<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useNavbarScroll } from "@/composables/useNavbarScroll";

const { isScrolled } = useNavbarScroll();
const route = useRoute();
const mobileOpen = ref(false);

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
}

function closeMobile() {
  mobileOpen.value = false;
}

// Anchor links live on the home view; from a sub-page we need to send the
// browser back to / with the hash so the router scrollBehavior kicks in.
function anchorTo(hash) {
  return route.name === "home" ? { hash } : { name: "home", hash };
}
</script>

<template>
  <nav
    :class="[
      'app-navbar fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4',
      { 'is-scrolled': isScrolled },
    ]"
    data-testid="navbar"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <RouterLink
        :to="anchorTo('#accueil')"
        class="flex items-center gap-3 group"
        aria-label="BussySport - Accueil"
        @click="closeMobile"
      >
        <img
          src="/images/logo.jpeg"
          alt="Logo BussySport"
          class="h-12 w-12 rounded-full object-cover shadow-lg"
          width="48"
          height="48"
        />
        <div>
          <div class="font-display font-black text-xl text-white leading-none">
            BussySport
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-xs text-white/55 font-medium tracking-wide"
              >Bussigny · 1030 VD</span
            >
          </div>
        </div>
      </RouterLink>

      <div class="hidden md:flex items-center gap-8">
        <RouterLink
          :to="anchorTo('#apropos')"
          class="text-white/80 hover:text-white text-sm font-semibold tracking-wide transition-colors"
          >Notre Association</RouterLink
        >
        <RouterLink
          :to="anchorTo('#activites')"
          class="text-white/80 hover:text-white text-sm font-semibold tracking-wide transition-colors"
          >Activités</RouterLink
        >
        <RouterLink
          :to="anchorTo('#contact')"
          class="text-white/80 hover:text-white text-sm font-semibold tracking-wide transition-colors"
          >Contact</RouterLink
        >
        <RouterLink
          to="/adhesion"
          class="btn-primary px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2"
          data-testid="nav-join-btn"
        >
          <i class="fas fa-plus text-xs"></i>Rejoindre
        </RouterLink>
      </div>

      <button
        type="button"
        class="md:hidden text-white p-2.5 rounded-xl hover:bg-white/10 transition-colors"
        :aria-expanded="mobileOpen"
        aria-label="Ouvrir le menu"
        data-testid="hamburger-btn"
        @click="toggleMobile"
      >
        <i :class="['fas', mobileOpen ? 'fa-times' : 'fa-bars', 'text-xl']"></i>
      </button>
    </div>

    <div
      v-show="mobileOpen"
      class="app-mobile-menu md:hidden mt-3 mx-4 rounded-2xl overflow-hidden"
      data-testid="mobile-menu"
    >
      <div class="flex flex-col py-2">
        <RouterLink
          :to="anchorTo('#apropos')"
          class="px-6 py-3.5 text-white/80 hover:text-white hover:bg-white/8 font-semibold text-sm transition-all"
          @click="closeMobile"
          >Notre Association</RouterLink
        >
        <RouterLink
          :to="anchorTo('#activites')"
          class="px-6 py-3.5 text-white/80 hover:text-white hover:bg-white/8 font-semibold text-sm transition-all"
          @click="closeMobile"
          >Activités</RouterLink
        >
        <RouterLink
          :to="anchorTo('#contact')"
          class="px-6 py-3.5 text-white/80 hover:text-white hover:bg-white/8 font-semibold text-sm transition-all"
          @click="closeMobile"
          >Contact</RouterLink
        >
        <div class="px-5 py-4 border-t border-white/10 mt-1">
          <RouterLink
            to="/adhesion"
            class="btn-primary block text-center py-3.5 rounded-xl font-bold text-sm"
            @click="closeMobile"
          >
            <i class="fas fa-plus mr-2 text-xs"></i>Nous Rejoindre
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
