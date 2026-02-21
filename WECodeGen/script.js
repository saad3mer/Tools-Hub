let sims=JSON.parse(localStorage.getItem("sims"))||[];
const codes = {
    net: {withAmount: '*7*3*3*1*${gov}*${rest}*2*${amount}*100100#' , noAmount:'*7*3*3*1*${gov}*${rest}*1*100100#'},
    landline: {withAmount: '*7*3*2*${gov}*${rest}*2*${amount}*100100#' , noAmount:'*7*3*2*${gov}*${rest}*1*100100#'},
    mobile: {withAmount: '' , noAmount:'*7*3*1*1*${phone}*1*100100#'}
};


function generateCode(type, btn){
    const phone = document.getElementById("phone").value.trim();
    const amount = document.getElementById('amount').value.trim();

    if(phone.length < 3){
        alert('من فضلك ادخل الرقم صح');
        return;
    }

    const gov = phone.substring(0,3);
    const rest = phone.substring(3);

    // اختيار الكود حسب وجود مبلغ
    let template;
    if(amount && codes[type].withAmount){
        template = codes[type].withAmount;
    } else {
        template = codes[type].noAmount;
    }

    // استبدال المتغيرات داخل الكود
    const code = template
        .replace("${gov}", gov)
        .replace("${rest}", rest)
        .replace("${amount}", amount)
        .replace("${phone}", phone);

    copyWithAnimation(code, btn);
}

function copyWithAnimation(code, btn){
    navigator.clipboard.writeText(code);
    btn.classList.add("copied");
    setTimeout(()=>{btn.classList.remove("copied");},500);
    document.getElementById("copiedCodeBox").innerText=code;
    
    document.getElementById("phone").value = "";
    document.getElementById("amount").value = "";
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