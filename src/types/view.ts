import { List } from '../utils/structures/List';
import { Maybe } from '../utils/structures/Maybe';
import { Record } from '../utils/structures/Record';
import * as Data from './data';
import * as Wiki from './wiki';

export { UIMessages } from './ui';
export { Book } from './wiki';

export interface RaceCombined {
  wikiEntry: Record<Wiki.Race>
  mappedVariants: List<Record<Wiki.RaceVariant>>
}

export interface IncreasableView {
  id: string
  name: string
  value: number
  previous: Maybe<number>
}

export interface CultureCombined {
  wikiEntry: Record<Wiki.Culture>
  mappedCulturalPackageSkills: List<Record<IncreasableView>>
}

export interface ProfessionCombined {
  wikiEntry: Record<Wiki.Profession>
  mappedPrerequisites: List<
    Record<Data.ActivatableNameCostActive> |
    Record<Wiki.ProfessionRequiresIncreasableObject>
  >
  mappedSpecialAbilities: List<Record<Data.ActivatableNameCostActive>>
  selections: Wiki.Profession['selections']
  mappedCombatTechniques: List<Record<IncreasableView>>
  mappedPhysicalSkills: List<Record<IncreasableView>>
  mappedSocialSkills: List<Record<IncreasableView>>
  mappedNatureSkills: List<Record<IncreasableView>>
  mappedKnowledgeSkills: List<Record<IncreasableView>>
  mappedCraftSkills: List<Record<IncreasableView>>
  mappedSpells: List<Record<IncreasableView>>
  mappedLiturgicalChants: List<Record<IncreasableView>>
  mappedVariants: List<Record<ProfessionVariantCombined>>
}

export interface ProfessionVariantCombined {
  wikiEntry: Record<Wiki.ProfessionVariant>
  mappedPrerequisites: List<
    Record<Data.ActivatableNameCostActive> |
    Record<Wiki.ProfessionRequiresIncreasableObject>
  >
  mappedSpecialAbilities: List<Record<Data.ActivatableNameCostActive>>
  selections: Wiki.ProfessionVariant['selections']
  mappedCombatTechniques: List<Record<IncreasableView>>
  mappedSkills: List<Record<IncreasableView>>
  mappedSpells: List<Record<IncreasableView>>
  mappedLiturgicalChants: List<Record<IncreasableView>>
}

export interface AttributeCombined {
  wikiEntry: Record<Wiki.Attribute>
  stateEntry: Record<Data.AttributeDependent>
}

export interface AttributeWithRequirements extends AttributeCombined {
  max: Maybe<number>
  min: number
}

export interface CombatTechniqueCombined {
  wikiEntry: Record<Wiki.CombatTechnique>
  stateEntry: Record<Data.SkillDependent>
}

export interface CombatTechniqueWithAttackParryBase extends CombatTechniqueCombined {
  at: number
  pa: Maybe<number>
}

export interface CombatTechniqueWithRequirements extends CombatTechniqueWithAttackParryBase {
  max: number
  min: number
}

interface IsActive {
  active: boolean
}

interface IncreasableWithRequirements {
  isIncreasable: boolean
  isDecreasable: boolean
}

export interface BlessingCombined extends IsActive {
  wikiEntry: Record<Wiki.Blessing>
}

export interface CantripCombined extends IsActive {
  wikiEntry: Record<Wiki.Cantrip>
}

export interface LiturgicalChantIsActive extends IsActive {
  wikiEntry: Record<Wiki.LiturgicalChant>
}

export interface LiturgicalChantCombined {
  wikiEntry: Record<Wiki.LiturgicalChant>
  stateEntry: Record<Data.ActivatableSkillDependent>
}

export interface LiturgicalChantWithRequirements
  extends LiturgicalChantCombined, IncreasableWithRequirements { }

export interface SpellIsActive extends IsActive {
  wikiEntry: Record<Wiki.Spell>
}

export interface SpellCombined {
  wikiEntry: Record<Wiki.Spell>
  stateEntry: Record<Data.ActivatableSkillDependent>
}

export interface SpellWithRequirements extends SpellCombined, IncreasableWithRequirements { }

export interface SkillCombined {
  wikiEntry: Record<Wiki.Skill>
  stateEntry: Record<Data.SkillDependent>
}

export interface SkillWithRequirements extends SkillCombined, IncreasableWithRequirements { }

export interface Item {
  id: string
  name: string
  amount: number
  price: number
  weight: Maybe<number>
  where: Maybe<string>
  gr: number
}

export interface MeleeWeapon {
  id: string
  name: string
  combatTechnique: string
  primary: List<string>
  primaryBonus: number | List<number>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: number
  atMod: Maybe<number>
  at: number
  paMod: Maybe<number>
  pa: Maybe<number>
  reach: Maybe<number>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  isImprovisedWeapon: boolean
  isTwoHandedWeapon: boolean
}

export interface RangedWeapon {
  id: string
  name: string
  combatTechnique: string
  reloadTime: Maybe<number>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: Maybe<number>
  at: number
  range: Maybe<List<number>>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  ammunition: Maybe<string>
}

export interface Armor {
  id: string
  name: string
  st: Maybe<number>
  loss: Maybe<number>
  pro: Maybe<number>
  enc: Maybe<number>
  mov: number
  ini: number
  weight: Maybe<number>
  where: Maybe<string>
}

export interface ArmorZone {
  id: string
  name: string
  head: Maybe<number>
  leftArm: Maybe<number>
  leftLeg: Maybe<number>
  rightArm: Maybe<number>
  rightLeg: Maybe<number>
  torso: Maybe<number>
  enc: number
  addPenalties: boolean
  weight: number
}

export interface ShieldOrParryingWeapon {
  id: string
  name: string
  stp: Maybe<number>
  bf: number
  loss: Maybe<number>
  atMod: Maybe<number>
  paMod: Maybe<number>
  weight: Maybe<number>
}
