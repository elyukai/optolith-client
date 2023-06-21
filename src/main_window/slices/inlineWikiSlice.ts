import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import * as ID from "optolith-database-schema/types/_Identifier"
import { RootState } from "../store.ts"

export type DisplayableMainIdentifier =
  | ID.AdvancedCombatSpecialAbilityIdentifier
  | ID.AdvancedKarmaSpecialAbilityIdentifier
  | ID.AdvancedMagicalSpecialAbilityIdentifier
  | ID.AdvancedSkillSpecialAbilityIdentifier
  | ID.AdvantageIdentifier
  | ID.AlchemicumIdentifier
  | ID.AmmunitionIdentifier
  | ID.AncestorGlyphIdentifier
  | ID.AnimalCareIdentifier
  | ID.AnimalIdentifier
  | ID.AnimistPowerIdentifier
  | ID.ArcaneOrbEnchantmentIdentifier
  | ID.ArmorIdentifier
  | ID.AttireEnchantmentIdentifier
  | ID.BandageOrRemedyIdentifier
  | ID.BlessedTraditionIdentifier
  | ID.BlessingIdentifier
  | ID.BookIdentifier
  | ID.BowlEnchantmentIdentifier
  | ID.BrawlingSpecialAbilityIdentifier
  | ID.CantripIdentifier
  | ID.CauldronEnchantmentIdentifier
  | ID.CeremonialItemIdentifier
  | ID.CeremonialItemSpecialAbilityIdentifier
  | ID.CeremonyIdentifier
  | ID.ChronicleEnchantmentIdentifier
  | ID.CloseCombatTechniqueIdentifier
  | ID.ClothesIdentifier
  | ID.CombatSpecialAbilityIdentifier
  | ID.CombatStyleSpecialAbilityIdentifier
  | ID.CommandSpecialAbilityIdentifier
  | ID.ConditionIdentifier
  | ID.ContainerIdentifier
  | ID.CoreRuleIdentifier
  | ID.CultureIdentifier
  | ID.CurseIdentifier
  | ID.DaggerRitualIdentifier
  | ID.DisadvantageIdentifier
  | ID.DominationRitualIdentifier
  | ID.ElvenMagicalSongIdentifier
  | ID.EquipmentOfBlessedOnesIdentifier
  | ID.ExperienceLevelIdentifier
  | ID.FamiliarSpecialAbilityIdentifier
  | ID.FatePointSexSpecialAbilityIdentifier
  | ID.FocusRuleIdentifier
  | ID.GemOrPreciousStoneIdentifier
  | ID.GeneralSpecialAbilityIdentifier
  | ID.GeodeRitualIdentifier
  | ID.IlluminationLightSourceIdentifier
  | ID.IlluminationRefillsOrSuppliesIdentifier
  | ID.InfluenceIdentifier
  | ID.InstrumentEnchantmentIdentifier
  | ID.JesterTrickIdentifier
  | ID.JewelryIdentifier
  | ID.KarmaSpecialAbilityIdentifier
  | ID.KrallenkettenzauberIdentifier
  | ID.LiebesspielzeugIdentifier
  | ID.LiturgicalChantIdentifier
  | ID.LiturgicalStyleSpecialAbilityIdentifier
  | ID.LuxuryGoodIdentifier
  | ID.LycantropicGiftIdentifier
  | ID.MagicStyleSpecialAbilityIdentifier
  | ID.MagicalArtifactIdentifier
  | ID.MagicalDanceIdentifier
  | ID.MagicalMelodyIdentifier
  | ID.MagicalSpecialAbilityIdentifier
  | ID.MagicalTraditionIdentifier
  | ID.MusicalInstrumentIdentifier
  | ID.OptionalRuleIdentifier
  | ID.OrbEnchantmentIdentifier
  | ID.OrienteeringAidIdentifier
  | ID.PactGiftIdentifier
  | ID.PersonalityTraitIdentifier
  | ID.PoisonIdentifier
  | ID.ProfessionIdentifier
  | ID.ProtectiveWardingCircleSpecialAbilityIdentifier
  | ID.RaceIdentifier
  | ID.RangedCombatTechniqueIdentifier
  | ID.RingEnchantmentIdentifier
  | ID.RitualIdentifier
  | ID.RopeOrChainIdentifier
  | ID.SermonIdentifier
  | ID.SexSpecialAbilityIdentifier
  | ID.SickleRitualIdentifier
  | ID.SikaryanDrainSpecialAbilityIdentifier
  | ID.SkillIdentifier
  | ID.ThievesToolIdentifier
  | ID.ToolOfTheTradeIdentifier
  | ID.ToyEnchantmentIdentifier
  | ID.TravelGearOrToolIdentifier
  | ID.TrinkhornzauberIdentifier
  | ID.VehicleIdentifier
  | ID.VisionIdentifier
  | ID.WandEnchantmentIdentifier
  | ID.WeaponAccessoryIdentifier
  | ID.WeaponEnchantmentIdentifier
  | ID.WeaponIdentifier
  | ID.ZibiljaRitualIdentifier

type InlineWikiState = {
  id?: DisplayableMainIdentifier
}

const initialState: InlineWikiState = {
  id: { tag: "Skill", skill: 33 },
}

const inlineLibrarySlice = createSlice({
  name: "inlineLibrary",
  initialState,
  reducers: {
    changeInlineLibraryEntry(state, action: PayloadAction<DisplayableMainIdentifier>) {
      state.id = action.payload
    },
  },
})

export const { changeInlineLibraryEntry } = inlineLibrarySlice.actions

export const selectInlineLibraryEntryId = (state: RootState) => state.inlineLibrary.id

export const inlineLibraryReducer = inlineLibrarySlice.reducer
