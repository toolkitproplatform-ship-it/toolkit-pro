# ============================================
# Toolkit Pro - Dockerfile
# ============================================
# Node.js 18 Alpine (হালকা ও দ্রুত)
# ============================================

# বেস ইমেজ
FROM node:18-alpine

# মেটাডাটা
LABEL maintainer="Toolkit Pro Team"
LABEL description="Toolkit Pro - All-in-One Online Tools Platform"
LABEL version="1.0.0"

# ওয়ার্কিং ডিরেক্টরি
WORKDIR /app

# প্যাকেজ ফাইল কপি
COPY package*.json ./

# ডিপেন্ডেন্সি ইনস্টল (প্রোডাকশন)
RUN npm install --production --no-audit --no-fund

# সোর্স কোড কপি
COPY . .

# নন-রুট ইউজার তৈরি
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# নন-রুট ইউজার হিসেবে চালান
USER nodejs

# পোর্ট এক্সপোজ
EXPOSE 10000

# হেলথ চেক
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:10000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# এনভায়রনমেন্ট ভেরিয়েবল
ENV NODE_ENV=production
ENV PORT=10000

# সার্ভার শুরু
CMD ["node", "server.js"]
