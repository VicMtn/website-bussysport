<script setup>
import { activities } from '@/data/activities'
import ActivityCard from './ActivityCard.vue'
import ComingSoonBanner from './ComingSoonBanner.vue'

const delays = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4']
</script>

<template>
  <section
    id="activites"
    class="py-24"
    style="background: #f7f9fc;"
    data-testid="activities-section"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" v-reveal>
        <div class="flex items-center justify-center gap-4 mb-5">
          <div class="swiss-line"></div>
          <span class="text-xs font-bold uppercase tracking-widest text-gray-400">
            Ce que nous proposons
          </span>
          <div class="swiss-line"></div>
        </div>
        <h2 class="sec-title font-display font-black text-4xl sm:text-5xl text-gray-900 mb-5">
          Nos Activités
        </h2>
        <p class="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Du running au street workout, découvrez tout ce que BussySport vous
          propose pour bouger et vous retrouver.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-7 mb-7">
        <ActivityCard
          v-for="(activity, idx) in activities"
          :key="activity.slug"
          :activity="activity"
          :delay-class="delays[idx]"
        />
      </div>

      <ComingSoonBanner />
    </div>
  </section>
</template>
