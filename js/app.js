// ===============================
// Iraqi Eco - App.js
// القسم الأول : المتغيرات العامة
// ===============================

// الاتصال بقاعدة البيانات
const db = window.client;

// البيانات المحملة من Supabase
let allSpecies = [];

// البيانات المعروضة حالياً
let filteredSpecies = [];

// عناصر الصفحة
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const kingdomFilter = document.getElementById("kingdomFilter");

const speciesCount = document.getElementById("speciesCount");
const categoriesCount = document.getElementById("categoriesCount");

// عناصر نافذة الإضافة
const addModal = document.getElementById("addModal");
const saveBtn = document.getElementById("saveSpecies");
const result = document.getElementById("result");

// صورة افتراضية
const DEFAULT_IMAGE = "assets/no-image.svg";

// ===============================
// بداية التطبيق
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadSpecies();
});
// ===============================
// تحميل البيانات من Supabase
// ===============================

async function loadSpecies() {

    try {

        grid.innerHTML = `
        
        <div style="text-align:center;padding:40px;">
            جاري تحميل الكائنات...
        </div>
        `;

        const { data, error } = await db

        .from("species")

        .select(`
            id,
            name_ar,
            scientific_name,
            kingdom,
            conservation_status,
            description,
            image_url
        `)

        .order("name_ar", {
            ascending: true
        });

        if (error)
            throw error;

        allSpecies = data || [];

        filteredSpecies = [...allSpecies];

        updateStatistics();

        renderSpecies();

    }

    catch (err) {

        console.error(err);

        grid.innerHTML = `
        <div style="text-align:center;padding:40px;color:red;">
            فشل تحميل البيانات
        </div>
        `;

    }

}



// ===============================
// تحديث العدادات
// ===============================

function updateStatistics() {

    speciesCount.textContent = allSpecies.length;

    const kingdoms = new Set();

    allSpecies.forEach(item => {

        if (item.kingdom)
            kingdoms.add(item.kingdom);

    });

    categoriesCount.textContent = kingdoms.size;

}
// ===============================
// عرض الكائنات
// ===============================

function renderSpecies() {

    grid.innerHTML = "";

    if (filteredSpecies.length === 0) {

        grid.innerHTML = `
        <div style="text-align:center;padding:40px;">
            لا توجد نتائج
        </div>
        `;

        return;
    }

    filteredSpecies.forEach(item => {

        const status = getStatus(item.conservation_status);

        const image =
            item.image_url && item.image_url.trim() !== ""
            ? item.image_url
            : DEFAULT_IMAGE;

        const card = document.createElement("div");
card.className = "speciesCard";
card.dataset.id = item.id;

        card.innerHTML = `
<button
class="cardMenuBtn"
onclick="openCardMenu(event,'${item.id}')">
&#8942;
</button>
            <img
                src="${image}"
                loading="lazy"
                alt="${item.name_ar}">

            <div class="speciesBody">

                <h3>${item.name_ar || "غير معروف"}</h3>

                <p>
                <p class="scientificName">
    ${item.scientific_name || ""}
</p>

<p class="description">
    ${item.description || "لا يوجد وصف"}
</p>

<div class="statusBox">
    <span
        class="badge"
        style="
            background:${status.color};
            color:#fff;
        ">
        ${status.text}
    </span>


            </div>

        `;

        card.onclick = () => {

            location.href =
            `species.html?id=${item.id}`;

        };

        grid.appendChild(card);

    });

                       }
// ===============================
// البحث والفلترة
// ===============================

function applyFilters() {

    const searchText = (searchInput?.value || "")
        .trim()
        .toLowerCase();

    const kingdom = kingdomFilter?.value || "";

    filteredSpecies = allSpecies.filter(item => {

        const matchSearch =

            !searchText ||

            (item.name_ar || "")
            .toLowerCase()
            .includes(searchText)

            ||

            (item.scientific_name || "")
            .toLowerCase()
            .includes(searchText)

            ||

            (item.description || "")
            .toLowerCase()
            .includes(searchText);

        const matchKingdom =

            !kingdom ||

            item.kingdom === kingdom;

        return matchSearch && matchKingdom;

    });

    renderSpecies();

}

// ===============================
// أحداث البحث
// ===============================

if (searchInput) {

    searchInput.addEventListener("input", applyFilters);

}

if (kingdomFilter) {

    kingdomFilter.addEventListener("change", applyFilters);

}
// ===============================
// حالات الحفظ IUCN
// ===============================

const statusMap = {

    EX: {
        text: "منقرض",
        color: "#000000"
    },

    EW: {
        text: "منقرض في البرية",
        color: "#555555"
    },

    CR: {
        text: "مهدد بخطر انقراض أقصى",
        color: "#D32F2F"
    },

    EN: {
        text: "مهدد بالانقراض",
        color: "#F57C00"
    },

    VU: {
        text: "معرض للخطر",
        color: "#FBC02D"
    },

    NT: {
        text: "قريب من التهديد",
        color: "#7CB342"
    },

    LC: {
        text: "غير مهدد",
        color: "#2E7D32"
    },

    DD: {
        text: "بيانات غير كافية",
        color: "#1976D2"
    },

    NE: {
        text: "غير مقيم",
        color: "#9E9E9E"
    }

};

function getStatus(code) {

    code = (code || "")
        .trim()
        .toUpperCase();

    return statusMap[code] || {

        text: code || "غير محدد",

        color: "#607D8B"

    };

          }
// ===============================
// نافذة إضافة الكائن
// ===============================

const addBtn = document.getElementById("addBtn");
const closeModal = document.getElementById("closeModal");

// التحقق من تسجيل الدخول
async function checkLogin() {

    try {

        const {
            data: { user }
        } = await db.auth.getUser();

        if (user && addBtn) {

            addBtn.style.display = "block";

        }

    } catch (err) {

        console.log(err);

    }

}

checkLogin();


// فتح النافذة

if (addBtn) {

    addBtn.addEventListener("click", () => {

        addModal.classList.add("show");

    });

}


// إغلاق النافذة

if (closeModal) {

    closeModal.addEventListener("click", () => {

        addModal.classList.remove("show");

    });

}


// إغلاق عند الضغط خارجها

window.addEventListener("click", function (e) {

    if (e.target === addModal) {

        addModal.classList.remove("show");

    }

});
// ===============================
// رفع الصورة إلى Supabase Storage
// ===============================

async function uploadImage() {

    const fileInput = document.getElementById("image_file");

    if (!fileInput || !fileInput.files.length) {

        return "";

    }

    const file = fileInput.files[0];

    const extension = file.name.split(".").pop();

    const fileName =
        Date.now() + "_" +
        Math.random().toString(36).substring(2) +
        "." + extension;

    const { error } = await db.storage

        .from("species-images")

        .upload(fileName, file);

    if (error) {

        alert("فشل رفع الصورة");

        console.log(error);

        return "";

    }

    const { data } = db.storage

        .from("species-images")

        .getPublicUrl(fileName);

    return data.publicUrl;

}
// ===============================
// حفظ الكائن الجديد
// ===============================

if (saveBtn) {

    saveBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        result.innerHTML = "جاري الحفظ...";

        const obj = {

            name_ar: document.getElementById("name_ar").value.trim(),

            scientific_name: document.getElementById("scientific_name").value.trim(),

            kingdom: document.getElementById("kingdom").value,

            phylum: document.getElementById("phylum").value,

            class: document.getElementById("class").value,

            order_name: document.getElementById("order_name").value,

            family: document.getElementById("family").value,

            genus: document.getElementById("genus").value,

            species_type: document.getElementById("species_type").value,

            conservation_status: document.getElementById("conservation_status").value,

            description: document.getElementById("description").value.trim(),

            image_url: ""

        };

        if (!obj.name_ar || !obj.scientific_name) {

            result.innerHTML = "⚠️ يجب إدخال الاسم العربي والعلمي";

            return;

        }

        const { error } = await db

            .from("species")

            .insert([obj]);

        if (error) {

            result.innerHTML = "❌ " + error.message;

            return;

        }

        result.innerHTML = "✅ تم حفظ الكائن بنجاح";

        document.querySelectorAll(

            "#addModal input,#addModal textarea,#addModal select"

        ).forEach(el => {

            if (el.tagName === "SELECT") {

                el.selectedIndex = 0;

            } else {

                el.value = "";

            }

        });

        addModal.classList.remove("show");

        await loadSpecies();

    });

}
let currentSpeciesId = null;
function openCardMenu(event, id) {
    event.stopPropagation();

    document.querySelectorAll(".cardMenu").forEach(e => e.remove());

    const menu = document.createElement("div");
    menu.className = "cardMenu";

    const loggedIn = addBtn && addBtn.style.display === "block";

    menu.innerHTML = loggedIn
        ? `
        <button onclick="editSpecies('${id}')">✏️ تعديل</button>
        <button onclick="deleteSpecies('${id}')">🗑 حذف</button>
        <button onclick="downloadCard('${id}')">📥 تنزيل البطاقة</button>
        `
        : `
        <button onclick="downloadCard('${id}')">👜 تنزيل البطاقة</button>
        `;

    event.target.parentElement.appendChild(menu);
}

document.addEventListener("click", () => {
    document.querySelectorAll(".cardMenu").forEach(e => e.remove());
});
function editSpecies(id) {
    alert("تعديل: " + id);
}

function deleteSpecies(id) {
    alert("حذف: " + id);
}

async function downloadCard(id) {

    document.querySelectorAll(".cardMenu").forEach(e => e.remove());

    const card = document.querySelector(`[data-id="${id}"]`);

    if (!card) {
        alert("تعذر العثور على البطاقة");
        return;
    }

    const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
    });

    const link = document.createElement("a");
    link.download = `species-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

