// ============================================
// Toolkit Pro - PWA Registration
// ============================================

// Service Worker রেজিস্টার
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  
  // ইনস্টল বাটন দেখান (ঐচ্ছিক)
  showInstallButton();
});

// Install Button Handler
function showInstallButton() {
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          console.log('✅ App installed');
        }
        
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
}

// App Installed
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;
});
