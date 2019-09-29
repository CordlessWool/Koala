const { encryptPassword, isPasswordValid } = require('../utils/crypter');

const routes = async (fastify, options) => {
  fastify.route({
    method: 'POST',
    url: '/signin',
    schema: {
      body: {
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: async (req, res) => {
      const { level, jwt } = fastify;
      const { email, password } = req.body;


      try {
        const user = await level.get(`user:${email}`);


        if (isPasswordValid(password, user.password)) {
          return res.code(401);
        }

        const token = jwt.sign({
          email,
          name: user.name,
          roles: user.roles,
        });
        res.send({
          token,
        });
      } catch (err) {
        switch (err.type) {
          case 'NotFoundError':
            return res.code(401);
          default:
            return res.code(500);
        }
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/signup',
    schema: {
      body: {
        type: 'object',
        required: ['password', 'email', 'name'],
        properties: {
          password: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    handler: async (req, res) => {
      const { level, jwt } = fastify;
      const { email, password, name } = req.body;
      const roles = ['admin'];
      const enrypted = await encryptPassword(password);
      await level.put(`user:${email}`, {
        password: enrypted,
        email,
        name,
        roles,
      });

      res.send({
        token: jwt.sign({
          email,
          name,
          roles,
        }),
      });
    },
  });
};

module.exports = routes;
