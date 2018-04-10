#!/usr/bin/env node

const http = require('http')
const hyperdrive = require('hyperdrive')
const serve = require('hyperdrive-http')
const hyperdiscovery = require('hyperdiscovery')
const ram = require('random-access-memory')
const minimist = require('minimist')
const stats = require('./router')

const argv = minimist(process.argv.slice(2), {
  default: {
    statsPort: 10000,
    drivePort: 8000
  }
})

if (!argv._[0]) throw new Error('link required')
const link = argv._[0]

const statsPort = argv.statsPort
const drivePort = argv.drivePort

const archive = hyperdrive(ram, link)

archive.ready(() => {
  http.createServer(stats(archive)).listen(statsPort)
  http.createServer(serve(archive)).listen(drivePort)

  const sw = hyperdiscovery(archive)
  /*
  sw.on('connection', function (peer, type) {
    console.log('connected to', sw.connections.length, 'peers')
    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })
  */

  console.log(`Serving stats at http://localhost:${statsPort}/`)
  console.log(`Serving files at http://localhost:${drivePort}/`)
})
