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
    if (!redisClient) {
      redisClient = redis.createClient(REDIS_CONNECTION);
      redisClient.on('error', (err) => log('error', `Redis error: ${err}`));
      redisClient.on('connect', () => log('info', 'Redis connected'));
      redisClient.on('ready', () => log('info', 'Redis ready'));
      redisClient.on('end', () => log('info', 'Redis connection closed'));
      await redisClient.connect();
    }
    return redisClient;
  },
  getRedisClient: () => redisClient,
  closeRedisClient: async () => {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
    }
  },
  setCache: async (key, value) => {
    if (!redisClient) await module.exports.initRedisClient();
    await redisClient.setEx(key, EXPIRE_SECONDS, value);
  },
  getCache: async (key) => {
    if (!redisClient) await module.exports.initRedisClient();
    return redisClient.get(key);
  }
};
```