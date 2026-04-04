const CODES = {
  "balance": {
    withAmount: '*557*${phone}*${amount}*1#'
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

let balance = 0;

const totalInput = document.getElementById("totalBalance");
const amountInput = document.getElementById("amount");

// تحميل أول قيمة من الإجمالي
balance = parseFloat(totalInput.value) || 0;

// لو غيرت الإجمالي بإيدك
totalInput.addEventListener("input", () => {
    balance = parseFloat(totalInput.value) || 0;
});

function withdraw(amount) {
    if (!amount || amount <= 0) return;

    // منع السالب
    if (amount > balance) {
        // هنا الرسالة هتظهر في نفس الصندوق بتاع النسخ
        showNotification("المبلغ أكبر من إجمالي القيمة!", "danger");
        amountInput.value = "";
        return;
    }

    // خصم
    balance -= amount;

    // تحديث الإجمالي
    totalInput.value = balance;

    // تمييز الرقم في إجمالي القيمة
    totalInput.style.backgroundColor = "#ffff99"; // لون أصفر فاتح
    totalInput.style.fontWeight = "bold";

    // تفريغ خانة المبلغ فقط
    amountInput.value = "";
}
function generateCode(type) {
  const phoneInput = document.getElementById("phone");
  const phone = phoneInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());

  if (phone.length < 3) {
    showNotification("من فضلك ادخل الرقم صحيح", "danger");
    return;
  }

  const codeData = CODES[type];
  if (!codeData) {
    showNotification("خدمة غير متاحة", "danger");
    return;
  }

  const template = codeData.withAmount;

  const finalCode = template
    .replace(/\${phone}/g, phone)
    .replace(/\${amount}/g, amount);

  copyText(finalCode);

  // خصم المبلغ من الإجمالي مباشرة
  withdraw(amount);
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

    // خصم المبلغ لو موجود
    const amount = parseFloat(amountInput.value);
    withdraw(amount);
  });
});

window.addEventListener("message", (event) => {
  const d = event.data;
  if (d === "dark" || d?.dark === true || d?.theme === "dark") document.body.classList.add("dark");
  if (d === "light" || d?.dark === false || d?.theme === "light") document.body.classList.remove("dark");
});