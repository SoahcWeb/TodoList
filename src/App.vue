<template>
  <h2>Exo Synthèse</h2>

  <!-- Formulaire d'ajout -->
  <TodoForm @demanderAjoutTache="ajouterTache" />

  <!-- Menu de tri -->
  <select v-model="triCritere">
    <option value="manuel">Ordre personnalisé</option>
    <option value="creation">Ordre de création</option>
    <option value="libelleAsc">Libellé A→Z</option>
    <option value="libelleDesc">Libellé Z→A</option>
    <option value="terminee">Non terminées d'abord</option>
  </select>

  <p>Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé"</p>

  <!-- Compteurs -->
  <p>Total des tâches : {{ nombreTotalTaches }}</p>
  <p>Tâches terminées : {{ nombreTachesTerminees }}</p>

  <!-- Liste des tâches -->
  <TodoList
    :taches="tachesTriees"
    @demanderSuppression="supprimerTache"
    @demanderChangementStatut="basculerTerminee"
    @demanderMonter="monter"
    @demanderDescendre="descendre"
  />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

// -----------------------------------------------------
// Données réactives
// -----------------------------------------------------
const taches = reactive([])
const triCritere = ref('manuel')
const prochainId = ref(1)

// -----------------------------------------------------
// LocalStorage keys
// -----------------------------------------------------
const CLE_LOCALSTORAGE_TACHES = 'todolist:taches'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId'

// -----------------------------------------------------
// Initialisation depuis LocalStorage
// -----------------------------------------------------
const tachesStockees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
if (tachesStockees) {
  taches.push(...JSON.parse(tachesStockees))
}

const idStockee = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)
if (idStockee) {
  prochainId.value = parseInt(idStockee)
} else {
  prochainId.value = taches.length > 0 ? Math.max(...taches.map(t => t.id)) + 1 : 1
}

// -----------------------------------------------------
// Observers pour sauvegarde automatique
// -----------------------------------------------------
watch(taches, (nv) => {
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(nv))
}, { deep: true })

watch(prochainId, (nv) => {
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(nv))
})

// -----------------------------------------------------
// Propriétés calculées
// -----------------------------------------------------
const nombreTotalTaches = computed(() => taches.length)
const nombreTachesTerminees = computed(() => taches.filter(t => t.terminee).length)

const peutUtiliserTriManuel = computed(() => triCritere.value === 'manuel')

const tachesTriees = computed(() => {
  return taches.toSorted((a, b) => {
    switch (triCritere.value) {
      case 'creation': return a.id - b.id
      case 'libelleAsc': return a.libelle.localeCompare(b.libelle)
      case 'libelleDesc': return b.libelle.localeCompare(a.libelle)
      case 'terminee':
        return (a.terminee === b.terminee)
          ? a.libelle.localeCompare(b.libelle)
          : (a.terminee ? 1 : -1)
      case 'manuel':
      default: return a.ordre - b.ordre
    }
  })
})

// -----------------------------------------------------
// Fonctions métier
// -----------------------------------------------------
function ajouterTache(libelle) {
  if (!libelle.trim()) return
  taches.push({
    id: prochainId.value,
    libelle: libelle.trim(),
    terminee: false,
    ordre: prochainId.value
  })
  prochainId.value++
}

function basculerTerminee(id) {
  const t = taches.find(t => t.id === id)
  if (t) t.terminee = !t.terminee
}

function supprimerTache(id) {
  const index = taches.findIndex(t => t.id === id)
  if (index !== -1) taches.splice(index, 1)
}

function monter(id) {
  if (!peutUtiliserTriManuel.value) return
  const index = tachesTriees.value.findIndex(t => t.id === id)
  if (index <= 0) return
  const courant = tachesTriees.value[index]
  const auDessus = tachesTriees.value[index - 1]
  const tmp = courant.ordre
  courant.ordre = auDessus.ordre
  auDessus.ordre = tmp
}

function descendre(id) {
  if (!peutUtiliserTriManuel.value) return
  const index = tachesTriees.value.findIndex(t => t.id === id)
  if (index >= tachesTriees.value.length - 1) return
  const courant = tachesTriees.value[index]
  const auDessous = tachesTriees.value[index + 1]
  const tmp = courant.ordre
  courant.ordre = auDessous.ordre
  auDessous.ordre = tmp
}
</script>

<style>
li { margin-bottom: 5px; }
.terminee { text-decoration: line-through; color: gray; }
button { margin-left: 5px; }
button:disabled { opacity: 0.5; }
</style>
