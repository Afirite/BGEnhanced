/**
 * Builds an installable BetterNCM plugin package under release/.
 *
 * The bundle is produced by build.js into dist/, then staged with the runtime
 * files the host needs and zipped with zero dependencies (a small store-only
 * zip writer, so no archiver/7-Zip/Compress-Archive quirks on Windows).
 *
 *   node ./scripts/pack.js              # build, stage, zip
 *   node ./scripts/pack.js --no-build   # reuse the existing dist/
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkg = require(path.join(root, "package.json"));
const version = pkg.version;
const name = "BGEnhanced";
const pluginPath = path.join(root, "release", `${name}-${version}.plugin`);

/** Runtime files. The preview is resolved separately because its name varies. */
const files = ["manifest.json", "index.js", "index.css"];
const required = ["manifest.json", "index.js", "index.css"];
const PREVIEW_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"];

function readManifest() {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
    if (manifest.version !== version) {
        throw new Error(
            `manifest.json version ${manifest.version} does not match package.json version ${version}`,
        );
    }
    if (manifest.native_plugin) {
        throw new Error("This package is frontend-only; manifest.json must not declare native_plugin");
    }
    return manifest;
}

/**
 * Finds the preview image in dist/. The declared name is tried first, then the
 * same stem with any supported extension, so replacing preview.png with
 * preview.jpg keeps working instead of silently shipping a package whose
 * manifest points at a missing file.
 */
function findPreview(manifest) {
    const declared = typeof manifest.preview === "string" && manifest.preview.trim()
        ? manifest.preview.trim()
        : "preview.png";
    const stem = declared.replace(/\.[^.]+$/, "");
    for (const candidate of [declared, ...PREVIEW_EXTENSIONS.map(extension => `${stem}.${extension}`)]) {
        const source = path.join(root, "dist", candidate);
        if (fs.existsSync(source)) return { name: candidate, source };
    }
    return null;
}

/** Keeps the manifest's `preview` field pointing at a file that exists. */
function syncManifestPreview(manifestBuffer, previewName) {
    if (!previewName) return manifestBuffer;
    const manifest = JSON.parse(manifestBuffer.toString("utf8"));
    if (manifest.preview === previewName) return manifestBuffer;
    console.log(`  (manifest preview "${manifest.preview ?? ""}" -> "${previewName}")`);
    manifest.preview = previewName;
    const text = JSON.stringify(manifest, null, 4) + "\n";
    fs.writeFileSync(path.join(root, "manifest.json"), text);
    return Buffer.from(text, "utf8");
}

function sourceOf(file) {
    return file === "manifest.json" ? path.join(root, file) : path.join(root, "dist", file);
}

/** Store-only zip: no dependency, predictable bytes, readable by every unpacker. */
const crcTable = (() => {
    const table = new Int32Array(256);
    for (let index = 0; index < 256; index++) {
        let value = index;
        for (let bit = 0; bit < 8; bit++) {
            value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }
        table[index] = value;
    }
    return table;
})();

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const byte of buffer) {
        crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function writeZip(destination, entries) {
    const chunks = [];
    const central = [];
    let offset = 0;

    for (const entry of entries) {
        const nameBuffer = Buffer.from(entry.name, "utf8");
        const data = entry.data;
        const crc = crc32(data);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0); // local file header
        local.writeUInt16LE(20, 4);         // version needed
        local.writeUInt16LE(0x0800, 6);     // UTF-8 names
        local.writeUInt16LE(0, 8);          // store
        local.writeUInt16LE(0, 10);         // time
        local.writeUInt16LE(0x21, 12);      // date (1980-01-01)
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBuffer.length, 26);
        local.writeUInt16LE(0, 28);
        chunks.push(local, nameBuffer, data);

        const header = Buffer.alloc(46);
        header.writeUInt32LE(0x02014b50, 0); // central directory header
        header.writeUInt16LE(20, 4);
        header.writeUInt16LE(20, 6);
        header.writeUInt16LE(0x0800, 8);
        header.writeUInt16LE(0, 10);
        header.writeUInt16LE(0, 12);
        header.writeUInt16LE(0x21, 14);
        header.writeUInt32LE(crc, 16);
        header.writeUInt32LE(data.length, 20);
        header.writeUInt32LE(data.length, 24);
        header.writeUInt16LE(nameBuffer.length, 28);
        header.writeUInt16LE(0, 30);
        header.writeUInt16LE(0, 32);
        header.writeUInt16LE(0, 34);
        header.writeUInt16LE(0, 36);
        header.writeUInt32LE(0, 38);
        header.writeUInt32LE(offset, 42);
        central.push(header, nameBuffer);

        offset += local.length + nameBuffer.length + data.length;
    }

    const centralBuffer = Buffer.concat(central);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0); // end of central directory
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(entries.length, 8);
    end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralBuffer.length, 12);
    end.writeUInt32LE(offset, 16);
    end.writeUInt16LE(0, 20);

    fs.writeFileSync(destination, Buffer.concat([...chunks, centralBuffer, end]));
}

function main() {
    const manifest = readManifest();
    for (const file of required) {
        const source = sourceOf(file);
        if (file !== "manifest.json" && !fs.existsSync(source)) {
            throw new Error(`missing ${path.relative(root, source)}; run "npm run build" first`);
        }
    }

    const preview = findPreview(manifest);
    if (preview === null) {
        console.warn(
            "warning: no preview image in dist/ - the host will list the plugin without a thumbnail. "
            + `Add dist/${manifest.preview || "preview.png"} to fix this.`,
        );
    }

    // Keep the in-tree dist manifest aligned with the root manifest so the two
    // never drift (the root manifest is the source of truth for the package).
    let manifestBuffer = Buffer.from(JSON.stringify(manifest, null, 4) + "\n", "utf8");
    manifestBuffer = syncManifestPreview(manifestBuffer, preview && preview.name);
    fs.writeFileSync(path.join(root, "dist", "manifest.json"), manifestBuffer);

    fs.mkdirSync(path.dirname(pluginPath), { recursive: true });

    const entries = [];
    const staged = preview ? [...files, preview.name] : files;
    for (const file of staged) {
        const source = file === "manifest.json" ? null : (file === (preview && preview.name) ? preview.source : sourceOf(file));
        const data = file === "manifest.json" ? manifestBuffer : fs.readFileSync(source);
        entries.push({ name: file, data });
        console.log(`  ${file} (${data.length} bytes)`);
    }

    writeZip(pluginPath, entries);
    console.log(`\n${manifest.name} ${manifest.version} (frontend only)`);
    console.log(`  plugin: ${path.relative(root, pluginPath)} (${fs.statSync(pluginPath).size} bytes)`);
}

main();
