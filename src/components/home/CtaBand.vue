<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="py-20 relative overflow-hidden bg-navy" data-testid="cta-section">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-0 left-0 w-96 h-96 rounded-full"
        style="background: rgba(41, 182, 246, 0.04); transform: translate(-45%, -45%);"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-64 h-64 rounded-full"
        style="background: rgba(41, 182, 246, 0.06); transform: translate(35%, 35%);"
      ></div>
    </div>
    <div class="max-w-4xl mx-auto px-4 text-center relative z-10" v-reveal>
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8"
        style="background: rgba(41, 182, 246, 0.12); border: 2px solid rgba(41, 182, 246, 0.3);"
      >
        <i class="fas fa-running text-2xl text-primary-light" aria-hidden="true"></i>
      </div>
      <h2
        class="font-display font-black text-white mb-6 leading-tight"
        style="font-size: clamp(1.8rem, 5vw, 3.2rem);"
      >
        Prêt(e) à Rejoindre<br />
        <span class="text-primary-light">la Communauté BussySport ?</span>
      </h2>
      <p class="text-white/60 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
        Débutant ou expérimenté, il y a une place pour vous. Rejoignez nos
        activités et faites partie d'une communauté sportive engagée au cœur de
        Bussigny.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <RouterLink
          :to="{ hash: '#contact' }"
          class="btn-primary btn-pulse px-9 py-4 rounded-full font-bold text-base inline-flex items-center gap-3"
          data-testid="cta-contact-btn"
        >
          <i class="fas fa-envelope"></i>Nous Contacter
        </RouterLink>
        <a
          href="mailto:info@bussysport.ch"
          class="btn-outline px-9 py-4 rounded-full font-bold text-base inline-flex items-center gap-3"
          data-testid="cta-email-btn"
        >
          <i class="fas fa-at"></i>info@bussysport.ch
        </a>
      </div>
    </div>
  </section>
</template>
