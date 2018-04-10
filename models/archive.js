const ess = require('event-source-stream')
const speedometer = require('speedometer')

module.exports = function store (state, emitter) {
  state.key = ''
  state.feeds = [
    { name: 'metadata' },
    { name: 'content' }
  ]
  state.feedsIndex = {
    metadata: 0,
    content: 1
  }
  state.uploadSpeed = 0
  state.downloadSpeed = 0

  const _uploadSpeed = speedometer()
  const _downloadSpeed = speedometer()

  const stream = ess('/events')
  stream.on('data', function (event) {
    const data = JSON.parse(event)
    switch (data.type) {
      case 'key':
        state.key = data.key
        return emitter.emit('render')
      case 'feed':
        const feedIndex = state.feedsIndex[data.name]
        state.feeds[feedIndex] = data
        return emitter.emit('render')
      case 'update':
        // TODO: not sure how this would work with pixel-grid
        console.info('feed update')
        return
      case 'download':
        state.downloadSpeed = _downloadSpeed(data.bytes)
        const downloadIndex = state.feedsIndex[data.name]
        state.feeds[downloadIndex].blocks[data.index] = true
        return emitter.emit('render')
      case 'upload':
        state.uploadSpeed = _uploadSpeed(data.bytes)
        return emitter.emit('render')
    }
  })
}
