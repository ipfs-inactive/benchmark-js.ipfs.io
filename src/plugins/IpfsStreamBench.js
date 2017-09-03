import _ from 'lodash'
const hrtime = require('browser-process-hrtime')
const EventEmitter = require('events')

export default function (options) {
  const event = new EventEmitter()
  const NS_PER_SEC = 1e9
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
      media: 0
    },
    lastRate: 0
  }
  const interval = setInterval(() => {
    const diff = hrtime(started)
    metrics.elapsed = diff[0] * NS_PER_SEC + diff[1]
    event.emit('interval', _.cloneDeep(metrics))
  }, intervalTimeout)

  options.filesStream.on('data', (file) => {
    metrics.totalBytes = file.size
    if (file.content) {
      file.content.on('data', data => {
        // Ignore zero-length chunks, they produce zero min rate
        if (data.length === 0) return

        const chunk = {
          time: Date.now(),
          hrtime: hrtime(),
          bytes: data.length,
          rate: data.length / metrics.elapsed * NS_PER_SEC
        }
        metrics.chunks.push(chunk)
        metrics.received += data.length
        metrics.rates = calcRates(metrics.chunks.map(chunk => chunk.rate))
        metrics.lastRate = chunk.rate
        event.emit('data', _.cloneDeep(metrics))
      })

      file.content.once('end', data => {
        clearInterval(interval)
        metrics.rates = calcRates(metrics.chunks.map(chunk => chunk.rate))
        metrics.finished = Date.now()
        event.emit('end', _.cloneDeep(metrics))
        event.removeAllListeners()
      })

      file.content.resume()
    }
  })

  options.filesStream.on('end', () => console.log('Got files info for ', options.hash))
  return event
}

const calcRates = (rates) => {
  rates.sort(function (a, b) {
    if (a > b) return 1
    else if (a === b) return 0
    return -1
  })
  const min = rates[0]
  const max = rates[rates.length - 1]
  const avg = rates.reduce((p, c) => p + c, 0) / rates.length

  const middle = Math.floor(rates.length / 2)
  const isEven = rates.length % 2 === 0
  const median = isEven
    ? (rates[middle] + rates[middle - 1]) / 2
    : rates[middle]

  return {
    min: min,
    max: max,
    avg: avg,
    median: median
  }
}
