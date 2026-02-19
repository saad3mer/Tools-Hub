let lastOrderNumber = "";

function getToday(){
    const d = new Date();
    return d.getFullYear().toString().slice(2) +
           String(d.getMonth()+1).padStart(2,'0') +
           String(d.getDate()).padStart(2,'0');
}

function generateOrder(){
    const amount = document.getElementById("amount").value.trim();
    if(!amount || isNaN(amount)){ alert("ادخل مبلغ صحيح"); return; }

    const today = getToday();
    const counterKey = "counter_" + today;
    let count = localStorage.getItem(counterKey);
    count = count ? parseInt(count) + 1 : 1;
    localStorage.setItem(counterKey, count);

    const now = new Date();
    const orderNumber = today +
        String(now.getHours()).padStart(2,'0') +
        String(now.getMinutes()).padStart(2,'0') +
        count;

    lastOrderNumber = orderNumber;

    localStorage.setItem(orderNumber, JSON.stringify({
        amount: amount,
        date: new Date().toLocaleString()
    }));

    document.getElementById("amount").value = "";
    showPopup(orderNumber);
    updateOrdersTable();

    navigator.clipboard.writeText(orderNumber);
}

function showPopup(num){
    const p = document.getElementById("orderPopup");
    p.textContent = "رقم الأمر: " + num;
    p.classList.add("show");
    setTimeout(()=>p.classList.remove("show"),1500);
}

function copyOrder(){
    if(!lastOrderNumber) return;
    navigator.clipboard.writeText(lastOrderNumber);
}

function updateOrdersTable(){
    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";
    let orders = [];

    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(!isNaN(key)){
            const data = JSON.parse(localStorage.getItem(key));
            orders.push({order:key, amount:data.amount, date:data.date});
        }
    }

    orders.sort((a,b)=>b.order.localeCompare(a.order));

    orders.forEach(o=>{
        const tr = document.createElement("tr");
        if(o.order === lastOrderNumber) tr.classList.add("last-order");
        tr.innerHTML = `<td>${o.order}</td><td>${o.amount}</td><td>${o.date}</td>`;
        tbody.appendChild(tr);
    });
}

function searchOrder(){
    const val = document.getElementById("searchInput").value.trim();
    if(!val){ updateOrdersTable(); return; }

    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    if(!isNaN(val) && localStorage.getItem(val)){
        const d = JSON.parse(localStorage.getItem(val));
        tbody.innerHTML = `<tr><td>${val}</td><td>${d.amount}</td><td>${d.date}</td></tr>`;
    } else {
        tbody.innerHTML = `<tr><td colspan="3">❌ غير موجود</td></tr>`;
    }
}

function exportToExcel(){
    let arr = [];
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(!isNaN(key)){
            const d = JSON.parse(localStorage.getItem(key));
            arr.push({"رقم الأمر":key,"المبلغ":d.amount,"التاريخ والوقت":d.date});
        }
    }
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Orders");
    XLSX.writeFile(wb,"Orders.xlsx");
}

function importOrders(){
    const file = document.getElementById("importFile").files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = e=>{
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data,{type:"array"});
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        rows.forEach(r=>{
            if(r["رقم الأمر"]){
                localStorage.setItem(r["رقم الأمر"], JSON.stringify({
                    amount:r["المبلغ"],
                    date:r["التاريخ والوقت"]
                }));
            }
        });
        updateOrdersTable();
        alert("تم الاستيراد ✅");
    };
    reader.readAsArrayBuffer(file);
}

// تفعيل زر Enter لتوليد الرقم ونسخه تلقائي
document.getElementById("amount").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        generateOrder();
    }
});

updateOrdersTable();

// =========================
// Dark Mode مباشر من Tools Hub
// =========================
window.addEventListener("message", (event) => {
    if(event.data.dark !== undefined){
        if(event.data.dark){
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }
});