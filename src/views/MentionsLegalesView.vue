<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'

useHead({
  title: 'Mentions Légales – Association Sportive Bussigny',
  meta: [
    {
      name: 'description',
      content:
        "Mentions légales, politique de confidentialité et conditions générales de l'association BussySport à Bussigny-près-Lausanne, Vaud.",
    },
    { name: 'robots', content: 'noindex, follow' },
  ],
  link: [{ rel: 'canonical', href: 'https://bussysport.ch/mentions-legales/' }],
})

const sections = [
  { id: 'identite', label: 'Identité' },
  { id: 'responsable', label: 'Responsable de publication' },
  { id: 'hebergement', label: 'Hébergement' },
  { id: 'donnees', label: 'Données personnelles' },
  { id: 'cookies', label: 'Cookies & traceurs' },
  { id: 'propriete', label: 'Propriété intellectuelle' },
  { id: 'participation', label: 'Participation aux activités' },
  { id: 'responsabilite', label: 'Responsabilité' },
  { id: 'droit', label: 'Droit applicable' },
  { id: 'contact-legal', label: 'Contact' },
]
</script>

<template>
  <section
    class="pt-32 pb-16 px-4 text-white"
    style="background: linear-gradient(135deg, #0d2137 0%, #1565c0 100%);"
  >
    <div class="max-w-5xl mx-auto">
      <nav class="flex items-center gap-2 text-xs text-white/60 mb-6">
        <RouterLink to="/" class="hover:text-white">Accueil</RouterLink>
        <span>›</span>
        <span class="text-white">Mentions légales</span>
      </nav>
      <h1 class="font-display font-black text-4xl sm:text-5xl mb-4">Mentions Légales</h1>
      <p class="text-white/75 max-w-2xl leading-relaxed">
        Informations légales, données personnelles et conditions générales
        d'utilisation du site bussysport.ch.
      </p>
      <span
        class="inline-block mt-5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
        style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2);"
      >Mise à jour : mars 2025</span>
    </div>
  </section>

  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-10">
      <aside class="lg:sticky lg:top-28 self-start">
        <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Sommaire
        </h2>
        <ul class="space-y-2">
          <li v-for="(s, i) in sections" :key="s.id">
            <a
              :href="`#${s.id}`"
              class="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <span
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary border border-primary/30 flex-shrink-0"
              >{{ i + 1 }}</span>
              <span>{{ s.label }}</span>
            </a>
          </li>
        </ul>
      </aside>

      <div class="space-y-12">
        <div id="identite" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">1. Identité</h2>
          <div class="info-box grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-xs font-bold uppercase text-gray-400 mb-1">Nom</div>
              <div class="text-gray-800 font-semibold">Association BussySport</div>
            </div>
            <div>
              <div class="text-xs font-bold uppercase text-gray-400 mb-1">Statut</div>
              <div class="text-gray-800 font-semibold">Association à but non lucratif (CC art. 60 ss)</div>
            </div>
            <div>
              <div class="text-xs font-bold uppercase text-gray-400 mb-1">Siège</div>
              <div class="text-gray-800 font-semibold">Bussigny-près-Lausanne, 1030 VD, Suisse</div>
            </div>
            <div>
              <div class="text-xs font-bold uppercase text-gray-400 mb-1">Email</div>
              <a href="mailto:info@bussysport.ch" class="text-primary font-semibold">info@bussysport.ch</a>
            </div>
          </div>
        </div>

        <div id="responsable" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">2. Responsable de publication</h2>
          <p class="text-gray-600 leading-relaxed">
            Le comité de l'Association BussySport est responsable de la publication
            du site bussysport.ch. Pour toute demande relative au contenu,
            écrivez à
            <a href="mailto:info@bussysport.ch" class="text-primary font-semibold underline">info@bussysport.ch</a>.
          </p>
        </div>

        <div id="hebergement" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">3. Hébergement</h2>
          <p class="text-gray-600 leading-relaxed">
            Le site est hébergé par un prestataire en Suisse. Les coordonnées
            précises sont disponibles sur demande.
          </p>
        </div>

        <div id="donnees" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">4. Données personnelles</h2>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">4.1 Collecte</h3>
          <p class="text-gray-600 leading-relaxed">
            Le site collecte uniquement les données saisies dans le formulaire
            de contact (nom, email, sujet, message).
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">4.2 Finalité</h3>
          <p class="text-gray-600 leading-relaxed">
            Ces données ne servent qu'à répondre à la demande émise et ne sont
            jamais transmises à des tiers à des fins commerciales.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">4.3 Conservation</h3>
          <p class="text-gray-600 leading-relaxed">
            Les messages sont conservés le temps nécessaire au traitement et
            ne dépassent pas 24 mois sauf accord spécifique.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">4.4 Droits</h3>
          <p class="text-gray-600 leading-relaxed">
            Conformément à la LPD suisse, vous pouvez demander l'accès, la
            rectification ou la suppression de vos données par email.
          </p>
        </div>

        <div id="cookies" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">5. Cookies & traceurs</h2>
          <p class="text-gray-600 leading-relaxed">
            Le site n'utilise <strong>aucun cookie de mesure d'audience ou
            publicitaire</strong>. Seules les ressources nécessaires au
            chargement (polices, images externes) sont chargées depuis des
            services tiers (Google Fonts, Pexels, Unsplash).
          </p>
        </div>

        <div id="propriete" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">6. Propriété intellectuelle</h2>
          <p class="text-gray-600 leading-relaxed">
            Le contenu rédactionnel et le logo appartiennent à l'Association
            BussySport. Les images d'illustration proviennent des banques
            d'images Pexels et Unsplash et sont utilisées dans le respect de
            leurs licences respectives.
          </p>
        </div>

        <div id="participation" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">7. Participation aux activités</h2>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">7.1 Inscription</h3>
          <p class="text-gray-600 leading-relaxed">
            L'inscription se fait par email. Un retour de confirmation est
            adressé sous 7 jours.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">7.2 Conditions physiques</h3>
          <p class="text-gray-600 leading-relaxed">
            Chaque participant(e) s'engage à pratiquer les activités dans la
            mesure de ses capacités. En cas de doute, consultez un médecin
            avant de débuter.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">7.3 Mineurs</h3>
          <p class="text-gray-600 leading-relaxed">
            Les mineurs doivent disposer d'une autorisation parentale.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">7.4 Comportement</h3>
          <p class="text-gray-600 leading-relaxed">
            Tout participant s'engage à respecter le règlement intérieur, les
            autres membres et les lieux fréquentés.
          </p>
          <h3 class="font-display font-bold text-lg text-gray-900 mt-4 mb-2">7.5 Annulation</h3>
          <p class="text-gray-600 leading-relaxed">
            BussySport se réserve le droit d'annuler ou reporter une activité
            en cas de météo défavorable ou d'effectif insuffisant.
          </p>
        </div>

        <div id="responsabilite" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">8. Responsabilité</h2>
          <p class="text-gray-600 leading-relaxed">
            BussySport décline toute responsabilité en cas de blessure ou
            d'incident liés à une mauvaise condition physique non communiquée
            ou à un comportement contraire aux consignes.
          </p>
        </div>

        <div id="droit" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">9. Droit applicable</h2>
          <p class="text-gray-600 leading-relaxed">
            Les présentes mentions sont soumises au droit suisse. En cas de
            litige, le for judiciaire est fixé à Lausanne.
          </p>
        </div>

        <div id="contact-legal" class="legal-section">
          <h2 class="text-2xl font-black text-gray-900 mb-4">10. Contact</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Pour toute question relative aux présentes mentions, écrivez à :
          </p>
          <a
            href="mailto:info@bussysport.ch"
            class="btn-primary inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm"
          >
            <i class="fas fa-envelope"></i>info@bussysport.ch
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
