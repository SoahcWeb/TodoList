<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  libelle: { type: String, required: true },
  terminee: { type: Boolean, required: true },
  peutMonterDescendre: { type: Boolean, required: true },
  estPremiere: { type: Boolean, required: true },
  estDerniere: { type: Boolean, required: true }
})

const emit = defineEmits([
  'demanderSuppression',
  'demanderChangementStatut',
  'demanderMonter',
  'demanderDescendre'
])

function demanderSuppression() { emit('demanderSuppression', props.id) }
function demanderChangementStatut() { emit('demanderChangementStatut', props.id) }
function demanderMonter() { emit('demanderMonter', props.id) }
function demanderDescendre() { emit('demanderDescendre', props.id) }
</script>

<template>
  <li class="flex items-center gap-1 p-2 rounded-xl bg-[#011c2f]">
    <span :class="props.terminee ? 'terminee' : 'aFaire'">{{ props.libelle }}</span>

    <div class="flex ml-auto"> <!-- Groupe de boutons collés alignés à droite -->
      <!-- Bouton valider -->
      <button @click="demanderChangementStatut"
        class="w-[52px] h-[52px] rounded-xl border border-[#0F0F2F]/50
               bg-[#0F0F2F]/80 transition-all duration-300
               hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
               hover:scale-105 flex items-center justify-center m-0 p-0"
      >
        <img 
          :src="props.terminee ? '/images/Icons/valideron.png' : '/images/Icons/valider.png'" 
          alt="Valider" 
          title="Valider"
          class="w-4/5 h-4/5"
        />
      </button>

      <!-- Bouton poubelle -->
      <button @click="demanderSuppression"
        class="w-[52px] h-[52px] rounded-xl border border-[#0F0F2F]/50
               bg-[#0F0F2F]/80 transition-all duration-300
               hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
               hover:scale-105 flex items-center justify-center m-0 p-0"
      >
        <img src="/images/Icons/poubelle.png" alt="Supprimer" title="Supprimer" class="w-4/5 h-4/5" />
      </button>

      <!-- Bouton monter -->
      <button v-if="peutMonterDescendre" @click="demanderMonter" :disabled="estPremiere"
        class="w-[52px] h-[52px] rounded-xl border border-[#0F0F2F]/50
               bg-[#0F0F2F]/80 transition-all duration-300
               hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
               hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center m-0 p-0"
      >
        <img 
          :src="estPremiere ? '/images/Icons/upgris.png' : '/images/Icons/up.png'" 
          alt="Monter" 
          title="Monter"
          class="w-4/5 h-4/5"
        />
      </button>

      <!-- Bouton descendre -->
      <button v-if="peutMonterDescendre" @click="demanderDescendre" :disabled="estDerniere"
        class="w-[52px] h-[52px] rounded-xl border border-[#0F0F2F]/50
               bg-[#0F0F2F]/80 transition-all duration-300
               hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
               hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center m-0 p-0"
      >
        <img 
          :src="estDerniere ? '/images/Icons/downgris.png' : '/images/Icons/down.png'" 
          alt="Descendre" 
          title="Descendre"
          class="w-4/5 h-4/5"
        />
      </button>
    </div>

  </li>
</template>

<style scoped>
.aFaire { color: #52c5ff; }
.terminee { color: #f8786f; text-decoration: line-through; }
li { display: flex; align-items: center; gap: 0.25rem; } /* texte et groupe de boutons rapprochés */
button img { display: block; }
</style>
