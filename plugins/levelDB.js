const fastifyLevelDB = require('fastify-leveldb');
const fp = require('fastify-plugin');

const levelDB = fp(async (fastify, options) => {
  fastify.register(fastifyLevelDB, {
    name: 'db/koala',
    options: {
      keyEncoding: 'binary',
      valueEncoding: 'json',
    },
  });
});

module.exports = levelDB;
