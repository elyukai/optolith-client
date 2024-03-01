import { createSelector } from "@reduxjs/toolkit"
import { DisplayedActiveActivatable } from "../../shared/domain/activatable/activatableActive.ts"
import {
  Activatable,
  countActivations,
  isTinyActivatableActive,
} from "../../shared/domain/activatable/activatableEntry.ts"
import { DisplayedInactiveActivatable } from "../../shared/domain/activatable/activatableInactive.ts"
import { SpecialAbilityTagTypeMap } from "../../shared/domain/activatable/specialAbilities.ts"
import {
  DisplayedActiveSpecialAbility,
  getActiveSpecialAbilities,
} from "../../shared/domain/activatable/specialAbilitiesActive.ts"
import {
  DisplayedInactiveSpecialAbility,
  getInactiveSpecialAbilities,
} from "../../shared/domain/activatable/specialAbilitiesInactive.ts"
import {
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "../../shared/domain/rated/ratedEntry.ts"
import { count, sumWith } from "../../shared/utils/array.ts"
import { mapObject } from "../../shared/utils/object.ts"
import { RootState } from "../store.ts"
import { selectGetSelectOptionsById } from "./activatableSelectors.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectFilterApplyingActivatableDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectCapabilitiesForPrerequisitesOfGeneralEntryWithLevels } from "./prerequisiteSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"

// prettier-ignore
const selectorConfigMap: {
  [K in keyof SpecialAbilityTagTypeMap]: {
    staticSpecialAbilitiesSelector: (state: RootState) => SpecialAbilityTagTypeMap[K][],
    getStaticSpecialAbilityByIdSelector: (state: RootState) => (id: number) => SpecialAbilityTagTypeMap[K] | undefined,
    dynamicSpecialAbilitiesSelector: (state: RootState) => Activatable[]
    getDynamicSpecialAbilityByIdSelector: (state: RootState) => (id: number) => Activatable | undefined
  }
} = {
  "AdvancedCombatSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.AdvancedCombatSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AdvancedCombatSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AdvancedCombatSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AdvancedCombatSpecialAbility },
  "AdvancedKarmaSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.AdvancedKarmaSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AdvancedKarmaSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AdvancedKarmaSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AdvancedKarmaSpecialAbility },
  "AdvancedMagicalSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.AdvancedMagicalSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AdvancedMagicalSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AdvancedMagicalSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AdvancedMagicalSpecialAbility },
  "AdvancedSkillSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.AdvancedSkillSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AdvancedSkillSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AdvancedSkillSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AdvancedSkillSpecialAbility },
  "AncestorGlyph": { staticSpecialAbilitiesSelector: SelectAll.Static.AncestorGlyphs, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AncestorGlyph, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AncestorGlyphs, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AncestorGlyph },
  "ArcaneOrbEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.ArcaneOrbEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.ArcaneOrbEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.ArcaneOrbEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.ArcaneOrbEnchantment },
  "AttireEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.AttireEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.AttireEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.AttireEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.AttireEnchantment },
  "BlessedTradition": { staticSpecialAbilitiesSelector: SelectAll.Static.BlessedTraditions, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.BlessedTradition, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.BlessedTraditions, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.BlessedTradition },
  "BowlEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.BowlEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.BowlEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.BowlEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.BowlEnchantment },
  "BrawlingSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.BrawlingSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.BrawlingSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.BrawlingSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.BrawlingSpecialAbility },
  "CauldronEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.CauldronEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.CauldronEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.CauldronEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.CauldronEnchantment },
  "CeremonialItemSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.CeremonialItemSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.CeremonialItemSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.CeremonialItemSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.CeremonialItemSpecialAbility },
  "ChronicleEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.ChronicleEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.ChronicleEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.ChronicleEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.ChronicleEnchantment },
  "CombatSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.CombatSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.CombatSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.CombatSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.CombatSpecialAbility },
  "CombatStyleSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.CombatStyleSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.CombatStyleSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.CombatStyleSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.CombatStyleSpecialAbility },
  "CommandSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.CommandSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.CommandSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.CommandSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.CommandSpecialAbility },
  "DaggerRitual": { staticSpecialAbilitiesSelector: SelectAll.Static.DaggerRituals, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.DaggerRitual, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.DaggerRituals, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.DaggerRitual },
  "FamiliarSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.FamiliarSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.FamiliarSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.FamiliarSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.FamiliarSpecialAbility },
  "FatePointSexSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.FatePointSexSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.FatePointSexSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.FatePointSexSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.FatePointSexSpecialAbility },
  "FatePointSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.FatePointSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.FatePointSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.FatePointSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.FatePointSpecialAbility },
  "FoolsHatEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.FoolsHatEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.FoolsHatEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.FoolsHatEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.FoolsHatEnchantment },
  "GeneralSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.GeneralSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.GeneralSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.GeneralSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.GeneralSpecialAbility },
  "InstrumentEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.InstrumentEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.InstrumentEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.InstrumentEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.InstrumentEnchantment },
  "KarmaSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.KarmaSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.KarmaSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.KarmaSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.KarmaSpecialAbility },
  "Krallenkettenzauber": { staticSpecialAbilitiesSelector: SelectAll.Static.Krallenkettenzauber, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.Krallenkettenzauber, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.Krallenkettenzauber, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.Krallenkettenzauber },
  "LiturgicalStyleSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.LiturgicalStyleSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.LiturgicalStyleSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.LiturgicalStyleSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.LiturgicalStyleSpecialAbility },
  "LycantropicGift": { staticSpecialAbilitiesSelector: SelectAll.Static.LycantropicGifts, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.LycantropicGift, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.LycantropicGifts, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.LycantropicGift },
  "MagicalSign": { staticSpecialAbilitiesSelector: SelectAll.Static.MagicalSigns, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.MagicalSign, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.MagicalSigns, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.MagicalSign },
  "MagicalSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.MagicalSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.MagicalSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.MagicalSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.MagicalSpecialAbility },
  "MagicalTradition": { staticSpecialAbilitiesSelector: SelectAll.Static.MagicalTraditions, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.MagicalTradition, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.MagicalTraditions, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.MagicalTradition },
  "MagicStyleSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.MagicStyleSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.MagicStyleSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.MagicStyleSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.MagicStyleSpecialAbility },
  "OrbEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.OrbEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.OrbEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.OrbEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.OrbEnchantment },
  "PactGift": { staticSpecialAbilitiesSelector: SelectAll.Static.PactGifts, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.PactGift, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.PactGifts, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.PactGift },
  "ProtectiveWardingCircleSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.ProtectiveWardingCircleSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.ProtectiveWardingCircleSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.ProtectiveWardingCircleSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.ProtectiveWardingCircleSpecialAbility },
  "RingEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.RingEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.RingEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.RingEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.RingEnchantment },
  "Sermon": { staticSpecialAbilitiesSelector: SelectAll.Static.Sermons, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.Sermon, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.Sermons, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.Sermon },
  "SexSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.SexSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.SexSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.SexSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.SexSpecialAbility },
  "SickleRitual": { staticSpecialAbilitiesSelector: SelectAll.Static.SickleRituals, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.SickleRitual, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.SickleRituals, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.SickleRitual },
  "SikaryanDrainSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.SikaryanDrainSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.SikaryanDrainSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.SikaryanDrainSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.SikaryanDrainSpecialAbility },
  "SkillStyleSpecialAbility": { staticSpecialAbilitiesSelector: SelectAll.Static.SkillStyleSpecialAbilities, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.SkillStyleSpecialAbility, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.SkillStyleSpecialAbilities, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.SkillStyleSpecialAbility },
  "SpellSwordEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.SpellSwordEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.SpellSwordEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.SpellSwordEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.SpellSwordEnchantment },
  "StaffEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.StaffEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.StaffEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.StaffEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.StaffEnchantment },
  "ToyEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.ToyEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.ToyEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.ToyEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.ToyEnchantment },
  "Trinkhornzauber": { staticSpecialAbilitiesSelector: SelectAll.Static.Trinkhornzauber, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.Trinkhornzauber, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.Trinkhornzauber, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.Trinkhornzauber },
  "VampiricGift": { staticSpecialAbilitiesSelector: SelectAll.Static.VampiricGifts, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.VampiricGift, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.VampiricGifts, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.VampiricGift },
  "Vision": { staticSpecialAbilitiesSelector: SelectAll.Static.Visions, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.Vision, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.Visions, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.Vision },
  "WandEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.WandEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.WandEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.WandEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.WandEnchantment },
  "WeaponEnchantment": { staticSpecialAbilitiesSelector: SelectAll.Static.WeaponEnchantments, getStaticSpecialAbilityByIdSelector: SelectGetById.Static.WeaponEnchantment, dynamicSpecialAbilitiesSelector: SelectAll.Dynamic.WeaponEnchantments, getDynamicSpecialAbilityByIdSelector: SelectGetById.Dynamic.WeaponEnchantment },
}

const createActiveSpecialAbilitySelector = <K extends keyof SpecialAbilityTagTypeMap>(tag: K) =>
  createSelector(
    selectorConfigMap[tag].getStaticSpecialAbilityByIdSelector,
    selectorConfigMap[tag].dynamicSpecialAbilitiesSelector,
    selectCapabilitiesForPrerequisitesOfGeneralEntryWithLevels,
    selectGetSelectOptionsById,
    selectFilterApplyingActivatableDependencies,
    createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
      sumWith(dynamicSermons, countActivations),
    ),
    createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
      sumWith(dynamicVisions, countActivations),
    ),
    createSelector(SelectAll.Dynamic.Cantrips, dynamicCantrips =>
      count(dynamicCantrips, isTinyActivatableActive),
    ),
    createSelector(
      SelectAll.Dynamic.Spells,
      SelectAll.Dynamic.Rituals,
      (dynamicSpells, dynamicRituals) =>
        count(dynamicSpells, isRatedWithEnhancementsActive) +
        count(dynamicRituals, isRatedWithEnhancementsActive),
    ),
    createSelector(
      SelectAll.Dynamic.Curses,
      SelectAll.Dynamic.ElvenMagicalSongs,
      SelectAll.Dynamic.DominationRituals,
      SelectAll.Dynamic.MagicalDances,
      SelectAll.Dynamic.MagicalMelodies,
      SelectAll.Dynamic.JesterTricks,
      SelectAll.Dynamic.AnimistPowers,
      SelectAll.Dynamic.GeodeRituals,
      SelectAll.Dynamic.ZibiljaRituals,
      (
        dynamicCurses,
        dynamicElvenMagicalSongs,
        dynamicDominationRituals,
        dynamicMagicalDances,
        dynamicMagicalMelodies,
        dynamicJesterTricks,
        dynamicAnimistPowers,
        dynamicGeodeRituals,
        dynamicZibiljaRituals,
      ) =>
        count(dynamicCurses, isRatedActive) +
        count(dynamicElvenMagicalSongs, isRatedActive) +
        count(dynamicDominationRituals, isRatedActive) +
        count(dynamicMagicalDances, isRatedActive) +
        count(dynamicMagicalMelodies, isRatedActive) +
        count(dynamicJesterTricks, isRatedActive) +
        count(dynamicAnimistPowers, isRatedActive) +
        count(dynamicGeodeRituals, isRatedActive) +
        count(dynamicZibiljaRituals, isRatedActive),
    ),
    createSelector(SelectAll.Dynamic.Blessings, dynamicBlessings =>
      count(dynamicBlessings, isTinyActivatableActive),
    ),
    createSelector(SelectAll.Dynamic.LiturgicalChants, dynamicLiturgicalChants =>
      count(dynamicLiturgicalChants, isRatedWithEnhancementsActive),
    ),
    createSelector(SelectAll.Dynamic.Ceremonies, dynamicCeremonies =>
      count(dynamicCeremonies, isRatedWithEnhancementsActive),
    ),
    SelectGetById.Dynamic.Skill,
    SelectGetById.Dynamic.LiturgicalChant,
    SelectGetById.Dynamic.Ceremony,
    SelectGetById.Dynamic.Spell,
    SelectGetById.Dynamic.Ritual,
    SelectGetById.Dynamic.CloseCombatTechnique,
    SelectGetById.Dynamic.RangedCombatTechnique,
    selectStartExperienceLevel,
    (
      getStaticSpecialAbilityById,
      dynamicSpecialAbilities,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      activeSermonsCount,
      activeVisionsCount,
      activeCantripsCount,
      activeSpellworksCount,
      activeMagicalActionsCount,
      activeBlessingsCount,
      activeLiturgicalChantsCount,
      activeCeremoniesCount,
      getDynamicSkillById,
      getDynamicLiturgicalChantById,
      getDynamicCeremonyById,
      getDynamicSpellById,
      getDynamicRitualById,
      getDynamicCloseCombatTechniqueById,
      getDynamicRangedCombatTechniqueById,
      startExperienceLevel,
    ): DisplayedActiveActivatable<K, SpecialAbilityTagTypeMap[K]>[] =>
      getActiveSpecialAbilities(
        tag,
        getStaticSpecialAbilityById,
        dynamicSpecialAbilities,
        prerequisiteCapabilities,
        getSelectOptionsById,
        filterApplyingDependencies,
        {
          startExperienceLevel,
          activeSermonsCount,
          activeVisionsCount,
          activeCantripsCount,
          activeSpellworksCount,
          activeMagicalActionsCount,
          activeBlessingsCount,
          activeLiturgicalChantsCount,
          activeCeremoniesCount,
          getDynamicSkillById,
          getDynamicLiturgicalChantById,
          getDynamicCeremonyById,
          getDynamicSpellById,
          getDynamicRitualById,
          getDynamicCloseCombatTechniqueById,
          getDynamicRangedCombatTechniqueById,
        },
      ),
  )

// prettier-ignore
const {
  AdvancedCombatSpecialAbility: selectVisibleActiveAdvancedCombatSpecialAbilities,
  AdvancedKarmaSpecialAbility: selectVisibleActiveAdvancedKarmaSpecialAbilities,
  AdvancedMagicalSpecialAbility: selectVisibleActiveAdvancedMagicalSpecialAbilities,
  AdvancedSkillSpecialAbility: selectVisibleActiveAdvancedSkillSpecialAbilities,
  AncestorGlyph: selectVisibleActiveAncestorGlyphs,
  ArcaneOrbEnchantment: selectVisibleActiveArcaneOrbEnchantments,
  AttireEnchantment: selectVisibleActiveAttireEnchantments,
  BlessedTradition: selectVisibleActiveBlessedTraditions,
  BowlEnchantment: selectVisibleActiveBowlEnchantments,
  BrawlingSpecialAbility: selectVisibleActiveBrawlingSpecialAbilities,
  CauldronEnchantment: selectVisibleActiveCauldronEnchantments,
  CeremonialItemSpecialAbility: selectVisibleActiveCeremonialItemSpecialAbilities,
  ChronicleEnchantment: selectVisibleActiveChronicleEnchantments,
  CombatSpecialAbility: selectVisibleActiveCombatSpecialAbilities,
  CombatStyleSpecialAbility: selectVisibleActiveCombatStyleSpecialAbilities,
  CommandSpecialAbility: selectVisibleActiveCommandSpecialAbilities,
  DaggerRitual: selectVisibleActiveDaggerRituals,
  FamiliarSpecialAbility: selectVisibleActiveFamiliarSpecialAbilities,
  FatePointSexSpecialAbility: selectVisibleActiveFatePointSexSpecialAbilities,
  FatePointSpecialAbility: selectVisibleActiveFatePointSpecialAbilities,
  FoolsHatEnchantment: selectVisibleActiveFoolsHatEnchantments,
  GeneralSpecialAbility: selectVisibleActiveGeneralSpecialAbilities,
  InstrumentEnchantment: selectVisibleActiveInstrumentEnchantments,
  KarmaSpecialAbility: selectVisibleActiveKarmaSpecialAbilities,
  Krallenkettenzauber: selectVisibleActiveKrallenkettenzauber,
  LiturgicalStyleSpecialAbility: selectVisibleActiveLiturgicalStyleSpecialAbilities,
  LycantropicGift: selectVisibleActiveLycantropicGifts,
  MagicalSign: selectVisibleActiveMagicalSigns,
  MagicalSpecialAbility: selectVisibleActiveMagicalSpecialAbilities,
  MagicalTradition: selectVisibleActiveMagicalTraditions,
  MagicStyleSpecialAbility: selectVisibleActiveMagicStyleSpecialAbilities,
  OrbEnchantment: selectVisibleActiveOrbEnchantments,
  PactGift: selectVisibleActivePactGifts,
  ProtectiveWardingCircleSpecialAbility: selectVisibleActiveProtectiveWardingCircleSpecialAbilities,
  RingEnchantment: selectVisibleActiveRingEnchantments,
  Sermon: selectVisibleActiveSermons,
  SexSpecialAbility: selectVisibleActiveSexSpecialAbilities,
  SickleRitual: selectVisibleActiveSickleRituals,
  SikaryanDrainSpecialAbility: selectVisibleActiveSikaryanDrainSpecialAbilities,
  SkillStyleSpecialAbility: selectVisibleActiveSkillStyleSpecialAbilities,
  SpellSwordEnchantment: selectVisibleActiveSpellSwordEnchantments,
  StaffEnchantment: selectVisibleActiveStaffEnchantments,
  ToyEnchantment: selectVisibleActiveToyEnchantments,
  Trinkhornzauber: selectVisibleActiveTrinkhornzauber,
  VampiricGift: selectVisibleActiveVampiricGifts,
  Vision: selectVisibleActiveVisions,
  WandEnchantment: selectVisibleActiveWandEnchantments,
  WeaponEnchantment: selectVisibleActiveWeaponEnchantments,
} = mapObject(selectorConfigMap, (_config, tag) => createActiveSpecialAbilitySelector(tag)) as {
  [K in keyof SpecialAbilityTagTypeMap]: (state: RootState) => DisplayedActiveActivatable<K, SpecialAbilityTagTypeMap[K]>[]
}

/**
 * Selects all visible active special abilities.
 */
export const selectVisibleActiveSpecialAbilities = createSelector(
  selectVisibleActiveAdvancedCombatSpecialAbilities,
  selectVisibleActiveAdvancedKarmaSpecialAbilities,
  selectVisibleActiveAdvancedMagicalSpecialAbilities,
  selectVisibleActiveAdvancedSkillSpecialAbilities,
  selectVisibleActiveAncestorGlyphs,
  selectVisibleActiveArcaneOrbEnchantments,
  selectVisibleActiveAttireEnchantments,
  selectVisibleActiveBlessedTraditions,
  selectVisibleActiveBowlEnchantments,
  selectVisibleActiveBrawlingSpecialAbilities,
  selectVisibleActiveCauldronEnchantments,
  selectVisibleActiveCeremonialItemSpecialAbilities,
  selectVisibleActiveChronicleEnchantments,
  selectVisibleActiveCombatSpecialAbilities,
  selectVisibleActiveCombatStyleSpecialAbilities,
  selectVisibleActiveCommandSpecialAbilities,
  selectVisibleActiveDaggerRituals,
  selectVisibleActiveFamiliarSpecialAbilities,
  selectVisibleActiveFatePointSexSpecialAbilities,
  selectVisibleActiveFatePointSpecialAbilities,
  selectVisibleActiveFoolsHatEnchantments,
  selectVisibleActiveGeneralSpecialAbilities,
  selectVisibleActiveInstrumentEnchantments,
  selectVisibleActiveKarmaSpecialAbilities,
  selectVisibleActiveKrallenkettenzauber,
  selectVisibleActiveLiturgicalStyleSpecialAbilities,
  selectVisibleActiveLycantropicGifts,
  selectVisibleActiveMagicalSigns,
  selectVisibleActiveMagicalSpecialAbilities,
  selectVisibleActiveMagicalTraditions,
  selectVisibleActiveMagicStyleSpecialAbilities,
  selectVisibleActiveOrbEnchantments,
  selectVisibleActivePactGifts,
  selectVisibleActiveProtectiveWardingCircleSpecialAbilities,
  selectVisibleActiveRingEnchantments,
  selectVisibleActiveSermons,
  selectVisibleActiveSexSpecialAbilities,
  selectVisibleActiveSickleRituals,
  selectVisibleActiveSikaryanDrainSpecialAbilities,
  selectVisibleActiveSkillStyleSpecialAbilities,
  selectVisibleActiveSpellSwordEnchantments,
  selectVisibleActiveStaffEnchantments,
  selectVisibleActiveToyEnchantments,
  selectVisibleActiveTrinkhornzauber,
  selectVisibleActiveVampiricGifts,
  selectVisibleActiveVisions,
  selectVisibleActiveWandEnchantments,
  selectVisibleActiveWeaponEnchantments,
  (...activeSpecialAbilities: DisplayedActiveSpecialAbility[][]) => activeSpecialAbilities.flat(),
)

const createInactiveSpecialAbilitySelector = <K extends keyof SpecialAbilityTagTypeMap>(tag: K) =>
  createSelector(
    selectorConfigMap[tag].staticSpecialAbilitiesSelector,
    selectorConfigMap[tag].getDynamicSpecialAbilityByIdSelector,
    selectIsEntryAvailable,
    selectCapabilitiesForPrerequisitesOfGeneralEntryWithLevels,
    selectGetSelectOptionsById,
    selectFilterApplyingActivatableDependencies,
    createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
      sumWith(dynamicSermons, countActivations),
    ),
    createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
      sumWith(dynamicVisions, countActivations),
    ),
    createSelector(
      SelectAll.Dynamic.Spells,
      SelectAll.Dynamic.Rituals,
      (dynamicSpells, dynamicRituals) =>
        count(dynamicSpells, isRatedWithEnhancementsActive) +
        count(dynamicRituals, isRatedWithEnhancementsActive),
    ),
    SelectGetById.Dynamic.Advantage,
    (
      staticSpecialAbilities,
      getDynamicSpecialAbilityById,
      isEntryAvailable,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      activeSermonsCount,
      activeVisionsCount,
      activeSpellworksCount,
      getDynamicAdvantageById,
    ): DisplayedInactiveActivatable<K, SpecialAbilityTagTypeMap[K]>[] =>
      getInactiveSpecialAbilities(
        tag,
        staticSpecialAbilities,
        getDynamicSpecialAbilityById,
        isEntryAvailable,
        prerequisiteCapabilities,
        getSelectOptionsById,
        filterApplyingDependencies,
        {
          activeSermonsCount,
          activeVisionsCount,
          activeSpellworksCount,
          getDynamicAdvantageById,
          getDynamicDisadvantageById: getDynamicSpecialAbilityById,
        },
      ),
  )

// prettier-ignore
const {
  AdvancedCombatSpecialAbility: selectVisibleInactiveAdvancedCombatSpecialAbilities,
  AdvancedKarmaSpecialAbility: selectVisibleInactiveAdvancedKarmaSpecialAbilities,
  AdvancedMagicalSpecialAbility: selectVisibleInactiveAdvancedMagicalSpecialAbilities,
  AdvancedSkillSpecialAbility: selectVisibleInactiveAdvancedSkillSpecialAbilities,
  AncestorGlyph: selectVisibleInactiveAncestorGlyphs,
  ArcaneOrbEnchantment: selectVisibleInactiveArcaneOrbEnchantments,
  AttireEnchantment: selectVisibleInactiveAttireEnchantments,
  BlessedTradition: selectVisibleInactiveBlessedTraditions,
  BowlEnchantment: selectVisibleInactiveBowlEnchantments,
  BrawlingSpecialAbility: selectVisibleInactiveBrawlingSpecialAbilities,
  CauldronEnchantment: selectVisibleInactiveCauldronEnchantments,
  CeremonialItemSpecialAbility: selectVisibleInactiveCeremonialItemSpecialAbilities,
  ChronicleEnchantment: selectVisibleInactiveChronicleEnchantments,
  CombatSpecialAbility: selectVisibleInactiveCombatSpecialAbilities,
  CombatStyleSpecialAbility: selectVisibleInactiveCombatStyleSpecialAbilities,
  CommandSpecialAbility: selectVisibleInactiveCommandSpecialAbilities,
  DaggerRitual: selectVisibleInactiveDaggerRituals,
  FamiliarSpecialAbility: selectVisibleInactiveFamiliarSpecialAbilities,
  FatePointSexSpecialAbility: selectVisibleInactiveFatePointSexSpecialAbilities,
  FatePointSpecialAbility: selectVisibleInactiveFatePointSpecialAbilities,
  FoolsHatEnchantment: selectVisibleInactiveFoolsHatEnchantments,
  GeneralSpecialAbility: selectVisibleInactiveGeneralSpecialAbilities,
  InstrumentEnchantment: selectVisibleInactiveInstrumentEnchantments,
  KarmaSpecialAbility: selectVisibleInactiveKarmaSpecialAbilities,
  Krallenkettenzauber: selectVisibleInactiveKrallenkettenzauber,
  LiturgicalStyleSpecialAbility: selectVisibleInactiveLiturgicalStyleSpecialAbilities,
  LycantropicGift: selectVisibleInactiveLycantropicGifts,
  MagicalSign: selectVisibleInactiveMagicalSigns,
  MagicalSpecialAbility: selectVisibleInactiveMagicalSpecialAbilities,
  MagicalTradition: selectVisibleInactiveMagicalTraditions,
  MagicStyleSpecialAbility: selectVisibleInactiveMagicStyleSpecialAbilities,
  OrbEnchantment: selectVisibleInactiveOrbEnchantments,
  PactGift: selectVisibleInactivePactGifts,
  ProtectiveWardingCircleSpecialAbility: selectVisibleInactiveProtectiveWardingCircleSpecialAbilities,
  RingEnchantment: selectVisibleInactiveRingEnchantments,
  Sermon: selectVisibleInactiveSermons,
  SexSpecialAbility: selectVisibleInactiveSexSpecialAbilities,
  SickleRitual: selectVisibleInactiveSickleRituals,
  SikaryanDrainSpecialAbility: selectVisibleInactiveSikaryanDrainSpecialAbilities,
  SkillStyleSpecialAbility: selectVisibleInactiveSkillStyleSpecialAbilities,
  SpellSwordEnchantment: selectVisibleInactiveSpellSwordEnchantments,
  StaffEnchantment: selectVisibleInactiveStaffEnchantments,
  ToyEnchantment: selectVisibleInactiveToyEnchantments,
  Trinkhornzauber: selectVisibleInactiveTrinkhornzauber,
  VampiricGift: selectVisibleInactiveVampiricGifts,
  Vision: selectVisibleInactiveVisions,
  WandEnchantment: selectVisibleInactiveWandEnchantments,
  WeaponEnchantment: selectVisibleInactiveWeaponEnchantments,
} = mapObject(selectorConfigMap, (_config, tag) => createInactiveSpecialAbilitySelector(tag)) as {
  [K in keyof SpecialAbilityTagTypeMap]: (state: RootState) => DisplayedInactiveActivatable<K, SpecialAbilityTagTypeMap[K]>[]
}

const selectVisibleInactiveSpecialAbilitiesPart1 = createSelector(
  selectVisibleInactiveAdvancedCombatSpecialAbilities,
  selectVisibleInactiveAdvancedKarmaSpecialAbilities,
  selectVisibleInactiveAdvancedMagicalSpecialAbilities,
  selectVisibleInactiveAdvancedSkillSpecialAbilities,
  selectVisibleInactiveAncestorGlyphs,
  selectVisibleInactiveArcaneOrbEnchantments,
  selectVisibleInactiveAttireEnchantments,
  selectVisibleInactiveBlessedTraditions,
  selectVisibleInactiveBowlEnchantments,
  selectVisibleInactiveBrawlingSpecialAbilities,
  selectVisibleInactiveCauldronEnchantments,
  selectVisibleInactiveCeremonialItemSpecialAbilities,
  selectVisibleInactiveChronicleEnchantments,
  selectVisibleInactiveCombatSpecialAbilities,
  selectVisibleInactiveCombatStyleSpecialAbilities,
  selectVisibleInactiveCommandSpecialAbilities,
  selectVisibleInactiveDaggerRituals,
  selectVisibleInactiveFamiliarSpecialAbilities,
  selectVisibleInactiveFatePointSexSpecialAbilities,
  selectVisibleInactiveFatePointSpecialAbilities,
  selectVisibleInactiveFoolsHatEnchantments,
  selectVisibleInactiveGeneralSpecialAbilities,
  selectVisibleInactiveInstrumentEnchantments,
  selectVisibleInactiveKarmaSpecialAbilities,
  selectVisibleInactiveKrallenkettenzauber,
  (...inactiveSpecialAbilities: DisplayedInactiveSpecialAbility[][]) =>
    inactiveSpecialAbilities.flat(),
)

const selectVisibleInactiveSpecialAbilitiesPart2 = createSelector(
  selectVisibleInactiveLiturgicalStyleSpecialAbilities,
  selectVisibleInactiveLycantropicGifts,
  selectVisibleInactiveMagicalSigns,
  selectVisibleInactiveMagicalSpecialAbilities,
  selectVisibleInactiveMagicalTraditions,
  selectVisibleInactiveMagicStyleSpecialAbilities,
  selectVisibleInactiveOrbEnchantments,
  selectVisibleInactivePactGifts,
  selectVisibleInactiveProtectiveWardingCircleSpecialAbilities,
  selectVisibleInactiveRingEnchantments,
  selectVisibleInactiveSermons,
  selectVisibleInactiveSexSpecialAbilities,
  selectVisibleInactiveSickleRituals,
  selectVisibleInactiveSikaryanDrainSpecialAbilities,
  selectVisibleInactiveSkillStyleSpecialAbilities,
  selectVisibleInactiveSpellSwordEnchantments,
  selectVisibleInactiveStaffEnchantments,
  selectVisibleInactiveToyEnchantments,
  selectVisibleInactiveTrinkhornzauber,
  selectVisibleInactiveVampiricGifts,
  selectVisibleInactiveVisions,
  selectVisibleInactiveWandEnchantments,
  selectVisibleInactiveWeaponEnchantments,
  (...inactiveSpecialAbilities: DisplayedInactiveSpecialAbility[][]) =>
    inactiveSpecialAbilities.flat(),
)

/**
 * Selects all visible inactive special abilities.
 */
export const selectVisibleInactiveSpecialAbilities = createSelector(
  selectVisibleInactiveSpecialAbilitiesPart1,
  selectVisibleInactiveSpecialAbilitiesPart2,
  (...inactiveSpecialAbilities: DisplayedInactiveSpecialAbility[][]) =>
    inactiveSpecialAbilities.flat(),
)
