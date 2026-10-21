import { mapObject } from "@elyukai/utils/object"
import type {
  AdvancedCombatSpecialAbility,
  AdvancedKarmaSpecialAbility,
  AdvancedMagicalSpecialAbility,
  AdvancedSkillSpecialAbility,
  AncestorGlyph,
  ArcaneOrbEnchantment,
  AttireEnchantment,
  BlessedTradition,
  BowlEnchantment,
  BrawlingSpecialAbility,
  CauldronEnchantment,
  CeremonialItemSpecialAbility,
  ChronicleEnchantment,
  CombatSpecialAbility,
  CombatStyleSpecialAbility,
  CommandSpecialAbility,
  DaggerRitual,
  FamiliarSpecialAbility,
  FatePointSexSpecialAbility,
  FatePointSpecialAbility,
  FoolsHatEnchantment,
  GeneralSpecialAbility,
  InstrumentEnchantment,
  KarmaSpecialAbility,
  Krallenkettenzauber,
  LiturgicalStyleSpecialAbility,
  LycantropicGift,
  MagicStyleSpecialAbility,
  MagicalSign,
  MagicalSpecialAbility,
  MagicalTradition,
  OrbEnchantment,
  PactGift,
  ProtectiveWardingCircleSpecialAbility,
  RingEnchantment,
  Sermon,
  SexSpecialAbility,
  SickleRitual,
  SikaryanDrainSpecialAbility,
  SkillStyleSpecialAbility,
  SpecialAbilityIdentifier as SpecialAbilityIdentifierType,
  SpellSwordEnchantment,
  StaffEnchantment,
  ToyEnchantment,
  Trinkhornzauber,
  VampiricGift,
  Vision,
  WandEnchantment,
  WeaponEnchantment,
} from "@optolith/database-schema/gen"
import { SpecialAbilityIdentifier } from "@optolith/database-schema/types/_IdentifierGroup"
import { computed } from "mobx"
import type { Database } from "../../database.ts"
import { Compare, compareAt, reduceCompare } from "../../utils/compare.ts"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { addAdventurePointsCaches, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import type { Character } from "../character.ts"
import { SpecialAbilitiesSortOrder } from "../sortOrders.ts"
import {
  CharacterActivatables,
  type DisplayedActiveActivatable,
  type DisplayedInactiveActivatable,
} from "./activatableEntry.ts"

export class CharacterSpecialAbilities {
  readonly #db: Database
  readonly #character: Character
  readonly #specialAbilities: {
    [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
  }

  constructor(db: Database, character: Character) {
    this.#db = db
    this.#character = character
    this.#specialAbilities = mapObject(
      SpecialAbilityIdentifier.type.value.values,
      (_value, key) => new CharacterActivatables(db, character, key),
    ) as {
      [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
    }
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#specialAbilities).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePointsTotal),
      emptyAdventurePointsCache,
    )
  }

  @computed
  get active(): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] => entry.active,
    )
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] =>
        entry.inactive,
    )
  }
}

/**
 * A map of all special ability tag names and their corresponding static entry
 * types.
 */
// prettier-ignore
export type SpecialAbilityTagTypeMap = {
  "AdvancedCombatSpecialAbility": AdvancedCombatSpecialAbility
  "AdvancedKarmaSpecialAbility": AdvancedKarmaSpecialAbility
  "AdvancedMagicalSpecialAbility": AdvancedMagicalSpecialAbility
  "AdvancedSkillSpecialAbility": AdvancedSkillSpecialAbility
  "AncestorGlyph": AncestorGlyph
  "ArcaneOrbEnchantment": ArcaneOrbEnchantment
  "AttireEnchantment": AttireEnchantment
  "BlessedTradition": BlessedTradition
  "BowlEnchantment": BowlEnchantment
  "BrawlingSpecialAbility": BrawlingSpecialAbility
  "CauldronEnchantment": CauldronEnchantment
  "CeremonialItemSpecialAbility": CeremonialItemSpecialAbility
  "ChronicleEnchantment": ChronicleEnchantment
  "CombatSpecialAbility": CombatSpecialAbility
  "CombatStyleSpecialAbility": CombatStyleSpecialAbility
  "CommandSpecialAbility": CommandSpecialAbility
  "DaggerRitual": DaggerRitual
  "FamiliarSpecialAbility": FamiliarSpecialAbility
  "FatePointSexSpecialAbility": FatePointSexSpecialAbility
  "FatePointSpecialAbility": FatePointSpecialAbility
  "FoolsHatEnchantment": FoolsHatEnchantment
  "GeneralSpecialAbility": GeneralSpecialAbility
  "InstrumentEnchantment": InstrumentEnchantment
  "KarmaSpecialAbility": KarmaSpecialAbility
  "Krallenkettenzauber": Krallenkettenzauber
  "LiturgicalStyleSpecialAbility": LiturgicalStyleSpecialAbility
  "LycantropicGift": LycantropicGift
  "MagicalSign": MagicalSign
  "MagicalSpecialAbility": MagicalSpecialAbility
  "MagicalTradition": MagicalTradition
  "MagicStyleSpecialAbility": MagicStyleSpecialAbility
  "OrbEnchantment": OrbEnchantment
  "PactGift": PactGift
  "ProtectiveWardingCircleSpecialAbility": ProtectiveWardingCircleSpecialAbility
  "RingEnchantment": RingEnchantment
  "Sermon": Sermon
  "SexSpecialAbility": SexSpecialAbility
  "SickleRitual": SickleRitual
  "SikaryanDrainSpecialAbility": SikaryanDrainSpecialAbility
  "SkillStyleSpecialAbility": SkillStyleSpecialAbility
  "SpellSwordEnchantment": SpellSwordEnchantment
  "StaffEnchantment": StaffEnchantment
  "ToyEnchantment": ToyEnchantment
  "Trinkhornzauber": Trinkhornzauber
  "VampiricGift": VampiricGift
  "Vision": Vision
  "WandEnchantment": WandEnchantment
  "WeaponEnchantment": WeaponEnchantment
}

/**
 * Maps the special ability tag names to their corresponding translations.
 */
// prettier-ignore
export const specialAbilityGroupTranslationKeys = Object.freeze({
  AdvancedCombatSpecialAbility: "Advanced Combat Special Abilities",
  AdvancedKarmaSpecialAbility: "Advanced Karma Special Abilities",
  AdvancedMagicalSpecialAbility: "Advanced Magical Special Abilities",
  AdvancedSkillSpecialAbility: "Advanced Skill Special Abilities",
  AncestorGlyph: "Ancestor Glyphs",
  ArcaneOrbEnchantment: "Arcane Orb Enchantments",
  AttireEnchantment: "Attire Enchantments",
  BlessedTradition: "Blessed Traditions",
  BowlEnchantment: "Bowl Enchantments",
  BrawlingSpecialAbility: "Brawling Special Abilities",
  CauldronEnchantment: "Cauldron Enchantments",
  CeremonialItemSpecialAbility: "Ceremonial Item Special Abilities",
  ChronicleEnchantment: "Chronicle Enchantments",
  CombatSpecialAbility: "Combat Special Abilities",
  CombatStyleSpecialAbility: "Combat Style Special Abilities",
  CommandSpecialAbility: "Command Special Abilities",
  DaggerRitual: "Dagger Rituals",
  FamiliarSpecialAbility: "Familiar Special Abilities",
  FatePointSexSpecialAbility: "Fate Point Sex Special Abilities",
  FatePointSpecialAbility: "Fate Point Special Abilities",
  FoolsHatEnchantment: "Fools Hat Enchantments",
  GeneralSpecialAbility: "General Special Abilities",
  InstrumentEnchantment: "Instrument Enchantments",
  KarmaSpecialAbility: "Karma Special Abilities",
  Krallenkettenzauber: "Krallenkettenzauber",
  LiturgicalStyleSpecialAbility: "Liturgical Style Special Abilities",
  LycantropicGift: "Lycantropic Gifts",
  MagicalSign: "Magical Signs",
  MagicalSpecialAbility: "Magical Special Abilities",
  MagicalTradition: "Magical Traditions",
  MagicStyleSpecialAbility: "Magic Style Special Abilities",
  OrbEnchantment: "Orb Enchantments",
  PactGift: "Pact Gifts",
  ProtectiveWardingCircleSpecialAbility: "Protective/Warding Circle Special Abilities",
  RingEnchantment: "Ring Enchantments",
  Sermon: "Sermons",
  SexSpecialAbility: "Sex Special Abilities",
  SickleRitual: "Sickle Rituals",
  SikaryanDrainSpecialAbility: "Sikaryan Drain Special Abilities",
  SkillStyleSpecialAbility: "Skill Style Special Abilities",
  SpellSwordEnchantment: "Spell Sword Enchantments",
  StaffEnchantment: "Staff Enchantments",
  ToyEnchantment: "Toy Enchantments",
  Trinkhornzauber: "Trinkhornzauber",
  VampiricGift: "Vampiric Gifts",
  Vision: "Visions",
  WandEnchantment: "Wand Enchantments",
  WeaponEnchantment: "Weapon Enchantments",
})

/**
 * Filters and sorts the displayed special abilities.
 */
export const filterAndSortDisplayed = <
  T extends
    | DisplayedInactiveActivatable<SpecialAbilityIdentifier["kind"]>
    | DisplayedActiveActivatable<SpecialAbilityIdentifier["kind"]>,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  sortOrder: SpecialAbilitiesSortOrder,
  translate: Translate,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T) => translateMap<{ name: string }>(c.dbEntry.translations)?.name ?? ""
  return (
    filterText === ""
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(
          c => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
        )
  ).toSorted(
    (() => {
      switch (sortOrder) {
        case SpecialAbilitiesSortOrder.Name:
          return compareAt(getName, localeCompare)
        case SpecialAbilitiesSortOrder.Group:
          return reduceCompare(
            compareAt(
              x => translate(specialAbilityGroupTranslationKeys[x.type] ?? ""),
              localeCompare,
            ),
            compareAt(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}
