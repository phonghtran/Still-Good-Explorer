import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
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
      component: Stats
    },
    {
      path: '/home',
      name: 'home',
      component: Home
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
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
