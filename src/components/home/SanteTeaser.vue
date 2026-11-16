<script setup>
import { RouterLink } from "vue-router";
import { disclaimer, topics } from "@/data/formeSante";
</script>

<template>
  <section class="py-20 bg-white" data-testid="sante-teaser">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mb-10" v-reveal>
        <div class="flex items-center gap-3 mb-5">
          <div class="swiss-line"></div>
          <span class="text-xs font-bold uppercase tracking-widest text-gray-400">
            Entre les séances
          </span>
        </div>
        <h2 class="font-display font-black text-4xl sm:text-5xl text-gray-900 mb-5 leading-tight">
          Forme & Santé
        </h2>
        <p class="text-gray-500 text-lg leading-relaxed">
          Nutrition, exercices et étirements : des notes écrites par le comité,
          à partir de ce qu'on fait nous-mêmes.
        </p>
        <p class="text-gray-400 text-sm leading-relaxed mt-4">
          {{ disclaimer.short }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <RouterLink
          v-for="topic in topics"
          :key="topic.slug"
          v-reveal
          :to="topic.path"
          class="feature-card flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100"
        >
          <span
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style="background: rgba(21, 101, 192, 0.1)"
          >
            <i :class="['fas', topic.icon, 'text-lg text-primary']" aria-hidden="true"></i>
          </span>
          <span>
            <span class="block font-display font-bold text-lg text-gray-900 mb-1">
              {{ topic.label }}
            </span>
            <span class="block text-gray-400 text-sm leading-relaxed">
              {{ topic.blurb }}
            </span>
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
