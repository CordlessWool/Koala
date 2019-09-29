const fastifyAuth = require('fastify-auth');
const fastifyJWT = require('fastify-jwt');
const fp = require('fastify-plugin');

const auth = fp(async (fastify, option) => {
  fastify
    .register(fastifyJWT, { secret: 'blub' })
    .register(fastifyAuth)
    .decorate('verifyJWT', async (request, reply) => {
      await request.jwtVerify();
    });
});

module.exports = auth;
