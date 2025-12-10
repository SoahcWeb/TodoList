<script setup>
import { reactive } from "vue";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import TodoList from "./TodoList.vue";
import TodoForm from "./TodoForm.vue";

const props = defineProps({
    auth: { type: Object, default: () => ({ user: null }) },
    taches: { type: Array, required: true }
});

const tasks = reactive([...props.taches]);
</script>

<template>
<AuthenticatedLayout
    title="Mes Tâches"
    :auth="props.auth"
>
    <template #header>
        <h2 class="text-2xl font-bold text-[#52c5ff] drop-shadow-md text-center">
            Gestion de mes tâches
        </h2>
    </template>

    <div class="flex flex-col h-screen">
        <div class="flex-1 dashboard-scroll">

            <!-- ███ Bloc de Présentation type Portfolio ███ -->
            <div class="relative mb-2 p-2 flex items-center overflow-hidden rounded-xl bg-[#0F0F2F]/80"
                 style="border: 4px solid; border-image: linear-gradient(to right, #0F0F2F, #0F4F8F, #0F0F2F) 1;">
                 
                <img src="/images/Icons/dashboard.png"
                     alt="Dashboard"
                     class="w-[80px] h-[80px] object-cover rounded-xl flex-shrink-0 mr-4" />

                <div class="absolute inset-0 flex items-center justify-center px-4">
                    <p class="text-[#E0E6F0] font-semibold text-center leading-tight text-1xl sm:text-2xl md:text-3xl break-words">
                        Vos tâches, <span class="text-[#52c5ff]">{{ props.auth.user?.name }}</span>, d’un seul coup d’œil.
                    </p>
                </div>
            </div>

            <!-- ███ Cartes : 40% Aperçu / 60% Formulaire ███ -->
            <div class="flex flex-col gap-6 px-3 mt-6 mb-6 md:flex-row">

                <!-- ███ Carte gauche : Aperçu des tâches (40%) ███ -->
                <div class="flex-[0.4] group relative block p-4 rounded-xl shadow-md bg-[#0F0F2F]/80 border border-[#0F0F2F]/50">

                    <!-- En-tête -->
                    <div class="relative flex items-center mb-2" style="min-height: 160px; padding-left: 160px;">
                        <img src="/images/Icons/infoperso.png"
                             alt="Tâches"
                             class="absolute object-contain h-35 w-35"
                             style="top:0; left:0;" />
                        <h3 class="text-xl font-semibold text-[#52c5ff]">
                            Mes tâches
                        </h3>
                    </div>

                    <!-- Séparateur -->
                    <div class="w-full h-2 my-4 bg-gradient-to-r from-[#0F0F2F] via-[#0F4F8F] to-[#0F0F2F]"></div>

                    <TodoList :taches="tasks" />

                </div>

                <!-- ███ Carte droite : Formulaire Ajout (60%) ███ -->
                <div class="flex-[0.6]">
                    <TodoForm @taskAdded="tasks.push($event)" />
                </div>

            </div>

        </div>
    </div>
</AuthenticatedLayout>
</template>

<style scoped>
.dashboard-scroll {
    flex: 1;
    overflow-y: scroll;
    padding-right: 12px;
    margin-right: -6px;
}

.dashboard-scroll::-webkit-scrollbar {
    width: 8px;
}

.dashboard-scroll::-webkit-scrollbar-track {
    background: rgba(15, 15, 47, 0.8);
    border-radius: 8px;
}

.dashboard-scroll::-webkit-scrollbar-thumb {
    background-color: #52c5ff;
    border-radius: 8px;
    border: 2px solid rgba(15, 15, 47, 0.8);
}

.dashboard-scroll {
    scrollbar-width: thin;
    scrollbar-color: #52c5ff rgba(15, 15, 47, 0.8);
}
</style>
