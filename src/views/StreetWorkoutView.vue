<script setup>
import { useHead } from '@unhead/vue'
import { getActivity } from '@/data/activities'
import ActivityHero from '@/components/activity/ActivityHero.vue'
import ActivityIntro from '@/components/activity/ActivityIntro.vue'
import BenefitsGrid from '@/components/activity/BenefitsGrid.vue'
import OtherActivities from '@/components/activity/OtherActivities.vue'
import ActivityCtaBand from '@/components/activity/ActivityCtaBand.vue'

const activity = getActivity('street-workout')

useHead({
  title: 'Street Workout – Calisthenics & musculation en plein air',
  meta: [
    {
      name: 'description',
      content:
        'Street Workout et calisthenics avec BussySport à Bussigny. Musculation en plein air au poids du corps, pour tous niveaux. Tractions, dips et plus.',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: 'https://bussysport.ch/street-workout/' },
    { property: 'og:title', content: 'Street Workout – BussySport Bussigny' },
  ],
  link: [{ rel: 'canonical', href: 'https://bussysport.ch/street-workout/' }],
})

const paragraphs = [
  "Le street workout est l'art de <strong>développer sa force avec son propre poids</strong>. Pas de machines, pas d'abonnement — juste vous, des barres, et la progression.",
  "Nos sessions ont lieu sur les <strong>installations urbaines de Bussigny</strong>. Tractions, dips, équilibres, planches — tout se construit pas à pas.",
  "La calisthenics est <strong>scalable</strong> : que vous fassiez votre première traction ou votre vingtième, il y a toujours un palier suivant.",
]

const audience = [
  'Adolescents et adultes voulant débuter la musculation',
  'Sportifs cherchant force et contrôle corporel',
  'Anciens des salles de sport en quête de plein air',
  'Personnes voulant apprendre les figures iconiques (handstand, planche, muscle-up)',
]

const infoLines = [
  { icon: 'fa-calendar-week', label: 'Fréquence', value: 'Hebdomadaire' },
  { icon: 'fa-clock', label: 'Durée', value: '60 à 75 minutes' },
  { icon: 'fa-location-dot', label: 'Lieu', value: 'Park & barres de Bussigny' },
  { icon: 'fa-coins', label: 'Tarif', value: 'Gratuit pour les membres' },
]

const levels = [
  {
    label: 'Débutant',
    bg: '#f0f7ff',
    border: '#1565C0',
    skills: ['Pompes au sol', 'Squats au poids du corps', 'Tractions assistées', 'Gainage'],
  },
  {
    label: 'Intermédiaire',
    bg: '#e8f5e9',
    border: '#2E7D32',
    skills: ['Tractions strictes', 'Dips aux barres', 'Pistols partiels', 'L-sit'],
  },
  {
    label: 'Avancé',
    bg: '#fff3e0',
    border: '#EF6C00',
    skills: ['Muscle-ups', 'Handstand push-ups', 'Front lever', 'Planche'],
  },
]

const benefits = [
  {
    icon: 'fa-hand-fist',
    title: 'Force fonctionnelle',
    text: "Une force qui s'utilise dans la vraie vie, pas seulement à la salle.",
  },
  {
    icon: 'fa-chart-line',
    title: 'Progression mesurable',
    text: 'Chaque répétition supplémentaire, chaque nouvelle figure — la progression se voit.',
  },
  {
    icon: 'fa-piggy-bank',
    title: 'Aucun coût',
    text: "Le mobilier urbain comme salle de sport, sans abonnement.",
  },
  {
    icon: 'fa-brain',
    title: 'Discipline',
    text: 'Patience, régularité, technique — le street workout forge le mental autant que le corps.',
  },
]
</script>

<template>
  <ActivityHero :activity="activity" />

  <ActivityIntro :paragraphs="paragraphs" :audience="audience" :info-lines="infoLines">
    <div class="mt-10">
      <h2 class="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-6">
        Progressions par niveau
      </h2>
      <div class="grid md:grid-cols-3 gap-5">
        <div
          v-for="level in levels"
          :key="level.label"
          v-reveal
          class="rounded-2xl p-6"
          :style="{ background: level.bg, borderLeft: `4px solid ${level.border}` }"
        >
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 text-white"
            :style="{ background: level.border }"
          >{{ level.label }}</span>
          <ul class="space-y-2">
            <li
              v-for="skill in level.skills"
              :key="skill"
              class="flex items-center gap-2 text-sm text-gray-700 font-medium"
            >
              <i class="fas fa-check text-xs" :style="{ color: level.border }"></i>{{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ActivityIntro>

  <BenefitsGrid title="Pourquoi le street workout" :benefits="benefits" />
  <OtherActivities current-slug="street-workout" />
  <ActivityCtaBand :cta="activity.cta" />
</template>
