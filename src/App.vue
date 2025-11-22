<template>
  <h2>Exo Synthèse</h2>

  <!-- Formulaire d'ajout -->
  <input v-model="nouvelleTache" placeholder="Nouvelle tâche">
  <button @click="ajouterTache" :disabled="!nouvelleTache">Ajouter</button>

  <!-- Menu de tri -->
  <select v-model="triCritere" @change="appliquerTri">
    <option value="manuel">Ordre personnalisé</option>
    <option value="creation">Ordre de création</option>
    <option value="libelleAsc">Libellé A→Z</option>
    <option value="libelleDesc">Libellé Z→A</option>
    <option value="terminee">Non terminées d'abord</option>
  </select>
  <button @click="appliquerTri">Appliquer</button>
  <p>Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé"</p>

  <!-- Compteurs -->
  <p>Total : {{ taches.length }}</p>
  <p>Terminées : {{ taches.filter(t => t.terminee).length }}</p>

  <!-- Liste des tâches -->
  <ul v-if="taches.length > 0">
    <li v-for="tache in taches" :key="tache.id">
      <span :class="{ terminee: tache.terminee }">{{ tache.libelle }}</span>
      <button @click="monter(tache.id)" :disabled="triCritere!=='manuel'">⬆</button>
      <button @click="descendre(tache.id)" :disabled="triCritere!=='manuel'">⬇</button>
      <button @click="basculerTerminee(tache.id)">✔</button>
      <button @click="supprimerTache(tache.id)">🗑 Supprimer</button>
    </li>
  </ul>
  <p v-else>Aucune tâche à afficher</p>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Réactifs
const taches = reactive([
  { id: 1, libelle: 'Tâche 1', terminee: false, ordre: 1 },
  { id: 2, libelle: 'Tâche 2', terminee: false, ordre: 2 },
  { id: 3, libelle: 'Tâche 3', terminee: false, ordre: 3 },
])
const nouvelleTache = ref('')
const triCritere = ref('manuel')
const prochainId = ref(Math.max(...taches.map(t => t.id)) + 1)

// Clés LocalStorage
const CLE_LOCALSTORAGE_TACHES = 'todolist:taches'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId'

// Initialisation depuis localStorage
const tachesStockees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
if (tachesStockees) {
  const parsed = JSON.parse(tachesStockees)
  taches.splice(0, taches.length, ...parsed)
}
const idStockee = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)
if (idStockee) prochainId.value = parseInt(idStockee)

// Sauvegarder dans le localStorage
function sauvegarder() {
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches))
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, prochainId.value)
}

// Ajouter une tâche
function ajouterTache() {
  if (!nouvelleTache.value) return
  taches.push({
    id: prochainId.value,
    libelle: nouvelleTache.value,
    terminee: false,
    ordre: prochainId.value
  })
  prochainId.value++
  nouvelleTache.value = ''
  appliquerTri()
  sauvegarder()
}

// Basculer terminé / non terminé
function basculerTerminee(id) {
  const t = taches.find(t => t.id === id)
  if (t) t.terminee = !t.terminee
  sauvegarder()
}

// Supprimer une tâche
function supprimerTache(id) {
  const index = taches.findIndex(t => t.id === id)
  if (index !== -1) taches.splice(index, 1)
  sauvegarder()
}

// Monter une tâche (ordre personnalisé)
function monter(id) {
  if (triCritere.value !== 'manuel') return
  const index = taches.findIndex(t => t.id === id)
  if (index > 0) {
    const tmp = taches[index].ordre
    taches[index].ordre = taches[index - 1].ordre
    taches[index - 1].ordre = tmp
    appliquerTri()
    sauvegarder()
  }
}

// Descendre une tâche (ordre personnalisé)
function descendre(id) {
  if (triCritere.value !== 'manuel') return
  const index = taches.findIndex(t => t.id === id)
  if (index < taches.length - 1) {
    const tmp = taches[index].ordre
    taches[index].ordre = taches[index + 1].ordre
    taches[index + 1].ordre = tmp
    appliquerTri()
    sauvegarder()
  }
}

// Appliquer le tri selon critère
function appliquerTri() {
  switch(triCritere.value) {
    case 'manuel':
      taches.sort((a,b) => a.ordre - b.ordre)
      break
    case 'creation':
      taches.sort((a,b) => a.id - b.id)
      break
    case 'libelleAsc':
      taches.sort((a,b) => a.libelle.localeCompare(b.libelle))
      break
    case 'libelleDesc':
      taches.sort((a,b) => b.libelle.localeCompare(a.libelle))
      break
    case 'terminee':
      taches.sort((a,b) => a.terminee - b.terminee || a.libelle.localeCompare(b.libelle))
      break
  }
}
</script>

<style>
li { margin-bottom: 5px; }
.terminee { text-decoration: line-through; color: gray; }
button { margin-left: 5px; }
button:disabled { opacity: 0.5; }
</style>
