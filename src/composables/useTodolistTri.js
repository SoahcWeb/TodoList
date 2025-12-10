import { computed } from 'vue'

export function useTodolistTri(taches, triCritere) {
  const peutUtiliserTriManuel = computed(() => triCritere.value === 'manuel')

  const tachesTriees = computed(() => {
    return taches.toSorted((a, b) => {
      switch (triCritere.value) {
        case 'creation':
          return a.id - b.id
        case 'libelleAsc':
          return a.libelle.localeCompare(b.libelle)
        case 'libelleDesc':
          return b.libelle.localeCompare(a.libelle)
        case 'terminee':
          return (a.terminee === b.terminee)
            ? a.libelle.localeCompare(b.libelle)
            : (a.terminee ? 1 : -1)
        case 'manuel':
        default:
          return a.ordre - b.ordre
      }
    })
  })

  return {
    tachesTriees,
    peutUtiliserTriManuel
  }
}
