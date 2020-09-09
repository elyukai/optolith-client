import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { fromDefault, makeLenses, Record, RecordCreator } from "../../../Data/Record"
import { SocialStatusId } from "../../Constants/Ids"
import { current_version } from "../../Selectors/envSelectors"
import { AttributeSkillCheckMinimumCache as SkillCheckAttributeCache } from "../../Utilities/Increasable/AttributeSkillCheckMinimum"
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../ActiveEntries/AttributeDependent"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { Locale } from "../Config"
import { L10n } from "../Wiki/L10n"
import { StaticData, StaticDataRecord } from "../Wiki/WikiModel"
import { Belongings } from "./Belongings"
import { EditPet } from "./EditPet"
import { Energies } from "./Energies"
import { Sex } from "./heroTypeHelpers"
import { Pact } from "./Pact"
import { PersonalData } from "./PersonalData"
import { Pet } from "./Pet"
import { Rules } from "./Rules"
import { StyleDependency } from "./StyleDependency"
import { TransferUnfamiliar } from "./TransferUnfamiliar"

export type HeroModelRecord = Record<HeroModel>

export interface HeroModel {
  "@@name": "Hero"
  id: string
  clientVersion: string
  locale: string
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
  isCulturalPackageActive: boolean
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
  skillStyleDependencies: List<Record<StyleDependency>>
  socialStatusDependencies: List<SocialStatusId>
  transferredUnfamiliarSpells: List<Record<TransferUnfamiliar>>
  skillCheckAttributeCache: SkillCheckAttributeCache
}

/**
 * Create a new `Hero` object from scratch. Does not handle special semantic
 * rules, so you need to take of them on your own.
 */
export const HeroModel: RecordCreator<HeroModel> =
  fromDefault ("Hero")
              <HeroModel> ({
                id: "",
                clientVersion: current_version,
                locale: Locale.German,
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
                isCulturalPackageActive: false,
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
                combatStyleDependencies: List (),
                magicalStyleDependencies: List (),
                blessedStyleDependencies: List (),
                skillStyleDependencies: List (),
                socialStatusDependencies: List (),
                transferredUnfamiliarSpells: List (),
                skillCheckAttributeCache: OrderedMap.empty,
              })

export const HeroModelL = makeLenses (HeroModel)

/**
 * Creates a new `Hero` object based on the input the user gives when creating
 * a new hero.
 */
export const getInitialHeroObject =
  (staticData: StaticDataRecord) =>
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
      locale: L10n.A.id (StaticData.A.ui (staticData)),
      dateCreated: new Date (),
      dateModified: new Date (),
      phase: Nothing,
      name,
      adventurePointsTotal: totalAp,
      isCulturalPackageActive: false,
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
      skillStyleDependencies: Nothing,
      socialStatusDependencies: Nothing,
      transferredUnfamiliarSpells: Nothing,
      skillCheckAttributeCache: Nothing,
    })
