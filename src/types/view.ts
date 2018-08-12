import { List, Maybe, Record } from '../utils/dataUtils';
import * as Data from './data';
import * as Wiki from './wiki';

export { UIMessages } from './ui';
export { Book } from './wiki';

export interface RaceCombined extends Wiki.Race {
  mappedVariants: List<Record<Wiki.RaceVariant>>;
}

export interface IncreasableView {
  id: string;
  name: string;
  value: number;
  previous?: number;
}

export interface CultureCombined extends Wiki.Culture {
  mappedCulturalPackageSkills: List<Record<IncreasableView>>;
}

export interface MappedProfession {
  mappedPrerequisites: List<
    Record<Data.ActivatableNameCostActive> |
    Record<Wiki.ProfessionRequiresIncreasableObject>
  >;
  mappedSpecialAbilities: List<Record<Data.ActivatableNameCostActive>>;
  selections: Wiki.Profession['selections'];
  mappedCombatTechniques: List<Record<IncreasableView>>;
  mappedPhysicalSkills: List<Record<IncreasableView>>;
  mappedSocialSkills: List<Record<IncreasableView>>;
  mappedNatureSkills: List<Record<IncreasableView>>;
  mappedKnowledgeSkills: List<Record<IncreasableView>>;
  mappedCraftSkills: List<Record<IncreasableView>>;
  mappedSpells: List<Record<IncreasableView>>;
  mappedLiturgicalChants: List<Record<IncreasableView>>;
  mappedVariants: List<Record<ProfessionVariantCombined>>;
}

export type ProfessionCombined = Wiki.Profession & MappedProfession;

export interface MappedProfessionVariant {
  mappedPrerequisites: List<
    Record<Data.ActivatableNameCostActive> |
    Record<Wiki.ProfessionRequiresIncreasableObject>
  >;
  mappedSpecialAbilities: List<Record<Data.ActivatableNameCostActive>>;
  selections: Wiki.ProfessionVariant['selections'];
  mappedCombatTechniques: List<Record<IncreasableView>>;
  mappedSkills: List<Record<IncreasableView>>;
  mappedSpells: List<Record<IncreasableView>>;
  mappedLiturgicalChants: List<Record<IncreasableView>>;
}

export type ProfessionVariantCombined = Wiki.ProfessionVariant & MappedProfessionVariant;

export type AttributeCombined = Wiki.Attribute & Data.AttributeDependent;

export interface AttributeWithRequirements extends AttributeCombined {
  max: Maybe<number>;
  min: number;
}

export type CombatTechniqueCombined = Wiki.CombatTechnique & Data.SkillDependent;

export interface CombatTechniqueWithAttackParryBase extends CombatTechniqueCombined {
  at: number;
  pa?: number;
}

export interface CombatTechniqueWithRequirements extends CombatTechniqueWithAttackParryBase {
  max: number;
  min: number;
}

export type LiturgicalChantCombined = Wiki.LiturgicalChant & Data.ActivatableSkillDependent;

export interface LiturgicalChantWithRequirements extends LiturgicalChantCombined {
  isIncreasable: boolean;
  isDecreasable: boolean;
}

export type SpellCombined = Wiki.Spell & Data.ActivatableSkillDependent;

export interface SpellWithRequirements extends SpellCombined {
  isIncreasable: boolean;
  isDecreasable: boolean;
}

export type SkillCombined = Wiki.Skill & Data.SkillDependent;

export interface Item {
  id: string;
  name: string;
  amount: number;
  price: number;
  weight?: number;
  where?: number;
  gr: number;
}

export interface MeleeWeapon {
  id: string;
  name: string;
  combatTechnique: string;
  primary: string[];
  primaryBonus: number | number[];
  damageDiceNumber?: number;
  damageDiceSides?: number;
  damageFlat: number;
  atMod?: number;
  at: number;
  paMod?: number;
  pa?: number;
  reach?: number;
  bf: number;
  loss?: number;
  weight?: number;
  isImprovisedWeapon: boolean;
  isTwoHandedWeapon: boolean;
}

export interface RangedWeapon {
  id: string;
  name: string;
  combatTechnique: string;
  reloadTime?: number;
  damageDiceNumber?: number;
  damageDiceSides?: number;
  damageFlat?: number;
  at: number;
  range?: [number, number, number];
  bf: number;
  loss?: number;
  weight?: number;
  ammunition?: string;
}

export interface Armor {
  id: string;
  name: string;
  st?: number;
  loss?: number;
  pro?: number;
  enc?: number;
  mov: number;
  ini: number;
  weight?: number;
  where?: string;
}

export interface ArmorZone {
  id: string;
  name: string;
  head?: number;
  leftArm?: number;
  leftLeg?: number;
  rightArm?: number;
  rightLeg?: number;
  torso?: number;
  enc: number;
  addPenalties: boolean;
  weight: number;
}

export interface ShieldOrParryingWeapon {
  id: string;
  name: string;
  stp?: number;
  bf: number;
  loss?: number;
  atMod?: number;
  paMod?: number;
  weight?: number;
}
