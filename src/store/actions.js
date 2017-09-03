import * as types from './mutation_types'
import Ipfs from 'ipfs'
import _ from 'lodash'
import hrtime from 'browser-process-hrtime'
import StreamBenchmarks from '../plugins/IpfsStreamBench'

const PEER_UPDATE_INTERVAL = 3000

export const initNode = ({commit, getters}, params) => {
  if (this.node) return console.warn('initNode: Is already initialized ')
  const options = _.assign({
    repo: 'ipfs-' + Math.random()
  }, getters.ipfs.config)
  this.node = new Ipfs(options)
  this.monitorPeers({commit, getters}, params)
}

export const openNodeInfo = ({commit, getters}, params) => {
  commit(types.NODE_INFO_VISIBILITY, true)
}

export const closeNodeInfo = ({commit, getters}, params) => {
  commit(types.NODE_INFO_VISIBILITY, false)
}

export const startNode = ({commit}, params) => {
  commit(types.UPDATE_NODE, {status: 'starting'})
  this.node.start(() => {
    commit(types.UPDATE_NODE, {status: 'running'})
    this.node.id().then(info => {
      commit(types.UPDATE_NODE, {
        id: info.id,
        addresses: info.addresses
      })
    })
  })
}

export const stopNode = ({commit}, params) => {
  if (!this.node) return
  this.node.stop(() => {
    commit(types.UPDATE_NODE, {
      status: 'stopped'
    })
    commit(types.UPDATE_PEERS, [])
  })
}

export const monitorPeers = ({getters, commit}, params) => {
  if (getters.ipfs.state.status === 'stopped' ||
    !this.node ||
    !this.node.isOnline()) {
  } else {
    this.node.swarm.peers({
      verbose: true
    }, (err, peers) => {
      if (err) console.warn('swarm.peers: Error ', err)
      const filtered = peers.filter(p => p.addr)
      commit(types.UPDATE_PEERS, filtered.map((peer) => {
        return {
          addr: peer.addr.toString(),
          id: peer.peer.id.toB58String()
        }
      }))
    })
  }
  setTimeout(() => {
    monitorPeers({getters, commit}, params)
  }, PEER_UPDATE_INTERVAL)
}

export const getFile = ({ commit }, hash) => {
  if (!hash) {
    return console.log('getFile: no multihash was inserted')
  }

  const started = hrtime()
  const startedTimestamp = Date.now()

  this.node.files.get(hash, (err, filesStream) => {
    if (err) {
      return console.log('ipfs.files.get: Error ', err)
    }
    //
    // Calculate Stream benchmarks
    const bench = new StreamBenchmarks({
      started: started,
      startedTimestamp: startedTimestamp,
      filesStream: filesStream,
      hash: hash,
      interval: 1000,
      timeout: 20000
    })

    bench.on('data', report => commit(types.UPDATE_BENCHMARKS, report))
    bench.on('interval', report => commit(types.UPDATE_BENCHMARKS, report))
    bench.on('end', report => commit(types.UPDATE_BENCHMARKS, report))
  })
}
