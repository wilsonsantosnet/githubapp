```javascript
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const REDIS_HOST = process.env.BCPF_BFF_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.BCPF_BFF_REDIS_PORT || '6379';
const REDIS_ACCESS_KEY = process.env.BCPF_BFF_REDIS_ACCESS_KEY || '';
const EXPIRE_SECONDS = parseInt(process.env.BCPF_BFF_CACHE_TTL || '1200', 10); // 20 minutes

const REDIS_CONNECTION = {
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    tls: true,
    reconnectStrategy: false,
  },
  password: REDIS_ACCESS_KEY,
};

let redisClient;

(async () => {
  redisClient = redis.createClient(REDIS_CONNECTION);

  redisClient.on('error', (err) => log('Redis Client Error', err));
  redisClient.on('connect', () => log('Redis Client Connected'));
  redisClient.on('end', () => log('Redis Client Disconnected'));

  await redisClient.connect();
})();

module.exports = {
  redisClient,
  EXPIRE_SECONDS,
};
```