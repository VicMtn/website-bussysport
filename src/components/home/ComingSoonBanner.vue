<template>
  <div v-reveal class="reveal-d5" data-testid="coming-soon-banner">
    <div
      class="relative overflow-hidden rounded-2xl p-10 text-center"
      style="background: linear-gradient(135deg, #0d2137 0%, #1565c0 60%, #1976d2 100%);"
    >
      <div
        class="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style="background: #29b6f6; transform: translate(35%, -35%);"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style="background: #29b6f6; transform: translate(-35%, 35%);"
      ></div>

      <div class="relative z-10">
        <div
          class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6"
          style="background: rgba(41, 182, 246, 0.18); border: 1px solid rgba(41, 182, 246, 0.4);"
        >
          <span class="text-xs font-black tracking-widest text-white/90 uppercase">
            Prochainement
          </span>
        </div>

        <h3 class="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white mb-4 leading-tight">
          D'autres activités passionnantes<br class="hidden sm:block" />
          arrivent dans les mois à venir !
        </h3>
        <p class="text-white/65 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Notre association grandit ! De nouvelles disciplines sont en
          préparation pour enrichir notre offre et répondre aux envies et
          besoins des habitants de Bussigny. Restez connectés !
        </p>
      </div>
    </div>
  </div>
</template>
