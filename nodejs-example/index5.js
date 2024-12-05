```javascript
// @ts-check
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const REDIS_HOST = process.env.BCPF_BFF_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.BCPF_BFF_REDIS_PORT, 10) || 6379;
const REDIS_ACCESS_KEY = process.env.BCPF_BFF_REDIS_ACCESS_KEY || '';
const EXPIRE_SECONDS = parseInt(process.env.BCPF_BFF_CACHE_TTL, 10) || 1200; // 20 minutes

const REDIS_CONNECTION = {
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    tls: true,
    reconnectStrategy: false,
  },
};

let redisClient;

const connectToRedis = async () => {
  if (!redisClient) {
    redisClient = redis.createClient(REDIS_CONNECTION);
    redisClient.on('error', (err) => log('Redis Client Error', err));
    
    await redisClient.connect();
  }
  return redisClient;
};

module.exports = {
  connectToRedis,
  EXPIRE_SECONDS,
};
```