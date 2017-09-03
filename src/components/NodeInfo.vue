<template>
  <div v-if="visible">
    <div class="node-info">
      <a class="close-node-info" @click.prevent="closeNodeInfo"><i class="el-icon-circle-cross"></i></a>
      <div class="toggle-node">
        <span class="node-label"><strong>Ipfs Node</strong></span>
        <el-button :disabled="status != 'stopped'" type="primary" size="small" @click="startNode">Start</el-button>
        <el-button :disabled="status === 'stopped'" type="danger" size="small" @click="stopNode">Stop</el-button>
        <el-button v-if="status === 'starting'" type="simple" :loading="true" size="small">Starting</el-button>
      </div>

      <div class="node-addresses">
        <br>
        <el-table
          v-if="status === 'running'"
          :data="node.addresses"
          style="width: 100%">
          <el-table-column
            label="Node Info">
            <template scope="scope">
              <div><strong>ID:</strong> <br>{{node.id}}</div>
              <div><strong>Address:</strong><br>{{scope.row}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <h4>Connected peers {{node.peers.length}} <div>{{peersStatus}}</div></h4>
      <div class="node-peers">
        <el-table
          :data="node.peers"
          border style="width: 100%"
          empty-text="No peers connected">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column class="peer-address" prop="addr" label="Address"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      status: state => state.ipfs.status,
      node: state => state.ipfs,
      peersStatus: state => state.peersStatus,
      visible: state => state.nodeInfoVisible
    })
  },
  methods: {
    ...mapActions([
      'startNode',
      'stopNode',
      'closeNodeInfo'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .node-info {
    padding: 20px;
    border-bottom: 1px solid #e9eced;
    position: fixed;
    background: #fff;
    box-shadow: 4px 0px 5px -6px #000;
    z-index: 10;
    overflow: auto;
    top: 61px;
    bottom: 0;
    width: 50%;
  }
  .node-label {
    margin-right: 10px
  }
  .node-addresses .cell,
  .node-peers .cell {
    font-size:10px;
  }
  .close-node-info {
    display: block;
    text-align: right!important
  }
</style>
