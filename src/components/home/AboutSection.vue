<script setup>
import { RouterLink } from 'vue-router'

const pillars = [
  {
    icon: 'fa-users',
    color: '#1565C0',
    bg: 'rgba(21,101,192,.1)',
    title: 'Accessible à Tous',
    text: "Aucun niveau requis. Nos activités s'adaptent à chacun, du plus débutant au plus expérimenté.",
  },
  {
    icon: 'fa-heart',
    color: '#29B6F6',
    bg: 'rgba(41,182,246,.12)',
    title: 'Esprit Communautaire',
    text: 'Créer des liens, partager des moments, construire ensemble une communauté sportive soudée à Bussigny.',
  },
  {
    icon: 'fa-medal',
    color: '#D32F2F',
    bg: 'rgba(211,47,47,.08)',
    title: 'Santé & Bien-être',
    text: 'Promouvoir une vie active et saine, pour le bien-être physique et mental de chaque habitant du village.',
  },
]

const stats = [
  { value: '10+', label: 'Membres', testid: 'stat-members' },
  { value: '4', label: 'Activités' },
  { value: '100%', label: 'Bénévole' },
]
</script>

<template>
  <section id="apropos" class="py-24 bg-white" data-testid="about-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div v-reveal>
          <div class="flex items-center gap-3 mb-5">
            <div class="swiss-line"></div>
            <span class="text-xs font-bold uppercase tracking-widest text-gray-400">À Propos</span>
          </div>
          <h2 class="font-display font-black text-4xl sm:text-5xl text-gray-900 mb-6 leading-tight">
            Une Association Née à Bussigny,<br />
            <span class="block pt-3 sm:pt-2 md:pt-3 text-primary">Pour Bussigny</span>
          </h2>
          <p class="text-gray-500 text-lg leading-relaxed mb-5">
            BussySport est née d'une conviction simple : le sport est un puissant
            vecteur de cohésion sociale et de bien-être collectif. Fondée à
            Bussigny, notre association réunit des passionnés de toutes
            disciplines pour créer une communauté dynamique, inclusive et
            engagée.
          </p>
          <p class="text-gray-500 text-lg leading-relaxed mb-8">
            Que vous soyez débutant ou sportif confirmé, il y a une place pour
            vous chez BussySport. Ensemble, faisons de notre village un exemple
            vivant d'engagement sportif et social.
          </p>
          <RouterLink
            :to="{ hash: '#contact' }"
            class="btn-primary inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-base"
            data-testid="about-join-btn"
          >
            <i class="fas fa-users"></i>Rejoindre l'aventure
          </RouterLink>
        </div>

        <div class="flex flex-col gap-5" v-reveal>
          <div
            v-for="pillar in pillars"
            :key="pillar.title"
            class="feature-card flex gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100"
          >
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              :style="{ background: pillar.bg }"
            >
              <i :class="['fas', pillar.icon, 'text-2xl']" :style="{ color: pillar.color }"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-lg text-gray-900 mb-1">{{ pillar.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ pillar.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-20 pt-12 border-t border-gray-100">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card text-center p-7 rounded-2xl bg-gray-50"
        >
          <div
            class="font-display font-black text-4xl mb-2 text-primary"
            :data-testid="stat.testid"
          >{{ stat.value }}</div>
          <div class="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
