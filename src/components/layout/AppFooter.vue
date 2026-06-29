<script setup>
import { RouterLink, useRoute } from "vue-router";
import { activities } from "@/data/activities";

const route = useRoute();

function anchorTo(hash) {
  return route.name === "home" ? { hash } : { name: "home", hash };
}
</script>

<template>
  <footer class="bg-navy pt-16 pb-8" data-testid="footer">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
        <div>
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
              class="social-icon w-10 h-10 rounded-xl flex items-center justify-center text-white/50"
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
              class="social-icon w-10 h-10 rounded-xl flex items-center justify-center text-white/50"
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
            class="font-display font-bold text-white text-xs uppercase tracking-widest mb-6"
          >
            Navigation
          </h3>
          <ul class="space-y-3.5">
            <li>
              <RouterLink
                :to="anchorTo('#accueil')"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >Accueil</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#apropos')"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >Notre Association</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#activites')"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >Activités</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="anchorTo('#contact')"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >Contact</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/adhesion"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >Adhésion</RouterLink
              >
            </li>
            <li>
              <a
                href="mailto:info@bussysport.ch"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors"
                >info@bussysport.ch</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3
            class="font-display font-bold text-white text-xs uppercase tracking-widest mb-6"
          >
            Activités
          </h3>
          <ul class="space-y-3.5">
            <li v-for="activity in activities" :key="activity.slug">
              <RouterLink
                :to="{ name: activity.slug }"
                class="text-white/45 hover:text-white text-sm font-medium transition-colors flex items-center gap-2.5"
              >
                <i
                  :class="['fas', activity.icon, 'text-xs text-primary-light']"
                  aria-hidden="true"
                ></i>
                {{ activity.label }}
              </RouterLink>
            </li>
            <li
              class="flex items-center gap-2.5 text-white/45 text-sm font-medium"
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
        class="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4"
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
