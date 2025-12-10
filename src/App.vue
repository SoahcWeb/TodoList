<script setup>
import AuthenticatedLayout from './Layouts/AuthenticatedLayout.vue'
import TodoList from './components/TodoList.vue'
import TodoForm from './components/TodoForm.vue'
import { reactive, ref, computed, onMounted } from 'vue'

// -----------------------------------------------------
// Données réactives
// -----------------------------------------------------
const taches = reactive([
  { id: 1, libelle: 'Exemple 1', terminee: false, ordre: 1 },
  { id: 2, libelle: 'Exemple 2', terminee: true, ordre: 2 },
])
const triCritere = ref('manuel')
const prochainId = ref(3)

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
  if (triCritere.value !== 'manuel') return
  const index = tachesTriees.value.findIndex(t => t.id === id)
  if (index <= 0) return
  const courant = tachesTriees.value[index]
  const auDessus = tachesTriees.value[index - 1]
  const tmp = courant.ordre
  courant.ordre = auDessus.ordre
  auDessus.ordre = tmp
}

function descendre(id) {
  if (triCritere.value !== 'manuel') return
  const index = tachesTriees.value.findIndex(t => t.id === id)
  if (index >= tachesTriees.value.length - 1) return
  const courant = tachesTriees.value[index]
  const auDessous = tachesTriees.value[index + 1]
  const tmp = courant.ordre
  courant.ordre = auDessous.ordre
  auDessous.ordre = tmp
}

// -----------------------------------------------------
// Tri et filtres
// -----------------------------------------------------
const tachesTriees = computed(() => {
  let copie = [...taches]
  switch (triCritere.value) {
    case 'creation': return copie.sort((a,b)=>a.id-b.id)
    case 'libelleAsc': return copie.sort((a,b)=>a.libelle.localeCompare(b.libelle))
    case 'libelleDesc': return copie.sort((a,b)=>b.libelle.localeCompare(a.libelle))
    case 'terminee': return copie.sort((a,b)=>Number(a.terminee)-Number(b.terminee))
    default: return copie.sort((a,b)=>a.ordre-b.ordre) // manuel
  }
})

const aDesTaches = computed(() => taches.length > 0)
const nombreTotalTaches = computed(() => taches.length)
const nombreTachesTerminees = computed(() => taches.filter(t=>t.terminee).length)

// -----------------------------------------------------
// Date du jour
// -----------------------------------------------------
const dateDuJour = ref(formatDate(new Date()))

function formatDate(date) {
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
}

function updateDateToMidnight() {
  const now = new Date()
  const demain = new Date()
  demain.setHours(24, 0, 0, 0)
  const msJusquaMinuit = demain - now

  setTimeout(() => {
    dateDuJour.value = formatDate(new Date())
    updateDateToMidnight()
  }, msJusquaMinuit)
}

onMounted(() => {
  updateDateToMidnight()
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="text-2xl font-bold text-[#52c5ff] drop-shadow-md text-center">
        Todo Dashboard
      </h2>
    </template>

    <div class="flex flex-col h-screen dashboard-scroll p-4 space-y-6">

      <!-- Bloc de présentation -->
      <div class="relative mb-2 p-4 flex items-center overflow-hidden rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50">
        <img src="/images/Icons/dashboard.png" alt="Dashboard"
             class="w-16 h-16 object-contain mr-4" />
        <p class="text-[#E0E6F0] text-lg sm:text-xl md:text-2xl font-semibold">
          Bienvenue sur votre tableau de tâches, gardez le contrôle et restez organisé !
        </p>
      </div>

      <!-- Grille : Formulaire à gauche 40%, Tâches à droite 60% -->
      <div class="flex flex-col gap-6 md:flex-row">

        <!-- Carte gauche : Formulaire + barre de tri 40% -->
        <div class="flex-[0.4] p-6 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md flex flex-col">

          <!-- Formulaire d'ajout -->
          <h3 class="text-xl font-semibold text-[#52c5ff] mt-6 mb-4 text-center">Ajouter une tâche</h3>
          <TodoForm @demanderAjoutTache="ajouterTache" />

          <!-- Menu de tri -->
          <div class="mt-4">
            <select v-model="triCritere" class="w-full p-2 rounded bg-[#1a1a1a] text-[#E0E6F0] border border-[#0F0F2F]">
              <option value="manuel">Ordre personnalisé</option>
              <option value="creation">Ordre de création</option>
              <option value="libelleAsc">Libellé A→Z</option>
              <option value="libelleDesc">Libellé Z→A</option>
              <option value="terminee">Non terminées d'abord</option>
            </select>
            <p class="text-sm text-[#52c5ff] mt-1">
              Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé"
            </p>
          </div>

        </div>

        <!-- Carte droite : Liste des tâches + compteurs 60% -->
        <div class="flex-[0.6] p-6 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md flex flex-col">

          <!-- Titre -->
          <h3 class="text-xl font-semibold text-[#52c5ff] mt-6 mb-4 text-center">
            Voici vos tâches à réaliser pour le <span class="font-bold text-[#E0E6F0]">{{ dateDuJour }}</span>
          </h3>

          <!-- Séparateur 1 -->
          <div class="w-full h-2 mt-6 mb-6 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <!-- Compteurs centrés avec même marge que le titre -->
          <div class="flex flex-col items-center space-y-2 mt-6 mb-6">
            <p class="text-[#E0E6F0] text-lg font-bold">Total des tâches : {{ nombreTotalTaches }}</p>
            <p class="text-[#f8786f] text-lg font-bold">Tâches terminées : {{ nombreTachesTerminees }}</p>
          </div>

          <!-- Séparateur 2 -->
          <div class="w-full h-2 mt-6 mb-6 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <!-- Liste des tâches avec espacement homogène -->
          <div class="flex-1 mt-6 overflow-y-auto">
            <TodoList
              v-if="aDesTaches"
              :taches="tachesTriees"
              @demanderSuppression="supprimerTache"
              @demanderChangementStatut="basculerTerminee"
              @demanderMonter="monter"
              @demanderDescendre="descendre"
            />
            <p v-else class="text-[#E0E6F0] text-center">Aucune tâche à afficher</p>
          </div>

        </div>

      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
.dashboard-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #52c5ff rgba(15,15,47,0.8);
  padding-right: 12px;
  margin-right: -6px;
}
.dashboard-scroll::-webkit-scrollbar {
  width: 8px;
}
.dashboard-scroll::-webkit-scrollbar-track {
  background: rgba(15,15,47,0.8);
  border-radius: 8px;
}
.dashboard-scroll::-webkit-scrollbar-thumb {
  background-color: #52c5ff;
  border-radius: 8px;
  border: 2px solid rgba(15,15,47,0.8);
}
</style>
