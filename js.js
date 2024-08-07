"use strict";

function confirm_url(url) {
    if (url !== "") {
        try {
            new URL(url);
            let res_parse = URL.canParse(url);
            let res_ext = confirm_image(url);
            if (!res_parse || !res_ext) {
                throw new Error();
            }
            return url;
        } catch (error) {
            alert("La URL o el formato de archivo alojado no son válidas");
            return false;
        }
    }
}

function confirm_image(url) {
    let extensions = [
        "JPEG",
        "GIF",
        "GIFS",
        "PNG",
        "APNG",
        "SVG",
        "BMP",
        "ICO",
        "WEBP",
        "AVIF",
        "TIFF",
        "XBM",
    ];
    if (ext_includes(url, extensions)) {
        return url;
    } else {
        return false;
    }
}

function ext_includes(url, exts) {
    return exts.some((ext) => {
        let res;
        if (url.endsWith("/")) {
            res = url.endsWith(`.${ext.toLowerCase()}/`);
        } else {
            res = url.endsWith(`.${ext.toLowerCase()}`);
        }
        if (res === true) return ext;
    });
}

async function loading_animation(button) {
    const original_width = button.offsetWidth;
    const original_height = button.offsetHeight;
    button.style["background-color"] = "white";
    button.style["width"] = `${original_width}px`;
    button.style["height"] = `${original_height}px`;
    button.setAttribute("disabled", "");
    button.style["transform"] = "scale(0.9)";
    button.style["cursor"] = "default";
    button.style["padding"] = 0;
    button.textContent = "";
    const LOADER = document.createElement("img");
    LOADER.id = "loader";
    LOADER.classList.add("pos_abs", "centrar_absoluto");
    LOADER.src = "assets/loader.svg";
    const LOAD_BAR = document.createElement("div");
    LOAD_BAR.classList.add("pos_abs");
    const BAR_STY = {
        height: "100%",
        background: "#019908",
        left: 0,
        width: 0,
        top: 0,
        "z-index": 1,
    };
    for (const [key, value] of Object.entries(BAR_STY)) {
        LOAD_BAR.style[key] = value;
    }
    [LOADER,LOAD_BAR].forEach(async (node) => {
        button.appendChild(node);
    });
    await new Promise((res) =>
        setTimeout(res, 600)
    );
    const animation = LOAD_BAR.animate({ width: "100%" }, 1500);
    await animation.finished;
    button.textContent = "";
    button.removeAttribute("disabled");
    button.style = "";
    button.style["width"] = `${original_width}px`;
    button.style["height"] = `${original_height}px`;
    button.textContent = "¡Hecho!";
    await new Promise((res) =>
        setTimeout(res, 1000)
    );
    button.textContent = "Añadir al carrusel"
    button.style["width"] = "";
    button.style["height"] = "";
}

const ADD_BUTTON = document.querySelector("#add_button");
document.addEventListener("DOMContentLoaded", () => {
    ADD_BUTTON.addEventListener("click", async () => {
        const URL_VALUE = document.querySelector("#url");
        const TITLE_VALUE = document.querySelector("#title");
        const URL = confirm_url(URL_VALUE.value.toLowerCase().trim());
        if (TITLE_VALUE.value !== "" && URL) {
            await loading_animation(ADD_BUTTON);
        }
    });
});
