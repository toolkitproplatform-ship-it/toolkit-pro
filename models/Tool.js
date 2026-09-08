// ============================================
// Toolkit Pro - Tool Model
// ============================================
// টুলস ডাটাবেস মডেল ও CRUD অপারেশন
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const database = require("../database");
const redisClient = require("../redis");

// ----------------------------------------------
// Tool ক্লাস
// ----------------------------------------------
class Tool {
  /**
   * টুল তৈরি করুন
   * @param {Object} toolData - টুলের ডাটা
   * @returns {Object} তৈরি হওয়া টুল
   */
  static async create(toolData) {
    try {
      const {
        slug,
        name,
        category,
        description,
        icon = "🔧",
        url = null,
        api_endpoint = null,
        is_free = true,
        is_active = true,
        is_featured = false,
        is_popular = false,
        is_new = false,
        tags = [],
        keywords = [],
        seo_title = null,
        seo_description = null,
        seo_keywords = [],
        ads_enabled = true,
        config = {},
      } = toolData;
      
      // ভ্যালিডেশন
      if (!slug || !name || !category || !description) {
        throw new Error("Slug, name, category, and description are required");
      }
      
      // স্লাগ ইউনিক চেক
      const existingTool = await database.getOne(`
        SELECT id FROM tools WHERE slug = $1
      `, [slug]);
      
      if (existingTool) {
        throw new Error(`Tool with slug "${slug}" already exists`);
      }
      
      // টুল তৈরি
      const newTool = await database.getOne(`
        INSERT INTO tools (
          slug, name, category, description, icon, url, api_endpoint,
          is_free, is_active, is_featured, is_popular, is_new,
          tags, keywords, seo_title, seo_description, seo_keywords,
          ads_enabled, config
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `, [
        slug, name, category, description, icon, url, api_endpoint,
        is_free, is_active, is_featured, is_popular, is_new,
        tags, keywords, seo_title, seo_description, seo_keywords,
        ads_enabled, JSON.stringify(config)
      ]);
      
      // ক্যাটাগরি টুল কাউন্ট আপডেট
      await database.query(`
        UPDATE tool_categories 
        SET tool_count = tool_count + 1 
        WHERE slug = $1
      `, [category]);
      
      // ক্যাশে ক্লিয়ার
      await redisClient.deleteCache(`tool:${slug}`);
      await redisClient.clearCacheByPattern("tools:list:*");
      await redisClient.clearCacheByPattern("categories:*");
      
      console.log(`✅ Tool created: ${name}`);
      return newTool;
    } catch (error) {
      console.error("Tool create error:", error);
      throw error;
    }
  }
  
  /**
   * স্লাগ অনুযায়ী টুল খুঁজুন
   * @param {String} slug - টুলের স্লাগ
   * @returns {Object|null} টুল অথবা null
   */
  static async findBySlug(slug) {
    try {
      // ক্যাশে চেক
      const cacheKey = `tool:${slug}`;
      const cachedTool = await redisClient.getCachedTool(slug);
      
      if (cachedTool) {
        return cachedTool;
      }
      
      // ডাটাবেস থেকে ফেচ
      const tool = await database.getOne(`
        SELECT 
          t.*,
          tc.name as category_name,
          tc.icon as category_icon,
          (
            SELECT COALESCE(AVG(rating), 0) 
            FROM tool_reviews 
            WHERE tool_id = t.id AND is_approved = true
          ) as average_rating,
          (
            SELECT COUNT(*) 
            FROM tool_reviews 
            WHERE tool_id = t.id AND is_approved = true
          ) as review_count
        FROM tools t
        LEFT JOIN tool_categories tc ON t.category = tc.slug
        WHERE t.slug = $1 AND t.is_active = true
      `, [slug]);
      
      if (tool) {
        // ক্যাশে সেভ
        await redisClient.cacheTool(slug, tool, 600);
      }
      
      return tool;
    } catch (error) {
      console.error("Tool findBySlug error:", error);
      throw error;
    }
  }
  
  /**
   * ID অনুযায়ী টুল খুঁজুন
   * @param {Number} id - টুলের ID
   * @returns {Object|null} টুল অথবা null
   */
  static async findById(id) {
    try {
      const tool = await database.getOne(`
        SELECT * FROM tools WHERE id = $1 AND is_active = true
      `, [id]);
      
      return tool;
    } catch (error) {
      console.error("Tool findById error:", error);
      throw error;
    }
  }
  
  /**
   * সব টুল লিস্ট করুন
   * @param {Object} options - ফিল্টার অপশন
   * @returns {Array} টুলস অ্যারে
   */
  static async findAll(options = {}) {
    try {
      const {
        category = null,
        search = null,
        sort = "popular",
        limit = 20,
        offset = 0,
        is_active = true,
        is_featured = null,
        is_popular = null,
        is_new = null,
      } = options;
      
      let queryText = `
        SELECT 
          id, slug, name, category, icon, description,
          usage_count, rating, rating_count,
          is_featured, is_popular, is_new,
          created_at, updated_at
        FROM tools 
        WHERE 1=1
      `;
      
      const params = [];
      
      if (is_active !== null) {
        queryText += ` AND is_active = $${params.length + 1}`;
        params.push(is_active);
      }
      
      if (category) {
        queryText += ` AND category = $${params.length + 1}`;
        params.push(category);
      }
      
      if (is_featured !== null) {
        queryText += ` AND is_featured = $${params.length + 1}`;
        params.push(is_featured);
      }
      
      if (is_popular !== null) {
        queryText += ` AND is_popular = $${params.length + 1}`;
        params.push(is_popular);
      }
      
      if (is_new !== null) {
        queryText += ` AND is_new = $${params.length + 1}`;
        params.push(is_new);
      }
      
      if (search) {
        queryText += ` AND (
          name ILIKE $${params.length + 1} 
          OR description ILIKE $${params.length + 1}
          OR slug ILIKE $${params.length + 1}
          OR tags::text ILIKE $${params.length + 1}
        )`;
        params.push(`%${search}%`);
      }
      
      // সর্টিং
      switch (sort) {
        case "newest":
          queryText += ` ORDER BY created_at DESC`;
          break;
        case "rating":
          queryText += ` ORDER BY rating DESC, rating_count DESC`;
          break;
        case "alphabetical":
          queryText += ` ORDER BY name ASC`;
          break;
        case "usage":
          queryText += ` ORDER BY usage_count DESC`;
          break;
        case "popular":
        default:
          queryText += ` ORDER BY usage_count DESC, rating DESC`;
          break;
      }
      
      queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const tools = await database.getMany(queryText, params);
      return tools;
    } catch (error) {
      console.error("Tool findAll error:", error);
      throw error;
    }
  }
  
  /**
   * টুল আপডেট করুন
   * @param {String} slug - টুলের স্লাগ
   * @param {Object} updates - আপডেট ডাটা
   * @returns {Object} আপডেটেড টুল
   */
  static async update(slug, updates) {
    try {
      const {
        name,
        category,
        description,
        icon,
        url,
        api_endpoint,
        is_free,
        is_active,
        is_featured,
        is_popular,
        is_new,
        tags,
        keywords,
        seo_title,
        seo_description,
        seo_keywords,
        ads_enabled,
        config,
      } = updates;
      
      const updatedTool = await database.getOne(`
        UPDATE tools 
        SET 
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          icon = COALESCE($4, icon),
          url = COALESCE($5, url),
          api_endpoint = COALESCE($6, api_endpoint),
          is_free = COALESCE($7, is_free),
          is_active = COALESCE($8, is_active),
          is_featured = COALESCE($9, is_featured),
          is_popular = COALESCE($10, is_popular),
          is_new = COALESCE($11, is_new),
          tags = COALESCE($12, tags),
          keywords = COALESCE($13, keywords),
          seo_title = COALESCE($14, seo_title),
          seo_description = COALESCE($15, seo_description),
          seo_keywords = COALESCE($16, seo_keywords),
          ads_enabled = COALESCE($17, ads_enabled),
          config = COALESCE($18, config),
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = $19
        RETURNING *
      `, [
        name, category, description, icon, url, api_endpoint,
        is_free, is_active, is_featured, is_popular, is_new,
        tags, keywords, seo_title, seo_description, seo_keywords,
        ads_enabled, config ? JSON.stringify(config) : null, slug
      ]);
      
      if (updatedTool) {
        // ক্যাশে আপডেট
        await redisClient.deleteCache(`tool:${slug}`);
        await redisClient.clearCacheByPattern("tools:list:*");
        console.log(`✅ Tool updated: ${updatedTool.name}`);
      }
      
      return updatedTool;
    } catch (error) {
      console.error("Tool update error:", error);
      throw error;
    }
  }
  
  /**
   * টুল ডিলিট করুন (সফট ডিলিট)
   * @param {String} slug - টুলের স্লাগ
   * @returns {Boolean} সফল হলে true
   */
  static async delete(slug) {
    try {
      const result = await database.query(`
        UPDATE tools SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE slug = $1
      `, [slug]);
      
      // ক্যাশে ক্লিয়ার
      await redisClient.deleteCache(`tool:${slug}`);
      await redisClient.clearCacheByPattern("tools:list:*");
      
      console.log(`✅ Tool deleted: ${slug}`);
      return true;
    } catch (error) {
      console.error("Tool delete error:", error);
      throw error;
    }
  }
  
  /**
   * টুল হার্ড ডিলিট (ডাটাবেস থেকে সম্পূর্ণ মুছে ফেলুন)
   * @param {String} slug - টুলের স্লাগ
   * @returns {Boolean} সফল হলে true
   */
  static async destroy(slug) {
    try {
      await database.query(`
        DELETE FROM tools WHERE slug = $1
      `, [slug]);
      
      await redisClient.deleteCache(`tool:${slug}`);
      await redisClient.clearCacheByPattern("tools:list:*");
      
      console.log(`✅ Tool destroyed: ${slug}`);
      return true;
    } catch (error) {
      console.error("Tool destroy error:", error);
      throw error;
    }
  }
  
  /**
   * টুলের ইউজ কাউন্ট বাড়ান
   * @param {String} slug - টুলের স্লাগ
   * @returns {Number} নতুন ইউজ কাউন্ট
   */
  static async incrementUsage(slug) {
    try {
      const result = await database.getOne(`
        UPDATE tools SET usage_count = usage_count + 1
        WHERE slug = $1
        RETURNING usage_count
      `, [slug]);
      
      // ক্যাশে আপডেট
      await redisClient.increment(`tool:usage:${slug}`);
      
      return result ? result.usage_count : 0;
    } catch (error) {
      console.error("Tool incrementUsage error:", error);
      throw error;
    }
  }
  
  /**
   * টুলের রেটিং আপডেট
   * @param {Number} toolId - টুলের ID
   * @returns {Object} নতুন রেটিং ডাটা
   */
  static async updateRating(toolId) {
    try {
      const ratingResult = await database.getOne(`
        SELECT 
          COALESCE(AVG(rating), 0) as avg_rating,
          COUNT(*) as rating_count
        FROM tool_reviews 
        WHERE tool_id = $1 AND is_approved = true
      `, [toolId]);
      
      await database.query(`
        UPDATE tools 
        SET rating = $1, rating_count = $2 
        WHERE id = $3
      `, [ratingResult.avg_rating, ratingResult.rating_count, toolId]);
      
      return {
        rating: parseFloat(ratingResult.avg_rating),
        ratingCount: parseInt(ratingResult.rating_count),
      };
    } catch (error) {
      console.error("Tool updateRating error:", error);
      throw error;
    }
  }
  
  /**
   * টুল কাউন্ট
   * @param {Object} filters - ফিল্টার
   * @returns {Number} টুল সংখ্যা
   */
  static async count(filters = {}) {
    try {
      const { category = null, is_active = true } = filters;
      
      let queryText = `SELECT COUNT(*) as total FROM tools WHERE 1=1`;
      const params = [];
      
      if (is_active !== null) {
        queryText += ` AND is_active = $${params.length + 1}`;
        params.push(is_active);
      }
      
      if (category) {
        queryText += ` AND category = $${params.length + 1}`;
        params.push(category);
      }
      
      const result = await database.getOne(queryText, params);
      return parseInt(result.total);
    } catch (error) {
      console.error("Tool count error:", error);
      throw error;
    }
  }
  
  /**
   * পপুলার টুলস
   * @param {Number} limit - সর্বোচ্চ সংখ্যা
   * @returns {Array} পপুলার টুলস
   */
  static async popular(limit = 10) {
    try {
      return await this.findAll({
        sort: "popular",
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error("Tool popular error:", error);
      throw error;
    }
  }
  
  /**
   * ফিচার্ড টুলস
   * @param {Number} limit - সর্বোচ্চ সংখ্যা
   * @returns {Array} ফিচার্ড টুলস
   */
  static async featured(limit = 10) {
    try {
      return await this.findAll({
        is_featured: true,
        sort: "popular",
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error("Tool featured error:", error);
      throw error;
    }
  }
  
  /**
   * নতুন টুলস
   * @param {Number} limit - সর্বোচ্চ সংখ্যা
   * @returns {Array} নতুন টুলস
   */
  static async newest(limit = 10) {
    try {
      return await this.findAll({
        is_new: true,
        sort: "newest",
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error("Tool newest error:", error);
      throw error;
    }
  }
  
  /**
   * সার্চ টুলস
   * @param {String} query - সার্চ কোয়েরি
   * @param {Object} options - অতিরিক্ত অপশন
   * @returns {Array} ম্যাচিং টুলস
   */
  static async search(query, options = {}) {
    try {
      return await this.findAll({
        ...options,
        search: query,
      });
    } catch (error) {
      console.error("Tool search error:", error);
      throw error;
    }
  }
  
  /**
   * ক্যাটাগরি অনুযায়ী টুলস
   * @param {String} category - ক্যাটাগরি স্লাগ
   * @param {Object} options - অতিরিক্ত অপশন
   * @returns {Array} টুলস
   */
  static async byCategory(category, options = {}) {
    try {
      return await this.findAll({
        ...options,
        category,
      });
    } catch (error) {
      console.error("Tool byCategory error:", error);
      throw error;
    }
  }
  
  /**
   * সম্পর্কিত টুলস
   * @param {String} slug - বর্তমান টুলের স্লাগ
   * @param {String} category - ক্যাটাগরি
   * @param {Number} limit - সর্বোচ্চ সংখ্যা
   * @returns {Array} সম্পর্কিত টুলস
   */
  static async related(slug, category, limit = 6) {
    try {
      const tools = await database.getMany(`
        SELECT 
          id, slug, name, category, icon, description,
          usage_count, rating
        FROM tools 
        WHERE category = $1 AND slug != $2 AND is_active = true 
        ORDER BY usage_count DESC 
        LIMIT $3
      `, [category, slug, limit]);
      
      return tools;
    } catch (error) {
      console.error("Tool related error:", error);
      throw error;
    }
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = Tool;
