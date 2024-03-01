import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { AdvancedCombatSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedCombatSpecialAbility"
import { AdvancedKarmaSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedKarmaSpecialAbility"
import { AdvancedMagicalSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedMagicalSpecialAbility"
import { AdvancedSkillSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedSkillSpecialAbility"
import { AncestorGlyph } from "optolith-database-schema/types/specialAbility/AncestorGlyph"
import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { BrawlingSpecialAbility } from "optolith-database-schema/types/specialAbility/BrawlingSpecialAbility"
import { CeremonialItemSpecialAbility } from "optolith-database-schema/types/specialAbility/CeremonialItemSpecialAbility"
import { CombatSpecialAbility } from "optolith-database-schema/types/specialAbility/CombatSpecialAbility"
import { CombatStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/CombatStyleSpecialAbility"
import { CommandSpecialAbility } from "optolith-database-schema/types/specialAbility/CommandSpecialAbility"
import { FamiliarSpecialAbility } from "optolith-database-schema/types/specialAbility/FamiliarSpecialAbility"
import { FatePointSexSpecialAbility } from "optolith-database-schema/types/specialAbility/FatePointSexSpecialAbility"
import { FatePointSpecialAbility } from "optolith-database-schema/types/specialAbility/FatePointSpecialAbility"
import { GeneralSpecialAbility } from "optolith-database-schema/types/specialAbility/GeneralSpecialAbility"
import { KarmaSpecialAbility } from "optolith-database-schema/types/specialAbility/KarmaSpecialAbility"
import { LiturgicalStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/LiturgicalStyleSpecialAbility"
import { LycantropicGift } from "optolith-database-schema/types/specialAbility/LycantropicGift"
import { MagicStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/MagicStyleSpecialAbility"
import { MagicalSign } from "optolith-database-schema/types/specialAbility/MagicalSign"
import { MagicalSpecialAbility } from "optolith-database-schema/types/specialAbility/MagicalSpecialAbility"
import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { PactGift } from "optolith-database-schema/types/specialAbility/PactGift"
import { ProtectiveWardingCircleSpecialAbility } from "optolith-database-schema/types/specialAbility/ProtectiveWardingCircleSpecialAbility"
import { Sermon } from "optolith-database-schema/types/specialAbility/Sermon"
import { SexSpecialAbility } from "optolith-database-schema/types/specialAbility/SexSpecialAbility"
import { SikaryanDrainSpecialAbility } from "optolith-database-schema/types/specialAbility/SikaryanDrainSpecialAbility"
import { SkillStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/SkillStyleSpecialAbility"
import { VampiricGift } from "optolith-database-schema/types/specialAbility/VampiricGift"
import { Vision } from "optolith-database-schema/types/specialAbility/Vision"
import { ArcaneOrbEnchantment } from "optolith-database-schema/types/traditionArtifacts/ArcaneOrbEnchantment"
import { AttireEnchantment } from "optolith-database-schema/types/traditionArtifacts/AttireEnchantment"
import { BowlEnchantment } from "optolith-database-schema/types/traditionArtifacts/BowlEnchantment"
import { CauldronEnchantment } from "optolith-database-schema/types/traditionArtifacts/CauldronEnchantment"
import { ChronicleEnchantment } from "optolith-database-schema/types/traditionArtifacts/ChronicleEnchantment"
import { DaggerRitual } from "optolith-database-schema/types/traditionArtifacts/DaggerRitual"
import { FoolsHatEnchantment } from "optolith-database-schema/types/traditionArtifacts/FoolsHatEnchantment"
import { InstrumentEnchantment } from "optolith-database-schema/types/traditionArtifacts/InstrumentEnchantment"
import { Krallenkettenzauber } from "optolith-database-schema/types/traditionArtifacts/Krallenkettenzauber"
import { OrbEnchantment } from "optolith-database-schema/types/traditionArtifacts/OrbEnchantment"
import { RingEnchantment } from "optolith-database-schema/types/traditionArtifacts/RingEnchantment"
import { SickleRitual } from "optolith-database-schema/types/traditionArtifacts/SickleRitual"
import { SpellSwordEnchantment } from "optolith-database-schema/types/traditionArtifacts/SpellSwordEnchantment"
import { StaffEnchantment } from "optolith-database-schema/types/traditionArtifacts/StaffEnchantment"
import { ToyEnchantment } from "optolith-database-schema/types/traditionArtifacts/ToyEnchantment"
import { Trinkhornzauber } from "optolith-database-schema/types/traditionArtifacts/Trinkhornzauber"
import { WandEnchantment } from "optolith-database-schema/types/traditionArtifacts/WandEnchantment"
import { WeaponEnchantment } from "optolith-database-schema/types/traditionArtifacts/WeaponEnchantment"
import { Compare, compareAt, reduceCompare } from "../../utils/compare.ts"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { SpecialAbilitiesSortOrder } from "../sortOrders.ts"
import { DisplayedActiveActivatable } from "./activatableActive.ts"
import { DisplayedInactiveActivatable } from "./activatableInactive.ts"

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
    | DisplayedInactiveActivatable<
        keyof SpecialAbilityTagTypeMap,
        { translations: LocaleMap<{ name: string }> }
      >
    | DisplayedActiveActivatable<
        keyof SpecialAbilityTagTypeMap,
        { translations: LocaleMap<{ name: string }> }
      >,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  sortOrder: SpecialAbilitiesSortOrder,
  translate: Translate,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T) => translateMap(c.static.translations)?.name ?? ""
  return (
    filterText === ""
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(
          c => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
        )
  ).sort(
    (() => {
      switch (sortOrder) {
        case SpecialAbilitiesSortOrder.Name:
          return compareAt(getName, localeCompare)
        case SpecialAbilitiesSortOrder.Group:
          return reduceCompare(
            compareAt(x => translate(specialAbilityGroupTranslationKeys[x.kind]), localeCompare),
            compareAt(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}
