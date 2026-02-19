const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const ordersBox = document.getElementById("ordersBox");
const ordersDiv = document.getElementById("orders");

// Paste image & OCR
document.addEventListener("paste", e => {
    for (let item of e.clipboardData.items) {
        if (item.type.includes("image")) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = () => {
                preview.innerHTML = `<img src="${reader.result}">`;
                runOCR(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
});

function runOCR(img) {
    loader.style.display = "block";
    result.value = "";
    ordersDiv.innerHTML = "";
    ordersBox.style.display = "none";

    Tesseract.recognize(img, "ara+eng")
        .then(({ data: { text } }) => {
            result.value = text.trim();
            detectOrders(text);
        })
        .finally(() => loader.style.display = "none");
}

function detectOrders(text) {
    const regex = /\b[A-Z]*\d{8,}[A-Z]*\b/gi;
    const matches = [...new Set(text.match(regex))];

    if (!matches.length) return;

    ordersBox.style.display = "block";

    matches.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-item";
        div.textContent = order;

        div.onclick = () => {
            navigator.clipboard.writeText(order);
            div.classList.add("copied");
            setTimeout(() => div.classList.remove("copied"), 500);
        };

        ordersDiv.appendChild(div);
    });
}

// =========================
// Dark Mode مباشر من Tools Hub
// =========================
window.addEventListener("message", (event) => {
    if(event.data.dark !== undefined){
        if(event.data.dark){
            document.documentElement.setAttribute("data-theme","dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }
});