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
            <el-col :span="6"> Elapsed: {{(elapsed())}}</el-col>
            <el-col :span="11"> Received: {{downloadPercentage()}}% ({{received()}}/{{total()}})</el-col>
            <el-col :span="6"> Speed: {{ rate()}}/sec</el-col>
          </el-row>
        </div>
    </el-col>
    </el-row>
    <br>
    <!-- {{benchmarks}} -->
    <div class="chunks" v-if="benchmarks && benchmarks.chunks.length > 0">

        <h2>Report</h2>
      <el-table
        class="report"
        :data="[1]"
        stripe
        max-height="500"
        style="width: 100%">
        <el-table-column
          width="150">
          <template scope="scope">
              <div class="metrics">
                <div>Hash </div>
                <div>Total size</div>
                <div><div style="visibility:hidden">.</div></div>
                <div>Received </div>
                <div>Started </div>
                <div>Finished </div>
                <div>Duration </div>
                <div><strong>Rates :</strong></div>
                <div>Min </div>
                <div>Max </div>
                <div>Average</div>
                <div>Median</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template scope="scope">
              <div class="metrics">
                <div>{{benchmarks.hash}}</div>
                <div>{{prettyBytes(benchmarks.totalBytes)}}</div>
                <div><div style="visibility:hidden">.</div></div>
                <div>{{prettyBytes(benchmarks.received)}}</div>
                <div>{{new Date(benchmarks.started).toString()}}</div>
                <div v-if="benchmarks.finished">{{new Date(benchmarks.finished).toString()}}</div>
                <div v-else> running</div>
                <div>{{elapsed()}} </div>
                <div><div style="visibility:hidden">.</div></div>
                <div>{{prettyBytes(benchmarks.rates.min)}}/sec</div>
                <div>{{prettyBytes(benchmarks.rates.max)}}/sec</div>
                <div>{{prettyBytes(benchmarks.rates.avg)}}/sec</div>
                <div>{{prettyBytes(benchmarks.rates.median)}}/sec</div>
            </div>
        </template>
        </el-table-column>
      </el-table>

      <h3>{{benchmarks.chunks.length}} Chunks</h3>
      <el-table
        :data="benchmarks.chunks"
        :default-sort= "{prop: 'time', order: 'ascending'}"
        stripe
        max-height="500"
        style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column
          prop="time"
          label="Arrived"
          sortable
          width="180">
          <template scope="scope">
            <div>{{new Date(scope.row.time).getHours()}}:{{new Date(scope.row.time).getMinutes()}}:{{new Date(scope.row.time).getSeconds()}}.{{new Date(scope.row.time).getMilliseconds()}}</div>
            <!-- <div>{{scope.row.elapsedSinseLastHr}} seconds later</div> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="bytes"
          label="Size"
          sortable
          width="180">
          <template scope="scope">
            {{prettyBytes(scope.row.bytes)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          sortable
          label="Speed">
          <template scope="scope">
            <span>{{prettyBytes(scope.row.rate)}} /sec</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <br><br>
  </div>
</template>

<script>
// import StreamStatus from './StreamStatus'
import prettyBytes from 'pretty-bytes'
import prettyTime from 'pretty-time'
import prettySeconds from 'pretty-seconds'

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
    },
    peers: {
      type: Array
    }
  },
  data () {
    return {
      fileHash: this.hash,
      loading: false
    }
  },
  methods: {
    prettyBytes: prettyBytes,
    prettyTime: prettyTime,
    start (event) {
      if (this.nodeStatus !== 'running') {
        this.$message({
          message: 'Your node is not runnng. Start your node first',
          type: 'warning'
        })
        return
      }
      if (this.peers.length === 0) {
        this.$message({
          message: 'No peers connected yet. Wait for a few seconds and try again',
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
      if (!this.benchmarks) return prettySeconds(0)
      return prettySeconds(this.benchmarks.elapsed)
    },
    rate () {
      return (this.benchmarks)
        ? prettyBytes((this.benchmarks.overallRate))
        : prettyBytes(0)
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
<style scoped>
  .metrics > div {
    padding:5px;
  }
  .metrics > div:not(:last-child) {
    border-bottom:1px solid #ddd
  }
</style>
