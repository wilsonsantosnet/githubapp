```javascript
// @ts-check
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const {
  BCPF_BFF_REDIS_HOST: REDIS_HOST = '127.0.0.1',
  BCPF_BFF_REDIS_PORT: REDIS_PORT = '6379',
  BCPF_BFF_REDIS_ACCESS_KEY: REDIS_ACCESS_KEY = '',
  BCPF_BFF_CACHE_TTL
} = process.env;

const EXPIRE_SECONDS = parseInt(BCPF_BFF_CACHE_TTL || (1 * 60 * 20).toString(), 10); // 20 minutes

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