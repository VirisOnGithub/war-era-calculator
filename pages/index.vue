<script setup>
import { useDamageCalc } from '~/composables/useDamageCalc'
import StatTable from '~/components/StatTable.vue'
import ResultCard from '~/components/ResultCard.vue'

const firstState = reactive( {
  base:      { dmg: 100, prec: 0.5, crit: 0.1, critDmg: 0.5, arm: 0, esquive: 0, pv: 50 },
  bonus:     { dmg: 0,   prec: 0,   crit: 0,   critDmg: 0,   arm: 0, esquive: 0  },
  skillCost: { dmg_pts: 0, prec_pts: 0, crit_pts: 0, critDmg_pts: 0, arm: 0, esquive_pts: 0, pv_pts: 0 }
})

const { state, combined, avgDmgPerHit, hitsPer10h, totalDmg10h } = useDamageCalc(firstState)


function onInputUpdate(patch) {
  Object.assign(state, patch)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Calculateur de dégâts</h1>

    <!-- Base Stats (readonly) -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Base Stats</h2>
    <StatTable
        :stats="state.base"
        readonly
    />

    <!-- Bonus Stats -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Bonus Stats</h2>
    <StatTable
        :stats="state.bonus"
        @update="val => onInputUpdate({ bonus: val })"
    />

    <!-- Skill Costs -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Skill Costs</h2>
    <StatTable
        :stats="state.skillCost"
        @update="val => onInputUpdate({ skillCost: val })"
    />

    <!-- Combined Totals (readonly) -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Statistiques Totales</h2>
    <StatTable
        :stats="combined"
        readonly
    />

    <!-- Résultats -->
    <ResultCard
        :avg-dmg="avgDmgPerHit"
        :hits="hitsPer10h"
        :total-dmg="totalDmg10h"
    />
  </div>
</template>