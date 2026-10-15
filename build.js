const { build, context } = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const pkg = require("./package.json");
const dev = process.argv.includes("--dev");
// Stamped into the bundle so a running host can report which build it loaded.
const buildStamp = new Date().toISOString();
const options = {
    entryPoints: ["src/index.tsx"],
    target: "chrome91",
    bundle: true,
    sourcemap: dev ? "inline" : false,
    minify: false,
    outdir: dev ? "./" : "./dist",
    define: {
        DEBUG: String(dev),
        __BGE_VERSION__: JSON.stringify(pkg.version),
        __BGE_BUILD__: JSON.stringify(buildStamp),
    },
    plugins: [sassPlugin()],
};
async function main() {
    if (process.argv.includes("--watch")) {
        const ctx = await context(options);
        await ctx.watch();
        console.log("Watching for changes");
    } else {
        await build(options);
        console.log(`Build success (BGEnhanced ${pkg.version}, ${buildStamp})`);
    }
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
