```javascript
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const REDIS_HOST = process.env.BCPF_BFF_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.BCPF_BFF_REDIS_PORT || '6379';
const REDIS_ACCESS_KEY = process.env.BCPF_BFF_REDIS_ACCESS_KEY || '';
const EXPIRE_SECONDS = parseInt(process.env.BCPF_BFF_CACHE_TTL, 10) || 1200; // 20 minutes

const REDIS_CONNECTION = {
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    tls: true,
    reconnectStrategy: false,
  },
};

let redisClient;

module.exports = {
  initRedisClient: async () => {
    try {
      redisClient = redis.createClient(REDIS_CONNECTION);
      await redisClient.connect();
      log('Connected to Redis');
    } catch (error) {
      log(`Failed to connect to Redis: ${error.message}`);
    }
  },
  getRedisClient: () => redisClient,
  setCache: async (key, value) => {
    try {
      await redisClient.setEx(key, EXPIRE_SECONDS, JSON.stringify(value));
      log(`Cache set for key: ${key}`);
    } catch (error) {
      log(`Failed to set cache for key ${key}: ${error.message}`);
    }
  },
  getCache: async (key) => {
    try {
      const data = await redisClient.get(key);
      log(`Cache retrieved for key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      log(`Failed to retrieve cache for key ${key}: ${error.message}`);
      return null;
    }
  },
};
```