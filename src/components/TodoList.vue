<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps({
  taches: { type: Array, required: true }
})

const emit = defineEmits([
  'demanderSuppression',
  'demanderChangementStatut',
  'demanderMonter',
  'demanderDescendre'
])
</script>

<template>
  <ul>
    <TodoItem
      v-for="(tache, index) in taches"
      :key="tache.id"
      :id="tache.id"
      :libelle="tache.libelle"
      :terminee="tache.terminee"
      :peutMonterDescendre="taches.length > 1"
      :estPremiere="index === 0"
      :estDerniere="index === taches.length - 1"
      @demanderSuppression="emit('demanderSuppression', $event)"
      @demanderChangementStatut="emit('demanderChangementStatut', $event)"
      @demanderMonter="emit('demanderMonter', $event)"
      @demanderDescendre="emit('demanderDescendre', $event)"
    />
  </ul>
</template>
