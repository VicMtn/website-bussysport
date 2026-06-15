<script setup>
import { useHead } from '@unhead/vue'
import { getActivity } from '@/data/activities'
import ActivityHero from '@/components/activity/ActivityHero.vue'
import ActivityIntro from '@/components/activity/ActivityIntro.vue'
import BenefitsGrid from '@/components/activity/BenefitsGrid.vue'
import OtherActivities from '@/components/activity/OtherActivities.vue'
import ActivityCtaBand from '@/components/activity/ActivityCtaBand.vue'

const activity = getActivity('tournois')

useHead({
  title: 'Tournois de Jeux – Compétitions sportives conviviales',
  meta: [
    {
      name: 'description',
      content:
        "Tournois sportifs conviviaux organisés par BussySport à Bussigny. Pétanque, football, beach-volley — dans l'esprit fair-play.",
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: 'https://bussysport.ch/tournois' },
    { property: 'og:title', content: 'Tournois de Jeux – BussySport Bussigny' },
  ],
  link: [{ rel: 'canonical', href: 'https://bussysport.ch/tournois' }],
})

const paragraphs = [
  "Les tournois BussySport sont avant tout des <strong>moments de fête et de partage</strong>. L'objectif n'est pas de gagner à tout prix — c'est de bouger, rire et se rencontrer entre habitants de Bussigny.",
  "Nous organisons régulièrement des tournois <strong>multidisciplinaires</strong>, accessibles à tous les niveaux. Chacun(e) peut s'inscrire seul(e) ou en équipe.",
]

const audience = [
  'Familles et habitants de Bussigny',
  'Sportifs occasionnels ou réguliers',
  'Tout(e) curieux(se) prêt(e) à passer un bon moment',
  'Équipes formées ou inscriptions individuelles',
]

const infoLines = [
  { icon: 'fa-calendar-day', label: 'Fréquence', value: 'Plusieurs par an' },
  { icon: 'fa-clock', label: 'Durée', value: 'Demi-journée ou journée' },
  { icon: 'fa-location-dot', label: 'Lieu', value: 'Bussigny — espaces publics' },
  { icon: 'fa-handshake', label: 'Esprit', value: 'Fair-play & convivialité' },
]

const sports = [
  {
    name: 'Pétanque',
    image: 'https://images.pexels.com/photos/10071075/pexels-photo-10071075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
    text: "L'incontournable du village. Doublettes ou triplettes — tout le monde peut jouer.",
  },
  {
    name: 'Football',
    image: 'https://images.pexels.com/photos/32424852/pexels-photo-32424852.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
    text: 'Tournois 5v5 ou 7v7 selon le format — toujours dans la bonne humeur.',
  },
  {
    name: 'Volleyball',
    image: 'https://images.pexels.com/photos/36696879/pexels-photo-36696879.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
    text: 'Volley en salle ou beach-volley en été — mixte et tous niveaux.',
  },
]

const benefits = [
  {
    icon: 'fa-people-group',
    title: 'Esprit d\'équipe',
    text: 'Apprendre à jouer ensemble, gagner ensemble, perdre ensemble — c\'est ça le sport.',
  },
  {
    icon: 'fa-flag',
    title: 'Animation locale',
    text: 'Donner vie au village et créer des moments forts pour les habitants.',
  },
  {
    icon: 'fa-handshake-simple',
    title: 'Nouvelles rencontres',
    text: 'Le terrain comme prétexte pour faire connaissance avec ses voisin(e)s.',
  },
  {
    icon: 'fa-trophy',
    title: 'Plaisir et adrénaline',
    text: 'Le frisson de la compétition, sans la pression du résultat.',
  },
]
</script>

<template>
  <ActivityHero :activity="activity" />

  <ActivityIntro :paragraphs="paragraphs" :audience="audience" :info-lines="infoLines">
    <div class="mt-10">
      <h2 class="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-6">
        Disciplines organisées
      </h2>
      <div class="grid md:grid-cols-3 gap-5">
        <div
          v-for="sport in sports"
          :key="sport.name"
          v-reveal
          class="feature-card rounded-2xl overflow-hidden bg-white border border-gray-100"
        >
          <img :src="sport.image" :alt="sport.name" class="w-full h-36 object-cover" loading="lazy" />
          <div class="p-5">
            <h3 class="font-display font-bold text-lg text-gray-900 mb-1">{{ sport.name }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ sport.text }}</p>
          </div>
        </div>
      </div>

      <div class="info-box mt-6 flex items-start gap-3">
        <i class="fas fa-circle-info text-primary text-lg mt-0.5"></i>
        <p class="text-sm text-gray-700 leading-relaxed">
          <strong>D'autres disciplines à venir !</strong> Une suggestion ?
          Écrivez-nous à
          <a href="mailto:info@bussysport.ch" class="text-primary font-semibold underline">info@bussysport.ch</a>.
        </p>
      </div>
    </div>
  </ActivityIntro>

  <BenefitsGrid title="Pourquoi participer" :benefits="benefits" />
  <OtherActivities current-slug="tournois" />
  <ActivityCtaBand :cta="activity.cta" />
</template>
