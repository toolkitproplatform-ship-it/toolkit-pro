// ============================================
// Toolkit Pro - Response Helper
// ============================================
// স্ট্যান্ডার্ড API রেসপন্স ফরম্যাট ও হেল্পার
// ============================================

// ----------------------------------------------
// স্ট্যান্ডার্ড রেসপন্স
// ----------------------------------------------
function standardResponse(res, statusCode = 200, success = true, message = "", data = null) {
  return res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// এরর রেসপন্স
// ----------------------------------------------
function errorResponse(res, statusCode = 500, message = "Internal server error", error = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? {
      details: typeof error === "string" ? error : error.message || error,
      ...(typeof error === "object" ? error : {}),
    } : null,
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// পেজিনেটেড রেসপন্স
// ----------------------------------------------
function paginatedResponse(res, statusCode = 200, success = true, message = "", data = [], pagination = {}) {
  return res.status(statusCode).json({
    success,
    message,
    data,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      totalPages: pagination.totalPages || 0,
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
      nextPage: pagination.hasNext ? (pagination.page || 1) + 1 : null,
      prevPage: pagination.hasPrev ? (pagination.page || 1) - 1 : null,
    },
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// সাকসেস রেসপন্স (ডাটা সহ)
// ----------------------------------------------
function successResponse(res, message = "Operation successful", data = null, statusCode = 200) {
  return standardResponse(res, statusCode, true, message, data);
}

// ----------------------------------------------
// ক্রিয়েটেড রেসপন্স (২০১)
// ----------------------------------------------
function createdResponse(res, message = "Resource created", data = null) {
  return standardResponse(res, 201, true, message, data);
}

// ----------------------------------------------
// নট ফাউন্ড রেসপন্স (৪০৪)
// ----------------------------------------------
function notFoundResponse(res, message = "Resource not found", data = null) {
  return errorResponse(res, 404, message, data);
}

// ----------------------------------------------
// ব্যাড রিকোয়েস্ট (৪০০)
// ----------------------------------------------
function badRequestResponse(res, message = "Bad request", data = null) {
  return errorResponse(res, 400, message, data);
}

// ----------------------------------------------
// আনঅথরাইজড (৪০১)
// ----------------------------------------------
function unauthorizedResponse(res, message = "Unauthorized access", data = null) {
  return errorResponse(res, 401, message, data);
}

// ----------------------------------------------
// ফরবিডেন (৪০৩)
// ----------------------------------------------
function forbiddenResponse(res, message = "Access forbidden", data = null) {
  return errorResponse(res, 403, message, data);
}

// ----------------------------------------------
// কনফ্লিক্ট (৪০৯)
// ----------------------------------------------
function conflictResponse(res, message = "Resource conflict", data = null) {
  return errorResponse(res, 409, message, data);
}

// ----------------------------------------------
// ভ্যালিডেশন এরর (৪২২)
// ----------------------------------------------
function validationErrorResponse(res, message = "Validation failed", errors = []) {
  return res.status(422).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// টু মেনি রিকোয়েস্ট (৪২৯)
// ----------------------------------------------
function tooManyRequestsResponse(res, message = "Too many requests", retryAfter = 60) {
  res.setHeader("Retry-After", retryAfter);
  return errorResponse(res, 429, message, {
    retryAfter,
  });
}

// ----------------------------------------------
// সার্ভার এরর (৫০০)
// ----------------------------------------------
function serverErrorResponse(res, message = "Internal server error", error = null) {
  return errorResponse(res, 500, message, error);
}

// ----------------------------------------------
// অ্যাডসেন্স রেসপন্স হেল্পার
// ----------------------------------------------
function adsenseResponse(res, adsenseData = {}) {
  return standardResponse(res, 200, true, "AdSense data retrieved", {
    enabled: adsenseData.enabled || false,
    publisherId: adsenseData.publisherId || null,
    autoAds: adsenseData.autoAds || false,
    placements: adsenseData.placements || [],
    lazyLoading: adsenseData.lazyLoading !== false,
    responsive: adsenseData.responsive !== false,
  });
}

// ----------------------------------------------
// ক্যাশে রেসপন্স হেল্পার
// ----------------------------------------------
function cachedResponse(res, data = null, cacheInfo = {}) {
  return res.status(200).json({
    success: true,
    message: "Data retrieved from cache",
    data,
    cache: {
      hit: true,
      ttl: cacheInfo.ttl || null,
      expiresAt: cacheInfo.expiresAt || null,
    },
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// ফাইল ডাউনলোড রেসপন্স
// ----------------------------------------------
function fileResponse(res, fileData = {}) {
  const {
    filename = "download.txt",
    content = "",
    contentType = "text/plain",
  } = fileData;
  
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.send(content);
}

// ----------------------------------------------
// রিডাইরেক্ট রেসপন্স
// ----------------------------------------------
function redirectResponse(res, url = "/", statusCode = 302) {
  return res.redirect(statusCode, url);
}

// ----------------------------------------------
// HTML রেসপন্স
// ----------------------------------------------
function htmlResponse(res, html = "", statusCode = 200) {
  res.setHeader("Content-Type", "text/html");
  return res.status(statusCode).send(html);
}

// ----------------------------------------------
// JSONP রেসপন্স (ক্যালব্যাক সহ)
// ----------------------------------------------
function jsonpResponse(res, data = null, callback = "callback") {
  return res.jsonp(data);
}

// ----------------------------------------------
// স্ট্রিম রেসপন্স
// ----------------------------------------------
function streamResponse(res, stream, options = {}) {
  const {
    contentType = "application/octet-stream",
    filename = null,
  } = options;
  
  if (contentType) {
    res.setHeader("Content-Type", contentType);
  }
  
  if (filename) {
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  }
  
  return stream.pipe(res);
}

// ----------------------------------------------
// অ্যাডসেন্স অ্যাড ইউনিট হেল্পার
// ----------------------------------------------
function createAdUnit(location = "header", size = "auto") {
  const adUnits = {
    header: {
      name: "Header Ad",
      location: "header",
      size: "728x90",
      slot: process.env.ADSENSE_SLOT_HEADER || null,
    },
    sidebar: {
      name: "Sidebar Ad",
      location: "sidebar",
      size: "300x250",
      slot: process.env.ADSENSE_SLOT_SIDEBAR || null,
    },
    in_content: {
      name: "In-Content Ad",
      location: "in_content",
      size: "336x280",
      slot: process.env.ADSENSE_SLOT_IN_CONTENT || null,
    },
    result_page: {
      name: "Result Page Ad",
      location: "result_page",
      size: "300x600",
      slot: process.env.ADSENSE_SLOT_RESULT_PAGE || null,
    },
    mobile_banner: {
      name: "Mobile Banner",
      location: "mobile_banner",
      size: "320x100",
      slot: process.env.ADSENSE_SLOT_MOBILE_BANNER || null,
    },
  };
  
  return adUnits[location] || {
    name: "Custom Ad",
    location,
    size,
    slot: null,
  };
}

// ----------------------------------------------
// মেটা ডাটা হেল্পার
// ----------------------------------------------
function metaResponse(res, data = null, meta = {}) {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      version: meta.version || "1.0.0",
      author: meta.author || "Toolkit Pro",
      license: meta.license || "MIT",
      ...meta,
    },
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// হেলথ চেক রেসপন্স
// ----------------------------------------------
function healthResponse(res, healthData = {}) {
  return standardResponse(res, 200, true, "Health check", {
    status: healthData.status || "healthy",
    uptime: healthData.uptime || process.uptime(),
    database: healthData.database || "unknown",
    redis: healthData.redis || "unknown",
    memory: healthData.memory || process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// বাল্ক রেসপন্স
// ----------------------------------------------
function bulkResponse(res, results = [], message = "Bulk operation completed") {
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return res.status(200).json({
    success: failed === 0,
    message,
    summary: {
      total: results.length,
      successful,
      failed,
    },
    results,
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// রেট লিমিট রেসপন্স
// ----------------------------------------------
function rateLimitResponse(res, limitInfo = {}) {
  return res.status(429).json({
    success: false,
    message: "Rate limit exceeded",
    error: {
      code: "RATE_LIMIT",
      limit: limitInfo.limit || 100,
      remaining: 0,
      resetAt: limitInfo.resetAt || Date.now() + 60000,
      window: limitInfo.window || "1 minute",
    },
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = {
  standardResponse,
  errorResponse,
  paginatedResponse,
  successResponse,
  createdResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
  validationErrorResponse,
  tooManyRequestsResponse,
  serverErrorResponse,
  adsenseResponse,
  cachedResponse,
  fileResponse,
  redirectResponse,
  htmlResponse,
  jsonpResponse,
  streamResponse,
  createAdUnit,
  metaResponse,
  healthResponse,
  bulkResponse,
  rateLimitResponse,
};
