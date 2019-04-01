import Vue from 'vue';
import Vuex from 'vuex';

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

  },
  mutations: {

  },
  actions: {

  }
});
