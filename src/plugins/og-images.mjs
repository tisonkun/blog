import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import {
    OG_HEIGHT,
    OG_WIDTH,
    buildTrailOgNode,
    buildTrailsIndexOgNode,
    collectNodeText,
    parseTrailFile,
} from "../lib/trail-og.mjs";

const FONT_SPECS = [
    {
        id: "noto-serif-sc",
        prefix: "NotoSerifSC",
        weights: [400, 600, 700],
    },
    {
        id: "noto-sans-sc",
        prefix: "NotoSansSC",
        weights: [400, 500, 600],
    },
];

function parseUnicodeRange(rangeStr) {
    const ranges = [];
    for (const part of rangeStr.split(",")) {
        const clean = part.trim().toUpperCase().replace(/^U\+/, "");
        if (!clean) continue;
        if (clean.includes("-")) {
            const [startHex, endHex] = clean.split("-");
            ranges.push([Number.parseInt(startHex, 16), Number.parseInt(endHex, 16)]);
        } else {
            const cp = Number.parseInt(clean, 16);
            ranges.push([cp, cp]);
        }
    }
    return ranges;
}

class FontManager {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.bufferCache = new Map();
        this.monoFonts = null;
        this.unicodeTables = new Map();
    }

    readBuffer(filePath) {
        let buf = this.bufferCache.get(filePath);
        if (!buf) {
            buf = fs.readFileSync(filePath);
            this.bufferCache.set(filePath, buf);
        }
        return buf;
    }

    getMonoFonts() {
        if (!this.monoFonts) {
            const filesDir = path.join(
                this.rootDir,
                "node_modules/@fontsource/jetbrains-mono/files",
            );
            this.monoFonts = [
                {
                    name: "JetBrainsMono",
                    data: this.readBuffer(
                        path.join(filesDir, "jetbrains-mono-latin-400-normal.woff"),
                    ),
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "JetBrainsMono",
                    data: this.readBuffer(
                        path.join(filesDir, "jetbrains-mono-latin-500-normal.woff"),
                    ),
                    weight: 500,
                    style: "normal",
                },
            ];
        }
        return this.monoFonts;
    }

    getUnicodeTable(pkgId) {
        let table = this.unicodeTables.get(pkgId);
        if (!table) {
            const unicodePath = path.join(
                this.rootDir,
                `node_modules/@fontsource/${pkgId}/unicode.json`,
            );
            const raw = JSON.parse(fs.readFileSync(unicodePath, "utf8"));
            table = Object.entries(raw).map(([key, rangeStr]) => ({
                subset: key.replace(/^\[|\]$/g, ""),
                ranges: parseUnicodeRange(rangeStr),
            }));
            this.unicodeTables.set(pkgId, table);
        }
        return table;
    }

    resolveSubsets(pkgId, text) {
        const table = this.getUnicodeTable(pkgId);
        const matched = new Set(["latin"]);
        const codePoints = new Set();

        for (const ch of text) {
            const cp = ch.codePointAt(0);
            if (cp !== undefined) codePoints.add(cp);
        }

        for (const cp of codePoints) {
            for (const entry of table) {
                if (matched.has(entry.subset)) continue;
                let found = false;
                for (const [start, end] of entry.ranges) {
                    if (cp >= start && cp <= end) {
                        matched.add(entry.subset);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }

        return Array.from(matched);
    }

    loadFontsForText(text) {
        const fonts = [...this.getMonoFonts()];
        const familyLists = {
            serif: [],
            sans: [],
            mono: "JetBrainsMono",
        };

        for (const spec of FONT_SPECS) {
            const subsets = this.resolveSubsets(spec.id, text);
            const filesDir = path.join(this.rootDir, `node_modules/@fontsource/${spec.id}/files`);
            const targetList = spec.id.includes("serif") ? familyLists.serif : familyLists.sans;

            for (const subset of subsets) {
                const familyName = `${spec.prefix}-${subset}`;
                targetList.push(familyName);
                for (const weight of spec.weights) {
                    const filePath = path.join(
                        filesDir,
                        `${spec.id}-${subset}-${weight}-normal.woff`,
                    );
                    if (!fs.existsSync(filePath)) continue;
                    fonts.push({
                        name: familyName,
                        data: this.readBuffer(filePath),
                        weight,
                        style: "normal",
                    });
                }
            }
        }

        return {
            fonts,
            families: {
                serif: familyLists.serif.join(", "),
                sans: familyLists.sans.join(", "),
                mono: familyLists.mono,
            },
        };
    }
}

function walkTrailFiles(dir, baseDir = dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkTrailFiles(fullPath, baseDir, results);
        } else if (/\.(md|mdx)$/i.test(entry.name)) {
            const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
            const slug = rel.replace(/\.(md|mdx)$/i, "").toLowerCase();
            results.push({ slug, filePath: fullPath });
        }
    }
    return results;
}

function collectTrails(rootDir) {
    const trailsDir = path.join(rootDir, "src/content/trails");
    const trails = [];
    for (const { slug, filePath } of walkTrailFiles(trailsDir)) {
        const parsed = parseTrailFile(fs.readFileSync(filePath, "utf8"), slug);
        if (parsed && !parsed.ogImage) trails.push(parsed);
    }
    return trails;
}

async function renderNodeToPng(buildNode, fontManager) {
    const placeholderFamilies = { serif: "serif", sans: "sans", mono: "mono" };
    const text = collectNodeText(buildNode(placeholderFamilies)).join("");
    const { fonts, families } = fontManager.loadFontsForText(text);
    const node = buildNode(families);
    const svg = await satori(node, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts,
    });
    return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

export function ogImagesIntegration() {
    let rootDir = process.cwd();
    let fontManager = null;

    const getFontManager = () => {
        if (!fontManager) {
            fontManager = new FontManager(rootDir);
        }
        return fontManager;
    };

    return {
        name: "og-images",
        hooks: {
            "astro:config:resolved": ({ config }) => {
                rootDir = fileURLToPath(config.root);
                fontManager = new FontManager(rootDir);
            },
            "astro:server:setup": ({ server }) => {
                server.middlewares.use(async (req, res, next) => {
                    const urlPath = (req.url || "").split("?")[0];
                    try {
                        if (urlPath === "/og/trails.png") {
                            const png = await renderNodeToPng(
                                (families) => buildTrailsIndexOgNode(families),
                                getFontManager(),
                            );
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "image/png");
                            res.end(png);
                            return;
                        }
                        const trailMatch = urlPath.match(/^\/og\/trails\/(.+)\.png$/);
                        if (trailMatch) {
                            const slug = decodeURIComponent(trailMatch[1]);
                            const trail = collectTrails(rootDir).find((t) => t.slug === slug);
                            if (trail) {
                                const png = await renderNodeToPng(
                                    (families) => buildTrailOgNode(trail, families),
                                    getFontManager(),
                                );
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "image/png");
                                res.end(png);
                                return;
                            }
                        }
                    } catch (err) {
                        next(err);
                        return;
                    }
                    next();
                });
            },
            "astro:build:done": async ({ dir, logger }) => {
                const outDir = fileURLToPath(dir);
                const ogDir = path.join(outDir, "og");
                const trailsOgDir = path.join(ogDir, "trails");
                fs.mkdirSync(trailsOgDir, { recursive: true });

                const fm = getFontManager();
                const indexPng = await renderNodeToPng(
                    (families) => buildTrailsIndexOgNode(families),
                    fm,
                );
                fs.writeFileSync(path.join(ogDir, "trails.png"), indexPng);

                const trails = collectTrails(rootDir);
                const concurrency = 4;
                for (let i = 0; i < trails.length; i += concurrency) {
                    await Promise.all(
                        trails.slice(i, i + concurrency).map(async (trail) => {
                            const png = await renderNodeToPng(
                                (families) => buildTrailOgNode(trail, families),
                                fm,
                            );
                            const outPath = path.join(trailsOgDir, `${trail.slug}.png`);
                            fs.mkdirSync(path.dirname(outPath), { recursive: true });
                            fs.writeFileSync(outPath, png);
                        }),
                    );
                }

                logger.info(`Generated trails index OG and ${trails.length} trail OG images.`);
            },
        },
    };
}
