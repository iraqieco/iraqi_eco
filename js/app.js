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

const status=(item.conservation_status||"").trim()||"غير محدد";

const className=(item.class||"").trim()||"غير محدد";

const card=document.createElement("div");
card.className="speciesCard";

card.innerHTML=`
<img src="${image}" loading="lazy">

<div class="speciesBody">

<h3>${name}</h3>

<p><strong>${scientific}</strong></p>

<p>Class : ${className}</p>

<span class="badge">${status}</span>

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

const status=(item.conservation_status||"").trim()||"غير محدد";

const className=(item.class||"").trim()||"غير محدد";

grid.innerHTML+=`
<div class="speciesCard" onclick="location.href='species.html?id=${item.id}'">

<img src="${image}" loading="lazy">

<div class="speciesBody">

<h3>${name}</h3>

<p><strong>${scientific}</strong></p>

<p>Class : ${className}</p>

<span class="badge">${status}</span>

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

addModal.classList.add("show");

};

closeModal.onclick = () => {

addModal.classList.remove("show");

};

addModal.onclick = function(e){

if(e.target===addModal){

addModal.classList.remove("show");

}

};

saveBtn.onclick = async function(){

const result=document.getElementById("result");

const obj={

name_ar:document.getElementById("name_ar").value.trim(),

scientific_name:document.getElementById("scientific_name").value.trim(),

image_url:document.getElementById("image_url").value.trim(),

description:document.getElementById("description").value.trim(),

conservation_status:document.getElementById("conservation_status").value,

kingdom:document.getElementById("kingdom").value,

phylum:document.getElementById("phylum").value.trim(),

class:document.getElementById("class").value.trim(),

order_name:document.getElementById("order_name").value.trim(),

family:document.getElementById("family").value.trim()

};

if(!obj.name_ar || !obj.scientific_name){

result.innerHTML="⚠️ يجب إدخال الاسم العربي والاسم العلمي";

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
