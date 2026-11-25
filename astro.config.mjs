import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import remarkDirective from "remark-directive";
import remarkCalloutDirectives from '@microflash/remark-callout-directives';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import { rehypeFigure } from "./src/plugins/rehype-figure.mjs";
import { remarkQuote } from "./src/plugins/remark-quote.mjs";

const port = 4000;
const isBuild = process.env.npm_lifecycle_script?.includes("astro build");
const baseUrl = isBuild ? 'https://www.tisonkun.org' : `http://localhost:${port}`;

const headingLinkIcon = {
    type: 'element',
    tagName: 'svg',
    properties: {
        className: ['header-link'],
        viewBox: '0 0 24 24',
        width: '16',
        height: '16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ariaHidden: 'true',
    },
    children: [
        {
            type: 'element',
            tagName: 'path',
            properties: {
                d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            },
            children: [],
        },
        {
            type: 'element',
            tagName: 'path',
            properties: {
                d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
            },
            children: [],
        },
    ],
};

export default defineConfig({
    server: {
        port: port,
    },

    session: false,

    markdown: {
        processor: unified({
            remarkPlugins: [
                remarkDirective,
                remarkQuote,
                [remarkCalloutDirectives, {
                    aliases: {
                        info: "assert",
                        commend: "tip",
                    },
                    callouts: {
                        commend: {
                            title: "提示",
                        },
                        assert: {
                            title: "说明",
                        },
                    },
                }],
                remarkMath,
            ],
            rehypePlugins: [
                rehypeSlug,
                rehypeFigure,
                [rehypeKatex, { strict: "warn" }],
                [rehypeAutolinkHeadings, {
                    behavior: 'append',
                    properties: {
                        className: ['header-anchor'],
                        ariaLabel: '链接到此节',
                    },
                    content() {
                        return [headingLinkIcon];
                    },
                }],
            ],
        }),
    },

    site: baseUrl,

    integrations: [
        sitemap(),
        expressiveCode({
            themes: ['github-light'],
            plugins: [pluginLineNumbers()],
            frames: {
                extractFileNameFromCode: false,
                removeCommentsWhenCopyingTerminalFrames: false,
            },
            defaultProps: {
                frame: 'terminal',
                showLineNumbers: true,
                overridesByLang: {
                    'sh,bash,zsh,shell,console,text,plaintext': {
                        showLineNumbers: false,
                    },
                },
            },
            styleOverrides: {
                frames: {
                    frameBoxShadowCssValue: '0 1px 3px rgba(0, 0, 0, 0.06)',
                },
            },
        }),
        mdx(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },

    adapter: cloudflare({
        imageService: "compile",
    }),
});
