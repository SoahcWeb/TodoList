<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  libelle: { type: String, required: true },
  terminee: { type: Boolean, required: true },
  peutMonterDescendre: { type: Boolean, required: true },
  estPremiere: { type: Boolean, required: true },
  estDerniere: { type: Boolean, required: true }
})

const emit = defineEmits([
  'demanderSuppression',
  'demanderChangementStatut',
  'demanderMonter',
  'demanderDescendre'
])

function demanderSuppression() { emit('demanderSuppression', props.id) }
function demanderChangementStatut() { emit('demanderChangementStatut', props.id) }
function demanderMonter() { emit('demanderMonter', props.id) }
function demanderDescendre() { emit('demanderDescendre', props.id) }
</script>

<template>
  <li>
    <span :class="{ terminee: props.terminee }">{{ props.libelle }}</span>

    <button @click="demanderChangementStatut">✔</button>
    <button @click="demanderSuppression">🗑</button>

    <button 
      v-if="peutMonterDescendre" 
      @click="demanderMonter" 
      :disabled="estPremiere">⬆</button>
    <button 
      v-if="peutMonterDescendre" 
      @click="demanderDescendre" 
      :disabled="estDerniere">⬇</button>
  </li>
</template>

<style scoped>
.terminee { text-decoration: line-through; color: gray; }
button { margin-left: 5px; }
button:disabled { opacity: 0.5; }
</style>
