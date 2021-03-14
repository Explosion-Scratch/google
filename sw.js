const staticCacheName = 'site-static-v1';
const assets = [
  '/',
  '/index.html',
	"/manifest.json",
	"/pwa.js",
	"/high-res.png",
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  '/script.js',
	'/style.css',
	'/favicon.png',
	"https://cdn.jsdelivr.net/gh/explosion-scratch/popup@v1.0.2/popup.js",
	"https://cdn.jsdelivr.net/gh/explosion-scratch/popup@v1.0.2/popup.css",
	"https://unpkg.com/mathjs/lib/browser/math.js",
	"https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.1/dist/lazyload.min.js",
	"https://code.iconify.design/1/1.0.7/iconify.min.js",
	"https://unpkg.com/@popperjs/core@2",
	"https://unpkg.com/tippy.js@6/themes/light.css",
	"https://unpkg.com/tippy.js@6"
];
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});