// ===============================
// Iraqi Eco - App.js (النسخة الكاملة)
// ===============================

const db = window.client;
let allSpecies = [];
let filteredSpecies = [];

// عناصر الصفحة
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const kingdomFilter = document.getElementById("kingdomFilter");
const speciesCount = document.getElementById("speciesCount");
const categoriesCount = document.getElementById("categoriesCount");
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addBtn");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveSpecies");

// ===============================
// بداية التطبيق
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadSpecies();
    checkLogin();
});

// تحميل البيانات
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

// تحديث الإحصائيات
function updateStats() {
    speciesCount.textContent = allSpecies.length;
    const kingdoms = new Set(allSpecies.map(s => s.kingdom));
    categoriesCount.textContent = kingdoms.size;
}

// عرض الكائنات (مع عزل وظيفة التنزيل)
function render() {
    grid.innerHTML = "";
    filteredSpecies.forEach(item => {
        const card = document.createElement("div");
        card.className = "speciesCard";
        card.innerHTML = `
            <div class="card-content" onclick="location.href='species.html?id=${item.id}'" style="cursor:pointer;">
                <img src="${item.image_url || 'assets/no-image.svg'}" style="width:100%; height:200px; object-fit:cover;">
                <h3>${item.name_ar}</h3>
            </div>
            <button class="download-btn" onclick="downloadCard(event, this)" style="width:100%; padding:10px; margin-top:10px; cursor:pointer;">⬇ تنزيل البطاقة</button>
        `;
        grid.appendChild(card);
    });
}

// التنزيل المستقل (يمنع فتح صفحة الكائن)
async function downloadCard(event, btn) {
    event.stopPropagation();
    const card = btn.parentElement;
    const canvas = await html2canvas(card, { backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `species.png`;
    link.click();
}

// البحث والفلترة
function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const kingdom = kingdomFilter.value;
    filteredSpecies = allSpecies.filter(s => 
        (s.name_ar.toLowerCase().includes(searchText) || s.scientific_name?.toLowerCase().includes(searchText)) &&
        (!kingdom || s.kingdom === kingdom)
    );
    render();
}

searchInput?.addEventListener("input", applyFilters);
kingdomFilter?.addEventListener("change", applyFilters);

// إدارة نافذة الإضافة
async function checkLogin() {
    const { data: { user } } = await db.auth.getUser();
    if (user && addBtn) addBtn.style.display = "block";
}

addBtn?.addEventListener("click", () => addModal.classList.add("show"));
closeModal?.addEventListener("click", () => addModal.classList.remove("show"));

saveBtn?.addEventListener("click", async function() {
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
