```javascript
// @ts-check
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const {
  BCPF_BFF_REDIS_HOST = '127.0.0.1',
  BCPF_BFF_REDIS_PORT = '6379',
  BCPF_BFF_REDIS_ACCESS_KEY = '',
  BCPF_BFF_CACHE_TTL = '1200' // 20 minutes in seconds
} = process.env;

const REDIS_HOST = BCPF_BFF_REDIS_HOST;
const REDIS_PORT = Number(BCPF_BFF_REDIS_PORT);
const REDIS_ACCESS_KEY = BCPF_BFF_REDIS_ACCESS_KEY;
const EXPIRE_SECONDS = parseInt(BCPF_BFF_CACHE_TTL);

const REDIS_CONNECTION = {
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    tls: true,
    reconnectStrategy: false,
  },
};

let redisClient;
```