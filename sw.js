const CACHE_NAME = 'anime-game-v1';

// キャッシュするファイルの一覧
const FILES_TO_CACHE = [
  '/anime-game/',
  '/anime-game/index.html',
  '/anime-game/hitsuji_path.html',
  '/anime-game/manifest.json',
  '/anime-game/icons/icon-192.png',
  '/anime-game/icons/icon-512.png'
];

// インストール時: キャッシュに全ファイルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// アクティベート時: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// フェッチ時: キャッシュ優先、なければネットワーク
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
