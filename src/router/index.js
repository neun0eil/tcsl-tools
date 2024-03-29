import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/sight',
    name: 'sight',
    component: () => import('../views/SightView.vue'),
    meta: { title: 'Réglage visée' },
  },
  {
    path: '/license',
    name: 'license',
    component: () => import('../views/LicenseView.vue'),
    meta: { title: 'Impression licence' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
