<script setup>
import { useHead } from '@unhead/vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// Site-wide head defaults. Per-route metadata is layered on top by each view.
useHead({
  htmlAttrs: { lang: 'fr' },
  titleTemplate: (title) =>
    title ? `${title} – BussySport` : 'Association BussySport',
  meta: [
    { name: 'author', content: 'Association BussySport' },
    { name: 'language', content: 'French' },
    { name: 'theme-color', content: '#0D2137' },
    { name: 'geo.region', content: 'CH-VD' },
    { name: 'geo.placename', content: 'Bussigny-près-Lausanne' },
    { name: 'geo.position', content: '46.5522;6.5558' },
    { name: 'ICBM', content: '46.5522, 6.5558' },
    { property: 'og:site_name', content: 'BussySport' },
    { property: 'og:locale', content: 'fr_CH' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <AppNavbar />
  <main>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </main>
  <AppFooter />
</template>
