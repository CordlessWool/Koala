const fastifyAuth = require('fastify-auth')
const fastifyJWT = require('fastify-jwt')
const fp = require('fastify-plugin')

const auth = fp(async (fastify, option) => {
    fastify
    .register(fastifyJWT, {secret: 'blub'})
    .register(fastifyAuth)
    .decorate('verifyJWT', async function (request, reply) {
        await request.jwtVerify();
    })
    .decorate('verifyUser', async function (req, res) {
        console.log(req)
        const {user, password} = req.body;

        if(!user || !password){
            throw new Error('BadRequest')
        }
    })
});

module.exports = auth;