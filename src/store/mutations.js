import * as types from './mutation_types'
import _ from 'lodash'

export default {
  [types.UPDATE_NODE] (state, data) {
    const allowedValues = ['status', 'addresses', 'id']
    _.extend(state.ipfs, _.pick(data, allowedValues))
  },
  [types.UPDATE_PEERS] (state, peers) {
    // Reset peers array
    state.ipfs.peers = []
    if (state.ipfs.status === 'stopped') return
    peers.forEach(peer => state.ipfs.peers.push(peer))
  },
  [types.UPDATE_BENCHMARKS] (state, report) {
    const hash = report.hash
    let file = _.find(state.benchmarks, {hash})
    if (!file) return state.benchmarks.push(report)
    _.extend(file, report)
  },
  [types.NODE_INFO_VISIBILITY] (state, status) {
    state.nodeInfoVisible = status
  }
}
