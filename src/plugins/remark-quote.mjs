/**
 * Remark plugin that transforms `:::quote` container directives into semantic
 * book-quote figures:
 *
 *   :::quote[高桥弥七郎，《灼眼的夏娜》第五卷〈「天道宫」的少女〉]
 *   Quoted text...
 *   :::
 *
 * or with explicit attributes:
 *
 *   :::quote{by="高桥弥七郎" from="《灼眼的夏娜》第五卷〈「天道宫」的少女〉"}
 *   Quoted text...
 *   :::
 */
function visitNode(node) {
    if (!node || !Array.isArray(node.children)) return;

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === "containerDirective" && child.name === "quote") {
            const rawChildren = Array.isArray(child.children) ? child.children : [];
            let labelChildren = null;
            const bodyChildren = [];

            for (const item of rawChildren) {
                if (!labelChildren && item.data?.directiveLabel) {
                    labelChildren = item.children ?? [];
                } else {
                    bodyChildren.push(item);
                }
            }

            const attrs = child.attributes ?? {};
            const author = (attrs.by || attrs.author || "").trim();
            const source = (attrs.from || attrs.source || "").trim();

            const figureChildren = [
                {
                    type: "blockquote",
                    data: {
                        hName: "blockquote",
                        hProperties: { className: ["book-quote-body"] },
                    },
                    children: bodyChildren,
                },
            ];

            if (labelChildren && labelChildren.length > 0) {
                figureChildren.push({
                    type: "paragraph",
                    data: {
                        hName: "figcaption",
                        hProperties: { className: ["book-quote-cite"] },
                    },
                    children: [
                        {
                            type: "cite",
                            data: { hName: "cite" },
                            children: labelChildren,
                        },
                    ],
                });
            } else if (author || source) {
                const citeNodes = [];
                if (author) {
                    citeNodes.push({
                        type: "span",
                        data: {
                            hName: "span",
                            hProperties: { className: ["book-quote-author"] },
                        },
                        children: [{ type: "text", value: author }],
                    });
                }
                if (author && source) {
                    citeNodes.push({ type: "text", value: "，" });
                }
                if (source) {
                    citeNodes.push({
                        type: "cite",
                        data: { hName: "cite" },
                        children: [{ type: "text", value: source }],
                    });
                }
                figureChildren.push({
                    type: "paragraph",
                    data: {
                        hName: "figcaption",
                        hProperties: { className: ["book-quote-cite"] },
                    },
                    children: citeNodes,
                });
            }

            node.children[i] = {
                type: "bookQuote",
                data: {
                    hName: "figure",
                    hProperties: { className: ["book-quote"] },
                },
                children: figureChildren,
            };
        } else {
            visitNode(child);
        }
    }
}

export function remarkQuote() {
    return (tree) => {
        visitNode(tree);
    };
}
