<script setup>
import { useHead } from "@unhead/vue";
import { RouterLink } from "vue-router";
import { topics } from "@/data/formeSante";
import SanteHero from "@/components/sante/SanteHero.vue";
import SanteDisclaimer from "@/components/sante/SanteDisclaimer.vue";
import SanteTopicCards from "@/components/sante/SanteTopicCards.vue";

const description =
  "Notes de forme et de santé du comité BussySport : nutrition, exercices et étirements tirés de notre pratique. Aucun de nous n'est professionnel de santé.";

useHead({
  title: "Forme & Santé",
  meta: [
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://bussysport.ch/forme-sante/" },
    { property: "og:title", content: "Forme & Santé – BussySport" },
    { property: "og:description", content: description },
  ],
  link: [{ rel: "canonical", href: "https://bussysport.ch/forme-sante/" }],
});
</script>

<template>
  <SanteHero
    title="Forme & Santé"
    subtitle="Ce qu'on a pris l'habitude de faire autour des séances. Rien qui ne vienne de notre propre pratique."
  />

  <section class="py-16 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
      <SanteDisclaimer />

      <div class="mt-12 space-y-5 text-gray-600 text-lg leading-relaxed">
        <p>
          On a rassemblé ici des habitudes qu'on se transmet entre membres du
          comité : comment on mange autour d'une séance, les mouvements qu'on
          reprend souvent, et les étirements qu'on fait avant de se quitter.
        </p>
        <p>
          Si une note ne correspond plus à ce qu'on fait vraiment, on la retire.
          On n'ajoute rien qui vienne d'un article, d'une appli ou de quelqu'un
          qui ne pratique pas avec nous.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <SanteTopicCards :items="topics" />
      <p class="text-gray-400 text-sm leading-relaxed mt-10 max-w-3xl">
        Une habitude du comité n'est pas encore écrite, ou une phrase ne
        correspond pas à ce que vous faites ?
        <a href="mailto:info@bussysport.ch" class="text-primary font-semibold">
          Écrivez-nous
        </a>
        — on ne publie que ce qui vient de notre pratique.
      </p>
      <RouterLink
        :to="{ name: 'home', hash: '#activites' }"
        class="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
      >
        <i class="fas fa-arrow-left text-xs" aria-hidden="true"></i>
        Revenir aux activités
      </RouterLink>
    </div>
  </section>
</template>
