<template>
  <form @submit.prevent="gererSoumission" class="flex gap-2 items-center">
    <input
      ref="champSaisie"
      type="text"
      v-model="nouvelleTache"
      placeholder="Ajouter une tâche"
      class="flex-1 px-3 py-2 rounded-md bg-[#1A1A1A] text-[#E0E6F0] border border-[#0F0F2F]/50 focus:outline-none focus:ring-2 focus:ring-[#52c5ff]"
    />
    <button
      type="submit"
      :disabled="!nouvelleTache.trim()"
      class="px-4 py-2 rounded-md bg-[#0F0F2F]/80 text-[#52c5ff] font-semibold hover:bg-[#0F4F8F]/80 disabled:opacity-50 disabled:cursor-not-allowed"
    >
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
  if (champSaisie.value) champSaisie.value.focus()
})
</script>

<style scoped>
input {
  transition: all 0.2s ease;
}
input:focus {
  border-color: #52c5ff;
}
button {
  transition: all 0.2s ease;
}
button:hover:not(:disabled) {
  background-color: #52c5ff33;
}
</style>
