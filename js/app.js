// Iraqi Eco - App.js (النسخة الكاملة والمحدثة)
const db = window.client;
let allSpecies = [];
let filteredSpecies = [];

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const kingdomFilter = document.getElementById("kingdomFilter");
const speciesCount = document.getElementById("speciesCount");
const categoriesCount = document.getElementById("categoriesCount");
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addBtn");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveSpecies");

document.addEventListener("DOMContentLoaded", async () => {
    await loadSpecies();
    checkLogin();
});

async function loadSpecies() {
    try {
        const { data, error } = await db.from("species").select("*").order("name_ar");
        if (error) throw error;
        allSpecies = data || [];
        filteredSpecies = [...allSpecies];
        updateStats();
        render();
    } catch (err) {
        console.error("خطأ في التحميل:", err);
    }
}

function updateStats() {
    if (speciesCount) speciesCount.textContent = allSpecies.length;
    if (categoriesCount) {
        const kingdoms = new Set(allSpecies.map(s => s.kingdom));
        categoriesCount.textContent = kingdoms.size;
    }
}

function render() {
    if (!grid) return;
    grid.innerHTML = "";
    filteredSpecies.forEach(item => {
        const card = document.createElement("div");
        card.className = "speciesCard";
        
        card.innerHTML = `
            <div class="card-content" onclick="location.href='species.html?id=${item.id}'" style="cursor:pointer;">
                <img src="${item.image_url || 'assets/no-image.svg'}" style="width:100%; height:140px; object-fit:cover;">
                <h3 style="margin: 5px 0;">${item.name_ar || ''}</h3>
                <p style="font-style:italic; font-size:0.85em; margin:0;">${item.scientific_name || ''}</p>
                <div class="description-text" style="font-size:0.8em; color:#666; margin: 5px 0; height: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${item.description || ''}
                </div>
            </div>
            <button class="status-badge" style="width:auto; margin-bottom:10px;">${item.conservation_status || ''}</button>
            <button class="download-btn" onclick="downloadCard(event, this)">⬇ تنزيل البطاقة</button>
        `;
        grid.appendChild(card);
    });
}

async function downloadCard(event, btn) {
    event.stopPropagation();
    const card = btn.parentElement;
    const canvas = await html2canvas(card, { backgroundColor: "#ffffff", useCORS: true });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `species-${Date.now()}.png`;
    link.click();
}

function applyFilters() {
    const s = searchInput?.value.toLowerCase() || "";
    const k = kingdomFilter?.value || "";
    filteredSpecies = allSpecies.filter(item => 
        (item.name_ar.toLowerCase().includes(s) || item.scientific_name?.toLowerCase().includes(s)) &&
        (!k || item.kingdom === k)
    );
    render();
}

async function checkLogin() {
    const { data: { user } } = await db.auth.getUser();
    if (user && addBtn) addBtn.style.display = "block";
}

addBtn?.addEventListener("click", () => addModal?.classList.add("show"));
closeModal?.addEventListener("click", () => addModal?.classList.remove("show"));
searchInput?.addEventListener("input", applyFilters);
kingdomFilter?.addEventListener("change", applyFilters);

saveBtn?.addEventListener("click", async () => {
    const obj = {
        name_ar: document.getElementById("name_ar").value,
        scientific_name: document.getElementById("scientific_name").value,
        kingdom: document.getElementById("kingdom").value,
        conservation_status: document.getElementById("conservation_status").value,
        description: document.getElementById("description").value
    };
    await db.from("species").insert([obj]);
    addModal.classList.remove("show");
    loadSpecies();
});
