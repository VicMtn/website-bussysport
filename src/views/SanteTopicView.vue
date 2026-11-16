<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useHead } from "@unhead/vue";
import { getOtherTopics, getTopic } from "@/data/formeSante";
import SanteHero from "@/components/sante/SanteHero.vue";
import SanteDisclaimer from "@/components/sante/SanteDisclaimer.vue";
import SanteTopicCards from "@/components/sante/SanteTopicCards.vue";

const route = useRoute();
const topic = computed(() => getTopic(route.meta.topic));
const others = computed(() => getOtherTopics(route.meta.topic));

useHead(
  computed(() => {
    const current = topic.value;
    if (!current) return {};
    return {
      title: current.title,
      meta: [
        { name: "description", content: current.description },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `https://bussysport.ch${current.path}/`,
        },
        {
          property: "og:title",
          content: `${current.title} – Forme & Santé – BussySport`,
        },
        { property: "og:description", content: current.description },
      ],
      link: [
        {
          rel: "canonical",
          href: `https://bussysport.ch${current.path}/`,
        },
      ],
    };
  }),
);
</script>

<template>
  <template v-if="topic">
    <SanteHero
      :title="topic.title"
      :subtitle="topic.blurb"
      :current-label="topic.label"
    />

    <section class="py-16 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <SanteDisclaimer />

        <p class="mt-12 text-gray-600 text-lg leading-relaxed">
          {{ topic.lead }}
        </p>

        <div class="mt-14 space-y-14">
          <article v-for="section in topic.sections" :key="section.title">
            <h2
              class="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-3"
            >
              {{ section.title }}
            </h2>
            <p class="text-gray-500 leading-relaxed mb-6">
              {{ section.intro }}
            </p>
            <component
              :is="section.ordered ? 'ol' : 'ul'"
              class="space-y-5 list-none m-0 p-0"
            >
              <li
                v-for="(item, index) in section.items"
                :key="item.title"
                class="sante-note"
              >
                <span
                  v-if="section.ordered"
                  class="sante-note-index"
                  aria-hidden="true"
                  >{{ index + 1 }}</span
                >
                <div>
                  <h3 class="font-display font-bold text-lg text-gray-900 mb-1">
                    {{ item.title }}
                  </h3>
                  <p class="text-gray-600 text-base leading-relaxed">
                    {{ item.text }}
                  </p>
                </div>
              </li>
            </component>
          </article>
        </div>

        <div class="mt-14">
          <SanteDisclaimer compact />
        </div>

        <p class="text-gray-400 text-sm leading-relaxed mt-8">
          Ces lignes décrivent notre pratique du moment. Pour les corriger,
          <a
            href="mailto:info@bussysport.ch"
            class="text-primary font-semibold"
          >
            écrivez au comité </a
          >.
        </p>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div class="flex items-end justify-between gap-4 mb-6">
          <h2 class="font-display font-black text-2xl text-gray-900">
            Les autres notes
          </h2>
          <RouterLink
            :to="{ name: 'forme-sante' }"
            class="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Toute la section
          </RouterLink>
        </div>
        <SanteTopicCards :items="others" />
      </div>
    </section>
  </template>
</template>
