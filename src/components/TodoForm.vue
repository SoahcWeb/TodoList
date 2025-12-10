<template>
  <form @submit.prevent="gererSoumission">
    <input
      ref="champSaisie"
      type="text"
      v-model="nouvelleTache"
      placeholder="Ajouter une tâche"
    >
    <button type="submit" :disabled="!nouvelleTache.trim()">
      Ajouter
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nouvelleTache = ref('')
const champSaisie = ref(null)

const emit = defineEmits(['demanderAjoutTache'])

const gererSoumission = () => {
  const texteNettoye = nouvelleTache.value.trim()
  if (texteNettoye === '') return
  emit('demanderAjoutTache', texteNettoye)
  nouvelleTache.value = ''
}

onMounted(() => {
  if (champSaisie.value !== null) {
    champSaisie.value.focus()
  }
})
</script>

<style scoped>
input { margin-right: 5px; padding: 2px 5px; }
button { padding: 2px 6px; }
</style>
