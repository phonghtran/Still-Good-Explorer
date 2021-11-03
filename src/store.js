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
    songsAsArray: state => {
      let arr = [];

      for (let trackId in state.songs){
        let newItem = state.songs[trackId];
        newItem.trackID = trackId;

        arr.push(newItem);

      }

      return arr;
    },
    durationCalculation:  state =>  {
      let songOccurrance = {};
      const masterPlaylistsKeys = Object.keys(state.playlists);
      const defaultMessage = '<1 week';

      for (let trackID in state.songs ){
        const playlists = state.songs[trackID].playlists;
        const keys = Object.keys(playlists);

        if (keys.length > 1) {
          let anchorDate = 0;
          let prevIndex = masterPlaylistsKeys.indexOf(keys[0]);
          let durationCurrentIndex = 0;
          let durations = [];

          for (let keyIndex = 1; keyIndex < keys.length; keyIndex++) {
            const thisCurrentIndex = masterPlaylistsKeys.indexOf(keys[keyIndex]);


            if (typeof durations[durationCurrentIndex] === 'undefined') {
              durations[durationCurrentIndex] = {
                duration: defaultMessage,
                playlists: [],
                initialDate: keys[anchorDate]
              };
            }

            if (thisCurrentIndex - prevIndex === 1) {
              const thisDate = moment(keys[keyIndex]);

              durations[durationCurrentIndex].duration = thisDate.from(moment(keys[anchorDate]), true);
              durations[durationCurrentIndex].finalDate = keys[keyIndex];
            } else {
              durationCurrentIndex++;
              anchorDate = keyIndex;

              durations[durationCurrentIndex] = {
                duration: '<1 week',
                playlists: [],
                initialDate: keys[keyIndex]
              };
            }

            durations[durationCurrentIndex].playlists.push(keys[keyIndex]);
            prevIndex = thisCurrentIndex;
          }

          songOccurrance[trackID] =  durations;
        } else {
          songOccurrance[trackID] = [{
            duration: defaultMessage,
            playlists: [
              keys[0]
            ],
            initialDate: keys[0]
          }];
        }


      } // for loop

      return songOccurrance;
    }
  },
  mutations: {

  },
  actions: {

  }
});
