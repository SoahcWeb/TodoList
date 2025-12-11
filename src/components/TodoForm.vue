<template>
  <form @submit.prevent="gererSoumission" class="flex flex-col w-full gap-3">
    <input
      ref="champSaisie"
      type="text"
      v-model="nouvelleTache"
      placeholder="Ajouter une tâche"
      class="w-full px-3 py-2 rounded-md text-[#E0E6F0] 
             bg-[#011c2f]
             border border-transparent
             focus:outline-none"
    />

    <button
      type="submit"
      :disabled="!nouvelleTache.trim()"
      class="flex justify-center w-full"
    >
      <img
        :src="nouvelleTache.trim() ? 'images/Bvalideron.png' : 'images/Bvalideroff.png'"
        alt="Valider"
        class="object-contain h-16"
      />
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
/* Transition identique à ton bouton */
input {
  transition: all 0.3s ease;
  border: 1px solid rgba(15,15,47,0.5);
}

/* Couleur du placeholder */
input::placeholder {
  color: #E0E6F0;
}

/* Bordure + shadow + scale au hover et focus */
input:hover,
input:focus {
  border-color: #C96BFF;
  box-shadow: 0 0 15px rgba(201, 107, 255, 0.45);
  transform: scale(1.05);
  outline: none;
}

button {
  transition: all 0.2s ease;
}
button:hover:not(:disabled) img {
  transform: scale(1.05);
}
button img {
  transition: transform 0.2s ease;
}
</style>
