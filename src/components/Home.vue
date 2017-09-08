<template>
  <div>
    <TopNav></TopNav>
    <NodeInfo></NodeInfo>
    <div class="main-container-wrapper">

      <div class="description text-center">
        <h1>IPFS Browser Stream Benchmarks</h1>
        <p>A small utility to test ipfs's get streaming performance (especially for large files) and see some metrics.</p>
        <p> Choose one of the preselected files below or test with a custom one</p>
        <br>
          <el-button v-if="status === 'stopped'" type="primary" size="large" @click="startNode">Start your node</el-button>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="87 kB" name="first">
        <Stream
          :peers="peers"
          :nodeStatus="status"
          @submit="getFile"
          :benchmarks="getBenchmarkByHash('QmTKZgRNwDNZwHtJSjCp6r5FYefzpULfy37JvMt9DwvXse/poster.jpg')"
          hash="QmTKZgRNwDNZwHtJSjCp6r5FYefzpULfy37JvMt9DwvXse/poster.jpg">
        </Stream>
       </el-tab-pane>
       <el-tab-pane label="1 MB" name="second">
        <Stream
          :peers="peers"
          :nodeStatus="status"
          @submit="getFile"
          :benchmarks="getBenchmarkByHash('QmTca4A43f4kEvzTouvYTegtp6KobixRqweV12NrvwwtFP')"
          hash="QmTca4A43f4kEvzTouvYTegtp6KobixRqweV12NrvwwtFP">
        </Stream>
       </el-tab-pane>
       <el-tab-pane label="22 MB" name="third">
        <Stream
          :peers="peers"
          :nodeStatus="status"
          @submit="getFile"
          :benchmarks="getBenchmarkByHash('QmTKZgRNwDNZwHtJSjCp6r5FYefzpULfy37JvMt9DwvXse/video.webm')"
          hash="QmTKZgRNwDNZwHtJSjCp6r5FYefzpULfy37JvMt9DwvXse/video.webm">
        </Stream>
       </el-tab-pane>
      </el-tabs>
  </div>


  </div>
</template>

<script>
import Stream from './Stream'
import TopNav from './TopNav'
import NodeInfo from './NodeInfo'
import { mapActions, mapState } from 'vuex'

export default {
  components: {Stream, TopNav, NodeInfo},
  data () {
    return {
      activeTab: 'first'
    }
  },
  methods: {
    ...mapActions(['getFile', 'startNode']),
    getBenchmarkByHash (hash) {
      return this.benchmarks.find(bench => bench.hash === hash)
    }
  },
  computed: {
    ...mapState({
      benchmarks: state => state.benchmarks,
      status: state => state.ipfs.status,
      peers: state => state.ipfs.peers
    })
  }
}
</script>

<style scoped>
  .main-container-wrapper {
    max-width: 680px;
    margin: 0 auto;
  }
  .text-center {
    text-align: center
  }
  .description {
    margin-bottom: 80px
  }
  .description h1 {
    margin-top: 80px;
    font-weight: 300;
    font-family: 'Open Sans', sans-serif;
  }
</style>
