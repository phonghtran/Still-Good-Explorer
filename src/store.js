import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

import playlists from './services/playlists.json';
import songs from './services/songs.json';
import songByAppearances from './services/songByAppearances.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    songs: songs,
    songByAppearances: songByAppearances,
    playlists: playlists
  },
  getters: {
    playlistDates: state => {
      let datesArray = [];

      for (let pl in state.playlists){
        datesArray.push(pl)
      }

      datesArray.sort();

      return datesArray;
    },
    playlistDurations: (state, getters) => {
      if (getters.playlistDates.length > 0) {
        const firstDate = moment(getters.playlistDates[0]);
        const lastDate = moment(getters.playlistDates[getters.playlistDates.length - 1]);
        const duration = (lastDate - firstDate);

        return {
          ms: duration,
          s: duration / 1000,
          m: duration / 1000 / 60,
          h: duration / 1000 / 60 / 60,
          d: duration / 1000 / 60 / 60 / 24,
          y: duration / 1000 / 60 / 60 / 24 / 365
        };
      }
      return {};
    }
  },
  mutations: {

  },
  actions: {

  }
});
