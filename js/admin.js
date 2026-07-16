async function loadTable() {

    const table = document.getElementById("table");

    if (!table) return;

    const { data, error } = await supabase
        .from("species")
        .select("*")
        .order("id");

    if (error) {

        table.innerHTML = "<tr><td>خطأ في تحميل البيانات</td></tr>";

        return;

    }

    table.innerHTML = "";

    data.forEach(item => {

        table.innerHTML += `

<tr>

<td>${item.id}</td>

<td>${item.name_ar}</td>

<td>${item.scientific_name}</td>

<td>${item.class || "-"}</td>

<td>${item.conservation_status || "-"}</td>

<td>

<a href="edit.html?id=${item.id}">✏️</a>

<button onclick="deleteSpecies(${item.id})">

🗑

</button>

</td>

</tr>

`;

    });

}

loadTable();

async function deleteSpecies(id){

if(!confirm("هل تريد حذف هذا الكائن؟")) return;

const {error}=await supabase

.from("species")

.delete()

.eq("id",id);

if(error){

alert("فشل الحذف");

return;

}

loadTable();

}
