import { computed } from 'vue'

export function useTodolistStats(taches) {
  const nombreTotalTaches = computed(() => taches.length)
  const nombreTachesTerminees = computed(() => taches.filter(t => t.terminee).length)
  const aDesTaches = computed(() => taches.length > 0)

  return {
    nombreTotalTaches,
    nombreTachesTerminees,
    aDesTaches
  }
}
