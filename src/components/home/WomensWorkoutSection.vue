<script setup>
import { RouterLink } from "vue-router";

const highlights = [
  {
    icon: "fa-people-group",
    title: "Entre femmes",
    text: "Un créneau rien qu'à nous, pour s'entraîner en toute confiance.",
  },
  {
    icon: "fa-seedling",
    title: "Tous niveaux",
    text: "Débutante ou sportive confirmée : chaque exercice s'adapte à votre rythme.",
  },
  {
    icon: "fa-dumbbell",
    title: "Force & cardio",
    text: "Renforcement, circuits et mobilité pour un travail complet du corps.",
  },
  {
    icon: "fa-heart",
    title: "Bienveillance",
    text: "Pas de jugement, juste de la motivation de groupe et de la bonne humeur.",
  },
];

const delays = ["reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4"];
</script>

<template>
  <section
    id="womens-workout"
    class="py-24 relative overflow-hidden"
    style="background: linear-gradient(145deg, #0d2137 0%, #1565c0 100%)"
    data-testid="womens-workout-section"
  >
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-0 right-0 w-96 h-96 rounded-full"
        style="background: rgba(41, 182, 246, 0.08); transform: translate(35%, -40%)"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div v-reveal>
          <div class="flex items-center gap-3 mb-5">
            <div class="swiss-line"></div>
            <span class="text-xs font-bold uppercase tracking-widest text-white/50">
              Nouveau à BussySport
            </span>
          </div>
          <h2
            class="font-display font-black text-white mb-6 leading-tight"
            style="font-size: clamp(2.2rem, 5vw, 3.4rem)"
          >
            Women's<br />
            <span class="text-primary-light">Workout</span>
          </h2>
          <p class="text-white/70 text-lg leading-relaxed mb-4">
            Des séances pensées <strong class="text-white">par et pour les femmes</strong> :
            renforcement musculaire, cardio et mobilité, dans un cadre convivial
            où chacune avance à son rythme.
          </p>
          <p class="text-white/50 leading-relaxed mb-10">
            Envie de vous (re)mettre au sport, de vous sentir plus forte ou
            simplement de bouger entre copines ? Le groupe vous attend à Bussigny.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink
              :to="{ path: '/adhesion', query: { activite: 'womens-workout' }, hash: '#formulaire' }"
              class="btn-primary px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3"
              data-testid="womens-workout-adhesion-btn"
            >
              <i class="fas fa-user-plus" aria-hidden="true"></i>Rejoindre le groupe
            </RouterLink>
            <RouterLink
              :to="{ query: { sujet: 'womensworkout' }, hash: '#contact' }"
              class="btn-outline px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3"
              data-testid="womens-workout-contact-btn"
            >
              <i class="fas fa-envelope" aria-hidden="true"></i>Poser une question
            </RouterLink>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div
            v-for="(item, idx) in highlights"
            :key="item.title"
            v-reveal
            :class="['rounded-2xl p-6 border border-white/10', delays[idx]]"
            style="background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(8px)"
          >
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style="background: rgba(41, 182, 246, 0.15)"
            >
              <i :class="['fas', item.icon, 'text-lg text-primary-light']" aria-hidden="true"></i>
            </div>
            <h3 class="font-display font-bold text-lg text-white mb-1">{{ item.title }}</h3>
            <p class="text-white/55 text-sm leading-relaxed">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
