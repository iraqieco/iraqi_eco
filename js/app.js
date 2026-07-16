
const statusMap = {
  "EX": { text: "منقرض", color: "#000000" },
  "EW": { text: "منقرض في البرية", color: "#555555" },
  "CR": { text: "مهدد بخطر انقراض أقصى", color: "#D32F2F" },
  "EN": { text: "مهدد بالانقراض", color: "#F57C00" },
  "VU": { text: "معرض للخطر", color: "#FBC02D" },
  "NT": { text: "قريب من التهديد", color: "#7CB342" },
  "LC": { text: "غير مهدد", color: "#2E7D32" },
  "DD": { text: "بيانات غير كافية", color: "#1976D2" },
  "NE": { text: "غير مقيم", color: "#9E9E9E" }
};

function getStatus(status){
  status = (status || "").trim().toUpperCase();

  if(statusMap[status]){
    return statusMap[status];
  }

  return {
    text: status || "غير محدد",
    color: "#607D8B"
  };
} 
async function loadSpecies() {

const grid = document.getElementById("grid");
if (!grid) return;

grid.innerHTML = "<p>جاري التحميل...</p>";

const { data, error } = await supabaseClient
.from("species")
.select("*")
.order("name_ar");

if (error) {
grid.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات</p>";
console.log(error);
return;
}

const speciesCount = document.getElementById("speciesCount");
if (speciesCount) speciesCount.textContent = data.length;

const categories = [...new Set(
data.map(i => (i.kingdom || "").trim()).filter(Boolean)
)];

const categoriesCount = document.getElementById("categoriesCount");
if (categoriesCount) categoriesCount.textContent = categories.length;

grid.innerHTML = "";

data.forEach(item=>{

const image=(item.image_url||"").trim()||"assets/no-image.svg";

const name=(item.name_ar||"").trim()||"غير محدد";

const scientific=(item.scientific_name||"").trim()||"غير محدد";

const statusInfo = getStatus(item.conservation_status);

const className=(item.class||"").trim()||"غير محدد";

const card=document.createElement("div");
card.className="speciesCard";

card.innerHTML=`
<img src="${image}" loading="lazy">

<div class="speciesBody">

<h3>${name}</h3>

<p><strong>${scientific}</strong></p>

<p>Class : ${className}</p>

<span
class="badge"
style="background:${statusInfo.color};color:#fff;">
${statusInfo.text}
</span>

</div>
`;

card.onclick=()=>{
location.href=`species.html?id=${item.id}`;
};

grid.appendChild(card);

});

}

loadSpecies();

const search=document.getElementById("search");

if(search){

search.addEventListener("input",async function(){

const value=this.value.replace(/\s+/g,"").trim();

let query=supabaseClient.from("species").select("*");

if(value!==""){
query=query.or(`name_ar.ilike.%${value}%,scientific_name.ilike.%${value}%`);
}

const {data,error}=await query.order("name_ar");

if(error)return;

const grid=document.getElementById("grid");

grid.innerHTML="";

data.forEach(item=>{

const image=(item.image_url||"").trim()||"assets/no-image.svg";

const name=(item.name_ar||"").trim()||"غير محدد";

const scientific=(item.scientific_name||"").trim()||"غير محدد";

const statusInfo = getStatus(item.conservation_status);
const className=(item.class||"").trim()||"غير محدد";

grid.innerHTML+=`
<div class="speciesCard" onclick="location.href='species.html?id=${item.id}'">

<img src="${image}" loading="lazy">

<div class="speciesBody">

<h3>${name}</h3>

<p><strong>${scientific}</strong></p>

<p>Class : ${className}</p>

<span
class="badge"
style="background:${statusInfo.color};color:#fff;">
${statusInfo.text}
</span>

</div>

</div>
`;

});

});

}
/* ===========================
   نافذة إضافة الكائن
=========================== */

const addBtn = document.getElementById("addBtn");
const addModal = document.getElementById("addModal");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveSpecies");

async function checkLogin(){

try{

const { data:{ user } } = await supabaseClient.auth.getUser();

if(user){
addBtn.style.display="block";
}

}catch(e){}

}

checkLogin();

addBtn.onclick = () => {

setTimeout(() => {
    result.innerHTML = "✅ تمت إضافة الكائن";
    loadSpecies();
    addModal.classList.remove("show");
}, 1500);
};

closeModal.onclick = () => {

addModal.classList.remove("show");

};

addModal.onclick = function(e){

if(e.target===addModal){

addModal.classList.remove("show");

}

};

saveBtn.onclick = async function(e){
e.preventDefault();

const result=document.getElementById("result");

const obj={

name_ar:document.getElementById("name_ar").value.trim().replace(/\s+/g," "),

scientific_name:document.getElementById("scientific_name").value.trim().replace(/\s+/g," "),

kingdom:document.getElementById("kingdom").value,

conservation_status:document.getElementById("conservation_status").value,

phylum:document.getElementById("phylum").value.trim(),

class:document.getElementById("class").value.trim(),

order_name:document.getElementById("order_name").value.trim(),

family:document.getElementById("family").value.trim(),

genus: document.getElementById("genus").value.trim(),

species_type: document.getElementById("species_type").value.trim(),
description:document.getElementById("description").value.trim(),


image_url: ""
};

if(!obj.name_ar || !obj.scientific_name){

result.innerHTML="⚠️ يجب إدخال الاسم العربي والاسم العلمي";

return;

}
const { data: exists } = await supabaseClient
.from("species")
.select("id")
.or(
`name_ar.eq.${obj.name_ar},scientific_name.eq.${obj.scientific_name}`
);

if(exists && exists.length){

result.innerHTML="⚠️ يوجد كائن بنفس الاسم العربي أو اللاتيني.";

return;

}
result.innerHTML="جاري الحفظ...";

const { error } = await supabaseClient

.from("species")

.insert([obj]);

if(error){

result.innerHTML="❌ "+error.message;

return;

}

result.innerHTML="✅ تمت إضافة الكائن";

addModal.classList.remove("show");

/* إعادة تحميل البطاقات */

loadSpecies();

/* تنظيف الحقول */

document.querySelectorAll("#addModal input,#addModal textarea,#addModal select").forEach(el=>{

if(el.tagName==="SELECT"){

el.selectedIndex=0;

}else{

el.value="";

}

});

};
const kingdom = document.getElementById("kingdom");
const phylum = document.getElementById("phylum");
const classSelect = document.getElementById("class");
const order = document.getElementById("order_name");
const family = document.getElementById("family");

function resetSelect(select, text) {
    select.innerHTML = `<option value="">${text}</option>`;
}

if (kingdom) {

kingdom.addEventListener("change", function () {

resetSelect(phylum, "اختر الشعبة");
resetSelect(classSelect, "اختر الصف");
resetSelect(order, "اختر الرتبة");
resetSelect(family, "اختر الفصيلة");

const kingdomData = taxonomy[this.value];

if (!kingdomData) return;

Object.keys(kingdomData.phylum).forEach(function(name){

const option = document.createElement("option");

option.value = name;

option.textContent = name;

phylum.appendChild(option);

});

});

}
