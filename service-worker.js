const CACHE_NAME = 'ssgs-v4'; // 💡 每次修改後請手動加 1 (v4, v5...)，手機才會更新
const PRE_CACHE_ASSETS = [
    'index.html',
    'service_menu.html',
    'document_apply.html',
    'withdrawal_guide.html',
    'styles.css',
    'manifest.json',
    'icon-192.png',
    'icon-512.png',
    // 💡 請確認以下路徑與 GitHub 資料夾名稱完全一致
    'forms/國立臺中科技大學日間部註冊組各項證明申請書.pdf',
    'forms/國立臺中科技大學(休、退、復)學申請書.pdf',
    'forms/國立臺中科技大學(休、退)學家長同意書.pdf'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // 逐一快取，避免一個檔案失敗就全盤皆輸
            return Promise.allSettled(
                PRE_CACHE_ASSETS.map(asset => {
                    return cache.add(asset).catch(err => console.warn(`快取失敗: ${asset}`, err));
                })
            );
        })
    );
});

// 離線攔截：有快取用快取，沒快取嘗試抓網路
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
