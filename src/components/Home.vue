<template>
	<div class="wrap">
		<div class="container" v-if="tournament">
			<h1 class="title is-1">{{tournament.name}}</h1>
			 <div class="tabs">
				<ul>
					<li :class="{'is-active': round._id == selectedRound._id}" v-for="(round, i) of tournament.rounds" :key="round._id" @click="selectRound(i)"><a>{{round.name}}</a></li>
					<li @click="openAddRoundModal = true"><a>+ Add Round</a></li>
				</ul>
			</div>

			<template v-if="selectedRound != null">
				<h3 class="title is-3">Matchups:</h3>
			  <Matchup @updateTournament="getTournament()" :matchup="matchup" :round="selectedRound" v-for="matchup of selectedRound.matchups" :key="matchup._id" v-if="selectedRound.matchups != null"></Matchup>
				<Matchup @updateTournament="getTournament()" :matchup="{type: 'addMatchup'}" :round="selectedRound"></Matchup>
			</template>
		</div>
		<div class="modal" :class="{'is-active': openAddRoundModal}">
			<div class="modal-background" @click="openAddRoundModal = false"></div>
			<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Modal title</p>
				<button class="delete" aria-label="close" @click="openAddRoundModal = false"></button>
			</header>
			<section class="modal-card-body">
        <h3 class="title is-3">Round</h3>
				<h5>Name</h5>
				<input v-model="newRound.name" type="text" class="input">
			</section>
			<footer class="modal-card-foot">
				<button class="button is-success" @click="saveRound()">Save</button>
				<button class="button" @click="openAddRoundModal = false">Cancel</button>
			</footer>
		</div>
		</div>
	</div>


</template>

<script>
import Matchup from "./Matchup";
import axios from "axios";
import {Bar} from "vue-chartjs"

export default {
  name: 'Home',
  data () {
    return {
			msg: 'Welcome to Your Vue.js App',
			tournament: null,
			instance: axios.create({
				baseURL: 'http://localhost:9090',
				timeout: 1000,
				headers: {'Access-Control-Allow-Origin': '*'}
			}),
			selectedRound: "",
			openAddRoundModal: false,
			newRound: {
				name: ""
			}
    }
  },
  methods: {
	  getTournament: async function() {
			let tournament = await this.instance.get("http://aoestats.tk:9090/tournament");
		  this.tournament = tournament.data;
			this.selectedRound = this.tournament.rounds[this.tournament.rounds.length -1];
		},
		updateTournament: function(t) {
			console.log(t);
			this.tournament = t;
		},
		selectRound: function(index) {
			this.selectedRound = this.tournament.rounds[index];
		},
	  isLast: function(index, array) {
		  if (array.length == index) {
			  return true;
		  }
		  return false;
	  },
		saveRound: async function() {
 			let result = await axios.post("http://aoestats.tk:9090/addRound", {round: this.newRound});
			 this.tournament = result.data;
			 if(this.selectedRound == null) {
				 this.selectedRound = this.tournament.rounds[this.tournament.rounds.length -1];
			 }
      console.log(result);
			this.openAddRoundModal = false;
		}
  },
  components: {
		Matchup,
		"chart-bar": Bar,

  },
  mounted() {
		console.log("chs", VueCharts);
	  this.getTournament();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
