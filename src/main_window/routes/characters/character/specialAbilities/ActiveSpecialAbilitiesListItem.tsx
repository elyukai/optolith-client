import { FC } from "react"
import {
  SpecialAbilityTagTypeMap,
  specialAbilityGroupTranslationKeys,
} from "../../../../../shared/domain/activatable/specialAbilities.ts"
import { DisplayedActiveSpecialAbility } from "../../../../../shared/domain/activatable/specialAbilitiesActive.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useActiveSpecialAbilityActions } from "../../../../hooks/activatableActions.ts"
import {
  changeAdvancedCombatSpecialAbilityLevel,
  removeAdvancedCombatSpecialAbility,
} from "../../../../slices/specialAbilities/advancedCombatSpecialAbilitiesSlice.ts"
import {
  changeAdvancedKarmaSpecialAbilityLevel,
  removeAdvancedKarmaSpecialAbility,
} from "../../../../slices/specialAbilities/advancedKarmaSpecialAbilitiesSlice.ts"
import {
  changeAdvancedMagicalSpecialAbilityLevel,
  removeAdvancedMagicalSpecialAbility,
} from "../../../../slices/specialAbilities/advancedMagicalSpecialAbilitiesSlice.ts"
import {
  changeAdvancedSkillSpecialAbilityLevel,
  removeAdvancedSkillSpecialAbility,
} from "../../../../slices/specialAbilities/advancedSkillSpecialAbilitiesSlice.ts"
import {
  changeAncestorGlyphLevel,
  removeAncestorGlyph,
} from "../../../../slices/specialAbilities/ancestorGlyphsSlice.ts"
import {
  changeArcaneOrbEnchantmentLevel,
  removeArcaneOrbEnchantment,
} from "../../../../slices/specialAbilities/arcaneOrbEnchantmentsSlice.ts"
import {
  changeAttireEnchantmentLevel,
  removeAttireEnchantment,
} from "../../../../slices/specialAbilities/attireEnchantmentsSlice.ts"
import {
  changeBlessedTraditionLevel,
  removeBlessedTradition,
} from "../../../../slices/specialAbilities/blessedTraditionsSlice.ts"
import {
  changeBowlEnchantmentLevel,
  removeBowlEnchantment,
} from "../../../../slices/specialAbilities/bowlEnchantmentsSlice.ts"
import {
  changeBrawlingSpecialAbilityLevel,
  removeBrawlingSpecialAbility,
} from "../../../../slices/specialAbilities/brawlingSpecialAbilitiesSlice.ts"
import {
  changeCauldronEnchantmentLevel,
  removeCauldronEnchantment,
} from "../../../../slices/specialAbilities/cauldronEnchantmentsSlice.ts"
import {
  changeCeremonialItemSpecialAbilityLevel,
  removeCeremonialItemSpecialAbility,
} from "../../../../slices/specialAbilities/ceremonialItemSpecialAbilitiesSlice.ts"
import {
  changeChronicleEnchantmentLevel,
  removeChronicleEnchantment,
} from "../../../../slices/specialAbilities/chronicleEnchantmentsSlice.ts"
import {
  changeCombatSpecialAbilityLevel,
  removeCombatSpecialAbility,
} from "../../../../slices/specialAbilities/combatSpecialAbilitiesSlice.ts"
import {
  changeCombatStyleSpecialAbilityLevel,
  removeCombatStyleSpecialAbility,
} from "../../../../slices/specialAbilities/combatStyleSpecialAbilitiesSlice.ts"
import {
  changeCommandSpecialAbilityLevel,
  removeCommandSpecialAbility,
} from "../../../../slices/specialAbilities/commandSpecialAbilitiesSlice.ts"
import {
  changeDaggerRitualLevel,
  removeDaggerRitual,
} from "../../../../slices/specialAbilities/daggerRitualsSlice.ts"
import {
  changeFamiliarSpecialAbilityLevel,
  removeFamiliarSpecialAbility,
} from "../../../../slices/specialAbilities/familiarSpecialAbilitiesSlice.ts"
import {
  changeFatePointSexSpecialAbilityLevel,
  removeFatePointSexSpecialAbility,
} from "../../../../slices/specialAbilities/fatePointSexSpecialAbilitiesSlice.ts"
import {
  changeFatePointSpecialAbilityLevel,
  removeFatePointSpecialAbility,
} from "../../../../slices/specialAbilities/fatePointSpecialAbilitiesSlice.ts"
import {
  changeFoolsHatEnchantmentLevel,
  removeFoolsHatEnchantment,
} from "../../../../slices/specialAbilities/foolsHatEnchantmentsSlice.ts"
import {
  changeGeneralSpecialAbilityLevel,
  removeGeneralSpecialAbility,
} from "../../../../slices/specialAbilities/generalSpecialAbilitiesSlice.ts"
import {
  changeInstrumentEnchantmentLevel,
  removeInstrumentEnchantment,
} from "../../../../slices/specialAbilities/instrumentEnchantmentsSlice.ts"
import {
  changeKarmaSpecialAbilityLevel,
  removeKarmaSpecialAbility,
} from "../../../../slices/specialAbilities/karmaSpecialAbilitiesSlice.ts"
import {
  changeKrallenkettenzauberLevel,
  removeKrallenkettenzauber,
} from "../../../../slices/specialAbilities/krallenkettenzauberSlice.ts"
import {
  changeLiturgicalStyleSpecialAbilityLevel,
  removeLiturgicalStyleSpecialAbility,
} from "../../../../slices/specialAbilities/liturgicalStyleSpecialAbilitiesSlice.ts"
import {
  changeLycantropicGiftLevel,
  removeLycantropicGift,
} from "../../../../slices/specialAbilities/lycantropicGiftsSlice.ts"
import {
  changeMagicStyleSpecialAbilityLevel,
  removeMagicStyleSpecialAbility,
} from "../../../../slices/specialAbilities/magicStyleSpecialAbilitiesSlice.ts"
import {
  changeMagicalSignLevel,
  removeMagicalSign,
} from "../../../../slices/specialAbilities/magicalSignsSlice.ts"
import {
  changeMagicalSpecialAbilityLevel,
  removeMagicalSpecialAbility,
} from "../../../../slices/specialAbilities/magicalSpecialAbilitiesSlice.ts"
import {
  changeMagicalTraditionLevel,
  removeMagicalTradition,
} from "../../../../slices/specialAbilities/magicalTraditionsSlice.ts"
import {
  changeOrbEnchantmentLevel,
  removeOrbEnchantment,
} from "../../../../slices/specialAbilities/orbEnchantmentsSlice.ts"
import {
  changePactGiftLevel,
  removePactGift,
} from "../../../../slices/specialAbilities/pactGiftsSlice.ts"
import {
  changeProtectiveWardingCircleSpecialAbilityLevel,
  removeProtectiveWardingCircleSpecialAbility,
} from "../../../../slices/specialAbilities/protectiveWardingCircleSpecialAbilitiesSlice.ts"
import {
  changeRingEnchantmentLevel,
  removeRingEnchantment,
} from "../../../../slices/specialAbilities/ringEnchantmentsSlice.ts"
import {
  changeSermonLevel,
  removeSermon,
} from "../../../../slices/specialAbilities/sermonsSlice.ts"
import {
  changeSexSpecialAbilityLevel,
  removeSexSpecialAbility,
} from "../../../../slices/specialAbilities/sexSpecialAbilitiesSlice.ts"
import {
  changeSickleRitualLevel,
  removeSickleRitual,
} from "../../../../slices/specialAbilities/sickleRitualsSlice.ts"
import {
  changeSikaryanDrainSpecialAbilityLevel,
  removeSikaryanDrainSpecialAbility,
} from "../../../../slices/specialAbilities/sikaryanDrainSpecialAbilitiesSlice.ts"
import {
  changeSkillStyleSpecialAbilityLevel,
  removeSkillStyleSpecialAbility,
} from "../../../../slices/specialAbilities/skillStyleSpecialAbilitiesSlice.ts"
import {
  changeSpellSwordEnchantmentLevel,
  removeSpellSwordEnchantment,
} from "../../../../slices/specialAbilities/spellSwordEnchantmentsSlice.ts"
import {
  changeStaffEnchantmentLevel,
  removeStaffEnchantment,
} from "../../../../slices/specialAbilities/staffEnchantmentsSlice.ts"
import {
  changeToyEnchantmentLevel,
  removeToyEnchantment,
} from "../../../../slices/specialAbilities/toyEnchantmentsSlice.ts"
import {
  changeTrinkhornzauberLevel,
  removeTrinkhornzauber,
} from "../../../../slices/specialAbilities/trinkhornzauberSlice.ts"
import {
  changeVampiricGiftLevel,
  removeVampiricGift,
} from "../../../../slices/specialAbilities/vampiricGiftsSlice.ts"
import {
  changeVisionLevel,
  removeVision,
} from "../../../../slices/specialAbilities/visionsSlice.ts"
import {
  changeWandEnchantmentLevel,
  removeWandEnchantment,
} from "../../../../slices/specialAbilities/wandEnchantmentsSlice.ts"
import {
  changeWeaponEnchantmentLevel,
  removeWeaponEnchantment,
} from "../../../../slices/specialAbilities/weaponEnchantmentsSlice.ts"
import { ActiveActivatablesListItem } from "../activatable/ActiveActivatableListItem.tsx"

type Props = {
  specialAbility: DisplayedActiveSpecialAbility
}

// prettier-ignore
const specialAbilityActions = {
  AdvancedCombatSpecialAbility: [removeAdvancedCombatSpecialAbility, changeAdvancedCombatSpecialAbilityLevel],
  AdvancedKarmaSpecialAbility: [removeAdvancedKarmaSpecialAbility, changeAdvancedKarmaSpecialAbilityLevel],
  AdvancedMagicalSpecialAbility: [removeAdvancedMagicalSpecialAbility, changeAdvancedMagicalSpecialAbilityLevel],
  AdvancedSkillSpecialAbility: [removeAdvancedSkillSpecialAbility, changeAdvancedSkillSpecialAbilityLevel],
  AncestorGlyph: [removeAncestorGlyph, changeAncestorGlyphLevel],
  ArcaneOrbEnchantment: [removeArcaneOrbEnchantment, changeArcaneOrbEnchantmentLevel],
  AttireEnchantment: [removeAttireEnchantment, changeAttireEnchantmentLevel],
  BlessedTradition: [removeBlessedTradition, changeBlessedTraditionLevel],
  BowlEnchantment: [removeBowlEnchantment, changeBowlEnchantmentLevel],
  BrawlingSpecialAbility: [removeBrawlingSpecialAbility, changeBrawlingSpecialAbilityLevel],
  CauldronEnchantment: [removeCauldronEnchantment, changeCauldronEnchantmentLevel],
  CeremonialItemSpecialAbility: [removeCeremonialItemSpecialAbility, changeCeremonialItemSpecialAbilityLevel],
  ChronicleEnchantment: [removeChronicleEnchantment, changeChronicleEnchantmentLevel],
  CombatSpecialAbility: [removeCombatSpecialAbility, changeCombatSpecialAbilityLevel],
  CombatStyleSpecialAbility: [removeCombatStyleSpecialAbility, changeCombatStyleSpecialAbilityLevel],
  CommandSpecialAbility: [removeCommandSpecialAbility, changeCommandSpecialAbilityLevel],
  DaggerRitual: [removeDaggerRitual, changeDaggerRitualLevel],
  FamiliarSpecialAbility: [removeFamiliarSpecialAbility, changeFamiliarSpecialAbilityLevel],
  FatePointSexSpecialAbility: [removeFatePointSexSpecialAbility, changeFatePointSexSpecialAbilityLevel],
  FatePointSpecialAbility: [removeFatePointSpecialAbility, changeFatePointSpecialAbilityLevel],
  FoolsHatEnchantment: [removeFoolsHatEnchantment, changeFoolsHatEnchantmentLevel],
  GeneralSpecialAbility: [removeGeneralSpecialAbility, changeGeneralSpecialAbilityLevel],
  InstrumentEnchantment: [removeInstrumentEnchantment, changeInstrumentEnchantmentLevel],
  KarmaSpecialAbility: [removeKarmaSpecialAbility, changeKarmaSpecialAbilityLevel],
  Krallenkettenzauber: [removeKrallenkettenzauber, changeKrallenkettenzauberLevel],
  LiturgicalStyleSpecialAbility: [removeLiturgicalStyleSpecialAbility, changeLiturgicalStyleSpecialAbilityLevel],
  LycantropicGift: [removeLycantropicGift, changeLycantropicGiftLevel],
  MagicalSign: [removeMagicalSign, changeMagicalSignLevel],
  MagicalSpecialAbility: [removeMagicalSpecialAbility, changeMagicalSpecialAbilityLevel],
  MagicalTradition: [removeMagicalTradition, changeMagicalTraditionLevel],
  MagicStyleSpecialAbility: [removeMagicStyleSpecialAbility, changeMagicStyleSpecialAbilityLevel],
  OrbEnchantment: [removeOrbEnchantment, changeOrbEnchantmentLevel],
  PactGift: [removePactGift, changePactGiftLevel],
  ProtectiveWardingCircleSpecialAbility: [removeProtectiveWardingCircleSpecialAbility, changeProtectiveWardingCircleSpecialAbilityLevel],
  RingEnchantment: [removeRingEnchantment, changeRingEnchantmentLevel],
  Sermon: [removeSermon, changeSermonLevel],
  SexSpecialAbility: [removeSexSpecialAbility, changeSexSpecialAbilityLevel],
  SickleRitual: [removeSickleRitual, changeSickleRitualLevel],
  SikaryanDrainSpecialAbility: [removeSikaryanDrainSpecialAbility, changeSikaryanDrainSpecialAbilityLevel],
  SkillStyleSpecialAbility: [removeSkillStyleSpecialAbility, changeSkillStyleSpecialAbilityLevel],
  SpellSwordEnchantment: [removeSpellSwordEnchantment, changeSpellSwordEnchantmentLevel],
  StaffEnchantment: [removeStaffEnchantment, changeStaffEnchantmentLevel],
  ToyEnchantment: [removeToyEnchantment, changeToyEnchantmentLevel],
  Trinkhornzauber: [removeTrinkhornzauber, changeTrinkhornzauberLevel],
  VampiricGift: [removeVampiricGift, changeVampiricGiftLevel],
  Vision: [removeVision, changeVisionLevel],
  WandEnchantment: [removeWandEnchantment, changeWandEnchantmentLevel],
  WeaponEnchantment: [removeWeaponEnchantment, changeWeaponEnchantmentLevel],
} as const

/**
 * Displays an advantage that is currently active.
 */
export const ActiveSpecialAbilitiesListItem: FC<Props> = props => {
  const { specialAbility } = props
  const [removeAction, changeLevelAction] = specialAbilityActions[specialAbility.kind]
  const { handleChangeLevel, handleRemove } = useActiveSpecialAbilityActions(
    removeAction,
    changeLevelAction,
    getCreateIdentifierObject(specialAbility.kind),
  )

  return (
    <ActiveActivatablesListItem<
      keyof SpecialAbilityTagTypeMap,
      SpecialAbilityTagTypeMap[keyof SpecialAbilityTagTypeMap]
    >
      activatable={specialAbility}
      changeLevel={handleChangeLevel}
      remove={handleRemove}
      createActivatableIdentifierObject={getCreateIdentifierObject(specialAbility.kind)}
      groupNameKey={specialAbilityGroupTranslationKeys[specialAbility.kind]}
    />
  )
}
