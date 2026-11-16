<script setup>
import { RouterLink, useRoute } from "vue-router";
import { activities } from "@/data/activities";

const route = useRoute();

function anchorTo(hash) {
  return route.name === "home" ? { hash } : { name: "home", hash };
}
</script>

<template>
  <footer
    class="bg-navy pt-12 md:pt-16 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-8"
    data-testid="footer"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-12 pb-10 md:pb-12 border-b border-white/10"
      >
        <div class="col-span-2 md:col-span-1">
          <RouterLink
            :to="anchorTo('#accueil')"
            class="flex items-center gap-3 mb-5"
            aria-label="BussySport"
          >
            <img
              src="/images/logo.jpeg"
              alt="Logo BussySport"
              class="h-14 w-14 rounded-full object-cover"
              loading="lazy"
              width="56"
              height="56"
            />
            <div>
              <div class="font-display font-black text-xl text-white">
                BussySport
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="text-xs text-white/40 tracking-wide"
                  >Bussigny · 1030 VD</span
                >
              </div>
            </div>
          </RouterLink>
          <p class="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
            Association sportive de Bussigny, dédiée à la promotion du sport et
            du bien-être pour tous.
          </p>
          <div class="flex gap-3">
            <a
              href="https://www.instagram.com/bussysport"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              data-testid="footer-instagram"
              class="social-icon w-11 h-11 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white/50"
              style="
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <i class="fab fa-instagram text-lg" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com/bussysport"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              data-testid="footer-facebook"
              class="social-icon w-11 h-11 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white/50"
              style="
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <i class="fab fa-facebook-f text-lg" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div>
          <h3
            class="font-display font-bold text-white text-xs uppercase tracking-widest mb-4 md:mb-6"
          >
            Navigation
          </h3>
          <ul class="space-y-1 md:space-y-3.5">
            <li>
              <RouterLink
                :to="anchorTo('#accueil')"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Accueil</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#apropos')"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Notre Association</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#activites')"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Activités</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#contact')"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Contact</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/adhesion"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Adhésion</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/forme-sante"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >Forme & Santé</RouterLink
              >
            </li>
            <li>
              <a
                href="mailto:info@bussysport.ch"
                class="block py-1.5 md:inline md:py-0 text-white/45 hover:text-white text-sm font-medium transition-colors break-words"
                >info@bussysport.ch</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3
            class="font-display font-bold text-white text-xs uppercase tracking-widest mb-4 md:mb-6"
          >
            Activités
          </h3>
          <ul class="space-y-1 md:space-y-3.5">
            <li v-for="activity in activities" :key="activity.slug">
              <RouterLink
                :to="{ name: activity.slug }"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors flex items-center gap-2.5 py-1.5 md:py-0"
              >
                <i
                  :class="['fas', activity.icon, 'text-xs text-primary-light']"
                  aria-hidden="true"
                ></i>
                {{ activity.label }}
              </RouterLink>
            </li>
            <li
              class="flex items-center gap-2.5 py-1.5 md:py-0 text-white/45 text-sm font-medium"
            >
              <i
                class="fas fa-ellipsis text-xs text-primary-light"
                aria-hidden="true"
              ></i>
              Et plus à venir…
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 md:pt-8 gap-3 sm:gap-4 text-center sm:text-left"
      >
        <p class="text-white/30 text-xs leading-relaxed">
          © 2025 BussySport — Association à but non lucratif — Bussigny, Vaud,
          Suisse
        </p>
        <div class="flex items-center gap-5">
          <RouterLink
            to="/mentions-legales"
            class="text-white/30 hover:text-white/70 text-xs font-medium transition-colors"
            >Mentions légales</RouterLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>
