<script setup>
defineProps({
  paragraphs: { type: Array, required: true },
  audience: { type: Array, required: true }, // bullet list — "Pour qui ?"
  infoTitle: { type: String, default: 'Infos Pratiques' },
  infoLines: { type: Array, default: () => [] }, // [{ icon, label, value }]
})
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-3 gap-10 items-start">
        <div class="lg:col-span-2 space-y-5" v-reveal>
          <p
            v-for="(p, i) in paragraphs"
            :key="i"
            class="text-gray-600 text-lg leading-relaxed"
            v-html="p"
          ></p>
          <slot></slot>
        </div>

        <aside class="space-y-5" v-reveal>
          <div
            class="rounded-2xl p-7 text-white"
            style="background: linear-gradient(145deg, #0d2137 0%, #1565c0 100%);"
          >
            <h3 class="font-display font-bold text-lg mb-5 text-white/90">{{ infoTitle }}</h3>
            <div class="space-y-4">
              <div
                v-for="line in infoLines"
                :key="line.label"
                class="flex items-start gap-3"
              >
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background: rgba(255, 255, 255, 0.1);"
                >
                  <i :class="['fas', line.icon, 'text-sm text-primary-light']" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-widest text-white/45 mb-0.5">
                    {{ line.label }}
                  </div>
                  <div class="text-white text-sm font-medium" v-html="line.value"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h3 class="font-display font-bold text-base text-gray-900 mb-3">Pour qui ?</h3>
            <ul class="space-y-2">
              <li
                v-for="item in audience"
                :key="item"
                class="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
              >
                <i class="fas fa-check text-primary text-xs mt-1.5" aria-hidden="true"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
