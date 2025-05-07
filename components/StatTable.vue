<template>
  <div class="grid grid-cols-2 gap-4">
    <div
        v-for="(value, key) in stats"
        :key="key"
        class="flex flex-col"
    >
      <label
          :for="key"
          class="font-medium text-sm mb-1 capitalize"
      >
        {{ formatLabel(key) }}
      </label>

      <input
          :id="key"
          :type="percentKeys.includes(key) ? 'text' : 'number'"
          :value="displayValue(key, localStats[key])"
          class="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onInput($event, key)"
          :disabled="readonly"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats { key: string, value: number | boolean }

const props = defineProps<{ stats: Stats; readonly?: boolean }>()
const emit = defineEmits<{ (e: 'update', value: Stats): void }>()

// Clés à afficher en pourcentage
const percentKeys: string[] = ['prec', 'crit', 'critDmg', 'arm', 'esquive']

// Copie locale des stats
const localStats: any = reactive({ ...props.stats })

// Synchronisation si props changent
watch(
    () => props.stats,
    (newStats) => Object.assign(localStats, newStats)
)

// Met à jour la valeur selon la saisie
function onInput(event: any, key: string) {
  let raw = (event.target as HTMLInputElement).value
  let parsed: number | boolean
  if (percentKeys.includes(key)) {
    // retirer le % si présent
    raw = raw.replace('%', '')
    parsed = parseFloat(raw) / 100
  } else {
    parsed = parseFloat(raw)
  }
  localStats[key] = isNaN(parsed as number) ? 0 : parsed
  emit('update', { ...localStats })
}

// Affiche valeur brute ou formatée
function displayValue(key: string, val: number | boolean): string | number {
  if (typeof val === 'number' && percentKeys.includes(key)) {
    return `${(val * 100).toFixed(0)}%`
  }
  return val as number
}

function formatLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase()
}
</script>

<style scoped>
/* Styles éventuels */
</style>