let CACHE_NAME = "myfrontyard_cache10";

let urlsToCache = [
  "/",
  "/js/manifest.js",
  "/js/howler.core.js",
  "/js/index.js",
  "/js/jquery-ui.min.js",
  "/js/jquery.min.js",
  "/js/jquery.timepicker.js",
  "/js/jquery.ui.timepicker.js",
  "/js/login.js",
  "/js/logout.js",
  "/js/moment.min.js",
  "/js/register-event.js",
  "/js/register-property.js",
  "/js/search-properties.js",
  "/js/signup.js",
  "/js/update-event.js",

  "/audio/halloween_sound.mp3",
  "/audio/xmas_sound.mp3",
  "/css/jquery.timepicker.css",
  "/css/style.css",
  "/images/close.png",
  "/images/event.png",
  "/images/favicon.png",
  "/images/favorites.png",
  "/images/garagesale.png",
  "/images/halloween.png",
  "/images/house_image.png",
  "/images/house.png",
  "/images/icon.png",
  "/images/like.png",
  "/images/liked.png",
  "/images/logout.png",
  "/images/menu_icon.png",
  "/images/pos.png",
  "/images/register.png",
  "/images/saved.png",
  "/images/search.png",
  "/images/trash.png",
  "/images/tree.png",
  "/images/xmas_tree.png",
  "/images/backyard-Edited.jpg",
  "/views/layout/main.handlebars",
  "/views/partials/favourites.handlebars",
  "/views/create-event.handlebars",
  "/views/dashboard.handlebars",
  "/views/homepage.handlebars",
  "/views/login.handlebars",
  "/views/register-property.handlebars",
  "/views/search-property.handlebars",
  "/views/signup.handlebars",
  "/views/update-event.handlebars",

  "/dashboard/",
  "/properties/",
  "/users/",
  "/home",

  "https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap",
  "https://kit.fontawesome.com/05c6b543c0.js",
  "https://code.jquery.com/jquery-1.10.2.js",
  "https://code.jquery.com/ui/1.11.4/jquery-ui.js",
  "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
  "https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css",
  "https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css",
  "https://kit.fontawesome.com/05c6b543c0.js",
  "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
  "https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js",
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js",
  "https://cdn.jsdelivr.net/gh/hosuaby/Leaflet.SmoothMarkerBouncing@v2.0.0/dist/bundle.js",
];

self.addEventListener("install", function (event) {
  console.log("Service Worker installing");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      cache.addAll(urlsToCache);
    })
  );
});

//self.addEventListener('activate', function(event){
//	console.log('Service Working activating');
// event.waitUntil(
//	caches.key().then(function(cacheNames){
//	return Promise.all(
//		cacheNames.filter(function(cacheName){
//			//return true;
//		}).map(function(cacheName){
// 		return caches.delete(cacheName);
// 	   })
//    );
//   })
//  );
//});

self.addEventListener("install", function (event) {
  console.log("Service Worker installing");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      cache.addAll(urlsToCache);
    })
  );
});

//self.addEventListener('activate', function(event){
//	console.log('Service Working activating');
// event.waitUntil(
//	caches.key().then(function(cacheNames){
//	return Promise.all(
//		cacheNames.filter(function(cacheName){
//			//return true;
//		}).map(function(cacheName){
// 		return caches.delete(cacheName);
// 	   })
//    );
//   })
//  );
//});

self.addEventListener("activate", (event) => {
  // Remove old caches
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      return keys.map(async (cache) => {
        if (cache.indexOf("myfrontyard_") == 0) {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Removing old cache: " + cache);
            return await caches.delete(cache);
          }
        }
      });
    })()
  );
});

self.addEventListener("fetch", function (event) {
  let online = navigator.onLine;
  if (!online) {
    if (event.request.destination == "" || event.request.destination == null) {
      return;
    }
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        requestBackend(event);
      })
    );
  }
});

function requestBackend(event) {
  var url = event.request.clone();
  return fetch(url).then(function (res) {
    //if not a valid response send the error
    if (!res || res.status !== 200 || res.type !== "basic") {
      return res;
    }

    var response = res.clone();

    caches.open(CACHE_VERSION).then(function (cache) {
      cache.put(event.request, response);
    });

    return res;
  });
}
