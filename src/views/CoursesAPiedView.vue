<script setup>
import { useHead } from '@unhead/vue'
import { getActivity } from '@/data/activities'
import ActivityHero from '@/components/activity/ActivityHero.vue'
import ActivityIntro from '@/components/activity/ActivityIntro.vue'
import BenefitsGrid from '@/components/activity/BenefitsGrid.vue'
import OtherActivities from '@/components/activity/OtherActivities.vue'
import ActivityCtaBand from '@/components/activity/ActivityCtaBand.vue'

const activity = getActivity('courses-a-pied')

useHead({
  title: 'Courses à Pied – Bussigny',
  meta: [
    {
      name: 'description',
      content:
        'Rejoignez les sorties running de BussySport à Bussigny. Courses à pied pour tous niveaux – débutants à confirmés. Convivial, hebdomadaire, en plein air.',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: 'https://bussysport.ch/courses-a-pied/' },
    { property: 'og:title', content: 'Courses à Pied – BussySport Bussigny' },
    {
      property: 'og:description',
      content: 'Sorties running hebdomadaires à Bussigny pour tous les niveaux.',
    },
  ],
  link: [{ rel: 'canonical', href: 'https://bussysport.ch/courses-a-pied/' }],
})

const paragraphs = [
  "Chez BussySport, la course à pied est avant tout une <strong>aventure collective</strong>. Chaque semaine, nous nous retrouvons pour des sorties conviviales, ouvertes à tous les niveaux. Que vous couriez votre premier kilomètre ou prépariez un semi-marathon, vous trouverez votre place dans le groupe.",
  "Nos parcours alternent <strong>routes, sentiers et campagne vaudoise</strong>. L'objectif n'est pas la performance — c'est de bouger, de partager, et de progresser ensemble.",
  "Une bonne paire de chaussures, l'envie de bouger, le sourire — c'est tout ce qu'il faut pour démarrer.",
]

const audience = [
  'Débutants qui veulent commencer à courir',
  'Coureurs réguliers cherchant une équipe',
  'Habitants de Bussigny et environs',
  'Toute personne motivée — sans pré-requis',
]

const infoLines = [
  { icon: 'fa-calendar-week', label: 'Fréquence', value: 'Hebdomadaire' },
  { icon: 'fa-clock', label: 'Durée', value: '45 à 90 minutes' },
  { icon: 'fa-location-dot', label: 'Lieu', value: 'Bussigny et environs' },
  { icon: 'fa-coins', label: 'Tarif', value: 'Gratuit pour les membres' },
]

const steps = [
  {
    title: 'Échauffement',
    text: 'Mobilité articulaire et activation cardio progressive (5 à 10 min) pour préparer le corps.',
  },
  {
    title: 'Sortie principale',
    text: 'Course en groupe(s) selon les rythmes — personne ne reste seul derrière.',
  },
  {
    title: 'Étirements',
    text: 'Retour au calme avec étirements ciblés pour la récupération.',
  },
  {
    title: 'Moment partage',
    text: "Échange convivial de fin de séance — le moment qui transforme le sport en communauté.",
  },
]

const benefits = [
  {
    icon: 'fa-heart-pulse',
    title: 'Santé cardiovasculaire',
    text: 'Cœur plus fort, meilleure endurance, meilleur sommeil.',
  },
  {
    icon: 'fa-arrow-trend-up',
    title: 'Progression visible',
    text: 'Des plans adaptés et un groupe pour rester motivé sur la durée.',
  },
  {
    icon: 'fa-tree',
    title: 'Plein air',
    text: 'Découvrez les parcours et la nature autour de Bussigny.',
  },
  {
    icon: 'fa-people-group',
    title: 'Lien social',
    text: 'Des rencontres qui dépassent le sport — courir, c\'est aussi se connaître.',
  },
]
</script>

<template>
  <ActivityHero :activity="activity" />

  <ActivityIntro
    :paragraphs="paragraphs"
    :audience="audience"
    :info-lines="infoLines"
  >
    <div class="mt-10">
      <h2 class="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-6">
        Déroulement d'une sortie
      </h2>
      <div class="space-y-5">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          v-reveal
          :class="['feature-card flex gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100', i < steps.length - 1 ? 'step-line' : '']"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-black text-lg text-white"
            :style="{ background: i === steps.length - 1 ? '#29B6F6' : '#1565C0' }"
          >{{ i + 1 }}</div>
          <div>
            <h3 class="font-display font-bold text-base text-gray-900 mb-1">{{ step.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </ActivityIntro>

  <BenefitsGrid title="Pourquoi courir avec nous" :benefits="benefits" />
  <OtherActivities current-slug="courses-a-pied" />
  <ActivityCtaBand :cta="activity.cta" />
</template>
