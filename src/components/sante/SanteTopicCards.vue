<script setup>
import { RouterLink } from "vue-router";

defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <div class="grid md:grid-cols-3 gap-6">
    <RouterLink
      v-for="topic in items"
      :key="topic.slug"
      :to="topic.path"
      class="sante-topic-card group flex flex-col p-6 rounded-2xl bg-white border border-gray-100"
    >
      <span
        class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style="background: rgba(21, 101, 192, 0.1)"
      >
        <i :class="['fas', topic.icon, 'text-xl text-primary']" aria-hidden="true"></i>
      </span>
      <h2 class="font-display font-bold text-xl text-gray-900 mb-2">
        {{ topic.label }}
      </h2>
      <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
        {{ topic.blurb }}
      </p>
      <span class="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Lire
        <i
          class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        ></i>
      </span>
    </RouterLink>
  </div>
</template>
