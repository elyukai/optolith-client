import { FC } from "react"
import { specialAbilityGroupTranslationKeys } from "../../../../../shared/domain/activatable/specialAbilities.ts"
import { DisplayedInactiveSpecialAbility } from "../../../../../shared/domain/activatable/specialAbilitiesInactive.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useInactiveSpecialAbilityActions } from "../../../../hooks/activatableActions.ts"
import { addAdvancedCombatSpecialAbility } from "../../../../slices/specialAbilities/advancedCombatSpecialAbilitiesSlice.ts"
import { addAdvancedKarmaSpecialAbility } from "../../../../slices/specialAbilities/advancedKarmaSpecialAbilitiesSlice.ts"
import { addAdvancedMagicalSpecialAbility } from "../../../../slices/specialAbilities/advancedMagicalSpecialAbilitiesSlice.ts"
import { addAdvancedSkillSpecialAbility } from "../../../../slices/specialAbilities/advancedSkillSpecialAbilitiesSlice.ts"
import { addAncestorGlyph } from "../../../../slices/specialAbilities/ancestorGlyphsSlice.ts"
import { addArcaneOrbEnchantment } from "../../../../slices/specialAbilities/arcaneOrbEnchantmentsSlice.ts"
import { addAttireEnchantment } from "../../../../slices/specialAbilities/attireEnchantmentsSlice.ts"
import { addBlessedTradition } from "../../../../slices/specialAbilities/blessedTraditionsSlice.ts"
import { addBowlEnchantment } from "../../../../slices/specialAbilities/bowlEnchantmentsSlice.ts"
import { addBrawlingSpecialAbility } from "../../../../slices/specialAbilities/brawlingSpecialAbilitiesSlice.ts"
import { addCauldronEnchantment } from "../../../../slices/specialAbilities/cauldronEnchantmentsSlice.ts"
import { addCeremonialItemSpecialAbility } from "../../../../slices/specialAbilities/ceremonialItemSpecialAbilitiesSlice.ts"
import { addChronicleEnchantment } from "../../../../slices/specialAbilities/chronicleEnchantmentsSlice.ts"
import { addCombatSpecialAbility } from "../../../../slices/specialAbilities/combatSpecialAbilitiesSlice.ts"
import { addCombatStyleSpecialAbility } from "../../../../slices/specialAbilities/combatStyleSpecialAbilitiesSlice.ts"
import { addCommandSpecialAbility } from "../../../../slices/specialAbilities/commandSpecialAbilitiesSlice.ts"
import { addDaggerRitual } from "../../../../slices/specialAbilities/daggerRitualsSlice.ts"
import { addFamiliarSpecialAbility } from "../../../../slices/specialAbilities/familiarSpecialAbilitiesSlice.ts"
import { addFatePointSexSpecialAbility } from "../../../../slices/specialAbilities/fatePointSexSpecialAbilitiesSlice.ts"
import { addFatePointSpecialAbility } from "../../../../slices/specialAbilities/fatePointSpecialAbilitiesSlice.ts"
import { addFoolsHatEnchantment } from "../../../../slices/specialAbilities/foolsHatEnchantmentsSlice.ts"
import { addGeneralSpecialAbility } from "../../../../slices/specialAbilities/generalSpecialAbilitiesSlice.ts"
import { addInstrumentEnchantment } from "../../../../slices/specialAbilities/instrumentEnchantmentsSlice.ts"
import { addKarmaSpecialAbility } from "../../../../slices/specialAbilities/karmaSpecialAbilitiesSlice.ts"
import { addKrallenkettenzauber } from "../../../../slices/specialAbilities/krallenkettenzauberSlice.ts"
import { addLiturgicalStyleSpecialAbility } from "../../../../slices/specialAbilities/liturgicalStyleSpecialAbilitiesSlice.ts"
import { addLycantropicGift } from "../../../../slices/specialAbilities/lycantropicGiftsSlice.ts"
import { addMagicStyleSpecialAbility } from "../../../../slices/specialAbilities/magicStyleSpecialAbilitiesSlice.ts"
import { addMagicalSign } from "../../../../slices/specialAbilities/magicalSignsSlice.ts"
import { addMagicalSpecialAbility } from "../../../../slices/specialAbilities/magicalSpecialAbilitiesSlice.ts"
import { addMagicalTradition } from "../../../../slices/specialAbilities/magicalTraditionsSlice.ts"
import { addOrbEnchantment } from "../../../../slices/specialAbilities/orbEnchantmentsSlice.ts"
import { addPactGift } from "../../../../slices/specialAbilities/pactGiftsSlice.ts"
import { addProtectiveWardingCircleSpecialAbility } from "../../../../slices/specialAbilities/protectiveWardingCircleSpecialAbilitiesSlice.ts"
import { addRingEnchantment } from "../../../../slices/specialAbilities/ringEnchantmentsSlice.ts"
import { addSermon } from "../../../../slices/specialAbilities/sermonsSlice.ts"
import { addSexSpecialAbility } from "../../../../slices/specialAbilities/sexSpecialAbilitiesSlice.ts"
import { addSickleRitual } from "../../../../slices/specialAbilities/sickleRitualsSlice.ts"
import { addSikaryanDrainSpecialAbility } from "../../../../slices/specialAbilities/sikaryanDrainSpecialAbilitiesSlice.ts"
import { addSkillStyleSpecialAbility } from "../../../../slices/specialAbilities/skillStyleSpecialAbilitiesSlice.ts"
import { addSpellSwordEnchantment } from "../../../../slices/specialAbilities/spellSwordEnchantmentsSlice.ts"
import { addStaffEnchantment } from "../../../../slices/specialAbilities/staffEnchantmentsSlice.ts"
import { addToyEnchantment } from "../../../../slices/specialAbilities/toyEnchantmentsSlice.ts"
import { addTrinkhornzauber } from "../../../../slices/specialAbilities/trinkhornzauberSlice.ts"
import { addVampiricGift } from "../../../../slices/specialAbilities/vampiricGiftsSlice.ts"
import { addVision } from "../../../../slices/specialAbilities/visionsSlice.ts"
import { addWandEnchantment } from "../../../../slices/specialAbilities/wandEnchantmentsSlice.ts"
import { addWeaponEnchantment } from "../../../../slices/specialAbilities/weaponEnchantmentsSlice.ts"
import { InactiveActivatablesListItem } from "../activatable/InactiveActivatableListItem.tsx"

type Props = {
  specialAbility: DisplayedInactiveSpecialAbility
}

const specialAbilityActions = {
  AdvancedCombatSpecialAbility: [addAdvancedCombatSpecialAbility],
  AdvancedKarmaSpecialAbility: [addAdvancedKarmaSpecialAbility],
  AdvancedMagicalSpecialAbility: [addAdvancedMagicalSpecialAbility],
  AdvancedSkillSpecialAbility: [addAdvancedSkillSpecialAbility],
  AncestorGlyph: [addAncestorGlyph],
  ArcaneOrbEnchantment: [addArcaneOrbEnchantment],
  AttireEnchantment: [addAttireEnchantment],
  BlessedTradition: [addBlessedTradition],
  BowlEnchantment: [addBowlEnchantment],
  BrawlingSpecialAbility: [addBrawlingSpecialAbility],
  CauldronEnchantment: [addCauldronEnchantment],
  CeremonialItemSpecialAbility: [addCeremonialItemSpecialAbility],
  ChronicleEnchantment: [addChronicleEnchantment],
  CombatSpecialAbility: [addCombatSpecialAbility],
  CombatStyleSpecialAbility: [addCombatStyleSpecialAbility],
  CommandSpecialAbility: [addCommandSpecialAbility],
  DaggerRitual: [addDaggerRitual],
  FamiliarSpecialAbility: [addFamiliarSpecialAbility],
  FatePointSexSpecialAbility: [addFatePointSexSpecialAbility],
  FatePointSpecialAbility: [addFatePointSpecialAbility],
  FoolsHatEnchantment: [addFoolsHatEnchantment],
  GeneralSpecialAbility: [addGeneralSpecialAbility],
  InstrumentEnchantment: [addInstrumentEnchantment],
  KarmaSpecialAbility: [addKarmaSpecialAbility],
  Krallenkettenzauber: [addKrallenkettenzauber],
  LiturgicalStyleSpecialAbility: [addLiturgicalStyleSpecialAbility],
  LycantropicGift: [addLycantropicGift],
  MagicalSign: [addMagicalSign],
  MagicalSpecialAbility: [addMagicalSpecialAbility],
  MagicalTradition: [addMagicalTradition],
  MagicStyleSpecialAbility: [addMagicStyleSpecialAbility],
  OrbEnchantment: [addOrbEnchantment],
  PactGift: [addPactGift],
  ProtectiveWardingCircleSpecialAbility: [addProtectiveWardingCircleSpecialAbility],
  RingEnchantment: [addRingEnchantment],
  Sermon: [addSermon],
  SexSpecialAbility: [addSexSpecialAbility],
  SickleRitual: [addSickleRitual],
  SikaryanDrainSpecialAbility: [addSikaryanDrainSpecialAbility],
  SkillStyleSpecialAbility: [addSkillStyleSpecialAbility],
  SpellSwordEnchantment: [addSpellSwordEnchantment],
  StaffEnchantment: [addStaffEnchantment],
  ToyEnchantment: [addToyEnchantment],
  Trinkhornzauber: [addTrinkhornzauber],
  VampiricGift: [addVampiricGift],
  Vision: [addVision],
  WandEnchantment: [addWandEnchantment],
  WeaponEnchantment: [addWeaponEnchantment],
} as const

/**
 * Displays an advantage that is currently inactive.
 */
export const InactiveSpecialAbilitiesListItem: FC<Props> = props => {
  const { specialAbility } = props
  const [addAction] = specialAbilityActions[specialAbility.kind]
  const { handleAdd } = useInactiveSpecialAbilityActions(addAction)

  return (
    <InactiveActivatablesListItem
      activatable={specialAbility}
      add={handleAdd}
      createActivatableIdentifierObject={getCreateIdentifierObject(specialAbility.kind)}
      groupNameKey={specialAbilityGroupTranslationKeys[specialAbility.kind]}
    />
  )
}
