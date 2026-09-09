import type { ClassGuidance } from '../../domain/types'
import type { RegistryModule } from '../registry'

const source = (section: string) => ({
  sourceId: 'CLASS_TIPS' as const,
  sourceLabel: 'D&D Beyond, "D&D 101: A Quick Breakdown of Classes in Dungeons & Dragons" (Bryce Miller Booker, 2021)',
  section,
})

/**
 * Beginner-friendly "How this class plays" guidance — deliberately a
 * separate registry from ClassDefinition, never consulted by the rule
 * engine (see domain/types/content.ts). The source article predates the
 * 2024 PHB, so every entry carries mechanicsVerifiedFor2024: false; its
 * value is class identity and playstyle framing, not mechanics, and any
 * mechanic-sounding claim here (e.g. "Warlocks recover spell slots on a
 * short rest") must be re-verified against the PHB2024-sourced data before
 * being trusted, never assumed correct because it appears in this file.
 */
export const classGuidance: Record<string, ClassGuidance> = {
  barbarian: {
    classId: 'barbarian',
    classIdentity: 'Frontline melee bruiser built around charging into danger, surviving punishment, and dealing heavy weapon damage. Rage boosts melee damage and reduces common incoming damage, Reckless Attack helps attacks land more reliably, and the largest Hit Die in the game supports a large hit point pool.',
    thingsToWatch: [
      'Armor Class is usually lower than heavily armored Fighters or Paladins.',
      'The class offers fewer tools outside combat.',
      'Players who want lots of tactical or spell choices may find the core loop simple.',
    ],
    goodFitFor: 'Players who want a direct, durable, aggressive martial character that is easy to pick up.',
    source: source('Barbarian'),
    mechanicsVerifiedFor2024: false,
  },
  bard: {
    classId: 'bard',
    classIdentity: 'Versatile support spellcaster and skill specialist who helps allies succeed both in social scenes and in combat. Bardic Inspiration improves allies\' rolls, Jack of All Trades and Expertise make Bards strong across many skills, and their spell list includes many ways to disrupt, deceive, control, and support.',
    thingsToWatch: [
      'Usually leans toward support rather than raw personal damage.',
      'Damage spell selection is more limited.',
      'Much of their value comes from actively engaging with NPCs, skills, and the world outside combat.',
    ],
    goodFitFor: 'Players who enjoy teamwork, roleplay, social interaction, creative spell use, and being useful in many situations.',
    source: source('Bard'),
    mechanicsVerifiedFor2024: false,
  },
  cleric: {
    classId: 'cleric',
    classIdentity: 'Divine spellcaster that can heal, support, defend, or deal damage depending on spell preparation and subclass. A flexible spell list supports healing and offense, Clerics prepare spells each day to adapt to expected challenges, and they can be especially valuable in adventures involving undead enemies.',
    thingsToWatch: [
      'Some groups may expect the Cleric to focus on healing even when the player wants another role.',
      'Heavy spell reliance means options shrink after spell slots are spent.',
    ],
    goodFitFor: 'Players who want a flexible caster with healing, support, strong defenses, and the ability to change prepared spells.',
    source: source('Cleric'),
    mechanicsVerifiedFor2024: false,
  },
  druid: {
    classId: 'druid',
    classIdentity: 'Nature spellcaster with healing, control magic, and Wild Shape, allowing very different playstyles within one class. Spellcasting plus Wild Shape creates answers for many situations, Druids can change prepared spells at the start of an adventuring day, and Wild Shape improves with level as subclasses can strongly reshape the class identity.',
    thingsToWatch: [
      'Considered less beginner-friendly, since the player may need to track many spells plus creature statistics for Wild Shape or summons.',
      'This can slow play if the information is not prepared in advance.',
    ],
    goodFitFor: 'Players who enjoy nature magic, transformation, battlefield control, support, and managing a broad toolkit.',
    source: source('Druid'),
    mechanicsVerifiedFor2024: false,
  },
  fighter: {
    classId: 'fighter',
    classIdentity: 'Straightforward and highly effective martial class with broad weapon and armor access and many possible combat styles. Fighters are easy to learn and effective, proficient with all armor, shields, and a wide range of weapons, and they receive many Ability Score Improvements and can use Action Surge for an extra action after resting.',
    thingsToWatch: [
      'The core class offers less utility outside combat than skill or spell focused classes.',
      'Some players may want more complexity than the basic Fighter loop provides.',
    ],
    goodFitFor: 'Players who want dependable martial combat, weapon flexibility, strong defenses, and a class that can be simple or expanded through subclass choices.',
    source: source('Fighter'),
    mechanicsVerifiedFor2024: false,
  },
  monk: {
    classId: 'monk',
    classIdentity: 'Fast martial artist focused on mobility, repeated attacks, and spending Ki to access special combat options. Monks can make many attacks and use Ki for offense, defense, movement, and utility; Dexterity and Wisdom are both useful ability scores and also common saving throws; and Stunning Strike is highlighted as an iconic control tool.',
    thingsToWatch: [
      'Individual attacks deal less damage to balance the number of attacks.',
      'Monks have lower health than many frontline characters and depend on avoiding damage.',
      'They rely on several ability scores and can spend Ki quickly.',
    ],
    goodFitFor: 'Players who like speed, positioning, martial arts flavor, multiple attacks, and resource based combat decisions.',
    source: source('Monk'),
    mechanicsVerifiedFor2024: false,
  },
  paladin: {
    classId: 'paladin',
    classIdentity: 'Armored holy warrior combining martial combat, support, limited spellcasting, healing, and explosive melee damage. Full armor, shield, and weapon proficiency makes Paladins sturdy, Divine Smite adds damage after an attack hits, and Lay on Hands adds healing while spellcasting brings extra utility.',
    thingsToWatch: [
      'Divine Smite consumes spell slots quickly and is tied to melee attacks in the source rules.',
      'Paladins rely on several ability scores.',
      'Their oath creates roleplay expectations that can matter to the campaign.',
    ],
    goodFitFor: 'Players who want heavy armor, strong melee hits, a heroic oath, some healing, and a blend of Fighter and Cleric style abilities.',
    source: source('Paladin'),
    mechanicsVerifiedFor2024: false,
  },
  ranger: {
    classId: 'ranger',
    classIdentity: 'Martial explorer with nature themed magic, tracking skills, and options for ranged or melee combat. Strong exploration identity and wilderness skills, spellcasting adds versatility beyond a typical martial class, and some builds can gain an animal companion.',
    thingsToWatch: [
      'The source article warns that several original Ranger features are situational and strongly recommends looking at the optional Ranger features from Tasha\'s Cauldron of Everything.',
      'Damage focused play can also become repetitive when relying heavily on Hunter\'s Mark.',
    ],
    goodFitFor: 'Players who like exploration, tracking, nature, a mix of weapons and magic, and flexible combat range.',
    source: source('Ranger'),
    mechanicsVerifiedFor2024: false,
  },
  rogue: {
    classId: 'rogue',
    classIdentity: 'Mobile skill expert and stealth specialist built around landing one powerful Sneak Attack and repositioning safely. Sneak Attack provides strong single target damage, Cunning Action gives frequent bonus action movement options such as Dash, Disengage, and Hide, and Rogues also gain many proficiencies and Expertise.',
    thingsToWatch: [
      'They do not receive Extra Attack as a core class feature.',
      'Combat damage depends heavily on consistently enabling Sneak Attack.',
      'Stealth plans can be harder when the rest of the party prefers a loud approach.',
    ],
    goodFitFor: 'Players who like stealth, mobility, skill checks, scouting, locks, traps, and precise single target attacks.',
    source: source('Rogue'),
    mechanicsVerifiedFor2024: false,
  },
  sorcerer: {
    classId: 'sorcerer',
    classIdentity: 'Innate spellcaster with a smaller spell list but strong control over how known spells behave through Metamagic. Metamagic can alter spell range, subtlety, power, and other properties; sorcery points can interact with spell slots, providing resource flexibility; and Charisma also supports social play.',
    thingsToWatch: [
      'Sorcerers learn relatively few spells, so choices matter and the character tends to specialize.',
      'They share the lowest Hit Die size with Wizards.',
    ],
    goodFitFor: 'Players who want focused spellcasting, Charisma based roleplay, and the ability to customize how a smaller set of spells works.',
    source: source('Sorcerer'),
    mechanicsVerifiedFor2024: false,
  },
  warlock: {
    classId: 'warlock',
    classIdentity: 'Charisma spellcaster whose power comes from a supernatural patron, with a small number of spell slots and strong customization through Eldritch Invocations. Eldritch Blast is presented as a premier damage cantrip, and Eldritch Invocations provide powerful, persistent customization choices.',
    thingsToWatch: [
      'The small spell slot pool can feel restrictive.',
      'Many Warlocks rely on Eldritch Blast very frequently.',
      'The patron relationship can also become a major roleplay element depending on the Dungeon Master.',
    ],
    goodFitFor: 'Players who like a strong magical theme, a reliable signature attack, customization, and patron driven roleplay.',
    source: source('Warlock'),
    mechanicsVerifiedFor2024: false,
  },
  wizard: {
    classId: 'wizard',
    classIdentity: 'Highly flexible arcane spellcaster with the broadest spell selection and many specialization options. Wizards have access to a very large spell list, can learn additional spells from scrolls and spellbooks, and their breadth makes them adaptable across many types of encounters.',
    thingsToWatch: [
      'Early levels can feel fragile and limited.',
      'Wizards share the lowest Hit Die size with Sorcerers.',
      'The huge number of spell choices can create decision overload, and learning additional spells can consume significant in game gold.',
    ],
    goodFitFor: 'Players who enjoy planning, collecting spells, solving problems with magic, and having many tactical options.',
    source: source('Wizard'),
    mechanicsVerifiedFor2024: false,
  },
}

export const classTipsModule: RegistryModule = {
  guidance: classGuidance,
}
