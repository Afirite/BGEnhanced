/**
 * Advances the plugin version in package.json AND manifest.json, keeping the two
 * in sync (scripts/pack.js refuses to package when they disagree).
 *
 *   node ./scripts/version.js            # print the current version
 *   node ./scripts/version.js patch      # 0.3.15 -> 0.3.16
 *   node ./scripts/version.js minor      # 0.3.15 -> 0.4.0
 *   node ./scripts/version.js major      # 0.3.15 -> 1.0.0
 *   node ./scripts/version.js 0.4.2      # set an explicit version
 *   node ./scripts/version.js patch --dry-run
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packagePath = path.join(root, "package.json");
const manifestPath = path.join(root, "manifest.json");

function readVersion(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8")).version;
}

/** Rewrites only the version string, so each file keeps its own formatting. */
function writeVersion(filePath, version) {
    const text = fs.readFileSync(filePath, "utf8");
    const next = text.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
    if (next === text) {
        throw new Error(`could not find a "version" field in ${path.basename(filePath)}`);
    }
    fs.writeFileSync(filePath, next);
}

function bump(current, target) {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(current);
    if (!match) throw new Error(`current version "${current}" is not x.y.z`);
    const [major, minor, patch] = match.slice(1).map(Number);
    if (target === "patch") return `${major}.${minor}.${patch + 1}`;
    if (target === "minor") return `${major}.${minor + 1}.0`;
    if (target === "major") return `${major + 1}.0.0`;
    if (/^\d+\.\d+\.\d+$/.test(target)) return target;
    throw new Error(`unknown release level or version: ${target}`);
}

function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");
    const target = args.filter(arg => !arg.startsWith("--"))[0];
    const current = readVersion(packagePath);
    const currentManifest = readVersion(manifestPath);

    if (!target) {
        console.log(`package.json  version: ${current}`);
        console.log(`manifest.json version: ${currentManifest}`);
        console.log(`in sync: ${current === currentManifest ? "yes" : "NO (run a bump to fix)"}`);
        return;
    }
    if (current !== currentManifest) {
        throw new Error(
            `refusing to bump: package.json is ${current} but manifest.json is ${currentManifest}; align them first`,
        );
    }

    const next = bump(current, target);
    console.log(`${current} -> ${next}${dryRun ? " (dry run, nothing written)" : ""}`);
    if (dryRun) return;

    writeVersion(packagePath, next);
    writeVersion(manifestPath, next);

    if (readVersion(packagePath) !== next || readVersion(manifestPath) !== next) {
        throw new Error("version bump did not stick; check both files manually");
    }
    console.log(`wrote ${path.relative(root, packagePath)} and ${path.relative(root, manifestPath)}`);
}

main();
