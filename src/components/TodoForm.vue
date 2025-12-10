<script setup>
import { ref } from 'vue';

const nouvelleTache = ref('');

const emit = defineEmits(['demanderAjoutTache']);

function gererSoumission() {
  const texteNettoye = nouvelleTache.value.trim();
  if (texteNettoye === '') return;

  emit('demanderAjoutTache', texteNettoye);
  nouvelleTache.value = '';
}
</script>

<template>
  <form @submit.prevent="gererSoumission">
    <input
      type="text"
      v-model="nouvelleTache"
      placeholder="Nouvelle tâche"
    />
    <button type="submit">Ajouter</button>
  </form>
</template>
