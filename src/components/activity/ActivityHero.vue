<script setup>
import { RouterLink } from "vue-router";

defineProps({
  activity: { type: Object, required: true },
});
</script>

<template>
  <section
    class="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-28 pb-16"
  >
    <div class="absolute inset-0">
      <img
        :src="activity.heroImage"
        :alt="`${activity.title} BussySport Bussigny`"
        class="w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
      />
      <div class="hero-overlay absolute inset-0"></div>
    </div>

    <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
      <div
        class="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
        style="
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
        "
      >
        <RouterLink
          to="/"
          class="text-xs font-bold tracking-widest text-white/70 uppercase hover:text-white transition-colors"
          >ACCUEIL</RouterLink
        >
        <span class="text-white/30">·</span>
        <RouterLink
          :to="{ name: 'home', hash: '#activites' }"
          class="text-xs font-bold tracking-widest text-white/70 uppercase hover:text-white transition-colors"
          >ACTIVITÉS</RouterLink
        >
        <span class="text-white/30">·</span>
        <span class="text-xs font-bold tracking-widest text-white/90 uppercase">
          {{ activity.breadcrumb }}
        </span>
      </div>

      <h1
        class="hero-title font-display font-black leading-tight mb-6"
        style="font-size: clamp(2.5rem, 6vw, 4.5rem)"
      >
        {{ activity.title }}
      </h1>

      <p
        class="hero-sub text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
        style="font-size: clamp(1rem, 2vw, 1.2rem)"
      >
        {{ activity.heroSubtitle }}
      </p>

      <div class="hero-cta flex flex-wrap gap-3 justify-center mb-8">
        <span
          v-for="badge in activity.heroBadges"
          :key="badge"
          class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          "
          >{{ badge }}</span
        >
      </div>

      <RouterLink
        to="/adhesion"
        class="btn-primary btn-pulse hero-cta px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-3"
      >
        <i class="fas fa-user-plus"></i>{{ activity.cta }}
      </RouterLink>
    </div>
  </section>
</template>
