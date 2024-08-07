window.addEventListener("beforeprint", (event) => {
    console.log("Before print");
    hideLinks(document.querySelectorAll("a"))
});

window.addEventListener("afterprint", (event) => {
    console.log("After print");
    unhideLinks(document.querySelectorAll("a"))
});

function hideLinks(elements) {
    for (const element of elements) {
        element["data-old-link"] = element.href;
        element.removeAttribute("href")
    }
}

function unhideLinks(elements) {
    console.log({ elements })
    for (const element of elements) {
        element.href = element["data-old-link"]
    }
}