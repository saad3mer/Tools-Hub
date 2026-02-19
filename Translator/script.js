let timer;
const copyBtn = document.getElementById("copyBtn");

// تحويل الأرقام العربية لإنجليزية
function normalizeNumbers(text){
  const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  arabicNums.forEach((n,i)=> text = text.replaceAll(n,i));
  return text;
}

// ترجمة مباشرة عند الكتابة
document.getElementById("input").addEventListener("input", ()=>{
  clearTimeout(timer);
  timer = setTimeout(translateLive,400);
});

async function translateLive(){
  let text = document.getElementById("input").value.trim();
  if(!text){
    document.getElementById("output").innerText="";
    return;
  }

  text = normalizeNumbers(text);

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();

  let translated = "";
  data[0].forEach(item => translated += item[0]);

  document.getElementById("output").innerText = translated;
}

// نسخ النص مع Animation داخل الزر
function copyText(){
  const text = document.getElementById("output").innerText;
  if(!text) return;

  navigator.clipboard.writeText(text).then(()=>{
    const original = copyBtn.innerText;
    copyBtn.classList.add("copied");
    copyBtn.innerText = "✔ تم النسخ";

    setTimeout(()=>{
      copyBtn.classList.remove("copied");
      copyBtn.innerText = original;
    },1500);
  });
}

// =========================
// Dark Mode مباشر من Tools Hub
// =========================
function applyTheme(theme){
    if(theme === 'dark'){
        document.documentElement.setAttribute("data-theme","dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

// استقبال الرسائل من Hub مباشرة
window.addEventListener("message", (event) => {
    if(event.data.dark !== undefined){
        applyTheme(event.data.dark ? 'dark' : 'light');
    }
});