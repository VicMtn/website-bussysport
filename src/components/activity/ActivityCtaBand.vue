<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  cta: { type: String, default: 'Rejoindre le groupe' },
})
</script>

<template>
  <section class="py-20 bg-navy text-center px-4">
    <div class="max-w-3xl mx-auto" v-reveal>
      <img
        src="/images/logo.jpeg"
        alt="Logo BussySport"
        class="h-20 w-20 rounded-full object-cover mx-auto mb-6 shadow-lg"
        width="80"
        height="80"
      />
      <h2 class="font-display font-black text-3xl sm:text-4xl text-white mb-5 leading-tight">
        Envie de nous rejoindre ?
      </h2>
      <p class="text-white/65 text-base sm:text-lg mb-8 leading-relaxed">
        Remplissez le formulaire d'adhésion en quelques minutes, ou contactez-nous
        si vous avez des questions — nous vous répondrons rapidement.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink
          to="/adhesion"
          class="btn-primary btn-pulse px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3"
        >
          <i class="fas fa-user-plus"></i>{{ cta }}
        </RouterLink>
        <RouterLink
          :to="{ name: 'home', hash: '#contact' }"
          class="btn-outline px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3"
        >
          <i class="fas fa-envelope"></i>Nous contacter
        </RouterLink>
      </div>
    </div>
  </section>
</template>
