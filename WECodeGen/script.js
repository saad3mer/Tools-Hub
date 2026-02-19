let sims=JSON.parse(localStorage.getItem("sims"))||[];

/* ===== WE CODE ===== */
function generateCode(btn){
    const phone = document.getElementById("phone").value.trim();
    const amount = document.getElementById('amount').value.trim();
    const type = document.getElementById("net").checked ? "net" : "landline";

    if(phone.length < 3){
        alert('من فضلك ادخل الرقم صح');
        return;
    }

    const gov = phone.substring(0,3);
    const rest = phone.substring(3);
    let code = "";

    if(amount === "") {
        // لو المبلغ فاضي
        code = type === "landline"
            ? `*7*3*2*${gov}*${rest}*1*100100#`
            : `*7*3*3*1*${gov}*${rest}*1*100100#`;
    } else {
        // لو المبلغ موجود
        code = type === "landline"
            ? `*7*3*2*${gov}*${rest}*2*${amount}*100100#`
            : `*7*3*3*1*${gov}*${rest}*2*${amount}*100100#`;
    }

    copyWithAnimation(code, btn);
}


function copyWithAnimation(code,btn){
    navigator.clipboard.writeText(code);
    btn.classList.add("copied");
    setTimeout(()=>{btn.classList.remove("copied");},500);
    document.getElementById("copiedCodeBox").innerText=code;
}
    
function copyCode(code, btn){
    copyWithAnimation(code, btn);
}

/* ===== جدول العرض ===== */
function save(){localStorage.setItem("sims",JSON.stringify(sims));}
function render(){
    const tbody=document.getElementById("simBody");
    tbody.innerHTML="";
    sims.forEach((s)=>{
        tbody.innerHTML+=`<tr>
            <td class="code-input">${s.code||''}</td>
            <td>${s.number||''}</td>
            <td>${s.balance||0}</td>
        </tr>`;
    });
    renderModal();
}

/* ===== Modal تعديل الشرائح ===== */
function openModal(){document.getElementById("simModal").style.display="flex";}
function closeModal(){document.getElementById("simModal").style.display="none";}

function renderModal(){
    const tbody=document.getElementById("simModalBody");
    tbody.innerHTML="";
    sims.forEach((s,i)=>{
        tbody.innerHTML+=`<tr>
            <td><input value="${s.code||''}" onchange="updateModal(${i},'code',this.value)"></td>
            <td><input value="${s.number||''}" onchange="updateModal(${i},'number',this.value)"></td>
            <td><input type="number" value="${s.balance||0}" onchange="updateModal(${i},'balance',this.value)"></td>
            <td><button class="edit-btn" onclick="delModal(${i})">✖</button></td>
        </tr>`;
    });
}

function addSimModal(){ sims.push({code:"",number:"",balance:0}); save(); renderModal(); render();}
function updateModal(i,field,val){ sims[i][field]=field==="balance"?parseFloat(val)||0:val; save(); renderModal(); render();}
function delModal(i){ sims.splice(i,1); save(); renderModal(); render();}

/* ===== Initial render ===== */
render();

/* ===== DARK MODE ===== */
window.addEventListener("message",(event)=>{
    const d=event.data;
    if(d==="dark"||d?.dark===true||d?.theme==="dark") document.body.classList.add("dark");
    if(d==="light"||d?.dark===false||d?.theme==="light") document.body.classList.remove("dark");
});