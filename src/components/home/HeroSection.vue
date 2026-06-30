<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section
    id="accueil"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    data-testid="hero-section"
  >
    <div class="absolute inset-0">
      <img
        src="https://images.pexels.com/photos/10499987/pexels-photo-10499987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920"
        alt="Runners BussySport Bussigny"
        class="w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
      />
      <div class="hero-overlay absolute inset-0"></div>
    </div>

    <div class="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-24">
      <div
        class="hero-badge inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8"
        data-testid="hero-badge"
        style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px);"
      >
        <span class="text-xs font-bold tracking-widest text-white/90 uppercase">
          Association Sportive · Bussigny
        </span>
      </div>

      <h1
        class="hero-title font-display font-black leading-tight mb-6"
        data-testid="hero-title"
        style="font-size: clamp(2.5rem, 7vw, 5rem);"
      >
        Le Sport,<br />
        <span class="text-primary-light">Notre Passion.</span><br />
        Votre Communauté.
      </h1>

      <p
        class="hero-sub text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
        data-testid="hero-subtitle"
        style="font-size: clamp(1rem, 2vw, 1.2rem);"
      >
        Association sportive dédiée à la promotion du sport, de la santé et du
        lien social pour tous les habitants de Bussigny — débutants et confirmés
        bienvenus.
      </p>

      <div
        class="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center"
        data-testid="hero-cta"
      >
        <RouterLink
          to="/adhesion"
          class="btn-primary btn-pulse px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-3"
          data-testid="hero-adhesion-btn"
        >
          <i class="fas fa-user-plus"></i>Demander l'adhésion
        </RouterLink>
        <RouterLink
          :to="{ hash: '#activites' }"
          class="btn-outline px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-3"
          data-testid="hero-activities-btn"
        >
          <i class="fas fa-running"></i>Nos Activités
        </RouterLink>
      </div>
    </div>

    <div class="hero-scroll text-white/50" aria-hidden="true">
      <div class="flex flex-col items-center gap-1.5">
        <span class="text-xs font-semibold tracking-widest uppercase">Découvrir</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </section>
</template>
