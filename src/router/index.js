import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/courses-a-pied',
    name: 'courses-a-pied',
    component: () => import('@/views/CoursesAPiedView.vue'),
  },
  {
    path: '/cross-training',
    name: 'cross-training',
    component: () => import('@/views/CrossTrainingView.vue'),
  },
  {
    path: '/street-workout',
    name: 'street-workout',
    component: () => import('@/views/StreetWorkoutView.vue'),
  },
  {
    path: '/tournois',
    name: 'tournois',
    component: () => import('@/views/TournoisView.vue'),
  },
  {
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: () => import('@/views/MentionsLegalesView.vue'),
  },
  // Legacy .html paths from the previous static site → redirect.
  { path: '/index.html', redirect: '/' },
  { path: '/courses-a-pied.html', redirect: '/courses-a-pied' },
  { path: '/cross-training.html', redirect: '/cross-training' },
  { path: '/street-workout.html', redirect: '/street-workout' },
  { path: '/tournois.html', redirect: '/tournois' },
  { path: '/mentions-legales.html', redirect: '/mentions-legales' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
