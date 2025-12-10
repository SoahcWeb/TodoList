<template>
  <div class="flex h-screen bg-black text-[#E0E6F0] overflow-hidden">

    <!-- SIDEBAR -->
    <aside class="relative flex-col hidden w-64 overflow-hidden shadow-lg md:flex">

      <!-- Image de fond -->
      <div class="absolute inset-0 flex items-start justify-center pointer-events-none">
        <img src="/images/sideadmin.png" class="object-contain object-top w-full h-full" />
      </div>

      <div class="relative z-10 flex flex-col h-full">

        <!-- Titre Dashboard -->
        <div class="flex flex-col items-center p-6 mt-2">
          <h1 class="text-4xl font-bold text-[#52c5ff]">Dashboard</h1>
        </div>

        <!-- Icônes -->
        <div class="absolute flex justify-center w-full space-x-4" style="bottom: 11.5%;">

          <!-- Logout -->
          <div class="flex flex-col items-center cursor-pointer" @click="$emit('logout')">
            <img src="/images/Icons/unlock.png"
              class="w-[105px] h-[105px] rounded-xl border border-[#0F0F2F]/50
                     bg-[#0F0F2F]/80 transition-all duration-300
                     hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
                     hover:scale-105" />
            <span class="text-[#52c5ff] mt-2 text-sm font-bold">Logout</span>
          </div>

          <!-- Retour -->
          <div class="flex flex-col items-center cursor-pointer" @click="$emit('back')">
            <img src="/images/Icons/retour.png"
              class="w-[105px] h-[105px] rounded-xl border border-[#0F0F2F]/50
                     bg-[#0F0F2F]/80 transition-all duration-300
                     hover:border-[#C96BFF] hover:shadow-[0_0_15px_rgba(201,107,255,0.45)]
                     hover:scale-105" />
            <span class="text-[#52c5ff] mt-2 text-sm font-bold">Retour</span>
          </div>
        </div>

      </div>
    </aside>

    <!-- HEADER MOBILE -->
    <header class="flex items-center justify-between p-4 bg-[#0F0F2F] shadow md:hidden">
      <h1 class="text-4xl font-bold text-[#52c5ff]">Dashboard</h1>
      <button @click="mobileOpen = !mobileOpen">
        <svg class="w-6 h-6 text-[#E0E6F0]" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- MENU MOBILE -->
    <transition name="fade">
      <div v-if="mobileOpen" class="px-4 pb-4 space-y-1 bg-[#0F0F2F] border-b border-[#1A1A1A] shadow md:hidden">

        <button class="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md
                       hover:bg-[#1A1A1A]/70 hover:text-[#C96BFF]"
                @click="$emit('back'); mobileOpen = false">
          Retour
        </button>

        <button class="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md text-red-500
                       hover:bg-red-900/20"
                @click="$emit('logout'); mobileOpen = false">
          Logout
        </button>

      </div>
    </transition>

    <!-- CONTENT -->
    <main class="flex-1 p-6 overflow-hidden">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const mobileOpen = ref(false);
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
</style>
