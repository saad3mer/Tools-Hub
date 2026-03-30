const CODES = {
  "mobile": {
    noAmount: "*7*3*1*1*${phone}*1*100100#"
  },
  "net": {
    withAmount: "*7*3*3*1*${gov}*${rest}*2*${amount}*100100#",
    noAmount: "*7*3*3*1*${gov}*${rest}*1*100100#"
  },
  "landline": {
    withAmount: "*7*3*2*${gov}*${rest}*2*${amount}*100100#",
    noAmount: "*7*3*2*${gov}*${rest}*1*100100#"
  }
};

function showNotification(message, type = "success") {
  const box = document.getElementById("copiedCodeBox");
  box.innerHTML = `<span>${message}</span>`;
  box.className = type;
  setTimeout(() => {
    box.classList.add("visible");
  }, 50);
  if (type !== "success") {
    setTimeout(() => {
      box.classList.remove("visible");
    }, 2500);
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  showNotification(text);
}

function generateCode(type) {
  const phoneInput = document.getElementById("phone");
  const amountInput = document.getElementById("amount");

  const phone = phoneInput.value.trim();
  const amount = amountInput.value.trim();

  if (phone.length < 3) {
    showNotification("من فضلك ادخل الرقم صحيح", "danger");
    return;
  }

  const codeData = CODES[type];

  if (!codeData) {
    showNotification("خدمة غير متاحة", "danger");
    return;
  }

  let template =
    amount && codeData.withAmount
      ? codeData.withAmount
      : codeData.noAmount;

  if (!template) {
    showNotification("الكود غير متاح", "danger");
    return;
  }

  const gov = phone.slice(0, 3);
  const rest = phone.slice(3);

  const finalCode = template
    .replace(/\${gov}/g, gov)
    .replace(/\${rest}/g, rest)
    .replace(/\${amount}/g, amount)
    .replace(/\${phone}/g, phone);

  copyText(finalCode);

  phoneInput.value = "";
  amountInput.value = "";
}

document.querySelectorAll("[data-type]").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    generateCode(type);
  });
});

document.querySelectorAll("[data-code]").forEach(btn => {
  btn.addEventListener("click", () => {
    const code = btn.dataset.code;
    copyText(code);
    document.getElementById("phone").value = "";
    document.getElementById("amount").value = "";
  });
});

window.addEventListener("message",(event)=>{
    const d=event.data;
    if(d==="dark"||d?.dark===true||d?.theme==="dark") document.body.classList.add("dark");
    if(d==="light"||d?.dark===false||d?.theme==="light") document.body.classList.remove("dark");
});