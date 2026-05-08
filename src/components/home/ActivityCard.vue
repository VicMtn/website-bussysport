<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  activity: { type: Object, required: true },
  delayClass: { type: String, default: '' },
})

const router = useRouter()

function go(e) {
  // Inner anchor handles its own navigation.
  if (e.target.closest('a')) return
  router.push({ name: props.activity.slug })
}

function onKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  if (e.target.closest('a')) return
  e.preventDefault()
  router.push({ name: props.activity.slug })
}
</script>

<template>
  <article
    v-reveal
    :class="['activity-card', delayClass]"
    role="link"
    tabindex="0"
    :data-testid="`card-${activity.slug.replace(/-/g, '')}`"
    @click="go"
    @keydown="onKeydown"
  >
    <div class="relative h-80">
      <img
        class="card-img absolute inset-0"
        :src="activity.image"
        :alt="`${activity.label} BussySport Bussigny`"
        loading="lazy"
      />
      <div class="card-overlay absolute inset-0"></div>

      <div class="absolute top-5 left-5">
        <span
          class="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white"
          style="background: rgba(21, 101, 192, 0.75); backdrop-filter: blur(8px);"
        >{{ activity.shortLabel }}</span>
      </div>

      <div class="absolute inset-0 flex flex-col justify-end p-7">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style="background: rgba(41, 182, 246, 0.22); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.2);"
        >
          <i :class="['fas', activity.icon, 'text-2xl text-white']" aria-hidden="true"></i>
        </div>
        <h3 class="font-display font-bold text-2xl text-white mb-2">{{ activity.title }}</h3>
        <p class="text-white/70 text-sm leading-relaxed mb-4">{{ activity.homeBlurb }}</p>
        <RouterLink :to="{ name: activity.slug }" class="arrow-link">
          Découvrir <i class="fas fa-arrow-right arrow"></i>
        </RouterLink>
      </div>
    </div>
  </article>
</template>
