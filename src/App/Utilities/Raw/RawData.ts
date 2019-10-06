import { StringKeyObject } from "../../../Data/Record";
import { SID } from "../../Models/Wiki/wikiTypeHelpers";
import { SortNames } from "../../Views/Universal/SortOptions";

export interface RawUser {
  id: string
  displayName: string
}

export interface RawHero {
  readonly id: string
  readonly name: string
  readonly avatar?: string
  readonly ap: {
    total: number;
  }
  readonly r?: string
  readonly rv?: string
  readonly c?: string
  readonly isCulturalPackageActive?: boolean
  readonly p?: string
  professionName?: string
  readonly pv?: string
  readonly sex: "m" | "f"
  readonly dateCreated: string
  readonly dateModified: string
  player?: RawUser
  rules: RawRules
  readonly clientVersion: string
  readonly phase: number
  readonly el: string
  readonly pers: {
    family?: string;
    placeofbirth?: string;
    dateofbirth?: string;
    age?: string;
    haircolor?: number;
    eyecolor?: number;
    size?: string;
    weight?: string;
    title?: string;
    socialstatus?: number;
    characteristics?: string;
    otherinfo?: string;
    cultureAreaKnowledge?: string;
  }
  readonly activatable: StringKeyObject<RawActiveObject[]>
  readonly attr: {
    values: { id: string; value: number }[];
    readonly attributeAdjustmentSelected: string;
    lp: number;
    ae: number;
    kp: number;
    permanentLP?: {
      lost: number;
    };
    permanentAE: {
      lost: number;
      redeemed: number;
    };
    permanentKP: {
      lost: number;
      redeemed: number;
    };
  }
  readonly talents: StringKeyObject<number>
  readonly ct: StringKeyObject<number>
  readonly spells: StringKeyObject<number>
  readonly cantrips: string[]
  readonly liturgies: StringKeyObject<number>
  readonly blessings: string[]
  readonly belongings: {
    items: StringKeyObject<RawCustomItem>;
    armorZones?: StringKeyObject<RawArmorZone>;
    purse: {
      d: string;
      s: string;
      h: string;
      k: string;
    };
  }
  readonly pets?: StringKeyObject<RawPet>
}

export interface RawActiveObject {
  sid?: string | number
  sid2?: string | number
  sid3?: string | number
  tier?: number
  cost?: number
}

export interface RawRules {
  higherParadeValues: number
  attributeValueLimit: boolean
  enableAllRuleBooks: boolean
  enabledRuleBooks: string[]
  enableLanguageSpecializations: boolean
}

export type RawHerolist = StringKeyObject<RawHero>

export interface RawCustomItem {
  id: string
  price?: number
  weight?: number
  template?: string
  imp?: number
  gr: number
  combatTechnique?: string
  damageDiceNumber?: number
  damageDiceSides?: number
  damageFlat?: number
  primaryThreshold?: RawPrimaryAttributeDamageThreshold
  at?: number
  pa?: number
  reach?: number
  length?: number
  stp?: string
  range?: number[]
  reloadTime?: string
  ammunition?: string
  pro?: number
  enc?: number
  addPenalties?: boolean
  isParryingWeapon?: boolean
  isTwoHandedWeapon?: boolean
  armorType?: number
  iniMod?: number
  movMod?: number
  stabilityMod?: number
  name: string
  amount: number
  isTemplateLocked: boolean
  loss?: number
  forArmorZoneOnly?: boolean
  where?: string
}

export interface RawPrimaryAttributeDamageThreshold {
  primary?: string
  threshold: number | readonly number[]
}

export interface RawArmorZone {
  id: string
  name: string
  head?: string
  headLoss?: number
  leftArm?: string
  leftArmLoss?: number
  rightArm?: string
  rightArmLoss?: number
  torso?: string
  torsoLoss?: number
  leftLeg?: string
  leftLegLoss?: number
  rightLeg?: string
  rightLegLoss?: number
}

export interface RawPet {
  id: string
  name: string
  avatar?: string
  size?: string
  type?: string
  attack?: string
  dp?: string
  reach?: string
  actions?: string
  talents?: string
  skills?: string
  notes?: string
  spentAp?: string
  totalAp?: string
  cou?: string
  sgc?: string
  int?: string
  cha?: string
  dex?: string
  agi?: string
  con?: string
  str?: string
  lp?: string
  ae?: string
  spi?: string
  tou?: string
  pro?: string
  ini?: string
  mov?: string
  at?: string
  pa?: string
}

export interface RawConfig {
  herolistSortOrder: SortNames
  herolistVisibilityFilter: string
  racesSortOrder: SortNames
  racesValueVisibility: boolean
  culturesSortOrder: SortNames
  culturesVisibilityFilter: string
  culturesValueVisibility: boolean
  professionsSortOrder: SortNames
  professionsVisibilityFilter: string
  professionsGroupVisibilityFilter: number
  professionsFromExpansionsVisibility: boolean
  advantagesDisadvantagesCultureRatingVisibility: boolean
  talentsSortOrder: SortNames
  talentsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: SortNames
  specialAbilitiesSortOrder: SortNames
  spellsSortOrder: SortNames
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: SortNames
  equipmentSortOrder: SortNames
  equipmentGroupVisibilityFilter: number
  sheetCheckAttributeValueVisibility?: boolean
  enableActiveItemHints: boolean
  locale?: string
  theme?: string
  enableEditingHeroAfterCreationPhase?: boolean
  meleeItemTemplatesCombatTechniqueFilter?: string
  rangedItemTemplatesCombatTechniqueFilter?: string
  enableAnimations?: boolean
}

export interface ValueOptionalDependency {

  /**
   * The skill/spell/chant rating or rather attribute value.
   */
  value: number

  /**
   * The entry that created this dependency.
   */
  origin: string
}

export interface ActiveDependency {
  active?: boolean
  sid?: SID
  sid2?: string | number
  tier?: number
}

export interface ActiveOptionalDependency extends ActiveDependency {
  origin: string
}
