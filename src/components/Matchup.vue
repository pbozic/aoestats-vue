
<template>
<div class="wrap">
  <div class="matchup card">
	  <h4 class="title is-4" @click="detail = !detail" v-if="matchup.type != 'addMatchup'"><span class="is-pulled-left">{{matchup.players[0].score ? matchup.players[0].score : "/"}}</span>{{matchup.players[0].player.name}} vs {{matchup.players[1].player.name}}<span class="is-pulled-right">{{matchup.players[1].score ? matchup.players[1].score : "/"}}</span></h4>
    <h4 class="title is-4" v-else @click="openModal = true">+ Add Matchup</h4>
    <template v-if="detail == true && matchup.type != 'addMatchup'">
      <div class="civilizations columns">
        <div class="column">
          <ul>
            <li v-for="civ of matchup.players[0].civs" :key="civ._id" v-if="matchup.players[0].civs">{{civ.name}} </li>
          </ul>
        </div>
        <div class="column">
          <h4 class="title is-4">{{matchup.players[0].score ? matchup.players[0].score : "/"}}</h4>
        </div>
        <div class="column">
          <h4 class="title is-4">{{matchup.players[1].score ? matchup.players[1].score : "/"}}</h4>
        </div>
        <div class="column">
          <ul>
            <li v-for="civ of matchup.players[1].civs" :key="civ._id" v-if="matchup.players[1].civs">{{civ.name}} </li>
          </ul>
        </div>
      </div>
      <div class="tabs m0">
        <ul>
          <li @click="activeGame = game" :class="{'is-active': activeGame._id == game._id}" v-for="(game, i) of matchup.matches" v-if="matchup.matches.length > 0 && game != null"><a>Game {{i + 1}}</a></li>
          <li @click="addGame(); openGameModal = true" v-if="admin"><a @click="openGameModal = true">+ Add Game</a></li>
        </ul>
      </div>
      <div class="content" v-if="activeGame">
        <div class="columns m0">
          <div class="column">
            <div class="columns" :class="{'winner': activeGame.players[0].winner}">
              <div class="column">
                <h4 class="title is-4">{{activeGame.players[0].player.name}}</h4>
                <h5 class="title is-5">{{activeGame.players[0].civ.name}}</h5>
              </div>
              <div class="column">
                <h4 class="title mid is-4">{{midScore[0]}}</h4>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="columns" :class="{'winner': activeGame.players[1].winner}">
              <div class="column">
                <h4 class="title mid is-4">{{midScore[1]}}</h4>
              </div>
              <div class="column">
                <h4 class="title is-4">{{activeGame.players[1].player.name}}</h4>
                <h5 class="title is-5">{{activeGame.players[1].civ.name}}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
<div class="modal" :class="{'is-active': openModal}">
			<div class="modal-background" @click="openModal = false"></div>
			<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Add Matchup</p>
				<button class="delete" aria-label="close" @click="openModal = false"></button>
			</header>
			<section class="modal-card-body">
        <template v-for="(p, i) of save.players" >
          <h3 class="title is-3" :key="i">Player {{i + 1}}</h3>
          <div class="columns" :key="i">
            <div class="column">
              <h5>Player</h5>
              <multiselect v-model="p.player" :options="players" label="name" :searchable="true"></multiselect>
            </div>
            <div class="column">
              <h5>Civs</h5>
              <multiselect :multiple="true" :options="civs" v-model="p.civs" label="name" :searchable="true"></multiselect>
            </div>
          </div>
          <div class="columns" :key="i">
            <div class="column">
              <h5>Score</h5>
              <input class="input" type="number" v-model="p.score">
            </div>
            <div class="column">
              <h5>Winner</h5>
              <input type="checkbox" class="checkbox" v-model="p.winner">
            </div>
          </div>
        </template>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-success" @click="addMatchup()">Save</button>
				<button class="button" @click="openModal = false">Cancel</button>
			</footer>
		</div>
</div>
<div class="modal" :class="{'is-active': openGameModal}">
			<div class="modal-background" @click="openGameModal = false"></div>
			<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Add Game</p>
				<button class="delete" aria-label="close" @click="openGameModal = false"></button>
			</header>
			<section class="modal-card-body">
        <template v-for="(p, i) of newGame.players" >
          <h3 class="title is-3" :key="i">{{p.player.name}}</h3>
          <div class="columns" :key="i">
            <div class="column">
              <h5>Civs</h5>
              <multiselect :multiple="false" :options="civs" v-model="newGame.players[i].civ" label="name" :searchable="true"></multiselect>
            </div>
          </div>
          <div class="columns" :key="i">
            <div class="column">
              <h5>Winner</h5>
              <input type="checkbox" class="checkbox" v-model="newGame.players[i].winner">
            </div>
          </div>
        </template>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-success" @click="saveGame()">Save</button>
				<button class="button" @click="openGameModal = false">Cancel</button>
			</footer>
		</div>
    </div>
</div>

</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
  name: 'Matchup',
  props: ["matchup", "round"],
  data () {
    return {
       detail: false,
      msg: 'Welcome to Your Vue.js App',
	  players: [],
	  civs: [],
    openModal: false,
    openGameModal: false,
	  save: {
      players: [],
      matches: [],
    },
    numPlayers: 2,
    newGame: {
      players: []
    },
    activeGame: {
      _id: "1",
    }
    }
  },
  computed: {
    midScore: function() {
      let matchTo = this.matchup.matches.findIndex((m) => {
        return this.activeGame._id == m._id;
      });
      let score = [0, 0];
      for (let i = 0; i <= matchTo; i++) {
        let match = this.matchup.matches[i];
        for (let pi in match.players) {
          let player = match.players[pi];
          if (player.winner) {
            score[pi]++;
          }
        }
      }
      return score;

    }
  },
  methods: {
    addMatchup: async function() {
      let newMatchup = {
        players: [],
        matches: [],
      };
      let clone = JSON.parse(JSON.stringify(this.save.players));
      for (let player of clone) {
        player.player = player.player._id;
       if (player.civs != null) {
         console.log(player.civs);
           player.civs = player.civs.map((x) => x._id);
      }
        newMatchup.players.push(player);
      }
      let result = await axios.post("http://localhost:9090/addMatchup", {matchup: newMatchup, round: this.round._id});
      console.log(result);
      this.$emit("updateTournament", result.data);
      this.openModal = false;
    },
    getPlayers: async function() {
      let {data} = await axios.get("http://localhost:9090/getPlayers");
      console.log(data);
      this.players = data;
    },
    getCivs: async function() {
      let {data} = await axios.get("http://localhost:9090/getCivs");
      console.log(data);
      this.civs = data;
    },
    addGame: function() {
      this.newGame.players = this.matchup.players;
    },
    saveGame: async function() {
      let game = {
        players: [],
      }
      for(let pi of this.newGame.players) {
        let player = {
          player: pi.player._id,
          civ: pi.civ._id,
          winner: pi.winner ? 1 : 0,
        }
        game.players.push(player);
      }
      let matchupId = this.matchup._id;
      let roundId = this.round._id;
      let result = await axios.post("http://localhost:9090/addMatch", {matchup: matchupId, round: roundId, game: game});
      console.log(result);
      this.$emit("updateTournament", result.data);

        let rnd = result.data.rounds.findIndex((x) => {
          return x._id == this.round._id
        });
        let mnd = result.data.rounds[rnd].matchups.findIndex((x) => {
          return x._id == this.matchup._id
        });
        console.log("neki", result.data.rounds[rnd].matchups[mnd].matches[result.data.rounds[rnd].matchups[mnd].matches.length - 1]);
        this.activeGame = result.data.rounds[rnd].matchups[mnd].matches[result.data.rounds[rnd].matchups[mnd].matches.length - 1];



      this.openGameModal = false;
    }


  },
  created() {
    this.getPlayers();
    this.getCivs();
    for(let i = 1; i <= this.numPlayers; i++) {
      this.save.players.push({
        player: "",
        civs: null,
      });
    }
    this.activeGame = this.matchup.matches[this.matchup.matches.length - 1];


  },
  components: {
    Multiselect,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .matchup{
    margin-bottom: 15px;
  }
  .title {
    padding: 10px 15px;
  }
  .matchup > .title {
      background-color: #4B77BE;
      color: white;
      cursor: pointer;
    }
    .mid {
          top: 50%;
    transform: translateY(-50%);
    position: relative;
    }
    .winner {
      background-color: rgba(38, 166, 91, 0.3)
    }
    .m0 {
      margin: 0 !important;
    }
</style>
