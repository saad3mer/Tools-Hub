const frame = document.getElementById("frame");
const tabs = document.querySelectorAll(".tab");
const darkToggle = document.getElementById("darkToggle");

// تبديل الأدوات
function switchTool(url,el){
    frame.src = url;
    tabs.forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
}

// تبديل Dark Mode
function toggleDark(){
    const isDark = document.body.classList.toggle("dark");

    // تغيير شكل زرار الدارك مود
    if(isDark){
        darkToggle.classList.add("dark");
        darkToggle.textContent = "☀️";
    } else {
        darkToggle.classList.remove("dark");
        darkToggle.textContent = "🌙";
    }

    // إرسال الرسالة مباشرة للـ iframe
    if(frame.contentWindow){
        frame.contentWindow.postMessage({dark:isDark}, '*');
    }
}

// عند تحميل iframe أرسل الثيم الحالي مباشرة
frame.onload = () => {
    if(frame.contentWindow){
        frame.contentWindow.postMessage({dark: document.body.classList.contains('dark')}, '*');
    }
};