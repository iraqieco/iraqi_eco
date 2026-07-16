async function loadSpecies() {

const grid = document.getElementById("grid");

if (!grid) return;

grid.innerHTML = "<p>جاري التحميل...</p>";

let { data, error } = await supabase
.from("species")
.select("*")
.order("id");

if (error) {

grid.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات</p>";

return;

}

document.getElementById("speciesCount").textContent = data.length;

const categories = [...new Set(data.map(i => (i.kingdom || "").trim()).filter(Boolean))];

document.getElementById("categoriesCount").textContent = categories.length;

grid.innerHTML = "";

data.forEach(item => {

const image = item.image_url?.trim() || "assets/no-image.svg";

const name = item.name_ar?.trim() || "غير محدد";

const scientific = item.scientific_name?.trim() || "غير محدد";

const status = item.conservation_status?.trim() || "غير محدد";

const card = document.createElement("div");

card.className = "speciesCard";

card.innerHTML = `

<img src="${image}" loading="lazy">

<div class="speciesBody">

<h3>${name}</h3>

<p>${scientific}</p>

<span class="badge">${status}</span>

</div>

`;

card.onclick = () => {

location.href = `species.html?id=${item.id}`;

};

grid.appendChild(card);

});

}

loadSpecies();

const search = document.getElementById("search");

if (search) {

search.addEventListener("input", async function () {

const value = this.value.replace(/\s+/g, "").trim();

let query = supabase.from("species").select("*");

if (value !== "") {

query = query.ilike("name_ar", `%${value}%`);

}

const { data } = await query;

const grid = document.getElementById("grid");

grid.innerHTML = "";

data.forEach(item => {

const image = item.image_url?.trim() || "assets/no-image.svg";

const name = item.name_ar?.trim() || "غير محدد";

const scientific = item.scientific_name?.trim() || "غير محدد";

const status = item.conservation_status?.trim() || "غير محدد";

grid.innerHTML += `

<div class="speciesCard"

onclick="location.href='species.html?id=${item.id}'">

<img src="${image}">

<div class="speciesBody">

<h3>${name}</h3>

<p>${scientific}</p>

<span class="badge">${status}</span>

</div>

</div>

`;

});

});

}
