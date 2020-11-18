importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
  [
    { url: "/", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/team.html", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/db.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/register.js", revision: "1" },
    { url: "/pages/home.html", revision: "1" },
    { url: "/pages/match.html", revision: "1" },
    { url: "/pages/saved.html", revision: "1" },
    { url: "/images/icons/favicon-16x16.png", revision: "1" },
    { url: "/images/icons/favicon-32x32.png", revision: "1" },
    { url: "/images/icons/icon-72x72.png", revision: "1" },
    { url: "/images/icons/icon-96x96.png", revision: "1" },
    { url: "/images/icons/icon-128x128.png", revision: "1" },
    { url: "/images/icons/icon-144x144.png", revision: "1" },
    { url: "/images/icons/icon-152x152.png", revision: "1" },
    { url: "/images/icons/icon-192x192.png", revision: "1" },
    { url: "/images/icons/icon-384x384.png", revision: "1" },
    { url: "/images/icons/icon-512x512.png", revision: "1" },
    { url: "/assets/css/fontawesome.min.css", revision: "1" },
    { url: "/assets/css/solid.min.css", revision: "1" },
    { url: "/assets/webfonts/fa-solid-900.eot", revision: "1" },
    { url: "/assets/webfonts/fa-solid-900.svg", revision: "1" },
    { url: "/assets/webfonts/fa-solid-900.ttf", revision: "1" },
    { url: "/assets/webfonts/fa-solid-900.woff", revision: "1" },
    { url: "/assets/webfonts/fa-solid-900.woff2", revision: "1" },
    ,
  ],
  {
    ignoreUrlParametersMatching: [/.*/],
  }
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football\-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "api",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        statuses: [200],
        headers: { "X-Is-Cacheable": "true" },
      }),
    ],
  })
);

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push No Payload";
  }
  const options = {
    body: body,
    icon: "images/ball.png",
    badge: "images/ball.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("push notification", options)
  );
});
