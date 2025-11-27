<template>
  <h2>Exo Synthèse</h2>

  <!-- Formulaire d'ajout -->
  <input v-model="nouvelleTache" placeholder="Nouvelle tâche">
  <button @click="ajouterTache" :disabled="!nouvelleTache">Ajouter</button>

  <!-- Menu de tri -->
  <select v-model="triCritere">
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
    <li v-for="(tache, index) in taches" :key="tache.id">
      <span :class="{ terminee: tache.terminee }">{{ tache.libelle }}</span>

      <!-- Boutons réorganisation -->
      <button @click="monter(tache.id)"
              :disabled="triCritere !== 'manuel' || index === 0">
        ⬆
      </button>

      <button @click="descendre(tache.id)"
              :disabled="triCritere !== 'manuel' || index === taches.length - 1">
        ⬇
      </button>

      <!-- Terminer / Supprimer -->
      <button @click="basculerTerminee(tache.id)">✔</button>
      <button @click="supprimerTache(tache.id)">🗑 Supprimer</button>
    </li>
  </ul>
  <p v-else>Aucune tâche à afficher</p>

  <!-- --- Test rapide Jour 6 --- -->
  <h3>Test rapide Jour 6</h3>
  <p>Déplacer avec ⬆ et ⬇, basculer ✔ ou supprimer 🗑 :</p>
  <ul>
    <li v-for="(t, idx) in taches" :key="'test-' + t.id">
      <span :style="{ textDecoration: t.terminee ? 'line-through' : 'none' }">
        {{ t.libelle }}
      </span>

      <button @click="monter(t.id)" :disabled="idx === 0">⬆</button>
      <button @click="descendre(t.id)" :disabled="idx === taches.length - 1">⬇</button>
      <button @click="basculerTerminee(t.id)">✔</button>
      <button @click="supprimerTache(t.id)">🗑</button>
    </li>
  </ul>
</template>

<script setup>
import { ref, reactive } from 'vue'

// -----------------------------------------------------
// Données réactives
// -----------------------------------------------------
const taches = reactive([])

const nouvelleTache = ref('')
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
  const parsed = JSON.parse(tachesStockees)
  taches.push(...parsed)
}

const idStockee = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)
if (idStockee) {
  prochainId.value = parseInt(idStockee)
} else {
  // Définition auto si pas encore stocké
  prochainId.value = taches.length > 0
    ? Math.max(...taches.map(t => t.id)) + 1
    : 1
}

// -----------------------------------------------------
// Sauvegarde
// -----------------------------------------------------
function sauvegarder() {
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches))
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, prochainId.value)
}

// -----------------------------------------------------
// Ajouter une tâche
// -----------------------------------------------------
function ajouterTache() {
  if (!nouvelleTache.value.trim()) return

  taches.push({
    id: prochainId.value,
    libelle: nouvelleTache.value.trim(),
    terminee: false,
    ordre: prochainId.value,
  })

  prochainId.value++
  nouvelleTache.value = ''

  // Tri visuel seulement
  appliquerTri()
  sauvegarder()
}

// -----------------------------------------------------
// Basculer terminé/non terminé
// -----------------------------------------------------
function basculerTerminee(id) {
  const t = taches.find(t => t.id === id)
  if (t) t.terminee = !t.terminee
  sauvegarder()
}

// -----------------------------------------------------
// Supprimer une tâche
// -----------------------------------------------------
function supprimerTache(id) {
  const index = taches.findIndex(t => t.id === id)
  if (index !== -1) taches.splice(index, 1)
  sauvegarder()
}

// -----------------------------------------------------
// Monter une tâche (tri manuel uniquement)
// -----------------------------------------------------
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

// -----------------------------------------------------
// Descendre une tâche (tri manuel uniquement)
// -----------------------------------------------------
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

// -----------------------------------------------------
// TRIS — Jour 7
// -----------------------------------------------------
function appliquerTri() {
  switch (triCritere.value) {
    case 'manuel':
      taches.sort((a, b) => a.ordre - b.ordre)
      break

    case 'creation':
      taches.sort((a, b) => a.id - b.id)
      break

    case 'libelleAsc':
      taches.sort((a, b) => a.libelle.localeCompare(b.libelle))
      break

    case 'libelleDesc':
      taches.sort((a, b) => b.libelle.localeCompare(a.libelle))
      break

    case 'terminee':
      taches.sort((a, b) =>
        (a.terminee - b.terminee) ||
        a.libelle.localeCompare(b.libelle)
      )
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
