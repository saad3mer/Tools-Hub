const frame = document.getElementById("frame");
const tabs = document.querySelectorAll(".tab");
const darkToggle = document.getElementById("darkToggle");

function switchTool(url,el){
    frame.src = url;
    tabs.forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
}

function toggleDark(){
    const isDark = document.body.classList.toggle("dark");

    if(isDark){
        darkToggle.classList.add("dark");
        darkToggle.textContent = "☀️";
    } else {
        darkToggle.classList.remove("dark");
        darkToggle.textContent = "🌙";
    }

    if(frame.contentWindow){
        frame.contentWindow.postMessage({dark:isDark}, '*');
    }
}

frame.onload = () => {
    if(frame.contentWindow){
        frame.contentWindow.postMessage({dark: document.body.classList.contains('dark')}, '*');
    }
};