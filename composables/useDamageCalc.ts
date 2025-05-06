import { reactive, computed } from 'vue'

export type State = {
    base:      { dmg: number, prec: number, crit: number, critDmg: number, arm: number, esquive: number, pv: number },
    bonus:     { dmg: number, prec: number, crit: number, critDmg: number, arm: number, esquive: number },
    skillCost: { "dmg_pts": number, "prec_pts": number, "crit_pts": number, "critDmg_pts": number, "arm": number, "esquive_pts": number, "pv_pts": number }
};

// Types pour base et skill entries
type BaseStats = {
    dmg: number
    prec: number
    crit: number
    critDmg: number
    arm: number
    esquive: number
    pv: number
}

type SkillEntry = {
    pts: number
    dmg: number
    prec: number
    crit: number
    critDmg: number
    arm: number
    esquive: number
    pv: number
    faim: number
}

// Tableau de conversion points → bonus
const skillTable: SkillEntry[] = [
    { pts: 0,  dmg: 0,   prec: 0,    crit: 0,    critDmg: 0,    arm: 0,    esquive: 0,    pv: 0,   faim: 0 },
    { pts: 1,  dmg: 20,  prec: 0.05, crit: 0.05, critDmg: 0.10, arm: 0.04, esquive: 0.04, pv: 10,  faim: 1 },
    { pts: 3,  dmg: 40,  prec: 0.10, crit: 0.10, critDmg: 0.20, arm: 0.08, esquive: 0.08, pv: 20,  faim: 2 },
    { pts: 6,  dmg: 60,  prec: 0.15, crit: 0.15, critDmg: 0.30, arm: 0.12, esquive: 0.12, pv: 30,  faim: 3 },
    { pts: 10, dmg: 80,  prec: 0.20, crit: 0.20, critDmg: 0.40, arm: 0.16, esquive: 0.16, pv: 40,  faim: 4 },
    { pts: 15, dmg: 100, prec: 0.25, crit: 0.25, critDmg: 0.50, arm: 0.20, esquive: 0.20, pv: 50,  faim: 5 },
    { pts: 21, dmg: 120, prec: 0.30, crit: 0.30, critDmg: 0.60, arm: 0.24, esquive: 0.24, pv: 60,  faim: 6 },
    { pts: 28, dmg: 140, prec: 0.35, crit: 0.35, critDmg: 0.70, arm: 0.28, esquive: 0.28, pv: 70,  faim: 7 },
    { pts: 36, dmg: 160, prec: 0.40, crit: 0.40, critDmg: 0.80, arm: 0.32, esquive: 0.32, pv: 80,  faim: 8 },
    { pts: 45, dmg: 180, prec: 0.45, crit: 0.45, critDmg: 0.90, arm: 0.36, esquive: 0.36, pv: 90,  faim: 9 },
    { pts: 55, dmg: 200, prec: 0.50, crit: 0.50, critDmg: 1.00, arm: 0.40, esquive: 0.40, pv: 100, faim: 10 }
]

// Map de correspondance entre BaseStats et SkillEntry
const skillKeyMap: Record<keyof BaseStats, keyof SkillEntry> = {
    dmg: 'dmg',
    prec: 'prec',
    crit: 'crit',
    critDmg: 'critDmg',
    arm: 'arm',
    esquive: 'esquive',
    pv: 'pv'
}

const pv_lost_by_attacking = 10;

// Recherche du bonus du palier (RECHERCHEV approximatif)
function getSkillBonus(cost: number): SkillEntry {
    const tiers = skillTable.filter(t => t.pts <= cost)
    return tiers.length ? tiers[tiers.length - 1] : skillTable[0]
}

export function useDamageCalc(state:State) {

    // Calcule la stat totale : base + bonus + bonus de skill
    const combined = computed(() => {
        const total = (prop: keyof SkillEntry) => {
            const bVal = state.base.hasOwnProperty(prop) ? state.base[prop] : 0
            const eVal = state.bonus.hasOwnProperty(prop) ? state.bonus[prop] : 0
            const key  = skillKeyMap[prop]
            const pts  = state.skillCost[prop.concat("_pts")]
            const skillBon = pts >= 1 ? getSkillBonus(pts)[key] as number : 0
            return (bVal as number) + (eVal as number) + skillBon
        }
        return {
            dmg:     total('dmg'),
            prec:    total('prec'),
            crit:    total('crit'),
            critDmg: total('critDmg'),
            arm:     total('arm'),
            esquive: total('esquive'),
            pv:      total('pv')
        }
    })

    const avgDmgPerHit = computed(() => {
        const c = combined.value
        return c.prec * ((1 - c.crit) * c.dmg + c.crit * (c.dmg * (1 + c.critDmg)))
    })

    const hitsPer10h = computed(() => {
        const c = combined.value
        return (c.pv / pv_lost_by_attacking) * (1 + c.arm) * (1 + c.esquive)
    })

    const totalDmg10h = computed(() => avgDmgPerHit.value * hitsPer10h.value)

    return { state, combined, avgDmgPerHit, hitsPer10h, totalDmg10h }
}