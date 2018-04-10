const path = require('path')
const serverRouter = require('server-router')
const bankai = require('bankai/http')
const hyperServer = require('hypercore-stats-server')

module.exports = function (archive) {
  const compiler = bankai(path.join(__dirname, 'index.js'))
  const router = serverRouter()
  router.route('GET', '/events', (_, res) => hyperServer(archive, res))
  router.route('GET', '/*', (req, res) => {
    compiler(req, res, () => {
      res.statusCode = 404
      res.end('not found')
    })
  })
  return router.start()
}
