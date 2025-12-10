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

  <!-- Rendu conditionnel -->
  <TodoList
    v-if="aDesTaches"
    :taches="tachesTriees"
    @demanderSuppression="supprimerTache"
    @demanderChangementStatut="basculerTerminee"
    @demanderMonter="monter"
    @demanderDescendre="descendre"
  />
  <p v-else>Aucune tâche à afficher</p>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

import { useTodolistLocalStorage } from './composables/useTodolistLocalStorage.js'
import { useTodolistStats } from './composables/useTodolistStats.js'
import { useTodolistTri } from './composables/useTodolistTri.js'

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
// Utilisation des composables
// -----------------------------------------------------
useTodolistLocalStorage(taches, prochainId, {
  cleTaches: CLE_LOCALSTORAGE_TACHES,
  cleProchainId: CLE_LOCALSTORAGE_PROCHAIN_ID
})

const { nombreTotalTaches, nombreTachesTerminees, aDesTaches } = useTodolistStats(taches)
const { tachesTriees, peutUtiliserTriManuel } = useTodolistTri(taches, triCritere)

// -----------------------------------------------------
// Fonctions métier
// -----------------------------------------------------
function ajouterTache(libelle) {
  if (!libelle.trim()) return

  taches.push({
    id: prochainId.value,
    libelle: libelle.trim(),
    terminee: false,
    ordre: prochainId.value,
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
