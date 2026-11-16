<script setup>
import { disclaimer } from "@/data/formeSante";

defineProps({
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <aside class="sante-disclaimer" role="note">
    <i class="fas fa-circle-info sante-disclaimer-icon" aria-hidden="true"></i>
    <div>
      <p class="sante-disclaimer-title">{{ disclaimer.title }}</p>
      <p v-if="compact" class="sante-disclaimer-text">{{ disclaimer.short }}</p>
      <p v-else class="sante-disclaimer-text">{{ disclaimer.text }}</p>
    </div>
  </aside>
</template>
