/* משפחתיקה service worker: app shell cache + web push */
const CACHE = 'mishpahtica-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  const n = (d && d.notification) || {};
  const data = (d && d.data) || {};
  const title = data.title || n.title || 'משפחתיקה';
  const body = data.body || n.body || '';
  e.waitUntil(self.registration.showNotification(title, { body, icon: 'icon-192.png', badge: 'icon-192.png', dir: 'rtl', lang: 'he', tag: n.tag || data.id || 'mp' }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => { for (const c of l) { if ('focus' in c) return c.focus(); } return clients.openWindow('./'); }));
});
