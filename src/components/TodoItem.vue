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
  <li class="todo-block flex items-center justify-between p-3 rounded-xl border border-[#0F0F2F]/50 mb-2">
    <span 
      :class="{'terminee': props.terminee, 'encours': !props.terminee}" 
      class="task-text"
    >
      {{ props.libelle }}
    </span>

    <div class="flex gap-1">
      <!-- Bouton valider -->
      <button @click="demanderChangementStatut" 
        class="btn">
        <img 
          :src="props.terminee ? '/images/Icons/valideron.png' : '/images/Icons/valider.png'" 
          alt="Valider" 
          title="Valider" 
          class="icon"
        />
      </button>

      <!-- Bouton poubelle -->
      <button @click="demanderSuppression" class="btn">
        <img src="/images/Icons/poubelle.png" alt="Supprimer" title="Supprimer" class="icon" />
      </button>

      <!-- Bouton monter -->
      <button v-if="peutMonterDescendre" @click="demanderMonter" :disabled="estPremiere" class="btn" >
        <img :src="estPremiere ? '/images/Icons/upgris.png' : '/images/Icons/up.png'" alt="Monter" title="Monter" class="icon"/>
      </button>

      <!-- Bouton descendre -->
      <button v-if="peutMonterDescendre" @click="demanderDescendre" :disabled="estDerniere" class="btn" >
        <img :src="estDerniere ? '/images/Icons/downgris.png' : '/images/Icons/down.png'" alt="Descendre" title="Descendre" class="icon"/>
      </button>
    </div>
  </li>
</template>

<style scoped>
.todo-block {
  width: 100%;
  max-width: 600px;
  min-width: 400px;
  background-color: #011c2f; /* fond du bloc complet */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* Texte des tâches */
.task-text {
  flex: 1;
  word-break: break-word; /* texte long passe à la ligne */
  margin-right: 8px;
}

/* Couleurs selon statut */
.encours {
  color: #E0E6F0;
}

.terminee {
  color: #f8786f;
  text-decoration: line-through;
}

/* Boutons */
.btn {
  width: 52px;
  height: 52px;
  background-color: #0F0F2F;
  border: 1px solid #0F0F2F;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: all 0.3s;
}

.btn:hover {
  border-color: #C96BFF;
  box-shadow: 0 0 15px rgba(201, 107, 255, 0.45);
  transform: scale(1.05);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 80%; /* 4/5 de la taille du bouton */
  height: 80%;
  display: block;
}
</style>
