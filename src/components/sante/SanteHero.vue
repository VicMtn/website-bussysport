<script setup>
import { RouterLink } from "vue-router";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  currentLabel: { type: String, default: "" },
});
</script>

<template>
  <section class="pt-32 pb-16 px-4 text-white bg-navy">
    <div class="max-w-3xl mx-auto">
      <nav class="flex flex-wrap items-center gap-2 text-sm text-white/60 mb-6" aria-label="Fil d'Ariane">
        <RouterLink to="/" class="hover:text-white transition-colors">Accueil</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink
          v-if="currentLabel"
          :to="{ name: 'forme-sante' }"
          class="hover:text-white transition-colors"
        >
          Forme & Santé
        </RouterLink>
        <span v-if="currentLabel" aria-hidden="true">/</span>
        <span class="text-white">{{ currentLabel || "Forme & Santé" }}</span>
      </nav>
      <h1 class="font-display font-black text-4xl sm:text-5xl leading-tight mb-5">
        {{ title }}
      </h1>
      <p class="text-white/75 text-lg leading-relaxed max-w-2xl">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
