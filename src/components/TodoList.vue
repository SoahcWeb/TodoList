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
  <ul class="space-y-2">
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
      class="flex items-center justify-between p-3 bg-[#0F0F2F]/50 rounded-xl border border-[#0F0F2F]/30 shadow-md"
    />
  </ul>
</template>

<style scoped>
/* Optionnel : ajuste la scrollabilité si nécessaire */
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
