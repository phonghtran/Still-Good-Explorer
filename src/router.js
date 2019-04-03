import Vue from 'vue';
import Router from 'vue-router';
import Playlists from './views/Playlists.vue';
import Stats from './views/Stats.vue';


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Playlists
    },

    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    }

  ]
});
