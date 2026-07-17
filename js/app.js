const statusMap = {
  EX: { text: "منقرض", color: "#000000" },
  EW: { text: "منقرض في البرية", color: "#555555" },
  CR: { text: "مهدد بخطر انقراض أقصى", color: "#D32F2F" },
  EN: { text: "مهدد بالانقراض", color: "#F57C00" },
  VU: { text: "معرض للخطر", color: "#FBC02D" },
  NT: { text: "قريب من التهديد", color: "#7CB342" },
  LC: { text: "غير مهدد", color: "#2E7D32" },
  DD: { text: "بيانات غير كافية", color: "#1976D2" },
  NE: { text: "غير مقيم", color: "#9E9E9E" }
};

function getStatus(code) {

    code = (code || "").trim().toUpperCase();

    return statusMap[code] || {
        text: "غير محدد",
        color: "#607D8B"
    };

}

const grid = document.getElementById("grid");
const speciesCount = document.getElementById("speciesCount");
const categoriesCount = document.getElementById("categoriesCount");

let allSpecies = [];

async function loadSpecies() {

    grid.innerHTML = "<h3 style='text-align:center'>جاري التحميل...</h3>";

    const { data, error } = await supabaseClient
        .from("species")
        .select("*")
        .order("name_ar");

    if (error) {

        console.log(error);

        grid.innerHTML = "<h3>حدث خطأ أثناء تحميل البيانات</h3>";

        return;

    }

    allSpecies = data;

    renderSpecies(allSpecies);

    speciesCount.textContent = data.length;

    categoriesCount.textContent =
        [...new Set(data.map(i => i.kingdom))].length;

}

function renderSpecies(list) {

    grid.innerHTML = "";

    if (!list.length) {

        grid.innerHTML = "<h3 style='text-align:center'>لا توجد نتائج</h3>";

        return;

    }

    list.forEach(item => {

        const status = getStatus(item.conservation_status);

        const image =
            item.image_url ||
            "assets/no-image.svg";

        grid.innerHTML += `

<div class="speciesCard"
onclick="location.href='species.html?id=${item.id}'">

<img
src="${image}"
loading="lazy">

<div class="speciesBody">

<h3>${item.name_ar || "غير معروف"}</h3>

<p>

<b>${item.scientific_name || ""}</b>

</p>

<p>

${item.description || ""}

</p>

<span
class="badge"
style="background:${status.color};color:#fff">

${status.text}

</span>

</div>

</div>

`;

    });

}

loadSpecies();
/* ===========================
   البحث
=========================== */

const search = document.getElementById("search");

if (search) {

    search.addEventListener("input", function () {

        const value = this.value
            .trim()
            .toLowerCase();

        const filtered = allSpecies.filter(item => {

            return (

                (item.name_ar || "")
                .toLowerCase()
                .includes(value)

                ||

                (item.scientific_name || "")
                .toLowerCase()
                .includes(value)

            );

        });

        renderSpecies(filtered);

    });

}

/* ===========================
   فلتر المملكة
=========================== */

const kingdomFilter =
document.getElementById("kingdomFilter");

if (kingdomFilter) {

    kingdomFilter.addEventListener("change", function () {

        const value = this.value;

        if (!value) {

            renderSpecies(allSpecies);

            return;

        }

        const filtered = allSpecies.filter(item =>

            item.kingdom === value

        );

        renderSpecies(filtered);

    });

}

/* ===========================
   التحقق من تسجيل الدخول
=========================== */

const addBtn =
document.getElementById("addBtn");

async function checkLogin() {

    try {

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (user) {

            addBtn.style.display = "block";

        }

    } catch (e) {

        console.log(e);

    }

}

checkLogin();

/* ===========================
   فتح وإغلاق النافذة
=========================== */

const addModal =
document.getElementById("addModal");

const closeModal =
document.getElementById("closeModal");

addBtn.onclick = () => {

    addModal.classList.add("show");

};

closeModal.onclick = () => {

    addModal.classList.remove("show");

};

addModal.onclick = function (e) {

    if (e.target === addModal) {

        addModal.classList.remove("show");

    }

};
/* ===========================
   حفظ الكائن
=========================== */

const saveBtn =
document.getElementById("saveSpecies");

saveBtn.onclick = async function (e) {

    e.preventDefault();

    const result =
    document.getElementById("result");

    const obj = {

        name_ar:
        document.getElementById("name_ar")
        .value.trim().replace(/\s+/g," "),

        scientific_name:
        document.getElementById("scientific_name")
        .value.trim().replace(/\s+/g," "),

        kingdom:
        document.getElementById("kingdom").value,

        conservation_status:
        document.getElementById("conservation_status").value,

        phylum:
        document.getElementById("phylum").value,

        class:
        document.getElementById("class").value,

        order_name:
        document.getElementById("order_name").value,

        family:
        document.getElementById("family").value,

        genus:
        document.getElementById("genus").value,

        species_type:
        document.getElementById("species_type").value,

        description:
        document.getElementById("description")
        .value.trim(),

        image_url: ""

    };

    if (!obj.name_ar || !obj.scientific_name) {

        result.innerHTML =
        "⚠️ الاسم العربي والعلمي إجباريان";

        return;

    }

    result.innerHTML = "جاري التحقق...";

    const { data: exists } =
    await supabaseClient

    .from("species")

    .select("id")

    .or(

`name_ar.eq.${obj.name_ar},scientific_name.eq.${obj.scientific_name}`

    );

    if (exists && exists.length) {

        result.innerHTML =
        "⚠️ الاسم موجود مسبقاً";

        return;

    }

    result.innerHTML =
    "جاري الحفظ...";

    const { error } =
    await supabaseClient

    .from("species")

    .insert([obj]);

    if (error) {

        result.innerHTML =
        "❌ " + error.message;

        return;

    }

    result.innerHTML =
    "✅ تمت إضافة الكائن";

    setTimeout(() => {

        addModal.classList.remove("show");

        document.querySelectorAll(
            "#addModal input,#addModal textarea,#addModal select"
        ).forEach(el => {

            if (el.tagName === "SELECT") {

                el.selectedIndex = 0;

            } else {

                el.value = "";

            }

        });

        loadSpecies();

    }, 1500);

};
/* ===========================
   التصنيفات (Taxonomy)
=========================== */

const kingdom =
document.getElementById("kingdom");

const phylum =
document.getElementById("phylum");

const classSelect =
document.getElementById("class");

const orderSelect =
document.getElementById("order_name");

const familySelect =
document.getElementById("family");

function resetSelect(select, text) {

    if (!select) return;

    select.innerHTML =
    `<option value="">${text}</option>`;

}

if (kingdom) {

    kingdom.addEventListener("change", function () {

        resetSelect(phylum, "اختر الشعبة");
        resetSelect(classSelect, "اختر الصف");
        resetSelect(orderSelect, "اختر الرتبة");
        resetSelect(familySelect, "اختر الفصيلة");

        if (
            typeof taxonomy === "undefined" ||
            !taxonomy[this.value]
        ) return;

        const kingdomData =
        taxonomy[this.value];

        Object.keys(
            kingdomData.phylum
        ).forEach(name => {

            phylum.innerHTML +=
            `<option value="${name}">
            ${name}
            </option>`;

        });

    });

}

/* ===========================
   رفع الصورة
=========================== */

const imageInput =
document.getElementById("image_file");

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            if (
                this.files &&
                this.files.length
            ) {

                console.log(
                    "تم اختيار صورة:",
                    this.files[0].name
                );

            }

        }
    );

}
