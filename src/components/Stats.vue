<template>
  <div class="statictics">
    <h1 class="title is-1">Statistics</h1>
	<div class="chart" v-if="playedCivChartData">
		<h3 class="title is-3">Civilization played</h3>
		<PlayedCivBar :chartData="playedCivChartData" :options="options"></PlayedCivBar>
	</div>
	<div class="chart" v-if="pickedCivChartData">
		<h3 class="title is-3">Civilization picked</h3>
		<PlayedCivBar :chartData="pickedCivChartData" :options="options"></PlayedCivBar>
	</div>

  </div>
</template>

<script>
import PlayedCivBar from "@/components/PlayedCivBar"
import axios from "axios"

export default {
  name: 'Stats',
  data () {
    return {
	  msg: 'Welcome to Your Vue.js App',
	  playedCivsStats: {},
	  options: {
		responsive: true,
		maintainAspectRatio: false,
        scales: {
          yAxes: [{
			  stacked: false,
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
			  stacked: true,
            gridLines: {
              display: true
            },
            categoryPercentage: 1,
            barPercentage: 0.5
          }]
        }
      },
	  playedCivChartData: {},
	  pickedCivChartData: {},
    }
  },
  methods: {
	  getPlayedCivsStats: async function(){
		  let {data} = await axios.get("http://aoestats.tk:9090/getPlayedCivsStatsChart");
		  this.playedCivChartData = data;
	  },
	  getPickedCivChartData: async function(){
		  let {data} = await axios.get("http://aoestats.tk:9090/getPickedCivsStatsChart");
		  this.pickedCivChartData = data;
	  },
	  getTopCharts: async function() {

	  }
  },
  mounted() {
	  this.getPlayedCivsStats();
	  this.getPickedCivChartData();
  },
  components: {
	PlayedCivBar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.chart {
		width: 100%;
	}
</style>
