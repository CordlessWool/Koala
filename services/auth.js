const routes = async (fastify, options) => {

    fastify.route({
        method: 'GET',
        url: '/test',
        preHandler: fastify.auth([
            fastify.verifyJWT,
            fastify.verifyUser
        ]),
        handler: (req, reply) => {
            req.log.info('Auth route')
            reply.send({ hello: 'world' })
        }
        })

    fastify.route({
        method: 'POST',
        url: '/signin',
        preHandler: fastify.auth([
            fastify.verifyJWT,
            fastify.verifyUser
        ]),
        handler: (req, reply) => {
            req.log.info('Auth route')
            reply.send({ hello: 'world' })
        }
        })

    fastify.route({
        method: 'POST',
        url: '/signup',
        handler: async (req, res) => {
            const { level, jwt } = fastify;
            const { user, password } = req.body;
            await level.put(`user:${user}`, password)

            res.send({
                token: jwt.sign({
                    user
                })
            })
        }
        })
}

module.exports = routes;