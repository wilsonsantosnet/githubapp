```javascript
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const {
  BCPF_BFF_REDIS_HOST = '127.0.0.1',
  BCPF_BFF_REDIS_PORT = '6379',
  BCPF_BFF_REDIS_ACCESS_KEY = '',
  BCPF_BFF_CACHE_TTL = '1200', // 20 minutes
} = process.env;

const EXPIRE_SECONDS = parseInt(BCPF_BFF_CACHE_TTL, 10);

const REDIS_CONNECTION = {
  socket: {
    host: BCPF_BFF_REDIS_HOST,
    port: Number(BCPF_BFF_REDIS_PORT),
    tls: true,
    reconnectStrategy: false,
  },
};

let redisClient;

(async () => {
  try {
    redisClient = redis.createClient(REDIS_CONNECTION);
    await redisClient.connect();
    log('Redis client connected');
  } catch (error) {
    log('Redis connection error:', error);
  }
})();
```