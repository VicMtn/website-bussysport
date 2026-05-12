<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getOtherActivities } from '@/data/activities'

const props = defineProps({
  currentSlug: { type: String, required: true },
})

const others = computed(() => getOtherActivities(props.currentSlug))
</script>

<template>
  <section class="py-20" style="background: #f7f9fc;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12" v-reveal>
        <h2 class="sec-title font-display font-black text-3xl sm:text-4xl text-gray-900 mb-3">
          Autres Activités
        </h2>
        <p class="text-gray-400 text-base">Découvrez tout ce que BussySport propose.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <RouterLink
          v-for="(activity, i) in others"
          :key="activity.slug"
          v-reveal
          :class="['activity-card block', `reveal-d${i + 1}`]"
          :to="{ name: activity.slug }"
        >
          <div class="relative h-56">
            <img class="card-img absolute inset-0" :src="activity.image" :alt="activity.label" loading="lazy" />
            <div class="card-overlay absolute inset-0"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-6">
              <div class="flex items-center gap-3 mb-1">
                <i :class="['fas', activity.icon, 'text-lg text-primary-light']" aria-hidden="true"></i>
                <h3 class="font-display font-bold text-xl text-white">{{ activity.title }}</h3>
              </div>
              <span class="arrow-link mt-1">
                Découvrir <i class="fas fa-arrow-right arrow"></i>
              </span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
