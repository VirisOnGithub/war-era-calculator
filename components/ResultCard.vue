<template>
  <div class="mt-8 p-4 bg-white rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-2">Résultats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-sm text-gray-500">Dégâts par attaque</p>
        <p class="text-xl font-bold">{{ formatted(avgDmg) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Attaques en 10h</p>
        <p class="text-xl font-bold">{{ formatted(hits) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Dégâts en 10h</p>
        <p class="text-xl font-bold">{{ formatted(totalDmg) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{ avgDmg: number; hits: number; totalDmg: number }>()
const { avgDmg, hits, totalDmg } = toRefs(props)

// Formatteur pour 2 décimales
const formatted = (val: number) => val.toFixed(2)
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>