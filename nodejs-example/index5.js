```javascript
// @ts-check
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
  getRedisClient: () => {
    if (!redisClient) {
      redisClient = redis.createClient(REDIS_CONNECTION);
      redisClient.on('error', (err) => log.error('Redis Client Error', err));
      if (REDIS_ACCESS_KEY) {
        redisClient.auth(REDIS_ACCESS_KEY);
      }
    }
    return redisClient;
  },
  
  setCache: (key, value) => {
    redisClient.set(key, JSON.stringify(value), 'EX', EXPIRE_SECONDS, (err) => {
      if (err) {
        log.error('Redis Set Cache Error', err);
      }
    });
  },
  
  getCache: (key, callback) => {
    redisClient.get(key, (err, data) => {
      if (err) {
        log.error('Redis Get Cache Error', err);
        callback(err, null);
      } else {
        callback(null, JSON.parse(data));
      }
    });
  }
};
```