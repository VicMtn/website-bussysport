<script setup>
import { useHead } from '@unhead/vue'
import { getActivity } from '@/data/activities'
import ActivityHero from '@/components/activity/ActivityHero.vue'
import ActivityIntro from '@/components/activity/ActivityIntro.vue'
import BenefitsGrid from '@/components/activity/BenefitsGrid.vue'
import OtherActivities from '@/components/activity/OtherActivities.vue'
import ActivityCtaBand from '@/components/activity/ActivityCtaBand.vue'

const activity = getActivity('cross-training')

useHead({
  title: 'Cross-Training – Entraînement fonctionnel en plein air',
  meta: [
    {
      name: 'description',
      content:
        'Cross-training en extérieur avec BussySport à Bussigny. Force, cardio et endurance pour tous les niveaux. Séances hebdomadaires au grand air.',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: 'https://bussysport.ch/cross-training/' },
    { property: 'og:title', content: 'Cross-Training – BussySport Bussigny' },
  ],
  link: [{ rel: 'canonical', href: 'https://bussysport.ch/cross-training/' }],
})

const paragraphs = [
  "Le cross-training combine <strong>cardio, force et mobilité</strong> dans des séances variées et intenses. Chaque entraînement est différent — on ne s'ennuie jamais.",
  "Toutes nos séances ont lieu <strong>en extérieur</strong>, beau temps comme couvert, en utilisant le terrain naturel et du matériel léger. Pas besoin de salle, pas besoin de machines.",
  "Les exercices sont <strong>scalables</strong> : un même WOD peut être adapté du débutant à l'athlète confirmé.",
]

const audience = [
  'Sportifs qui veulent diversifier leur entraînement',
  'Personnes cherchant un travail complet du corps',
  'Anciens du fitness en quête de plus d\'intensité',
  'Curieux qui veulent essayer une nouvelle discipline',
]

const infoLines = [
  { icon: 'fa-calendar-week', label: 'Fréquence', value: 'Hebdomadaire' },
  { icon: 'fa-clock', label: 'Durée', value: '60 minutes' },
  { icon: 'fa-location-dot', label: 'Lieu', value: 'Bussigny — extérieur' },
  { icon: 'fa-fire', label: 'Intensité', value: 'Modérée à élevée' },
]

const blocks = [
  {
    title: 'Échauffement dynamique',
    text: 'Mobilité, activation et préparation cardio progressive — environ 10 minutes.',
  },
  {
    title: 'Travail de force',
    text: 'Squats, fentes, dips, tractions, poussées — patrons de mouvements fondamentaux.',
  },
  {
    title: 'WOD du jour',
    text: "Circuit en temps imparti ou pour le score — l'esprit cross-training pur.",
  },
  {
    title: 'Récupération',
    text: 'Mobilité, étirements, et débrief de la séance.',
  },
]

const benefits = [
  {
    icon: 'fa-bolt',
    title: 'Corps complet',
    text: 'Force, cardio, agilité et endurance dans une seule séance.',
  },
  {
    icon: 'fa-fire-flame-curved',
    title: 'Brûle-graisses',
    text: "Intensité élevée et dépense énergétique importante, même après l'effort.",
  },
  {
    icon: 'fa-dumbbell',
    title: 'Force fonctionnelle',
    text: 'Des mouvements utiles dans la vie quotidienne, pas juste pour le miroir.',
  },
  {
    icon: 'fa-rocket',
    title: 'Progression rapide',
    text: 'Résultats visibles en quelques semaines avec un suivi régulier.',
  },
]
</script>

<template>
  <ActivityHero :activity="activity" />

  <ActivityIntro :paragraphs="paragraphs" :audience="audience" :info-lines="infoLines">
    <div class="mt-10">
      <h2 class="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-6">
        Déroulement d'une séance
      </h2>
      <div class="grid sm:grid-cols-2 gap-5">
        <div
          v-for="(block, i) in blocks"
          :key="block.title"
          v-reveal
          class="feature-card flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100"
        >
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-black text-white"
            :style="{ background: i === blocks.length - 1 ? '#29B6F6' : '#1565C0' }"
          >{{ i + 1 }}</div>
          <div>
            <h3 class="font-display font-bold text-base text-gray-900 mb-1">{{ block.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ block.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </ActivityIntro>

  <BenefitsGrid title="Pourquoi le cross-training" :benefits="benefits" />
  <OtherActivities current-slug="cross-training" />
  <ActivityCtaBand :cta="activity.cta" />
</template>
