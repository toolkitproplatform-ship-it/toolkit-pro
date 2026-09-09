// ============================================
// Toolkit Pro - AdSense Loader
// ============================================

// অ্যাডসেন্স কনফিগারেশন
const ADSENSE_CONFIG = {
    enabled: true,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // আপনার ID দিন
    autoAds: true,
    lazyLoad: true,
};

// অ্যাডসেন্স স্ক্রিপ্ট লোড
function loadAdSense() {
    if (!ADSENSE_CONFIG.enabled || !ADSENSE_CONFIG.publisherId) {
        console.log('AdSense is not configured');
        return;
    }
    
    // অ্যাডসেন্স স্ক্রিপ্ট
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    // অটো অ্যাডস
    if (ADSENSE_CONFIG.autoAds) {
        const autoAdsScript = document.createElement('script');
        autoAdsScript.async = true;
        autoAdsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;
        autoAdsScript.setAttribute('data-ad-client', ADSENSE_CONFIG.publisherId);
        document.head.appendChild(autoAdsScript);
    }
}

// অ্যাড ইউনিট তৈরি
function createAdUnit(slot, format = 'auto') {
    if (!ADSENSE_CONFIG.enabled) return '';
    
    return `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${ADSENSE_CONFIG.publisherId}"
             data-ad-slot="${slot}"
             data-ad-format="${format}"
             data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;
}

// Lazy Load অ্যাড
function lazyLoadAds() {
    if (!ADSENSE_CONFIG.lazyLoad) return;
    
    const adContainers = document.querySelectorAll('.ad-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const adContainer = entry.target;
                if (!adContainer.dataset.loaded) {
                    adContainer.dataset.loaded = 'true';
                    // অ্যাড লোড করুন
                    loadAdUnit(adContainer);
                }
            }
        });
    }, {
        rootMargin: '100px',
    });
    
    adContainers.forEach(container => {
        observer.observe(container);
    });
}

// অ্যাড ইউনিট লোড
function loadAdUnit(container) {
    if (window.adsbygoogle) {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense load error:', error);
        }
    }
}

// পেজ লোডে অ্যাডসেন্স শুরু
document.addEventListener('DOMContentLoaded', () => {
    loadAdSense();
    lazyLoadAds();
});
