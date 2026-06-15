<script setup>
defineProps({
  title: { type: String, default: 'Bénéfices' },
  benefits: { type: Array, required: true }, // [{ icon, title, text }]
})
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" v-reveal>
        <div class="flex items-center justify-center gap-4 mb-5">
          <div class="swiss-line"></div>
          <span class="text-xs font-bold uppercase tracking-widest text-gray-400">
            Pourquoi se lancer
          </span>
          <div class="swiss-line"></div>
        </div>
        <h2 class="sec-title font-display font-black text-3xl sm:text-4xl text-gray-900">
          {{ title }}
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(b, i) in benefits"
          :key="b.title"
          v-reveal
          :class="['feature-card p-6 rounded-2xl bg-gray-50 border border-gray-100', `reveal-d${(i % 4) + 1}`]"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style="background: rgba(21, 101, 192, 0.1);"
          >
            <i :class="['fas', b.icon, 'text-xl text-primary']" aria-hidden="true"></i>
          </div>
          <h3 class="font-display font-bold text-base text-gray-900 mb-2">{{ b.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ b.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
