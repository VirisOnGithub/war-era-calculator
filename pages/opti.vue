<script setup lang="ts">
import { useDamageCalc } from '~/composables/useDamageCalc'
import {array} from "zod";

type SkillPoints = { dmg_pts: number, prec_pts: number, crit_pts: number, critDmg_pts: number, arm: number, esquive_pts: number, pv_pts: number };

let totalPoints = 0;
let bestSkillPoints = {dmg_pts: 0, prec_pts: 0, crit_pts: 0, critDmg_pts: 0, arm: 0, esquive_pts: 0, pv_pts: 0}
let bestTotalDmg10h = 0

function recursiveGen(result_temp: number[], size:number) : number[]{
  if (size == 0) {
    return [];
  }

  const result = result_temp;
  let i = 0, j = 0;
  while (j <= size) {
    result.push(recursiveGen([j], size-1))
    i++
    j += i
  }

  let totalCost = 0
  for (let i = 0; i < result.length; i++) {
    totalCost += result[i]
  }
  if (totalCost > size) {
    return []
  }
  const skillPointsToTest = {dmg_pts: result[0], prec_pts: result[1], crit_pts: result[2], critDmg_pts: result[5], arm: result[3], esquive_pts: result[6], pv_pts: result[4]}
  const { totalDmg10h } = useDamageCalc({
    base: {dmg: 100, prec: 0.5, crit: 0.1, critDmg: 0.5, arm: 0, esquive: 0, pv: 50},
    bonus: {dmg: 0, prec: 0, crit: 0, critDmg: 0, arm: 0, esquive: 0},
    skillCost: skillPointsToTest
  })
  if (totalDmg10h.value > bestTotalDmg10h) {
    bestTotalDmg10h = totalDmg10h.value
    bestSkillPoints = skillPointsToTest
  }

  return [];
}

function onInput(newValue) {
  totalPoints = parseInt((newValue.target as HTMLInputElement).value)
  recursiveGen([], totalPoints)
}
</script>

<template>
  <label for="totSkillPts">Total skill points</label>
  <input
      id="totSkillPts"
      name="totSkillPts"
      type="number"
      required
      @input="onInput($event)"
  >
  <div
      v-for="(key, value) in bestSkillPoints"
      :key="key"
  >
    <p>{{key}} : {{value}}</p>
  </div>
</template>