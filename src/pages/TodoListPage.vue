<script setup>
import { reactive } from 'vue';
import TodoList from './TodoList.vue';
import TodoForm from './TodoForm.vue';

const todos = reactive([
  { id: 1, libelle: 'Apprendre Vue.js', terminee: false },
  { id: 2, libelle: 'Créer une app Todo', terminee: true },
]);

const ajouterTache = (texte) => {
  const nouvelId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  todos.push({ id: nouvelId, libelle: texte, terminee: false });
};

const supprimerTache = (id) => {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) todos.splice(index, 1);
};

const changerStatut = (id) => {
  const t = todos.find(t => t.id === id);
  if (t) t.terminee = !t.terminee;
};
</script>

<template>
<div class="flex flex-col h-screen bg-[#0F0F2F] text-[#E0E6F0]">

  <!-- Header -->
  <div class="px-6 py-4">
    <h2 class="text-2xl font-bold text-[#52c5ff] drop-shadow-md text-center">
      Ma TodoList
    </h2>
  </div>

  <!-- Contenu scrollable -->
  <div class="flex-1 dashboard-scroll px-6">

    <!-- Carte TodoList -->
    <div class="relative mb-4 p-4 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md">
      <div class="mb-4 flex items-center">
        <img src="/images/Icons/todolist.png" alt="Todo" class="w-12 h-12 mr-4"/>
        <h3 class="text-xl font-semibold text-[#52c5ff]">Vos tâches</h3>
      </div>

      <div class="w-full h-2 my-4 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

      <TodoList
        :taches="todos"
        class="space-y-2"
        @demanderSuppression="supprimerTache"
        @demanderChangementStatut="changerStatut"
      />
    </div>

    <!-- Carte Formulaire -->
    <div class="relative mb-4 p-4 rounded-xl bg-[#0F0F2F]/80 border border-[#0F0F2F]/50 shadow-md">
      <div class="mb-4 flex items-center">
        <img src="/images/Icons/add.png" alt="Ajouter" class="w-12 h-12 mr-4"/>
        <h3 class="text-xl font-semibold text-[#52c5ff]">Ajouter une tâche</h3>
      </div>

      <TodoForm @demanderAjoutTache="ajouterTache" />
    </div>

  </div>
</div>
</template>

<style scoped>
.dashboard-scroll {
  flex: 1;
  overflow-y: scroll;
  padding-right: 12px;
  margin-right: -6px;
}
.dashboard-scroll::-webkit-scrollbar { width: 8px; }
.dashboard-scroll::-webkit-scrollbar-track { background: rgba(15,15,47,0.8); border-radius: 8px; }
.dashboard-scroll::-webkit-scrollbar-thumb { background-color: #52c5ff; border-radius: 8px; border: 2px solid rgba(15,15,47,0.8); }
.dashboard-scroll { scrollbar-width: thin; scrollbar-color: #52c5ff rgba(15,15,47,0.8); }
</style>
