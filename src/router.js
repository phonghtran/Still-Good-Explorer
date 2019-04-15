import Vue from 'vue';
import Router from 'vue-router';
import Playlists from './views/Playlists.vue';
import Stats from './views/Stats.vue';
import Songs from './views/Songs.vue';
import Genres from './views/Genres.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Playlists,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/genres',
      name: 'genres',
      component: Genres,
      meta: {
        title: 'Genres'
      }
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists,
      meta: {
        title: 'Playlists'
      }
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs,
      meta: {
        title: 'Songs'
      }
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    }

  ]
});

const DEFAULT_TITLE = 'Still Good Explorer';
router.afterEach((to) => {
  let prefix = '';
  if (to.meta.title ){
    prefix = to.meta.title + ' | ';
  }
  document.title = prefix + DEFAULT_TITLE;
});

export default router;

