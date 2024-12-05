```javascript
const redis = require('redis');
const { keys } = require('../config/secretsManager');
const { log } = require('./logger');

const {
  BCPF_BFF_REDIS_HOST = '127.0.0.1',
  BCPF_BFF_REDIS_PORT = '6379',
  BCPF_BFF_REDIS_ACCESS_KEY = '',
  BCPF_BFF_CACHE_TTL = '1200' // 20 minutes in seconds
} = process.env;

const REDIS_CONNECTION = {
  socket: {
    host: BCPF_BFF_REDIS_HOST,
    port: Number(BCPF_BFF_REDIS_PORT),
    tls: true,
    reconnectStrategy: false,
  },
};

const EXPIRE_SECONDS = parseInt(BCPF_BFF_CACHE_TTL, 10);

let redisClient;
```