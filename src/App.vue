<script setup>
import AuthenticatedLayout from './Layouts/AuthenticatedLayout.vue'
import TodoList from './components/TodoList.vue'
import TodoForm from './components/TodoForm.vue'
import { reactive, ref, computed, onMounted, watch } from 'vue'

// -----------------------------------------------------
// Données réactives
// -----------------------------------------------------
const taches = reactive([]) // on initialise vide, chargement depuis localStorage
const triCritere = ref('manuel')
const prochainId = ref(1)

// -----------------------------------------------------
// Dropdown custom
// -----------------------------------------------------
const dropdownOptions = [
  { value: 'manuel', label: 'Ordre personnalisé' },
  { value: 'creation', label: 'Ordre de création' },
  { value: 'libelleAsc', label: 'Libellé A→Z' },
  { value: 'libelleDesc', label: 'Libellé Z→A' },
  { value: 'terminee', label: "Non terminées d'abord" }
]

const isDropdownOpen = ref(false)
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}
function selectOption(option) {
  triCritere.value = option.value
  isDropdownOpen.value = false
}

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
const pourcentageTerminees = computed(() => {
  if (taches.length === 0) return 0
  return Math.round((nombreTachesTerminees.value / nombreTotalTaches.value) * 100)
})

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

// -----------------------------------------------------
// Persistance dans le navigateur (localStorage)
// -----------------------------------------------------
const STORAGE_KEY = 'todolist-taches'

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    parsed.forEach(t => taches.push(t))
    if (taches.length > 0) {
      prochainId.value = Math.max(...taches.map(t => t.id)) + 1
    }
  }
  updateDateToMidnight()
})

watch(taches, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="text-2xl font-bold text-[#52c5ff] drop-shadow-md text-center">
        Todo Dashboard
      </h2>
    </template>

    <div class="flex flex-col h-screen p-4 space-y-6">

      <!-- Bloc de présentation -->
      <div class="relative mb-2 p-2 flex items-center justify-between overflow-hidden rounded-xl bg-[#0F0F2F]/80"
           style="border: 4px solid; border-image: linear-gradient(to right, #0F0F2F, #0F4F8F, #0F0F2F) 1; min-height: 80px;">

        <div class="flex items-center justify-center flex-1 px-4">
          <p class="text-[#52c5ff] font-semibold text-center leading-tight text-1xl sm:text-2xl md:text-3xl lg:text-3xl break-words">
            Nethra LifeDesk
          </p>
        </div>

        <img src="/images/Icons/lifedesk.png"
             alt="LifeDesk"
             class="w-[80px] h-[80px] object-cover rounded-xl flex-shrink-0 ml-4" />
      </div>

      <!-- Grille : Formulaire à gauche 40%, Tâches à droite 60% -->
      <div class="flex flex-col flex-1 gap-6 md:flex-row">

        <!-- Carte gauche : Formulaire + barre de tri 40% -->
        <div class="flex-[0.4] p-6 rounded-xl bg-[#0F0F2F]/80 flex flex-col"
             style="border: 4px solid; border-image: linear-gradient(to right, #0F0F2F, #0F4F8F, #0F0F2F) 1;">

          <!-- Titre avec image alignée à gauche -->
          <div class="flex items-center gap-4 mt-6 mb-4">
            <img src="/images/Icons/todolist.png" alt="icone" class="object-contain w-40 h-40" />
            <div class="flex flex-col justify-center w-full">
              <span class="text-4xl font-bold text-[#E0E6F0] leading-tight text-left">Nethra</span>
              <span class="text-4xl font-bold text-[#E0E6F0] leading-tight text-left">Todo-List</span>
            </div>
          </div>

          <div class="w-full h-2 my-4 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <div class="flex flex-col gap-4 my-4">
            <TodoForm @demanderAjoutTache="ajouterTache" class="w-full"/>
          </div>

          <div class="w-full h-2 my-4 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <!-- Dropdown custom -->
          <div class="dropdown-container">
            <p class="dropdown-label">Les flèches ne fonctionnent que si le tri est en "Ordre personnalisé"</p>
            <div class="dropdown" @click="toggleDropdown" :class="{ open: isDropdownOpen }">
              <div class="selected">
                {{ dropdownOptions.find(o => o.value === triCritere)?.label || "Choisir..." }}
              </div>
              <div class="arrow">▲</div>
              <ul v-if="isDropdownOpen" class="options">
                <li
                  v-for="option in dropdownOptions"
                  :key="option.value"
                  @click.stop="selectOption(option)"
                  :class="{ selected: option.value === triCritere }"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>

        </div>

        <!-- Carte droite : Liste des tâches + compteurs 60% -->
        <div class="flex-[0.6] p-6 rounded-xl bg-[#0F0F2F]/80 flex flex-col h-full md:h-[calc(100vh-8rem)]"
             style="border: 4px solid; border-image: linear-gradient(to right, #0F0F2F, #0F4F8F, #0F0F2F) 1;">

          <h3 class="mt-6 mb-4 text-xl font-semibold text-center">
            <span class="text-[#E0E6F0]">Voici vos tâches à réaliser pour</span>
            <span class="text-[#52c5ff]"> le {{ dateDuJour }}</span>
          </h3>

          <div class="w-full h-2 mt-6 mb-6 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <div class="flex flex-col items-center mt-6 mb-6 space-y-2">
            <p class="text-[#E0E6F0] text-lg font-bold">Total des tâches : {{ nombreTotalTaches }}</p>
            <p class="text-[#f8786f] text-lg font-bold">
              Vous avez réalisé {{ pourcentageTerminees }}% de vos tâches du jour
            </p>
          </div>

          <div class="w-full h-2 mt-6 mb-6 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

          <div class="flex flex-col items-center flex-1 min-h-0 overflow-y-auto scroll-right">
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
.scroll-right {
  scrollbar-width: thin;
  scrollbar-color: #52c5ff rgba(15,15,47,0.8);
}

.scroll-right::-webkit-scrollbar {
  width: 8px;
}
.scroll-right::-webkit-scrollbar-track {
  background: rgba(15,15,47,0.8);
  border-radius: 8px;
}
.scroll-right::-webkit-scrollbar-thumb {
  background-color: #52c5ff;
  border-radius: 8px;
  border: 2px solid rgba(15,15,47,0.8);
}

/* Dropdown custom */
.dropdown-container {
  text-align: center;
  margin-top: 12px;
}

.dropdown-label {
  color: #E0E6F0;
  margin-bottom: 12px;
  font-size: 14px;
}

.dropdown {
  width: 100%;
  background-color: #011c2f;
  border-radius: 1rem;
  border: 1px solid rgba(15,15,47,0.5);
  padding: 10px 14px;
  position: relative;
  cursor: pointer;
  user-select: none;
  color: #E0E6F0;
  transition: all 0.3s;
}

.dropdown:hover {
  border-color: #C96BFF;
  box-shadow: 0 0 15px rgba(201,107,255,0.45);
}

.dropdown.open {
  border-color: #C96BFF;
}

.selected {
  color: #C96BFF;
}

.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #C96BFF;
}

.options {
  background-color: #011c2f;
  border: 2px solid #C96BFF;
  border-radius: 6px;
  margin-bottom: 8px;
  list-style: none;
  padding: 0;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 100%;
  z-index: 20;
}

.options li {
  padding: 10px;
  color: #52c5ff;
  transition: 0.15s ease;
}

.options li:hover {
  background-color: #C96BFF;
  color: #E0E6F0;
}

.options li.selected {
  background-color: #C96BFF;
  color: #E0E6F0;
}

/* Champ d'ajout de tâche : hover et focus */
input[type="text"] {
  border: 1px solid rgba(15,15,47,0.5);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #011c2f;
  color: #E0E6F0;
  transition: all 0.3s;
}

input[type="text"]:hover,
input[type="text"]:focus {
  border-color: #C96BFF;
  box-shadow: 0 0 15px rgba(201, 107, 255, 0.45);
  transform: scale(1.05);
  outline: none;
}
</style>
