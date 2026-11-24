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
            { name: "轨迹", url: "/trails" },
        ],
    },
};

export const Social = {
    publicName: "@tison",
    twitterId: "@tison1096",
};
