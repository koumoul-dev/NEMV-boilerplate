const config = require('config')
const express = require('express')
const cors = require('cors')
const path = require('path')

let app = module.exports = express()
app.use(cors())

// Business routers
app.use('/api/v1', require('./api'))

// Static routing
const oneWeek = 7 * 24 * 60 * 60
const staticOptions = {
  setHeaders: (res) => {
    // 'private' so that it doesn't get store in the reverse proxy's cache
    res.set('cache-control', 'private, max-age=' + oneWeek)
  }
}
app.use('/bundles', express.static(path.join(__dirname, '../public/bundles'), staticOptions))
app.use('/assets', express.static(path.join(__dirname, '../public/assets'), staticOptions))
app.use('/favicon.ico', express.static(path.join(__dirname, '../public/favicon.ico'), staticOptions))

app.use('/*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Error handling to complement express default error handling. TODO do something useful of errors.
app.use((err, req, res, next) => {
  console.error('Error, what to do ?', err.stack)

  // Default error handler of express is actually not bad.
  // It will send stack to client only if not in production and manage interrupted streams.
  next(err)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log('Could not run server : ', err.stack)
    throw err
  }
  console.log('Listening on http://localhost:%s', config.port)
    // Emit this event for the test suite
  app.emit('listening')
})
