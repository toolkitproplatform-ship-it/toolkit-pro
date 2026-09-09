// ============================================
// Toolkit Pro - Service Worker
// PWA Offline Support
// ============================================

const CACHE_NAME = 'toolkit-pro-v1.0.0';
const STATIC_CACHE = 'toolkit-pro-static-v1';
const DYNAMIC_CACHE = 'toolkit-pro-dynamic-v1';
const API_CACHE = 'toolkit-pro-api-v1';

// ক্যাশে করার জন্য ফাইল
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/tools.html',
  '/tool.html',
  '/categories.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&display=swap',
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claim clients');
        return self.clients.claim();
      })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API কল হ্যান্ডেল
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Static ফাইল
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// API Request Handler
async function handleApiRequest(request) {
  // Network first, fallback to cache
  try {
    const response = await fetch(request);
    
    // সফল রেসপন্স ক্যাশে করুন
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // নেটওয়ার্ক ফেইল হলে ক্যাশে থেকে
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // ক্যাশে না থাকলে এরর
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Offline mode - data not available',
        offline: true,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Static Request Handler
async function handleStaticRequest(request) {
  // Cache first, fallback to network
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    // সফল রেসপন্স ক্যাশে করুন
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // HTML পেজের জন্য অফলাইন ফলব্যাক
    if (request.headers.get('accept').includes('text/html')) {
      const cachedHome = await caches.match('/index.html');
      if (cachedHome) {
        return cachedHome;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Push Notification
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Toolkit Pro';
  const options = {
    body: data.body || 'নতুন টুলস যোগ হয়েছে!',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-72x72.png',
    vibrate: [100, 50, 100],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
