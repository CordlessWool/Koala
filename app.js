const fastify = require('fastify')({
  logger: true
});
const AutoLoad = require('fastify-autoload');
const path = require('path');

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins')
})

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'services')
})

const start = async () => {
  try {
    await fastify.listen(3000) // add '0.0.0.0' for docker
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()