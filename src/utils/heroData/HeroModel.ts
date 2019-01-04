import { Sex, StyleDependency } from "../../types/data";
import { ActivatableDependent } from "../activeEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../activeEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../activeEntries/AttributeDependent";
import { SkillDependent } from "../activeEntries/SkillDependent";
import { currentVersion } from "../raw/compatibilityUtils";
import { List } from "../structures/List";
import { Maybe, Nothing } from "../structures/Maybe";
import { OrderedMap } from "../structures/OrderedMap";
import { OrderedSet } from "../structures/OrderedSet";
import { fromDefault, makeLenses, Record } from "../structures/Record";
import { Belongings } from "./Belongings";
import { EditPet } from "./EditPet";
import { Energies } from "./Energies";
import { Pact } from "./Pact";
import { PersonalData } from "./PersonalData";
import { Pet } from "./Pet";
import { Rules } from "./Rules";

export type HeroModelRecord = Record<HeroModel>

export interface HeroModel {
  id: string
  clientVersion: string
  player: Maybe<string>
  dateCreated: Date
  dateModified: Date
  phase: number
  name: string
  avatar: Maybe<string>
  adventurePointsTotal: number
  race: Maybe<string>
  raceVariant: Maybe<string>
  culture: Maybe<string>
  profession: Maybe<string>
  professionName: Maybe<string>
  professionVariant: Maybe<string>
  sex: Sex
  experienceLevel: string
  personalData: Record<PersonalData>
  advantages: OrderedMap<string, Record<ActivatableDependent>>
  disadvantages: OrderedMap<string, Record<ActivatableDependent>>
  specialAbilities: OrderedMap<string, Record<ActivatableDependent>>
  attributes: OrderedMap<string, Record<AttributeDependent>>
  attributeAdjustmentSelected: string
  energies: Record<Energies>
  skills: OrderedMap<string, Record<SkillDependent>>
  combatTechniques: OrderedMap<string, Record<SkillDependent>>
  spells: OrderedMap<string, Record<ActivatableSkillDependent>>
  cantrips: OrderedSet<string>
  liturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>
  blessings: OrderedSet<string>
  belongings: Record<Belongings>
  rules: Record<Rules>
  pets: OrderedMap<string, Record<Pet>>
  petInEditor: Maybe<Record<EditPet>>
  isInPetCreation: boolean
  pact: Maybe<Record<Pact>>
  combatStyleDependencies: List<Record<StyleDependency>>
  magicalStyleDependencies: List<Record<StyleDependency>>
  blessedStyleDependencies: List<Record<StyleDependency>>
}

/**
 * Create a new `Hero` object from scratch. Does not handle special semantic
 * rules, so you need to take of them on your own.
 */
export const HeroModel =
  fromDefault<HeroModel> ({
    id: "",
    clientVersion: currentVersion,
    player: Nothing,
    dateCreated: new Date (),
    dateModified: new Date (),
    phase: 1,
    name: "",
    avatar: Nothing,
    adventurePointsTotal: 0,
    race: Nothing,
    raceVariant: Nothing,
    culture: Nothing,
    profession: Nothing,
    professionName: Nothing,
    professionVariant: Nothing,
    sex: "m",
    experienceLevel: "",
    personalData: PersonalData .default,
    advantages: OrderedMap.empty,
    disadvantages: OrderedMap.empty,
    specialAbilities: OrderedMap.empty,
    attributes: OrderedMap.empty,
    attributeAdjustmentSelected: "",
    energies: Energies .default,
    skills: OrderedMap.empty,
    combatTechniques: OrderedMap.empty,
    spells: OrderedMap.empty,
    cantrips: OrderedSet.empty,
    liturgicalChants: OrderedMap.empty,
    blessings: OrderedSet.empty,
    belongings: Belongings .default,
    rules: Rules .default,
    pets: OrderedMap.empty,
    petInEditor: Nothing,
    isInPetCreation: false,
    pact: Nothing,
    combatStyleDependencies: List.empty,
    magicalStyleDependencies: List.empty,
    blessedStyleDependencies: List.empty,
  })

export const HeroModelL = makeLenses (HeroModel)

/**
 * Creates a new `Hero` object based on the input the user gives when creating
 * a new hero.
 */
export const getInitialHeroObject =
  (id: string) =>
  (name: string) =>
  (sex: "m" | "f") =>
  (experienceLevel: string) =>
  (totalAp: number) =>
  (enableAllRuleBooks: boolean) =>
  (enabledRuleBooks: OrderedSet<string>): Record<HeroModel> =>
    HeroModel ({
      id,
      clientVersion: Nothing,
      dateCreated: new Date (),
      dateModified: new Date (),
      phase: Nothing,
      name,
      adventurePointsTotal: totalAp,
      sex,
      experienceLevel,
      personalData: Nothing,
      advantages: Nothing,
      disadvantages: Nothing,
      specialAbilities: Nothing,
      attributes: Nothing,
      attributeAdjustmentSelected: Nothing,
      energies: Nothing,
      skills: Nothing,
      combatTechniques: Nothing,
      spells: Nothing,
      cantrips: Nothing,
      liturgicalChants: Nothing,
      blessings: Nothing,
      belongings: Nothing,
      rules: Rules ({
        higherParadeValues: Nothing,
        attributeValueLimit: Nothing,
        enableLanguageSpecializations: Nothing,
        enableAllRuleBooks,
        enabledRuleBooks,
      }),
      pets: Nothing,
      isInPetCreation: Nothing,
      combatStyleDependencies: Nothing,
      magicalStyleDependencies: Nothing,
      blessedStyleDependencies: Nothing,
    })
