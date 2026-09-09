import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRules } from '../app/RulesProvider'
import { useCharacterStore } from '../app/CharacterStoreProvider'
import { FIGHTING_STYLE_FEAT_IDS, warlockInvocationOptions } from '../data/phb2024'
import { getHitPointMaximum } from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

type CreatableClassId = 'barbarian' | 'bard' | 'cleric' | 'druid' | 'fighter' | 'monk' | 'paladin' | 'ranger' | 'wizard' | 'rogue' | 'sorcerer' | 'warlock'

const ABILITIES: AbilityName[] = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
const DEFAULT_SCORES: Record<CreatableClassId, Record<AbilityName, number>> = {
  barbarian: { Strength: 16, Dexterity: 14, Constitution: 15, Intelligence: 8, Wisdom: 10, Charisma: 12 },
  bard: { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 15 },
  cleric: { Strength: 12, Dexterity: 10, Constitution: 14, Intelligence: 8, Wisdom: 15, Charisma: 13 },
  druid: { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 10, Wisdom: 15, Charisma: 12 },
  fighter: { Strength: 15, Dexterity: 13, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 8 },
  monk: { Strength: 10, Dexterity: 16, Constitution: 14, Intelligence: 8, Wisdom: 15, Charisma: 12 },
  paladin: { Strength: 15, Dexterity: 10, Constitution: 14, Intelligence: 8, Wisdom: 12, Charisma: 13 },
  ranger: { Strength: 12, Dexterity: 15, Constitution: 14, Intelligence: 8, Wisdom: 13, Charisma: 10 },
  wizard: { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 15, Wisdom: 12, Charisma: 10 },
  rogue: { Strength: 8, Dexterity: 15, Constitution: 13, Intelligence: 12, Wisdom: 10, Charisma: 14 },
  sorcerer: { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 15 },
  warlock: { Strength: 8, Dexterity: 13, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 15 },
}

// Only invocations with no prerequisites at all are legal at character
// creation (level 1) — anything level-gated or dependent on another
// invocation (e.g. Thirsting Blade needing Pact of the Blade already held)
// can't be satisfied before a single level-1 pick exists.
const CREATION_LEGAL_INVOCATIONS = warlockInvocationOptions.filter((o) => !o.prerequisites?.length)

// Species whose species-granted traits include a player choice, mapped to
// the choiceId(s) that must be resolved at creation. Human's Skillful/
// Versatile choices go through this same generic mechanism as every other
// species' lineage/ancestry choice — no species gets its own bespoke picker.
const SPECIES_SUBCHOICES: Record<string, string[]> = {
  human: ['human-skillful-choice', 'human-versatile-choice'],
  dragonborn: ['dragonborn-draconic-ancestry-choice'],
  elf: ['elf-elven-lineage-choice', 'elf-keen-senses-choice'],
  gnome: ['gnome-gnomish-lineage-choice'],
  goliath: ['goliath-giant-ancestry-choice'],
  tiefling: ['tiefling-fiendish-legacy-choice'],
}

/**
 * A single-page creation flow covering all 12 PHB 2024 classes plus the full
 * set of 16 backgrounds and 10 species (Phase 5). Species/background-level
 * choices (Human's Skillful/Versatile, Elf's Elven Lineage, etc.) are
 * resolved generically via SPECIES_SUBCHOICES rather than per-species UI.
 */
export function CharacterSetupScreen() {
  const registry = useRules()
  const { saveCharacter } = useCharacterStore()
  const navigate = useNavigate()

  const [classId, setClassId] = useState<CreatableClassId>('fighter')
  const [name, setName] = useState('')
  const [abilityScores, setAbilityScores] = useState<Record<AbilityName, number>>(DEFAULT_SCORES.fighter)
  const [backgroundId, setBackgroundId] = useState('soldier')
  const [speciesId, setSpeciesId] = useState('human')
  const [speciesSubchoices, setSpeciesSubchoices] = useState<Record<string, string>>({})

  // Fighter/Rogue weapon mastery (shared state; count depends on classId)
  const [weaponMastery, setWeaponMastery] = useState<string[]>([])

  // Fighter-only state
  const [fightingStyle, setFightingStyle] = useState('')
  const [fighterPackId, setFighterPackId] = useState('fighterPackA')

  // Wizard/Warlock cantrips (shared state; count depends on classId)
  const [cantrips, setCantrips] = useState<string[]>([])

  // Wizard-only state
  const [spellbook, setSpellbook] = useState<string[]>([])
  const [prepared, setPrepared] = useState<string[]>([])
  const [wizardPackId, setWizardPackId] = useState('wizardPackA')

  // Rogue-only state
  const [rogueExpertise, setRogueExpertise] = useState<string[]>([])
  const [roguePackId, setRoguePackId] = useState('roguePackA')

  // Warlock-only state
  const [warlockKnownSpells, setWarlockKnownSpells] = useState<string[]>([])
  const [warlockInvocation, setWarlockInvocation] = useState('')
  const [warlockPackId, setWarlockPackId] = useState('warlockPackA')

  // Barbarian-only state
  const [barbarianPackId, setBarbarianPackId] = useState('barbarianPackA')

  // Sorcerer-only state
  const [sorcererKnownSpells, setSorcererKnownSpells] = useState<string[]>([])
  const [sorcererPackId, setSorcererPackId] = useState('sorcererPackA')

  // Monk-only state
  const [monkPackId, setMonkPackId] = useState('monkPackA')

  // Cleric-only state
  const [clericPrepared, setClericPrepared] = useState<string[]>([])
  const [divineOrder, setDivineOrder] = useState('')
  const [clericPackId, setClericPackId] = useState('clericPackA')

  // Bard-only state
  const [bardKnownSpells, setBardKnownSpells] = useState<string[]>([])
  const [bardPackId, setBardPackId] = useState('bardPackA')

  // Druid-only state
  const [druidPrepared, setDruidPrepared] = useState<string[]>([])
  const [primalOrder, setPrimalOrder] = useState('')
  const [druidPackId, setDruidPackId] = useState('druidPackA')

  // Paladin-only state
  const [paladinPrepared, setPaladinPrepared] = useState<string[]>([])
  const [paladinPackId, setPaladinPackId] = useState('paladinPackA')

  // Ranger-only state
  const [rangerPrepared, setRangerPrepared] = useState<string[]>([])
  const [rangerPackId, setRangerPackId] = useState('rangerPackA')

  const weaponOptions = useMemo(() => Object.values(registry.weapons).sort((a, b) => a.name.localeCompare(b.name)), [registry])
  const skillOptions = useMemo(
    () => Object.values(registry.choiceOptions).filter((o) => o.id.startsWith('skill-')).sort((a, b) => a.label.localeCompare(b.label)),
    [registry],
  )
  const wizardCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Wizard')), [registry])
  const wizardLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Wizard')), [registry])
  const warlockCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Warlock')), [registry])
  const warlockLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Warlock')), [registry])
  const sorcererCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Sorcerer')), [registry])
  const sorcererLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Sorcerer')), [registry])
  const clericCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Cleric')), [registry])
  const clericLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Cleric')), [registry])
  const divineOrderOptions = useMemo(() => Object.values(registry.choiceOptions).filter((o) => o.id.startsWith('divineOrder-')), [registry])
  const bardCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Bard')), [registry])
  const bardLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Bard')), [registry])
  const druidCantripOptions = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 0 && s.classes.includes('Druid')), [registry])
  const druidLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Druid')), [registry])
  const primalOrderOptions = useMemo(() => Object.values(registry.choiceOptions).filter((o) => o.id.startsWith('primalOrder-')), [registry])
  const paladinLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Paladin')), [registry])
  const rangerLevel1Options = useMemo(() => Object.values(registry.spells).filter((s) => s.level === 1 && s.classes.includes('Ranger')), [registry])

  const masteryMax = classId === 'fighter' ? 3 : classId === 'barbarian' || classId === 'rogue' || classId === 'paladin' || classId === 'ranger' ? 2 : 0
  const cantripMax = classId === 'wizard' || classId === 'cleric' ? 3 : classId === 'sorcerer' ? 4 : classId === 'warlock' || classId === 'bard' || classId === 'druid' ? 2 : 0

  const backgroundOptions = useMemo(() => Object.values(registry.backgrounds).sort((a, b) => a.name.localeCompare(b.name)), [registry])
  const speciesOptions = useMemo(() => Object.values(registry.species).sort((a, b) => a.name.localeCompare(b.name)), [registry])
  const selectedBackground = registry.backgrounds[backgroundId]
  const originFeat = selectedBackground ? registry.feats[selectedBackground.originFeatId] : undefined
  const subchoiceIds = SPECIES_SUBCHOICES[speciesId] ?? []
  const classGuidance = registry.guidance[classId]

  function selectClass(next: CreatableClassId) {
    setClassId(next)
    setAbilityScores(DEFAULT_SCORES[next])
  }

  function selectSpecies(next: string) {
    setSpeciesId(next)
    setSpeciesSubchoices({})
  }

  function toggleMastery(weaponId: string) {
    const optionId = `weapon-mastery-${weaponId}`
    setWeaponMastery((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : prev.length < masteryMax ? [...prev, optionId] : prev))
  }

  function toggleCantrip(id: string) {
    setCantrips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < cantripMax ? [...prev, id] : prev))
  }

  function toggleRogueExpertise(id: string) {
    setRogueExpertise((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev))
  }

  function toggleWarlockKnownSpell(id: string) {
    setWarlockKnownSpells((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev))
  }

  function toggleSorcererKnownSpell(id: string) {
    setSorcererKnownSpells((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev))
  }

  function toggleClericPrepared(id: string) {
    setClericPrepared((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev))
  }

  function toggleBardKnownSpell(id: string) {
    setBardKnownSpells((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev))
  }

  function toggleDruidPrepared(id: string) {
    setDruidPrepared((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev))
  }

  function togglePaladinPrepared(id: string) {
    setPaladinPrepared((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev))
  }

  function toggleRangerPrepared(id: string) {
    setRangerPrepared((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev))
  }

  function toggleSpellbook(id: string) {
    setSpellbook((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 6 ? [...prev, id] : prev
      if (!next.includes(id)) setPrepared((p) => p.filter((s) => s !== id))
      return next
    })
  }

  function togglePrepared(id: string) {
    setPrepared((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev))
  }

  const canSubmit =
    name.trim().length > 0 &&
    subchoiceIds.every((id) => speciesSubchoices[id]) &&
    (classId === 'barbarian'
      ? weaponMastery.length === 2
      : classId === 'bard'
        ? cantrips.length === 2 && bardKnownSpells.length === 4
        : classId === 'cleric'
          ? cantrips.length === 3 && clericPrepared.length === 4 && divineOrder.length > 0
          : classId === 'druid'
            ? cantrips.length === 2 && druidPrepared.length === 4 && primalOrder.length > 0
            : classId === 'fighter'
              ? fightingStyle && weaponMastery.length === 3
              : classId === 'monk'
                ? true
                : classId === 'paladin'
                  ? weaponMastery.length === 2 && paladinPrepared.length === 2
                  : classId === 'ranger'
                    ? weaponMastery.length === 2 && rangerPrepared.length === 2
                    : classId === 'wizard'
                      ? cantrips.length === 3 && spellbook.length === 6 && prepared.length === 4
                      : classId === 'rogue'
                        ? weaponMastery.length === 2 && rogueExpertise.length === 2
                        : classId === 'sorcerer'
                          ? cantrips.length === 4 && sorcererKnownSpells.length === 2
                          : cantrips.length === 2 && warlockKnownSpells.length === 2 && warlockInvocation.length > 0)

  function handleCreate() {
    if (!canSubmit) return
    const now = new Date().toISOString()
    const packId =
      classId === 'barbarian' ? barbarianPackId
      : classId === 'bard' ? bardPackId
      : classId === 'cleric' ? clericPackId
      : classId === 'druid' ? druidPackId
      : classId === 'fighter' ? fighterPackId
      : classId === 'monk' ? monkPackId
      : classId === 'paladin' ? paladinPackId
      : classId === 'ranger' ? rangerPackId
      : classId === 'wizard' ? wizardPackId
      : classId === 'rogue' ? roguePackId
      : classId === 'sorcerer' ? sorcererPackId
      : warlockPackId
    const pack = registry.equipmentPacks[packId]

    const baseSelections: Record<string, string[]> = Object.fromEntries(
      Object.entries(speciesSubchoices).map(([choiceId, optionId]) => [choiceId, [optionId]]),
    )
    const classSelections: Record<string, string[]> =
      classId === 'barbarian'
        ? { 'barbarian-weapon-mastery-choice': weaponMastery }
        : classId === 'bard'
          ? { cantripsKnown: cantrips }
          : classId === 'cleric'
            ? { cantripsKnown: cantrips, 'cleric-divine-order-choice': [divineOrder] }
            : classId === 'druid'
              ? { cantripsKnown: cantrips, 'druid-primal-order-choice': [primalOrder] }
              : classId === 'fighter'
                ? { 'fighter-fighting-style-choice': [fightingStyle], 'fighter-weapon-mastery-choice': weaponMastery }
                : classId === 'monk'
                  ? {}
                  : classId === 'paladin'
                    ? { 'paladin-weapon-mastery-choice': weaponMastery }
                    : classId === 'ranger'
                      ? { 'ranger-weapon-mastery-choice': weaponMastery }
                      : classId === 'wizard'
                        ? { cantripsKnown: cantrips }
                        : classId === 'rogue'
                          ? { 'rogue-expertise-choice': rogueExpertise, 'rogue-weapon-mastery-choice': weaponMastery }
                          : classId === 'sorcerer'
                            ? { cantripsKnown: cantrips }
                            : { cantripsKnown: cantrips, 'warlock-invocations-choice': [warlockInvocation] }

    const baseCharacter: CharacterState = {
      id: crypto.randomUUID(),
      name: name.trim(),
      level: 1,
      classId,
      backgroundId,
      speciesId,
      enabledSourceIds: ['PHB2024'],
      abilityScores,
      selections: { ...baseSelections, ...classSelections },
      preparedSpellIds:
        classId === 'bard' ? bardKnownSpells
        : classId === 'cleric' ? clericPrepared
        : classId === 'druid' ? druidPrepared
        : classId === 'paladin' ? paladinPrepared
        : classId === 'ranger' ? rangerPrepared
        : classId === 'wizard' ? prepared
        : classId === 'sorcerer' ? sorcererKnownSpells
        : classId === 'warlock' ? warlockKnownSpells
        : [],
      spellbookSpellIds: classId === 'wizard' ? spellbook : [],
      resourceState: [],
      activeEffects: [],
      equipmentIds: [...(pack?.weaponIds ?? []), ...(pack?.armorIds ?? [])],
      createdAt: now,
      updatedAt: now,
    }
    const startingHP = getHitPointMaximum(baseCharacter, registry)
    const character: CharacterState = { ...baseCharacter, maxHP: startingHP, currentHP: startingHP }
    saveCharacter(character)
    navigate(`/character/${character.id}/play`)
  }

  return (
    <div className="min-h-screen bg-page pb-8">
      <div className="mx-auto max-w-[960px] px-4 py-6">
        <h1 className="text-xl font-semibold">Create Character</h1>
        <p className="mt-1 text-sm text-page-muted">Choose a class, background, and species to get started.</p>

        <section className="mt-6 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-medium text-text-primary">Background</h2>
          <select value={backgroundId} onChange={(e) => setBackgroundId(e.target.value)} className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
            {backgroundOptions.map((bg) => (
              <option key={bg.id} value={bg.id}>{bg.name}</option>
            ))}
          </select>
          {selectedBackground && (
            <p className="mt-1 text-xs text-text-secondary">
              Ability Scores: {selectedBackground.abilityScoreOptions.join(', ')} · Skills: {selectedBackground.skillProficiencies.join(', ')} · Tool: {selectedBackground.toolProficiency} · Feat: {originFeat?.name ?? selectedBackground.originFeatId}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-medium text-text-primary">Species</h2>
          <select value={speciesId} onChange={(e) => selectSpecies(e.target.value)} className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm">
            {speciesOptions.map((sp) => (
              <option key={sp.id} value={sp.id}>{sp.name}</option>
            ))}
          </select>
          {subchoiceIds.map((choiceId) => {
            const choice = registry.choices[choiceId]
            if (!choice) return null
            return (
              <div key={choiceId} className="mt-2">
                <label className="block text-xs font-medium text-text-primary">{choice.label} <span className="text-danger">*</span></label>
                <select
                  value={speciesSubchoices[choiceId] ?? ''}
                  onChange={(e) => setSpeciesSubchoices((prev) => ({ ...prev, [choiceId]: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="">Select…</option>
                  {choice.optionIds.map((optionId) => (
                    <option key={optionId} value={optionId}>
                      {registry.choiceOptions[optionId]?.label ?? registry.feats[optionId]?.name ?? optionId}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
        </section>

        <section className="mt-6 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-medium text-text-primary">Class</h2>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {(['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'wizard', 'rogue', 'sorcerer', 'warlock'] as const).map((id) => (
              <label key={id} className={`rounded-md border p-2 text-center text-sm ${classId === id ? 'border-accent bg-surface' : 'border-border bg-surface'}`}>
                <input type="radio" name="classId" checked={classId === id} onChange={() => selectClass(id)} className="mr-1.5" />
                {registry.classes[id]?.name}
              </label>
            ))}
          </div>
          {classGuidance && (
            <div className="mt-2 rounded-md border border-border bg-surface p-3 text-xs">
              <h3 className="text-sm font-medium text-text-primary">How this class plays</h3>
              <p className="mt-1 text-text-secondary">{classGuidance.classIdentity}</p>
              <p className="mt-2 font-medium text-text-primary">Good fit for</p>
              <p className="mt-0.5 text-text-secondary">{classGuidance.goodFitFor}</p>
              <p className="mt-2 font-medium text-text-primary">Things to watch</p>
              <ul className="mt-0.5 list-inside list-disc text-text-secondary">
                {classGuidance.thingsToWatch.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] text-text-secondary">
                Playstyle guidance from a pre-2024 source — flavor and identity only, not mechanics. {classGuidance.source.sourceLabel}
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-md border border-border bg-surface p-3">
          <label className="block text-sm font-medium text-text-primary" htmlFor="char-name">Name</label>
          <input
            id="char-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Character name"
          />
        </section>

        <section className="mt-6 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-medium text-text-primary">Ability Scores</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ABILITIES.map((ability) => (
              <label key={ability} className="text-xs text-text-secondary">
                {ability}
                <input
                  type="number"
                  value={abilityScores[ability]}
                  onChange={(e) => setAbilityScores((prev) => ({ ...prev, [ability]: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
                  min={1}
                  max={20}
                />
              </label>
            ))}
          </div>
        </section>

        {classId === 'barbarian' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Weapon Mastery — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({weaponMastery.length}/2 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {weaponOptions.map((weapon) => {
                  const optionId = `weapon-mastery-${weapon.id}`
                  const checked = weaponMastery.includes(optionId)
                  const masteryProperty = registry.weaponMasteryProperties[weapon.masteryPropertyId]
                  return (
                    <label key={weapon.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleMastery(weapon.id)} disabled={!checked && weaponMastery.length >= 2} />
                      {weapon.name} <span className="text-text-secondary">({masteryProperty?.name})</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Simple or Martial Melee weapons only. Changeable after every Long Rest.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['barbarianPackA', 'barbarianPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="barbarianEquipmentPack" checked={barbarianPackId === packId} onChange={() => setBarbarianPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'bard' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {bardCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Dancing Lights and Vicious Mockery are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 4 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({bardKnownSpells.length}/4 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Bards prepare spells directly rather than from a spellbook; swap one whenever you gain a level.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {bardLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={bardKnownSpells.includes(spell.id)} onChange={() => toggleBardKnownSpell(spell.id)} disabled={!bardKnownSpells.includes(spell.id) && bardKnownSpells.length >= 4} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Charm Person, Color Spray, Dissonant Whispers, and Healing Word are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['bardPackA', 'bardPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="bardEquipmentPack" checked={bardPackId === packId} onChange={() => setBardPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'cleric' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Divine Order <span className="text-danger">*</span></h2>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {divineOrderOptions.map((option) => (
                  <label key={option.id} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                    <input type="radio" name="divineOrder" checked={divineOrder === option.id} onChange={() => setDivineOrder(option.id)} className="mt-0.5" />
                    <span className="text-xs text-text-secondary">{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {clericCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Guidance, Sacred Flame, and Thaumaturgy are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 4 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({clericPrepared.length}/4 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Clerics prepare directly from the full Cleric spell list (no spellbook, no fixed known-list); change your whole list on any Long Rest.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {clericLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={clericPrepared.includes(spell.id)} onChange={() => toggleClericPrepared(spell.id)} disabled={!clericPrepared.includes(spell.id) && clericPrepared.length >= 4} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Bless, Cure Wounds, Guiding Bolt, and Shield of Faith are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['clericPackA', 'clericPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="clericEquipmentPack" checked={clericPackId === packId} onChange={() => setClericPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'druid' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Primal Order <span className="text-danger">*</span></h2>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {primalOrderOptions.map((option) => (
                  <label key={option.id} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                    <input type="radio" name="primalOrder" checked={primalOrder === option.id} onChange={() => setPrimalOrder(option.id)} className="mt-0.5" />
                    <span className="text-xs text-text-secondary">{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {druidCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Druidcraft and Produce Flame are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 4 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({druidPrepared.length}/4 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Druids prepare directly from the full Druid spell list (no spellbook, no fixed known-list); change your whole list on any Long Rest.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {druidLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={druidPrepared.includes(spell.id)} onChange={() => toggleDruidPrepared(spell.id)} disabled={!druidPrepared.includes(spell.id) && druidPrepared.length >= 4} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Animal Friendship, Cure Wounds, Faerie Fire, and Thunderwave are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['druidPackA', 'druidPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="druidEquipmentPack" checked={druidPackId === packId} onChange={() => setDruidPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'fighter' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Fighting Style <span className="text-danger">*</span></h2>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {FIGHTING_STYLE_FEAT_IDS.map((featId) => {
                  const feat = registry.feats[featId]
                  if (!feat) return null
                  return (
                    <label key={featId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="fightingStyle" checked={fightingStyle === featId} onChange={() => setFightingStyle(featId)} className="mt-0.5" />
                      <span>
                        <span className="font-medium text-text-primary">{feat.name}</span>
                        <span className="block text-xs text-text-secondary">{feat.passiveSummary}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Weapon Mastery — choose 3 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({weaponMastery.length}/3 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {weaponOptions.map((weapon) => {
                  const optionId = `weapon-mastery-${weapon.id}`
                  const checked = weaponMastery.includes(optionId)
                  const masteryProperty = registry.weaponMasteryProperties[weapon.masteryPropertyId]
                  return (
                    <label key={weapon.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleMastery(weapon.id)} disabled={!checked && weaponMastery.length >= 3} />
                      {weapon.name} <span className="text-text-secondary">({masteryProperty?.name})</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Changeable after every Long Rest.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['fighterPackA', 'fighterPackB', 'fighterPackC'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="equipmentPack" checked={fighterPackId === packId} onChange={() => setFighterPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'monk' && (
          <section className="mt-6 rounded-md border border-border bg-surface p-3">
            <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
            <div className="mt-2 flex flex-col gap-1.5">
              {['monkPackA', 'monkPackB'].map((packId) => {
                const pack = registry.equipmentPacks[packId]
                if (!pack) return null
                return (
                  <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                    <input type="radio" name="monkEquipmentPack" checked={monkPackId === packId} onChange={() => setMonkPackId(packId)} className="mt-0.5" />
                    <span className="text-xs text-text-secondary">{pack.label}</span>
                  </label>
                )
              })}
            </div>
            <p className="mt-1 text-xs text-text-secondary">No other required choices at level 1 — Martial Arts, Unarmored Defense, and Monk's Focus (from level 2) apply automatically.</p>
          </section>
        )}

        {classId === 'paladin' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Weapon Mastery — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({weaponMastery.length}/2 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {weaponOptions.map((weapon) => {
                  const optionId = `weapon-mastery-${weapon.id}`
                  const checked = weaponMastery.includes(optionId)
                  const masteryProperty = registry.weaponMasteryProperties[weapon.masteryPropertyId]
                  return (
                    <label key={weapon.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleMastery(weapon.id)} disabled={!checked && weaponMastery.length >= 2} />
                      {weapon.name} <span className="text-text-secondary">({masteryProperty?.name})</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Changeable after every Long Rest.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({paladinPrepared.length}/2 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Paladins prepare directly from the full Paladin spell list (no cantrips, no spellbook); swap one spell on any Long Rest.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {paladinLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={paladinPrepared.includes(spell.id)} onChange={() => togglePaladinPrepared(spell.id)} disabled={!paladinPrepared.includes(spell.id) && paladinPrepared.length >= 2} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Heroism and Searing Smite are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['paladinPackA', 'paladinPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="paladinEquipmentPack" checked={paladinPackId === packId} onChange={() => setPaladinPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'ranger' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Weapon Mastery — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({weaponMastery.length}/2 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {weaponOptions.map((weapon) => {
                  const optionId = `weapon-mastery-${weapon.id}`
                  const checked = weaponMastery.includes(optionId)
                  const masteryProperty = registry.weaponMasteryProperties[weapon.masteryPropertyId]
                  return (
                    <label key={weapon.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleMastery(weapon.id)} disabled={!checked && weaponMastery.length >= 2} />
                      {weapon.name} <span className="text-text-secondary">({masteryProperty?.name})</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Changeable after every Long Rest.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({rangerPrepared.length}/2 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Rangers prepare directly from the full Ranger spell list (no cantrips, no spellbook); swap one spell on any Long Rest.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {rangerLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={rangerPrepared.includes(spell.id)} onChange={() => toggleRangerPrepared(spell.id)} disabled={!rangerPrepared.includes(spell.id) && rangerPrepared.length >= 2} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Cure Wounds and Ensnaring Strike are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['rangerPackA', 'rangerPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="rangerEquipmentPack" checked={rangerPackId === packId} onChange={() => setRangerPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'wizard' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {wizardCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Light, Mage Hand, and Ray of Frost are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Spellbook — starts with 6 level 1 spells <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({spellbook.length}/6 selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {wizardLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={spellbook.includes(spell.id)} onChange={() => toggleSpellbook(spell.id)} disabled={!spellbook.includes(spell.id) && spellbook.length >= 6} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 4 from your spellbook <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({prepared.length}/4 selected)</span>
              </h2>
              {spellbook.length === 0 ? (
                <p className="mt-2 text-xs text-text-secondary">Choose spellbook spells first.</p>
              ) : (
                <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                  {spellbook.map((id) => {
                    const spell = registry.spells[id]
                    if (!spell) return null
                    return (
                      <label key={id} className="flex items-center gap-1.5 text-xs">
                        <input type="checkbox" checked={prepared.includes(id)} onChange={() => togglePrepared(id)} disabled={!prepared.includes(id) && prepared.length >= 4} />
                        {spell.name}
                      </label>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['wizardPackA', 'wizardPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="wizardEquipmentPack" checked={wizardPackId === packId} onChange={() => setWizardPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'rogue' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Expertise — choose 2 skills <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({rogueExpertise.length}/2 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {skillOptions.map((option) => {
                  const checked = rogueExpertise.includes(option.id)
                  return (
                    <label key={option.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleRogueExpertise(option.id)} disabled={!checked && rogueExpertise.length >= 2} />
                      {option.label}
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Double Proficiency Bonus on checks with these skills. 2 more at level 6.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Weapon Mastery — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({weaponMastery.length}/2 selected)</span>
              </h2>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 sm:grid-cols-3">
                {weaponOptions.map((weapon) => {
                  const optionId = `weapon-mastery-${weapon.id}`
                  const checked = weaponMastery.includes(optionId)
                  const masteryProperty = registry.weaponMasteryProperties[weapon.masteryPropertyId]
                  return (
                    <label key={weapon.id} className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={checked} onChange={() => toggleMastery(weapon.id)} disabled={!checked && weaponMastery.length >= 2} />
                      {weapon.name} <span className="text-text-secondary">({masteryProperty?.name})</span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Changeable after every Long Rest.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['roguePackA', 'roguePackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="rogueEquipmentPack" checked={roguePackId === packId} onChange={() => setRoguePackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'sorcerer' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {sorcererCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Light, Prestidigitation, Shocking Grasp, and Fire Bolt are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Prepared Spells — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({sorcererKnownSpells.length}/2 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Sorcerers prepare spells directly rather than from a spellbook; swap one whenever you gain a level.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {sorcererLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={sorcererKnownSpells.includes(spell.id)} onChange={() => toggleSorcererKnownSpell(spell.id)} disabled={!sorcererKnownSpells.includes(spell.id) && sorcererKnownSpells.length >= 2} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Burning Hands and Detect Magic are recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['sorcererPackA', 'sorcererPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="sorcererEquipmentPack" checked={sorcererPackId === packId} onChange={() => setSorcererPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {classId === 'warlock' && (
          <>
            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Cantrips — choose {cantripMax} <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({cantrips.length}/{cantripMax} selected)</span>
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {warlockCantripOptions.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={cantrips.includes(spell.id)} onChange={() => toggleCantrip(spell.id)} disabled={!cantrips.includes(spell.id) && cantrips.length >= cantripMax} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Eldritch Blast is recommended.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">
                Spells Known — choose 2 <span className="text-danger">*</span>
                <span className="ml-2 text-xs text-text-secondary">({warlockKnownSpells.length}/2 selected)</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">Warlocks know spells directly rather than preparing from a spellbook.</p>
              <div className="mt-2 grid grid-cols-1 gap-1 rounded-md border border-border bg-surface p-2 sm:grid-cols-2">
                {warlockLevel1Options.map((spell) => (
                  <label key={spell.id} className="flex items-start gap-1.5 text-xs">
                    <input type="checkbox" checked={warlockKnownSpells.includes(spell.id)} onChange={() => toggleWarlockKnownSpell(spell.id)} disabled={!warlockKnownSpells.includes(spell.id) && warlockKnownSpells.length >= 2} className="mt-0.5" />
                    <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Eldritch Invocation <span className="text-danger">*</span></h2>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {CREATION_LEGAL_INVOCATIONS.map((option) => (
                  <label key={option.id} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                    <input type="radio" name="warlockInvocation" checked={warlockInvocation === option.id} onChange={() => setWarlockInvocation(option.id)} className="mt-0.5" />
                    <span className="text-xs text-text-secondary">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-secondary">Only invocations with no level/prerequisite requirement can be chosen at level 1. More grow available (and this one becomes freely replaceable) on level up.</p>
            </section>

            <section className="mt-6 rounded-md border border-border bg-surface p-3">
              <h2 className="text-sm font-medium text-text-primary">Starting Equipment</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {['warlockPackA', 'warlockPackB'].map((packId) => {
                  const pack = registry.equipmentPacks[packId]
                  if (!pack) return null
                  return (
                    <label key={packId} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2 text-sm">
                      <input type="radio" name="warlockEquipmentPack" checked={warlockPackId === packId} onChange={() => setWarlockPackId(packId)} className="mt-0.5" />
                      <span className="text-xs text-text-secondary">{pack.label}</span>
                    </label>
                  )
                })}
              </div>
            </section>
          </>
        )}

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canSubmit}
          className="mt-8 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Create Character
        </button>
      </div>
    </div>
  )
}
