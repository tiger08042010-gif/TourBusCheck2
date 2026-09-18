const CACHE_NAME = "tour-bus-check-v5";

const FILES_TO_CACHE = [
  "./login.html",
  "./dashboard.html",
  "./bus.html",
  "./groups.html",
  "./manifest.json"
];

/* =========================
   Firebase Cloud Messaging
========================= */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCyc7rXZ254ZPiLR6j-yKbsJSq3o9VahDw",
  authDomain: "tourbuscheck2.firebaseapp.com",
  projectId: "tourbuscheck2",
  storageBucket: "tourbuscheck2.firebasestorage.app",
  messagingSenderId: "151352354886",
  appId: "1:151352354886:web:6c12aea5b9165149c1c247",
  measurementId: "G-LBW7P3XDH1"
});

const messaging = firebase.messaging();

/* =========================
   Cache
========================= */

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then((cacheNames) => {

      return Promise.all(

        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))

      );

    })

  );

  self.clients.claim();
});

/* =========================
   รับ Notification ตอนแอปอยู่เบื้องหลัง
========================= */

messaging.onBackgroundMessage((payload) => {

  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title ||
    "Tour Bus Check";

  const notificationOptions = {

    body:
      payload.notification?.body ||
      "มีประกาศใหม่จากระบบ",

    icon: "./icon-192.png",

    data: {
      url: "./groups.html"
    }

  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});

/* =========================
   เปิดหน้าเว็บเมื่อกด Notification
========================= */

self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {

        if ("focus" in client) {
          return client.focus();
        }

      }

      if (clients.openWindow) {
        return clients.openWindow("./groups.html");
      }

    })

  );

});

/* =========================
   โหลดไฟล์เว็บ
========================= */

self.addEventListener("fetch", (event) => {

  event.respondWith(

    fetch(event.request).catch(() => {

      return caches.match(event.request);

    })

  );

});
