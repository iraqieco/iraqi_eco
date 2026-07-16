const CACHE_NAME="iraqieco-v1";

const FILES=[

"/",

"/index.html",

"/species.html",

"/login.html",

"/add.html",

"/admin.html",

"/edit.html",

"/css/style.css",

"/js/config.js",

"/js/app.js",

"/assets/logo.svg",

"/assets/no-image.svg"

];

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>cache.addAll(FILES))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request)

.then(r=>r||fetch(e.request))

);

});
