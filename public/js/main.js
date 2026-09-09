// ============================================
// Toolkit Pro - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // মোবাইল মেনু টগল
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // সার্চ ফাংশনালিটি
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/tools.html?search=${encodeURIComponent(query)}`;
            }
        };
        
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // হোমপেজে পপুলার টুলস লোড
    const popularToolsContainer = document.getElementById('popularTools');
    if (popularToolsContainer) {
        loadPopularTools().then(tools => {
            if (tools.length > 0) {
                popularToolsContainer.innerHTML = tools.map(tool => createToolCard(tool)).join('');
            } else {
                popularToolsContainer.innerHTML = '<p class="loading">No tools found</p>';
            }
        });
    }
    
    // হোমপেজে ক্যাটাগরি লোড
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (categoriesContainer) {
        loadCategories().then(categories => {
            if (categories.length > 0) {
                categoriesContainer.innerHTML = categories.map(category => createCategoryCard(category)).join('');
            } else {
                categoriesContainer.innerHTML = '<p class="loading">No categories found</p>';
            }
        });
    }
    
    // হোমপেজে নতুন টুলস লোড
    const newToolsContainer = document.getElementById('newTools');
    if (newToolsContainer) {
        loadNewTools().then(tools => {
            if (tools.length > 0) {
                newToolsContainer.innerHTML = tools.map(tool => createToolCard(tool)).join('');
            } else {
                newToolsContainer.innerHTML = '<p class="loading">No new tools</p>';
            }
        });
    }
});

// টুল কার্ড HTML তৈরি
function createToolCard(tool) {
    return `
        <a href="/tool.html?slug=${tool.slug}" class="tool-card">
            <div class="tool-icon">${tool.icon || '🔧'}</div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description || 'No description available'}</p>
            <div class="tool-meta">
                <span class="tool-rating">⭐ ${tool.rating || 0}</span>
                <span class="tool-usage">${tool.usage_count || 0} uses</span>
            </div>
        </a>
    `;
}

// ক্যাটাগরি কার্ড HTML তৈরি
function createCategoryCard(category) {
    return `
        <a href="/tools.html?category=${category.slug}" class="category-card">
            <div class="category-icon">${category.icon || '📁'}</div>
            <h3 class="category-name">${category.name}</h3>
            <p class="category-count">${category.tool_count || 0} tools</p>
        </a>
    `;
}
