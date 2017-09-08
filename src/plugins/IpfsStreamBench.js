import _ from 'lodash'
const hrtime = require('browser-process-hrtime')
const EventEmitter = require('events')

export default function (options) {
  const event = new EventEmitter()
  // const NS_PER_SEC = 1e9
  const started = options.started
  const intervalTimeout = options.interval || 0.01

  const metrics = {
    hash: options.hash,
    totalBytes: 0,
    received: 0,
    elapsed: null,
    started: options.startedTimestamp,
    finished: null,
    chunks: [],
    rates: {
      min: 0,
      max: 0,
      avg: 0,
      median: 0
    },
    overallRate: 0
  }
  const interval = setInterval(() => {
    metrics.elapsed = duration(started)
    metrics.overallRate = speed(metrics.received, duration(started))
    metrics.rates = calcRates(metrics.chunks.map(chunk => chunk.rate))

    event.emit('interval', _.cloneDeep(metrics))
  }, intervalTimeout)

  options.filesStream.on('data', (file) => {
    metrics.totalBytes = file.size
    if (file.content) {
      file.content.on('data', data => {
        // Ignore zero-length chunks, they produce zero min rate
        if (data.length === 0) return

        metrics.received += data.length

        const lastHr = (metrics.chunks.length > 0)
          ? metrics.chunks[metrics.chunks.length - 1].hrtime
          : started

        // const lastElapsed = duration(lastHr)
        const chunk = {
          time: Date.now(),
          hrtime: hrtime(),
          bytes: data.length,
          elaspedSinceLast: duration(lastHr),
          rate: speed(metrics.received, duration(started))
        }

        metrics.chunks.push(chunk)

        metrics.rates = calcRates(metrics.chunks.map(chunk => chunk.rate))
        metrics.overallRate = speed(metrics.received, duration(started))

        event.emit('data', _.cloneDeep(metrics))
      })

      file.content.once('end', data => {
        clearInterval(interval)

        metrics.rates = calcRates(metrics.chunks.map(chunk => chunk.rate))
        metrics.finished = Date.now()
        metrics.overallRate = speed(metrics.received, duration(started))

        event.emit('end', _.cloneDeep(metrics))
        event.removeAllListeners()
      })

      file.content.resume()
    }
  })

  options.filesStream.on('end', () => console.log('Got files info for ', options.hash))
  return event
}

const duration = (start) => {
  const nsPerSec = 1e9
  const time = hrtime(start)
  // In seconds
  return (time[0] * nsPerSec + time[1]) / nsPerSec
}

const calcRates = (rates) => {
  rates.sort(function (a, b) {
    if (a > b) return 1
    else if (a === b) return 0
    return -1
  })
  const min = rates[0] || 0
  const max = rates[rates.length - 1] || 0
  const avg = rates.reduce((p, c) => p + c, 0) / rates.length || 0

  const middle = Math.floor(rates.length / 2)
  const isEven = rates.length % 2 === 0
  const median = isEven
    ? (rates[middle] + rates[middle - 1]) / 2 || 0
    : rates[middle] || 0

  return {
    min,
    max,
    median,
    avg
  }
}

const speed = (size, time) => {
  if (size === 0) return 0
  return Math.round(size / (time || 1))
}
