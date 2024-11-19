Claro, com base nas sugestões fornecidas, aqui está o código refatorado:

```javascript
// @ts-check
const Redis = require('ioredis');
const { log } = require('./logger');

const REDIS_HOST = process.env.BCPF_BFF_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.BCPF_BFF_REDIS_PORT || '6379';
const REDIS_ACCESS_KEY = process.env.BCPF_BFF_REDIS_ACCESS_KEY || '';
const EXPIRE_SECONDS = parseInt((process.env.BCPF_BFF_CACHE_TTL || (1 * 60 * 20)).toString(), 10); // 20 minutes

const REDIS_CONNECTION = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  tls: REDIS_ACCESS_KEY ? { rejectUnauthorized: false } : false,
  password: REDIS_ACCESS_KEY,
  reconnectStrategy: (retries) => {
    if (retries > 10) {
      return new Error('Retry count exceeded');
    }
    return Math.min(retries * 50, 2000); // Exponential backoff
  },
};

let redisClient = new Redis(REDIS_CONNECTION);

redisClient.on('connect', () => log('Redis connected', { host: REDIS_HOST, port: REDIS_PORT }));
redisClient.on('error', (err) => log('Redis error', { error: err.message }));

process.on('SIGINT', () => {
  if (redisClient) {
    redisClient.quit(() => {
      log('Redis connection closed');
      process.exit(0);
    });
  }
});

async function getValue(key) {
  try {
    return await redisClient.get(key);
  } catch (err) {
    log('Error fetching value from Redis', { key, error: err.message });
    throw err;
  }
}

async function setValue(key, value) {
  try {
    await redisClient.set(key, value, 'EX', EXPIRE_SECONDS);
    log('Value set in Redis', { key, value });
  } catch (err) {
    log('Error setting value in Redis', { key, value, error: err.message });
    throw err;
  }
}

module.exports = { getValue, setValue, redisClient };
```

### Principais Mudanças:

1. **Reconexão Automatizada**: Adicionado `reconnectStrategy` para implementar uma estratégia de reconexão com backoff exponencial.
2. **Encerramento Graceful**: Adicionado um handler para `SIGINT` para garantir que o cliente Redis seja encerrado corretamente ao finalizar a aplicação.
3. **Uso de `ioredis`**: Substituído o cliente Redis padrão pelo `ioredis` para melhor suporte a reconexões e pooling.
4. **Manuseio de Promises**: Garantido que todas as operações Redis tratem rejeições de promessas.
5. **TLS e Autenticação**: Adicionado suporte para TLS e senha se `REDIS_ACCESS_KEY` estiver definido.
6. **Função `setValue`**: Adicionada uma função para definir valores no Redis com TTL configurado.

Estas melhorias devem proporcionar um código mais resiliente, eficiente e observável, além de seguir práticas modernas de desenvolvimento para aplicações em nuvem.