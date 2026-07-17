// الاتصال بقاعدة البيانات
const db = window.client;

async function init() {
    const { data } = await db.from("species").select("*");
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    
    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "speciesCard";
        card.innerHTML = `
            <div class="card-content" onclick="location.href='species.html?id=${item.id}'">
                <img src="${item.image_url || 'assets/no-image.svg'}" alt="${item.name_ar}">
                <h3>${item.name_ar}</h3>
            </div>
            <button class="download-btn" onclick="downloadCard(event, this)">⬇ تنزيل البطاقة</button>
        `;
        grid.appendChild(card);
    });
}

async function downloadCard(event, btn) {
    event.stopPropagation();
    const card = btn.parentElement;
    const canvas = await html2canvas(card, { backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "card.png";
    link.click();
}

document.addEventListener("DOMContentLoaded", init);
