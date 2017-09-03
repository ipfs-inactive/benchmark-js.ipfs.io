<template>
  <div>
    <br>
    <form @submit.prevent="start(fileHash)">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-input placeholder="Hash" :value="hash" v-model="fileHash"> <template slot="prepend">
              <span v-if="!loading">Get</span>
              <i v-if="loading" class="el-icon-loading"></i>
          </template> </el-input>
        </el-col>
        <el-col :span="4"><el-button :disabled="loading" type="primary" size="medium" @click="start(fileHash)">{{btnText}}</el-button></el-col>
      </el-row>
    </form>
    <el-row :gutter="10">
      <el-col :span="20">
        <div class="progress" >
          <el-progress :percentage="parseInt(downloadPercentage())"></el-progress>
          <el-row :gutter="0" v-if="benchmarks">
            <!-- <el&#45;col :span="8"> Started: {{new Date(benchmarks.started).d.toLocaleString().split(' ')[0]}} </el&#45;col> -->
            <el-col :span="6"> Elapsed: {{(elapsed())}}</el-col>
            <el-col :span="11"> Received: {{downloadPercentage()}}% ({{received()}}/{{total()}})</el-col>
            <el-col :span="6"> Speed: {{ rate()}} kB/sec</el-col>
          </el-row>
        </div>
    </el-col>
    </el-row>
    <br>
    {{benchmarks}}
  </div>
</template>

<script>
// import StreamStatus from './StreamStatus'
import prettyBytes from 'pretty-bytes'
// import prettyHrTime from 'pretty-hrtime'

export default {
  props: {
    nodeStatus: {
      type: String
    },
    btnText: {
      default: 'Run'
    },
    hash: {
      type: String
    },
    benchmarks: {
      type: Object
    }
  },
  data () {
    return {
      fileHash: this.hash,
      loading: false
    }
  },
  methods: {
    start (event) {
      if (this.nodeStatus !== 'running') {
        this.$message({
          message: 'Your node is not runnng. Start your node first',
          type: 'warning'
        })
        return
      }
      this.$emit('submit', this.fileHash)
      this.loading = true
    },
    percentage: (from, to) => (from / to) * 100,
    downloadPercentage () {
      if (!this.benchmarks || !this.benchmarks.received) return '0'
      const percentage = this.percentage(this.benchmarks.received, this.benchmarks.totalBytes)
      console.log('percentage', percentage)
      return percentage.toFixed(0)
    },
    received () {
      return (this.benchmarks)
        ? prettyBytes(this.benchmarks.received)
        : 0
    },
    total () {
      return (this.benchmarks)
        ? prettyBytes(this.benchmarks.totalBytes)
        : 0
    },
    elapsed () {
      if (!this.benchmarks) return 0
      const sec = this.benchmarks.elapsed / 1e9
      const converted = (sec > 60) ? (sec / 60).toFixed(0) + ' min' : sec.toFixed(0) + ' sec'
      return converted
    },
    rate () {
      return (this.benchmarks)
        ? (this.benchmarks.rates.avg / 1000).toFixed(2)
        : 0
    }
  },
  watch: {
    'benchmarks.finished' (finished) {
      if (finished) this.loading = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
