import type { SourceRef } from './source'

export type WeaponCategory = 'simple' | 'martial'
export type WeaponRangeType = 'melee' | 'ranged'
export type WeaponProperty =
  | 'ammunition'
  | 'finesse'
  | 'heavy'
  | 'light'
  | 'loading'
  | 'reach'
  | 'thrown'
  | 'twoHanded'
  | 'versatile'

export interface WeaponMasteryPropertyDefinition {
  id: string
  name: string
  source: SourceRef
  summary: string
}

export interface WeaponDefinition {
  id: string
  name: string
  source: SourceRef
  category: WeaponCategory
  rangeType: WeaponRangeType
  damageDice: string
  damageType: string
  properties: WeaponProperty[]
  /** Present only when properties includes 'versatile' — the two-handed damage die. */
  versatileDamageDice?: string
  masteryPropertyId: string
  cost: string
  weight: string
}

export type ArmorCategory = 'light' | 'medium' | 'heavy' | 'shield'

export interface ArmorDefinition {
  id: string
  name: string
  source: SourceRef
  category: ArmorCategory
  baseAC: number
  /** Undefined = unlimited Dex bonus (light armor); 2 for medium; absent/0 for heavy (fixed AC). */
  dexModifierCap?: number
  strengthRequirement?: number
  stealthDisadvantage?: boolean
  cost: string
  weight: string
}

export interface EquipmentPackOption {
  id: string
  label: string
  weaponIds?: string[]
  armorIds?: string[]
  goldPieces?: number
  otherItems?: string[]
}
