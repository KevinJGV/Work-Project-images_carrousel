"use strict";

// Nota: Los comentarios en este archivo fueron generados por una IA.

// Valida si la URL es correcta y corresponde a una imagen
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

// Verifica si la URL termina con una extensión de imagen válida
function confirm_image(url) {
    let extensions = [
        "JPEG",
        "JPG",
        "JPE",
        "JIF",
        "JFIF",
        "JFI",
        "GIF",
        "GIFS",
        "PNG",
        "APNG",
        "SVG",
        "SVGZ",
        "BMP",
        "DIB",
        "ICO",
        "WEBP",
        "AVIF",
        "TIFF",
        "TIF",
        "XBM",
        "HEIC",
        "HEIF",
        "PCX",
        "TGA",
        "ICB",
        "VDA",
        "VST",
        "RAW",
        "ARW",
        "CR2",
        "NRW",
        "K25",
        "RAF",
        "NEF",
        "ORF",
        "SR2",
        "SRF",
        "RW2",
        "DCR",
        "DNG",
        "ERF",
        "MRW",
        "PEF",
        "SRW",
    ];
    return ext_includes(url, extensions);
}

// Comprueba si la URL termina con alguna de las extensiones proporcionadas
function ext_includes(url, exts) {
    let urlWithoutParams = url.split("?")[0];
    return exts.some((ext) => {
        let res;
        if (urlWithoutParams.endsWith("/")) {
            res = urlWithoutParams.endsWith(`.${ext.toLowerCase()}/`);
        } else {
            res = urlWithoutParams.endsWith(`.${ext.toLowerCase()}`);
        }
        return res;
    });
}

// Muestra una animación de carga en el botón
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
    [LOADER, LOAD_BAR].forEach(async (node) => {
        button.appendChild(node);
    });
    await new Promise((res) => setTimeout(res, 600));
    const animation = LOAD_BAR.animate({ width: "100%" }, 1500);
    await animation.finished;
    button.textContent = "";
    button.removeAttribute("disabled");
    button.style = "";
    button.style["width"] = `${original_width}px`;
    button.style["height"] = `${original_height}px`;
    button.textContent = "¡Hecho!";
    await new Promise((res) => setTimeout(res, 1000));
    button.textContent = "Añadir al carrusel";
    button.style["width"] = "";
    button.style["height"] = "";
}

let images = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {

    // Seleccion de elementos del DOM
    const ADD_BUTTON = document.querySelector("#add_button");
    const LEFT_ARROW = document.querySelector(".left");
    const RIGHT_ARROW = document.querySelector(".right");
    const ADVICE = document.querySelector(".advice");
    const PREV_IMG = document.querySelector(".prev");
    const CURRENT_IMG = document.querySelector(".current");
    const NEXT_IMG = document.querySelector(".next");

    // Agrega evento para añadir nueva imagen
    ADD_BUTTON.addEventListener("click", async () => {
        const URL_VALUE = document.querySelector("#url");
        const TITLE_VALUE = document.querySelector("#title");
        const URL = confirm_url(URL_VALUE.value.toLowerCase().trim());
        if (TITLE_VALUE.value !== "" && URL) {
            await loading_animation(ADD_BUTTON);
            const FULL_DATE = new Date();
            const DATE = `${FULL_DATE.getDate()}/${FULL_DATE.getMonth() + 1}/${FULL_DATE.getFullYear()} ${FULL_DATE.getHours()}:${FULL_DATE.getMinutes()}:${FULL_DATE.getSeconds()}`;
            const NEW_IMAGE = {
                url: URL_VALUE.value,
                title: TITLE_VALUE.value,
                date: DATE,
            };
            images.push(NEW_IMAGE);
            updateCarousel();
        }
    });

    // Eventos para navegar entre imágenes
    LEFT_ARROW.addEventListener("click", () => {
        if (images.length > 1) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
    });

    RIGHT_ARROW.addEventListener("click", () => {
        if (images.length > 1) {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        }
    });

    // Actualiza la visualización del carrusel
    function updateCarousel() {
        if (images.length === 0) {
            ADVICE.classList.remove("no_display");
            LEFT_ARROW.classList.add("no_display");
            RIGHT_ARROW.classList.add("no_display");
            PREV_IMG.innerHTML = '';
            CURRENT_IMG.innerHTML = '';
            NEXT_IMG.innerHTML = '';
        } else {
            ADVICE.classList.add("no_display");
            LEFT_ARROW.classList.remove("no_display");
            RIGHT_ARROW.classList.remove("no_display");

            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            const nextIndex = (currentIndex + 1) % images.length;

            PREV_IMG.classList.remove("current", "next");
            CURRENT_IMG.classList.remove("prev", "next");
            NEXT_IMG.classList.remove("current", "prev");

            PREV_IMG.classList.add("prev");
            CURRENT_IMG.classList.add("current");
            NEXT_IMG.classList.add("next");

            PREV_IMG.innerHTML = createImageHTML(images[prevIndex]);
            CURRENT_IMG.innerHTML = createImageHTML(images[currentIndex]);
            NEXT_IMG.innerHTML = createImageHTML(images[nextIndex]);
        }
    }

    // Crea el HTML para una imagen en el carrusel
    function createImageHTML(image) {
        return `
            <div class="img_box pos_rela flex all_c">
                <img src="${image.url}" alt="${image.title}" draggable="false"/>
            </div>
            <div class="img_added_info pos_abs centrar_absoluto flex_col all_c">
                <h3>${image.title}</h3>
                <ul>
                    <li><strong>Fecha de adición: </strong>${image.date}</li>
                    <li><strong>Origen: </strong><a href="${image.url}" target="_blank">${image.url}</a></li>
                </ul>
                <button onclick="deleteImage(${images.indexOf(image)})">Eliminar</button>
            </div>
        `;
    }

    // Función global para eliminar una imagen
    window.deleteImage = function(index) {
        images.splice(index, 1);
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        updateCarousel();
    }
});