const LANG = {

ar:{

home:"الرئيسية",

categories:"التصنيفات",

about:"حول",

login:"تسجيل الدخول",

heroTitle:"اكتشف الكائنات الحية في العراق",

heroText:"موسوعة تضم الحيوانات والنباتات والفطريات والكائنات الحية العراقية.",

search:"ابحث باسم الكائن..."

},

en:{

home:"Home",

categories:"Categories",

about:"About",

login:"Login",

heroTitle:"Discover Iraq's Living Organisms",

heroText:"A database of Iraq's animals, plants, fungi and wildlife.",

search:"Search species..."

}

};

let current="ar";

const btn=document.getElementById("langBtn");

function applyLanguage(){

document.documentElement.lang=current;

document.documentElement.dir=current==="ar"?"rtl":"ltr";

document.querySelectorAll("[data-lang]").forEach(el=>{

const key=el.dataset.lang;

if(LANG[current][key])

el.innerHTML=LANG[current][key];

});

const title=document.getElementById("heroTitle");

if(title) title.innerHTML=LANG[current].heroTitle;

const text=document.getElementById("heroText");

if(text) text.innerHTML=LANG[current].heroText;

const search=document.getElementById("search");

if(search) search.placeholder=LANG[current].search;

btn.innerHTML=current==="ar"?"EN":"AR";

localStorage.setItem("lang",current);

}

current=localStorage.getItem("lang")||"ar";

applyLanguage();

btn.onclick=()=>{

current=current==="ar"?"en":"ar";

applyLanguage();

};
