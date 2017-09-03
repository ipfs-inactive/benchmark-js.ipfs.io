<template>
  <div>
    <div>
      <el-progress :percentage="downloadPercentage"></el-progress>
      <el-row :gutter="0">
        <el-col :span="8"> Started: {{started}} </el-col>
        <el-col :span="8"> Received: {{bytesReceived}}% (0/0)</el-col>
        <el-col :span="5"> Speed: {{speed}}MB/sec</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    downloadPercentage: {
      type: Number,
      default: 0
    },
    bytesReceived: {
      type: Number,
      default: 0
    },
    totalBytes: {
      type: Number,
      default: 0
    },
    started: {
      type: String,
      default: '--'
    },
    speed: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  methods: {
    start () {
      console.log('starting')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
