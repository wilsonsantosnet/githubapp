```javascript
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const {
  BCPF_BFF_REDIS_HOST: REDIS_HOST = '127.0.0.1',
  BCPF_BFF_REDIS_PORT: REDIS_PORT = '6379',
  BCPF_BFF_REDIS_ACCESS_KEY: REDIS_ACCESS_KEY = '',
  BCPF_BFF_CACHE_TTL: CACHE_TTL = '1200' // 20 minutes in seconds
} = process.env;

const EXPIRE_SECONDS = parseInt(CACHE_TTL, 10);

const REDIS_CONNECTION = {
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    tls: true,
    reconnectStrategy: false,
  },
};

let redisClient;
```