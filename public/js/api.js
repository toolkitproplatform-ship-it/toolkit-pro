// ============================================
// Toolkit Pro - API Helper
// ============================================

const API_BASE_URL = '/api/v1';

// API কল হেল্পার
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        return null;
    }
}

// পপুলার টুলস লোড
async function loadPopularTools() {
    const response = await apiCall('/popular?limit=12');
    if (response && response.success) {
        return response.data;
    }
    return [];
}

// ফিচার্ড টুলস লোড
async function loadFeaturedTools() {
    const response = await apiCall('/featured?limit=12');
    if (response && response.success) {
        return response.data;
    }
    return [];
}

// নতুন টুলস লোড
async function loadNewTools() {
    const response = await apiCall('/new?limit=12');
    if (response && response.success) {
        return response.data;
    }
    return [];
}

// সব টুলস লোড
async function loadAllTools(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiCall(`/tools?${queryString}`);
    if (response && response.success) {
        return response.data || response;
    }
    return [];
}

// ক্যাটাগরি লোড
async function loadCategories() {
    const response = await apiCall('/categories');
    if (response && response.success) {
        return response.data;
    }
    return [];
}

// টুল খোঁজা
async function searchTools(query) {
    const response = await apiCall(`/search?q=${encodeURIComponent(query)}`);
    if (response && response.success) {
        return response.data.results || response.data;
    }
    return [];
}

// টুল ডিটেইল
async function getToolDetail(slug) {
    const response = await apiCall(`/tools/${slug}`);
    if (response && response.success) {
        return response.data;
    }
    return null;
}

// টুল এক্সিকিউট
async function executeTool(slug, input) {
    const response = await apiCall(`/tools/${slug}/execute`, {
        method: 'POST',
        body: JSON.stringify(input),
    });
    
    if (response && response.success) {
        return response.data;
    }
    return null;
}
