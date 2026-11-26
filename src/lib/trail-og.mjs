import YAML from "yaml";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const SITE_TITLE = "夜天之书";
const SITE_DESCRIPTION = "A modern wizard.";
const SITE_DOMAIN = "tisonkun.org";
const TRAILS_TITLE = "中二少年的轨迹";
const SITE_TIME_ZONE = "Asia/Shanghai";

const siteDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

function formatSiteDate(date) {
    const parts = siteDateFormatter.formatToParts(date);
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    return `${year}-${month}-${day}`;
}

function normalizeDate(raw) {
    if (!raw) return "";
    const date = raw instanceof Date ? raw : new Date(String(raw));
    if (Number.isNaN(date.getTime())) return "";
    return formatSiteDate(date);
}

function stripInlineMarkdown(text) {
    return text
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/[ \t]+/g, " ")
        .trim();
}

function splitQuoteParagraphs(raw, { stripMarkdown = false } = {}) {
    return raw
        .split(/\r?\n\s*\r?\n/)
        .map((block) => {
            const joined = block
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
                .join(" ");
            return stripMarkdown ? stripInlineMarkdown(joined) : joined.trim();
        })
        .filter(Boolean);
}

function normalizeOgQuote(raw) {
    if (typeof raw === "string") {
        return splitQuoteParagraphs(raw);
    }
    if (Array.isArray(raw)) {
        return raw.map((item) => String(item).trim()).filter(Boolean);
    }
    return [];
}

function parseQuoteAttrs(attrStr) {
    const attrs = {};
    const regex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g;
    let match;
    while ((match = regex.exec(attrStr)) !== null) {
        attrs[match[1]] = (match[2] ?? match[3] ?? match[4] ?? "").trim();
    }
    const author = attrs.by || attrs.author || "";
    const source = attrs.from || attrs.source || "";
    if (author && source) return `${author}，${source}`;
    return author || source;
}

/**
 * Extracts only the explicit `:::quote` directive block (matching remark-quote.mjs).
 * Plain prose and standard blockquotes are intentionally ignored to avoid fragile heuristics.
 */
export function extractQuoteDirective(rawBody) {
    const body = (rawBody ?? "").trim();
    if (!body) return null;

    const match = body.match(
        /^(:{3,})quote(?:\[([^\]]*)\]|\{([^}]*)\})?[ \t]*\r?\n([\s\S]*?)\r?\n\1[ \t]*$/m,
    );
    if (!match) return null;

    const [, , labelCite, attrStr, inner] = match;
    const cite = labelCite
        ? stripInlineMarkdown(labelCite)
        : attrStr
          ? parseQuoteAttrs(attrStr)
          : "";
    const paragraphs = splitQuoteParagraphs(inner, { stripMarkdown: true });
    if (paragraphs.length === 0) return null;

    return { paragraphs, cite };
}

export function parseTrailFile(raw, slug) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
    if (!match) return null;

    const data = YAML.parse(match[1]) ?? {};
    if (data.draft) return null;

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const work = typeof data.work === "string" ? data.work.trim() : "";
    const ogQuote = normalizeOgQuote(data.ogQuote);
    const ogImage = typeof data.ogImage === "string" ? data.ogImage.trim() : "";
    const date = normalizeDate(data.date);
    const quoteDirective = extractQuoteDirective(match[2] ?? "");

    return {
        slug,
        date,
        title,
        work,
        ogQuote,
        ogImage,
        quoteDirective,
    };
}

export function visualLength(text) {
    let weight = 0;
    for (const ch of text) {
        const cp = ch.codePointAt(0) ?? 0;
        weight += cp >= 0x2e80 ? 1 : 0.56;
    }
    return weight;
}

export function truncateAtBoundary(text, maxWeight) {
    if (visualLength(text) <= maxWeight) return text;

    const chars = Array.from(text);
    const budget = Math.max(4, maxWeight - 1);
    let weight = 0;
    let cutIndex = chars.length;

    for (let i = 0; i < chars.length; i++) {
        const cp = chars[i].codePointAt(0) ?? 0;
        const w = cp >= 0x2e80 ? 1 : 0.56;
        if (weight + w > budget) {
            cutIndex = i;
            break;
        }
        weight += w;
    }

    let sliced = chars.slice(0, cutIndex).join("");
    const minKeep = Math.floor(sliced.length * 0.72);
    let boundary = -1;
    for (let i = sliced.length - 1; i >= minKeep; i--) {
        if (/[。！？；，、,.;!? ]/.test(sliced[i])) {
            boundary = i;
            break;
        }
    }

    if (boundary >= minKeep) {
        sliced = sliced.slice(0, boundary);
    }

    sliced = sliced.replace(/[，、,;:\-—\s]+$/u, "").trimEnd();
    return `${sliced}…`;
}

function fitParagraphs(paragraphs, maxTotalWeight) {
    const fitted = [];
    let remaining = maxTotalWeight;

    for (const para of paragraphs) {
        const len = visualLength(para);
        if (len <= remaining) {
            fitted.push(para);
            remaining -= len + 4;
            continue;
        }
        if (remaining >= 18) {
            fitted.push(truncateAtBoundary(para, remaining));
        } else if (fitted.length > 0) {
            const last = fitted[fitted.length - 1];
            if (!last.endsWith("…")) {
                fitted[fitted.length - 1] = `${last.replace(/[，、,;:\-—\s]+$/u, "")}…`;
            }
        }
        break;
    }

    return fitted;
}

function resolveQuoteCite(rawCite, work) {
    const cite = (rawCite ?? "").trim();
    const cleanWork = (work ?? "").trim();
    if (!cite) {
        return cleanWork ? `《${cleanWork}》` : "";
    }
    if (cleanWork && !cite.includes(cleanWork)) {
        return `${cite}，《${cleanWork}》`;
    }
    return cite;
}

/**
 * Deterministic card selection order:
 * 1. Explicit `ogQuote` in frontmatter -> quote card
 * 2. Explicit `title` in frontmatter -> titled card (`title` + optional `《work》`)
 * 3. Explicit `:::quote` directive block -> quote card
 * 4. Explicit `work` in frontmatter (or section fallback) -> work-only hero card
 */
export function selectTrailCardModel(trail) {
    if (trail.ogQuote.length > 0) {
        return {
            mode: "quote",
            paragraphs: fitParagraphs(trail.ogQuote.slice(0, 3), 165),
            cite: resolveQuoteCite(trail.quoteDirective?.cite ?? "", trail.work),
            work: trail.work,
            date: trail.date,
        };
    }

    if (trail.title) {
        return {
            mode: "titled",
            title: trail.title,
            work: trail.work,
            date: trail.date,
        };
    }

    if (trail.quoteDirective) {
        return {
            mode: "quote",
            paragraphs: fitParagraphs(trail.quoteDirective.paragraphs.slice(0, 3), 165),
            cite: resolveQuoteCite(trail.quoteDirective.cite, trail.work),
            work: trail.work,
            date: trail.date,
        };
    }

    return {
        mode: "work-only",
        heading: trail.work ? `《${trail.work}》` : TRAILS_TITLE,
        date: trail.date,
    };
}

export function bookMarkNode(size) {
    return {
        type: "svg",
        props: {
            width: size,
            height: size,
            viewBox: "0 0 64 64",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
                {
                    type: "rect",
                    props: { x: 2, y: 2, width: 60, height: 60, rx: 14, fill: "#19191F" },
                },
                {
                    type: "rect",
                    props: { x: 16, y: 15, width: 7, height: 34, rx: 2, fill: "#FAFAFC" },
                },
                {
                    type: "path",
                    props: {
                        d: "M27 15H43C45.8 15 48 17.2 48 20V44C48 46.8 45.8 49 43 49H27V15Z",
                        fill: "#FAFAFC",
                        fillOpacity: 0.92,
                    },
                },
                {
                    type: "rect",
                    props: { x: 31.5, y: 23, width: 11, height: 2.8, rx: 1.4, fill: "#19191F" },
                },
                {
                    type: "rect",
                    props: {
                        x: 31.5,
                        y: 29,
                        width: 7.5,
                        height: 2.8,
                        rx: 1.4,
                        fill: "#19191F",
                        fillOpacity: 0.55,
                    },
                },
                {
                    type: "circle",
                    props: { cx: 42.5, cy: 41.5, r: 3.6, fill: "#3B82F6" },
                },
            ],
        },
    };
}

function buildBrandSignature(fonts, { includeSection = false, iconSize = 28 } = {}) {
    const items = [];
    if (includeSection) {
        items.push(
            {
                type: "span",
                props: {
                    style: {
                        fontFamily: fonts.sans,
                        fontSize: "19px",
                        fontWeight: 500,
                        color: "#696974",
                        letterSpacing: "0.06em",
                    },
                    children: TRAILS_TITLE,
                },
            },
            {
                type: "span",
                props: {
                    style: {
                        fontFamily: fonts.sans,
                        fontSize: "19px",
                        color: "#B8BCC8",
                    },
                    children: "·",
                },
            },
        );
    }

    items.push(
        bookMarkNode(iconSize),
        {
            type: "span",
            props: {
                style: {
                    fontFamily: fonts.serif,
                    fontSize: includeSection ? "20px" : "22px",
                    fontWeight: 600,
                    color: "#19191F",
                    letterSpacing: "0.08em",
                },
                children: SITE_TITLE,
            },
        },
    );

    if (!includeSection) {
        items.push(
            {
                type: "span",
                props: {
                    style: {
                        fontFamily: fonts.sans,
                        fontSize: "20px",
                        color: "#B8BCC8",
                    },
                    children: "·",
                },
            },
            {
                type: "span",
                props: {
                    style: {
                        fontFamily: fonts.mono,
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#696974",
                    },
                    children: SITE_DOMAIN,
                },
            },
        );
    }

    return {
        type: "div",
        props: {
            style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
            },
            children: items,
        },
    };
}

function buildTopBar(leftLabel, date, fonts) {
    return {
        type: "div",
        props: {
            style: {
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            },
            children: [
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "999px",
                                        backgroundColor: "#3B82F6",
                                        flexShrink: 0,
                                    },
                                },
                            },
                            {
                                type: "span",
                                props: {
                                    style: {
                                        fontFamily: fonts.sans,
                                        fontSize: "22px",
                                        fontWeight: 500,
                                        color: "#696974",
                                        letterSpacing: "0.08em",
                                    },
                                    children: leftLabel,
                                },
                            },
                        ],
                    },
                },
                date
                    ? {
                          type: "span",
                          props: {
                              style: {
                                  fontFamily: fonts.mono,
                                  fontSize: "20px",
                                  fontWeight: 400,
                                  color: "#696974",
                                  letterSpacing: "0.03em",
                              },
                              children: date,
                          },
                      }
                    : { type: "div", props: {} },
            ],
        },
    };
}

function pickHeroTitleSize(text) {
    const len = visualLength(text);
    if (len <= 7) return 90;
    if (len <= 13) return 72;
    if (len <= 18) return 60;
    if (len <= 28) return 50;
    return 44;
}

function buildTitledNode(model, fonts) {
    const titleSize = pickHeroTitleSize(model.title);
    const workText = model.work ? `《${model.work}》` : "";
    const workSize = workText && visualLength(workText) > 22 ? 25 : 29;

    const centerChildren = [
        {
            type: "div",
            props: {
                style: {
                    fontFamily: fonts.serif,
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    lineHeight: 1.24,
                    letterSpacing: titleSize >= 80 ? "0.04em" : "0.01em",
                    color: "#16161D",
                    textAlign: "center",
                    maxWidth: "1000px",
                },
                children: model.title,
            },
        },
    ];

    if (workText) {
        centerChildren.push({
            type: "div",
            props: {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    maxWidth: "980px",
                },
                children: [
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "42px",
                                height: "1.5px",
                                backgroundColor: "#C8CAD4",
                                flexShrink: 0,
                            },
                        },
                    },
                    {
                        type: "span",
                        props: {
                            style: {
                                fontFamily: fonts.sans,
                                fontSize: `${workSize}px`,
                                fontWeight: 400,
                                color: "#4B5563",
                                letterSpacing: "0.03em",
                                textAlign: "center",
                            },
                            children: workText,
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "42px",
                                height: "1.5px",
                                backgroundColor: "#C8CAD4",
                                flexShrink: 0,
                            },
                        },
                    },
                ],
            },
        });
    }

    return {
        type: "div",
        props: {
            style: {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFC",
                color: "#19191F",
                padding: "56px 80px 46px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            },
            children: [
                buildTopBar(TRAILS_TITLE, model.date, fonts),
                {
                    type: "div",
                    props: {
                        style: {
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "28px",
                            paddingBottom: "18px",
                        },
                        children: centerChildren,
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingTop: "22px",
                            borderTop: "1px solid #E6E6EC",
                        },
                        children: [buildBrandSignature(fonts, { iconSize: 28 })],
                    },
                },
            ],
        },
    };
}

function pickQuoteTypography(paragraphs) {
    const totalWeight = paragraphs.reduce((acc, p) => acc + visualLength(p), 0);
    const maxParaWeight = Math.max(...paragraphs.map((p) => visualLength(p)));
    // Keep short 1-2 line quotes on clean unbroken lines without 1-char orphans.
    if (paragraphs.length <= 2 && maxParaWeight <= 30 && totalWeight <= 64) {
        const innerWidth = 948;
        const singleLineFit = Math.floor(innerWidth / (maxParaWeight * 1.03));
        const fontSize = Math.max(30, Math.min(36, singleLineFit));
        return { fontSize, lineHeight: 1.72, gap: 28 };
    }
    if (totalWeight <= 64 && paragraphs.length <= 2) {
        return { fontSize: 34, lineHeight: 1.74, gap: 24 };
    }
    if (totalWeight <= 118) {
        return { fontSize: 30, lineHeight: 1.84, gap: 18 };
    }
    if (totalWeight <= 165) {
        return { fontSize: 26, lineHeight: 1.78, gap: 14 };
    }
    return { fontSize: 25, lineHeight: 1.72, gap: 12 };
}

function buildQuoteNode(model, fonts) {
    const { fontSize, lineHeight, gap } = pickQuoteTypography(model.paragraphs);

    const cardChildren = [
        {
            type: "div",
            props: {
                style: {
                    position: "absolute",
                    top: "26px",
                    left: "30px",
                    fontFamily: fonts.serif,
                    fontSize: "92px",
                    fontWeight: 600,
                    lineHeight: 1,
                    color: "rgba(17, 24, 39, 0.13)",
                },
                children: "“",
            },
        },
        {
            type: "div",
            props: {
                style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: `${gap}px`,
                },
                children: model.paragraphs.map((text) => ({
                    type: "div",
                    props: {
                        style: {
                            fontFamily: fonts.serif,
                            fontSize: `${fontSize}px`,
                            fontWeight: 400,
                            lineHeight,
                            letterSpacing: "0.02em",
                            color: "#1F2328",
                        },
                        children: text,
                    },
                })),
            },
        },
    ];

    if (model.cite) {
        cardChildren.push({
            type: "div",
            props: {
                style: {
                    marginTop: "22px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "14px",
                },
                children: [
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "30px",
                                height: "1.5px",
                                backgroundColor: "#CBD5E1",
                                flexShrink: 0,
                            },
                        },
                    },
                    {
                        type: "span",
                        props: {
                            style: {
                                fontFamily: fonts.sans,
                                fontSize: "21px",
                                fontWeight: 400,
                                color: "#6B7280",
                                textAlign: "right",
                            },
                            children: model.cite,
                        },
                    },
                ],
            },
        });
    }

    return {
        type: "div",
        props: {
            style: {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFC",
                color: "#19191F",
                padding: "42px 56px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            },
            children: [
                {
                    type: "div",
                    props: {
                        style: {
                            flex: 1,
                            position: "relative",
                            backgroundColor: "#FAF9F5",
                            border: "1.5px solid #EAE6DC",
                            borderRadius: "18px",
                            padding: "50px 56px 36px 84px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        },
                        children: cardChildren,
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            marginTop: "22px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        },
                        children: [buildBrandSignature(fonts, { includeSection: true, iconSize: 26 })],
                    },
                },
            ],
        },
    };
}

function buildWorkOnlyNode(model, fonts) {
    const titleSize = pickHeroTitleSize(model.heading);
    return {
        type: "div",
        props: {
            style: {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFC",
                color: "#19191F",
                padding: "56px 80px 46px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            },
            children: [
                buildTopBar(TRAILS_TITLE, model.date, fonts),
                {
                    type: "div",
                    props: {
                        style: {
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingBottom: "18px",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        fontFamily: fonts.serif,
                                        fontSize: `${titleSize}px`,
                                        fontWeight: 700,
                                        lineHeight: 1.24,
                                        color: "#16161D",
                                        textAlign: "center",
                                        maxWidth: "1000px",
                                    },
                                    children: model.heading,
                                },
                            },
                        ],
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingTop: "22px",
                            borderTop: "1px solid #E6E6EC",
                        },
                        children: [buildBrandSignature(fonts, { iconSize: 28 })],
                    },
                },
            ],
        },
    };
}

export function buildTrailOgNode(trail, fonts) {
    const model = selectTrailCardModel(trail);
    switch (model.mode) {
        case "titled":
            return buildTitledNode(model, fonts);
        case "quote":
            return buildQuoteNode(model, fonts);
        case "work-only":
            return buildWorkOnlyNode(model, fonts);
    }
}

export function buildTrailsIndexOgNode(fonts) {
    return {
        type: "div",
        props: {
            style: {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFC",
                color: "#19191F",
                padding: "56px 80px 46px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            },
            children: [
                {
                    type: "div",
                    props: {
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                    },
                                    children: [
                                        bookMarkNode(38),
                                        {
                                            type: "span",
                                            props: {
                                                style: {
                                                    fontFamily: fonts.serif,
                                                    fontSize: "28px",
                                                    fontWeight: 600,
                                                    color: "#19191F",
                                                    letterSpacing: "0.08em",
                                                },
                                                children: SITE_TITLE,
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                type: "span",
                                props: {
                                    style: {
                                        fontFamily: fonts.mono,
                                        fontSize: "19px",
                                        color: "#696974",
                                    },
                                    children: SITE_DESCRIPTION,
                                },
                            },
                        ],
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "24px",
                            paddingBottom: "18px",
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        fontFamily: fonts.serif,
                                        fontSize: "76px",
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        letterSpacing: "0.05em",
                                        color: "#16161D",
                                    },
                                    children: TRAILS_TITLE,
                                },
                            },
                            {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px",
                                    },
                                    children: [
                                        {
                                            type: "div",
                                            props: {
                                                style: {
                                                    width: "48px",
                                                    height: "1.5px",
                                                    backgroundColor: "#C8CAD4",
                                                },
                                            },
                                        },
                                        {
                                            type: "span",
                                            props: {
                                                style: {
                                                    fontFamily: fonts.mono,
                                                    fontSize: "21px",
                                                    fontWeight: 400,
                                                    letterSpacing: "0.28em",
                                                    color: "#696974",
                                                },
                                                children: "TRAILS",
                                            },
                                        },
                                        {
                                            type: "div",
                                            props: {
                                                style: {
                                                    width: "48px",
                                                    height: "1.5px",
                                                    backgroundColor: "#C8CAD4",
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingTop: "22px",
                            borderTop: "1px solid #E6E6EC",
                        },
                        children: [
                            {
                                type: "span",
                                props: {
                                    style: {
                                        fontFamily: fonts.mono,
                                        fontSize: "19px",
                                        color: "#696974",
                                    },
                                    children: `${SITE_DOMAIN}/trails`,
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
}

export function collectNodeText(node, chunks = []) {
    if (node == null || typeof node === "boolean") return chunks;
    if (typeof node === "string" || typeof node === "number") {
        chunks.push(String(node));
        return chunks;
    }
    if (Array.isArray(node)) {
        for (const item of node) collectNodeText(item, chunks);
        return chunks;
    }
    if (typeof node === "object" && node.props && node.props.children !== undefined) {
        collectNodeText(node.props.children, chunks);
    }
    return chunks;
}
