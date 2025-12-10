import { watch, onMounted } from 'vue'

export function useTodolistLocalStorage(taches, prochainId, options = {}) {
  const { cleTaches, cleProchainId } = options

  function initialiserDepuisLocalStorage() {
    const tachesStockees = localStorage.getItem(cleTaches)
    if (tachesStockees) {
      const parsed = JSON.parse(tachesStockees)
      taches.push(...parsed)
    }

    const idStockee = localStorage.getItem(cleProchainId)
    if (idStockee) {
      prochainId.value = parseInt(idStockee)
    } else {
      prochainId.value = taches.length > 0 ? Math.max(...taches.map(t => t.id)) + 1 : 1
    }
  }

  onMounted(() => {
    initialiserDepuisLocalStorage()
  })

  watch(
    taches,
    (nouvellesTaches) => {
      localStorage.setItem(cleTaches, JSON.stringify(nouvellesTaches))
    },
    { deep: true }
  )

  watch(prochainId, (nouvelleValeur) => {
    localStorage.setItem(cleProchainId, String(nouvelleValeur))
  })
}
