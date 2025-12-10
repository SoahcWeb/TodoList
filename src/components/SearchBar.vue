<template>
  <div class="flex items-center gap-2 mb-4">
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher une tâche..."
      class="flex-1 p-2 rounded border border-gray-600 bg-[#0F0F2F] text-[#E0E6F0]"
    />
    <button
      @click="clearSearch"
      v-if="search"
      class="px-3 py-1 bg-[#52c5ff] text-black rounded hover:bg-[#39a2ff] transition"
    >
      X
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const search = ref(props.modelValue || '')

// Synchronisation avec le parent
watch(search, (val) => {
  emit('update:modelValue', val)
})

function clearSearch() {
  search.value = ''
}
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #52c5ff;
  box-shadow: 0 0 5px #52c5ff60;
}
</style>
