const CACHE_NAME = 'ssgs-v2';
// 這裡只放「沒這些網頁就打不開」的核心檔案
const PRE_CACHE_ASSETS = [
  // 1. 頁面核心 (所有導航流程)
  'index.html',
  'service_menu.html',
  'document_apply.html',
  'withdrawal_guide.html',
  
  // 2. 視覺樣式 (App 的外觀)
  'styles.css',
  
  // 3. PWA 圖示 (App 啟動圖標)
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  
  // 4. 高頻率使用表單 (最核心的兩份)
  /forms/國立臺中科技大學日間部註冊組各項證明申請書 (1).pdf',
  /forms/國立臺中科技大學(休、退、復)學申請書.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE_ASSETS))
  );
});

// 攔截請求：如果快取有就給快取，沒有就去網路抓，抓完順便存起來
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then(networkResponse => {
        // 只有成功的請求才存入快取
        if(networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      });
    })
  );
});
