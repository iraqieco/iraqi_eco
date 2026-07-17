const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const content = document.getElementById("speciesContent");

async function loadSpecies() {

    if (!id) {
        content.innerHTML = "<h2>الكائن غير موجود</h2>";
        return;
    }

    const { data, error } = await supabase
        .from("species")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        content.innerHTML = "<h2>تعذر تحميل البيانات</h2>";
        return;
    }

   document.title = data.name_ar + " | Iraqi Eco";

   content.innerHTML = `

<div class="species-page">

    <img class="species-image"
         src="${data.image_url || "assets/no-image.svg"}"
         alt="${data.name_ar}">

    <div class="species-info">

        <h1>${data.name_ar}</h1>

        <div class="scientific-name">
            ${data.scientific_name || "-"}
        </div>

        <div class="status-box">
            <span class="badge">
                ${data.conservation_status || "غير معروف"}
            </span>
        </div>

        <p class="species-description">
            ${data.description || "لا يوجد وصف."}
        </p>

        <table class="species-table">

            <tr>
                <td>المملكة</td>
                <td>${data.kingdom || "-"}</td>
            </tr>

            <tr>
                <td>الشعبة</td>
                <td>${data.phylum || "-"}</td>
            </tr>

            <tr>
                <td>الصف</td>
                <td>${data.class || "-"}</td>
            </tr>

            <tr>
                <td>الرتبة</td>
                <td>${data.order_name || "-"}</td>
            </tr>

            <tr>
                <td>الفصيلة</td>
                <td>${data.family || "-"}</td>
            </tr>

        </table>

        <div class="species-buttons">

            <button onclick="copyLink()">
                نسخ الرابط
            </button>

            <button onclick="sharePage()">
                مشاركة
            </button>

        </div>

    </div>

</div>

`; 

}

loadSpecies();

function copyLink() {

    navigator.clipboard.writeText(location.href);

    alert("تم نسخ الرابط");

}

async function sharePage() {

    if (navigator.share) {

        await navigator.share({

            title: document.title,

            text: document.title,

            url: location.href

        });

    } else {

        copyLink();

    }

  }
