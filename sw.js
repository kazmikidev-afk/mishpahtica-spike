/* משפחתיקה push spike SW */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  const n = (d && d.notification) || {};
  const data = (d && d.data) || {};
  const title = data.title || n.title || 'בדיקת התראות';
  const body = data.body || n.body || '';
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, { body, icon: 'icon-192.png', badge: 'icon-192.png', dir: 'rtl', lang: 'he', tag: 'spike' }),
    fetch('https://script.google.com/macros/s/AKfycbxgZt-UZ-w83xwbYuKyRmvdAfuSQ_fY4WO0ZrhuWH6L0-AY2ZO7igRAd2qNcVwGgl8R/exec', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'receipt', title, id: data.id || '' }) }).catch(() => {})
  ]));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
