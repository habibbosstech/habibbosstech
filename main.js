const sugar = {
    on: function (names, fn) {
        names.split(" ").forEach((name) => this.addEventListener(name, fn));
        return this;
    },
    off: function (names, fn) {
        names.split(" ").forEach((name) => this.removeEventListener(name, fn));
        return this;
    },
    attr: function (attr, val) {
        if (val === undefined) return this.getAttribute(attr);

        val == null
            ? this.removeAttribute(attr)
            : this.setAttribute(attr, val || "");

        return this;
    },
};

function $(query, $context = document) {
    let $nodes =
        query instanceof NodeList || Array.isArray(query)
            ? query
            : query instanceof HTMLElement || query instanceof SVGElement
                ? [query]
                : $context.querySelectorAll(query);

    if (!$nodes.length) $nodes = [];

    return Object.assign(
        Array.from($nodes).map(($el) => Object.assign($el, sugar)),
        {
            on: function (names, fn) {
                this.forEach(($el) => $el.on(names, fn));
                return this;
            },
            off: function (names, fn) {
                this.forEach(($el) => $el.off(names, fn));
                return this;
            },
            attr: function (attrs, val) {
                if (typeof attrs === "string" && val === undefined)
                    return this[0].attr(attrs);
                else if (typeof attrs === "object")
                    this.forEach(($el) =>
                        Object.entries(attrs).forEach(([key, val]) => $el.attr(key, val))
                    );
                else if (typeof attrs == "string" && (val || val == null || val == ""))
                    this.forEach(($el) => $el.attr(attrs, val));

                return this;
            },
        }
    );
}

$("pre > code").forEach(function (element) {
    element.setAttribute("contenteditable", true);
    element.setAttribute("spellcheck", false);
    element.parentNode.innerHTML = element.parentNode.innerHTML.trim();
});

function addCopyButtons(clipboard) {
    $(" pre > code").forEach(function (codeBlock) {
        var button = document.createElement("button");
        button.className = "copy-code-button";
        button.type = "button";
        button.innerText = "Copy to clipboard";

        button.addEventListener("click", function () {
            clipboard.writeText(codeBlock.innerText).then(
                function () {
                    /* Chrome doesn't seem to blur automatically, leaving the button in a focused state. */
                    button.blur();

                    button.innerText = "Copied!";

                    setTimeout(function () {
                        button.innerText = "Copy to clipboard";
                    }, 2000);
                },
                function (error) {
                    button.innerText = "Error";
                }
            );
        });
        let node = codeBlock.parentNode;
        if (node.parentNode.nodeName === 'FIGURE') {
            node.parentNode.insertBefore(button, codeBlock.parentNode);
        } else {
            node.prepend(button);
        }
    });
}

if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
}