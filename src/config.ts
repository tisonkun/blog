export const Site = {
    url: new URL(import.meta.env.SITE),
    baseUrl: new URL(import.meta.env.SITE).origin,

    title: "夜天之书",
    description: "A modern wizard.",

    menu: {
        navs: [
            { name: "首页", url: "/" },
            { name: "分类", url: "/categories" },
            { name: "标签", url: "/tags" },
        ],
        icons: [
            {
                clz: "fas fa-rss",
                url: "/rss.xml",
                label: "RSS",
            },
            {
                clz: "fab fa-github",
                url: "https://github.com/tisonkun",
                label: "GitHub",
            },
            {
                clz: "fab fa-twitter",
                url: "https://x.com/tison1096",
                label: "X",
            },
        ],
    },
};

export const Social = {
    publicName: "@tison",
    twitterId: "@tison1096",
};
