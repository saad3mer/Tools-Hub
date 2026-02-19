// ==================== Dark Mode ====================
window.addEventListener("message", (event) => {
    if(event.data.dark !== undefined){
        document.body.classList.toggle("dark", event.data.dark);
    }
    if(event.data.theme){
        document.body.classList.toggle("dark", event.data.theme === "dark");
    }
});

if(window.parent){
    window.parent.postMessage({requestTheme:true}, '*');
}
// ==================================================

let rate = 0;

const amountInput = document.getElementById("amount");
const discountEl = document.getElementById("discount");
const finalEl = document.getElementById("final");
const buttons = document.querySelectorAll(".buttons button");
const copyBtn = document.getElementById("copyBtn");
const customRateInput = document.getElementById("customRate");

function setRate(val,el){
    rate = val;
    customRateInput.value = "";

    buttons.forEach(b=>b.classList.remove("active"));
    el.classList.add("active");

    calculate();
}

function setCustomRate(val){
    rate = parseFloat(val) || 0;
    buttons.forEach(b=>b.classList.remove("active"));
    calculate();
}

function calculate(){
    const amount = parseFloat(amountInput.value) || 0;
    const discount = amount * (rate / 1000);
    const finalAmount = amount - discount;

    discountEl.textContent = discount.toFixed(2);
    finalEl.textContent = finalAmount.toFixed(2);
}

amountInput.addEventListener("input", calculate);

function copyResult(){
    const text = `المبلغ بعد الخصم: ${finalEl.textContent}`;
    navigator.clipboard.writeText(text);

    copyBtn.classList.add("copied");
    copyBtn.innerHTML = "✔ تم النسخ";

    setTimeout(()=>{
        copyBtn.classList.remove("copied");
        copyBtn.innerHTML = "📋 نسخ الناتج";
    },1000);
}