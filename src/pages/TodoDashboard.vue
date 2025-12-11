<script setup>
import { ref, reactive, computed } from 'vue'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'

// -----------------------------------------------------
// Données réactives
// -----------------------------------------------------
const taches = reactive([])
const triCritere = ref('manuel')
const prochainId = ref(1)

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
// Comptages et affichage
// -----------------------------------------------------
const nombreTotalTaches = computed(() => taches.length)
const nombreTachesTerminees = computed(() => taches.filter(t => t.terminee).length)
const aDesTaches = computed(() => taches.length > 0)

const tachesTriees = computed(() => {
  let arr = [...taches]
  switch (triCritere.value) {
    case 'creation': return arr.sort((a,b) => a.id - b.id)
    case 'libelleAsc': return arr.sort((a,b) => a.libelle.localeCompare(b.libelle))
    case 'libelleDesc': return arr.sort((a,b) => b.libelle.localeCompare(a.libelle))
    case 'terminee': return arr.sort((a,b) => a.terminee - b.terminee)
    case 'manuel':
    default: return arr.sort((a,b) => a.ordre - b.ordre)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen p-4 space-y-6">

    <!-- Bloc Présentation FIXE -->
    <div
      class="relative mb-2 p-6 flex items-center overflow-hidden rounded-xl bg-[#0F0F2F]/80"
      style="border: 4px solid; border-image: linear-gradient(to right, #0F0F2F, #0F4F8F, #0F0F2F) 1;"
    >
      <img
        src="/images/icons/dashboard.png"
        alt="Dashboard"
        class="w-[80px] h-[80px] object-cover rounded-xl flex-shrink-0 mr-4"
      />
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <p class="text-[#E0E6F0] font-semibold text-center leading-tight text-1xl sm:text-2xl md:text-3xl lg:text-3xl break-words">
          Bienvenue sur votre tableau de tâches,
          <span class="text-[#52c5ff]">Utilisateur</span> !
          Gardez le contrôle et restez organisé.
        </p>
      </div>
    </div>

    <!-- Bloc principal : Formulaire à gauche 60%, Tâches à droite 40% -->
    <div class="flex-1 flex gap-6 overflow-hidden">

      <!-- Carte Formulaire (60%) -->
      <div class="flex-[0.6] flex flex-col p-4 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md">
        <h3 class="text-xl font-semibold text-[#52c5ff] mb-4 text-center">Ajouter une tâche</h3>
        <TodoForm @demanderAjoutTache="ajouterTache" />
        <div class="mt-6">
          <label class="text-[#52c5ff] font-semibold">Filtrer / Trier :</label>
          <select v-model="triCritere" class="mt-2 w-full p-2 rounded bg-[#1A1A1A] text-[#E0E6F0]">
            <option value="manuel">Ordre personnalisé</option>
            <option value="creation">Ordre de création</option>
            <option value="libelleAsc">A→Z</option>
            <option value="libelleDesc">Z→A</option>
            <option value="terminee">Non terminées d'abord</option>
          </select>
          <p class="mt-2 text-sm text-[#E0E6F0]">Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est "Ordre personnalisé"</p>
        </div>
      </div>

      <!-- Carte Tâches (40%) -->
      <div class="flex-[0.4] flex flex-col p-4 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md min-h-0">
        <h3 class="text-xl font-semibold text-[#52c5ff] mb-4 text-center">Vos tâches</h3>

        <p class="text-[#E0E6F0]">Total des tâches : {{ nombreTotalTaches }}</p>
        <p class="text-[#E0E6F0]">Tâches terminées : {{ nombreTachesTerminees }}</p>

        <!-- Scroll uniquement sur le contenu de la liste -->
        <div class="flex-1 overflow-y-auto scrollbar mt-4 min-h-0">
          <TodoList
            v-if="aDesTaches"
            :taches="tachesTriees"
            :peutMonterDescendre="triCritere === 'manuel'"
            @demanderSuppression="supprimerTache"
            @demanderChangementStatut="basculerTerminee"
            @demanderMonter="monter"
            @demanderDescendre="descendre"
          />
          <p v-else class="text-[#E0E6F0] mt-2">Aucune tâche à afficher</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Scroll uniquement sur le contenu des cartes */
.scrollbar {
  padding-right: 12px;
  margin-right: -6px;
  scrollbar-width: thin;
  scrollbar-color: #52c5ff rgba(15,15,47,0.8);
}

.scrollbar::-webkit-scrollbar {
  width: 8px;
}

.scrollbar::-webkit-scrollbar-track {
  background: rgba(15,15,47,0.8);
  border-radius: 8px;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #52c5ff;
  border-radius: 8px;
  border: 2px solid rgba(15,15,47,0.8);
}
</style>
