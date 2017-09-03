<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'app',
  mounted () {
    this.initNode()
  },
  methods: {
    ...mapActions(['initNode'])
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i');
  body {
    margin: 0px;
    font-family: 'Open Sans', sans-serif;
    font-size:14px
  }
</style>
