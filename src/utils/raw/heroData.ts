import { Belongings, Energies, HeroDependent, PermanentEnergyLoss, PermanentEnergyLossAndBoughtBack, PersonalData, Purse, Rules } from '../../types/data';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { OrderedSet } from '../structures/OrderedSet';
import { fromDefault, makeGetters, makeLenses_, Record } from '../structures/Record';
import { currentVersion } from './VersionUtils';

/**
 * Create a new `PersonalData` object.
 */
export const PersonalDataCreator =
  fromDefault<PersonalData> ({
    family: Nothing,
    placeOfBirth: Nothing,
    dateOfBirth: Nothing,
    age: Nothing,
    hairColor: Nothing,
    eyeColor: Nothing,
    size: Nothing,
    weight: Nothing,
    title: Nothing,
    socialStatus: Nothing,
    characteristics: Nothing,
    otherInfo: Nothing,
    cultureAreaKnowledge: Nothing,
  })

export const PersonalDataG = makeGetters (PersonalDataCreator)
export const PersonalDataL = makeLenses_ (PersonalDataG) (PersonalDataCreator)

/**
 * Create a new `PermanentEnergyLoss` object.
 */
export const PermanentEnergyLossCreator =
  fromDefault<PermanentEnergyLoss> ({
    lost: 0,
  })

export const PermanentEnergyLossG = makeGetters (PermanentEnergyLossCreator)
export const PermanentEnergyLossL = makeLenses_ (PermanentEnergyLossG) (PermanentEnergyLossCreator)

/**
 * Create a new `PermanentEnergyLossAndBoughtBack` object.
 */
export const PermanentEnergyLossAndBoughtBackCreator =
  fromDefault<PermanentEnergyLossAndBoughtBack> ({
    lost: 0,
    redeemed: 0,
  })

export const PermanentEnergyLossAndBoughtBackG =
  makeGetters (PermanentEnergyLossAndBoughtBackCreator)

export const PermanentEnergyLossAndBoughtBackL =
  makeLenses_ (PermanentEnergyLossAndBoughtBackG)
              (PermanentEnergyLossAndBoughtBackCreator)

/**
 * Create a new `Energies` object.
 */
export const EnergiesCreator =
  fromDefault<Energies> ({
    addedLifePoints: 0,
    addedArcaneEnergyPoints: 0,
    addedKarmaPoints: 0,
    permanentLifePoints: PermanentEnergyLossCreator ({ }),
    permanentArcaneEnergyPoints: PermanentEnergyLossAndBoughtBackCreator ({ }),
    permanentKarmaPoints: PermanentEnergyLossAndBoughtBackCreator ({ }),
  })

export const EnergiesG = makeGetters (EnergiesCreator)
export const EnergiesL = makeLenses_ (EnergiesG) (EnergiesCreator)

/**
 * Create a new `Purse` object.
 */
export const PurseCreator =
  fromDefault<Purse> ({
    d: '',
    s: '',
    h: '',
    k: '',
  })

export const PurseG = makeGetters (PurseCreator)
export const PurseL = makeLenses_ (PurseG) (PurseCreator)

/**
 * Create a new `Belongings` object.
 */
export const BelongingsCreator =
  fromDefault<Belongings> ({
    items: OrderedMap.empty,
    itemInEditor: Nothing,
    isInItemCreation: false,
    armorZones: OrderedMap.empty,
    zoneArmorInEditor: Nothing,
    isInZoneArmorCreation: false,
    purse: PurseCreator ({ }),
  })

export const BelongingsG = makeGetters (BelongingsCreator)
export const BelongingsL = makeLenses_ (BelongingsG) (BelongingsCreator)

/**
 * Create a new `Rules` object.
 */
export const RulesCreator =
  fromDefault<Rules> ({
    higherParadeValues: 0,
    attributeValueLimit: false,
    enableAllRuleBooks: false,
    enabledRuleBooks: OrderedSet.empty,
    enableLanguageSpecializations: false,
  })

export const RulesG = makeGetters (RulesCreator)
export const RulesL = makeLenses_ (RulesG) (RulesCreator)

/**
 * Create a new `Hero` object from scratch. Does not handle special semantic
 * rules, so you need to take of them on your own.
 */
export const HeroCreator =
  fromDefault<HeroDependent> ({
    id: '',
    clientVersion: currentVersion,
    player: Nothing,
    dateCreated: new Date (),
    dateModified: new Date (),
    phase: 1,
    name: '',
    avatar: Nothing,
    adventurePointsTotal: 0,
    race: Nothing,
    raceVariant: Nothing,
    culture: Nothing,
    profession: Nothing,
    professionName: Nothing,
    professionVariant: Nothing,
    sex: 'm',
    experienceLevel: '',
    personalData: PersonalDataCreator ({ }),
    advantages: OrderedMap.empty,
    disadvantages: OrderedMap.empty,
    specialAbilities: OrderedMap.empty,
    attributes: OrderedMap.empty,
    attributeAdjustmentSelected: '',
    energies: EnergiesCreator ({ }),
    skills: OrderedMap.empty,
    combatTechniques: OrderedMap.empty,
    spells: OrderedMap.empty,
    cantrips: OrderedSet.empty,
    liturgicalChants: OrderedMap.empty,
    blessings: OrderedSet.empty,
    belongings: BelongingsCreator ({ }),
    rules: RulesCreator ({ }),
    pets: OrderedMap.empty,
    petInEditor: Nothing,
    isInPetCreation: false,
    pact: Nothing,
    combatStyleDependencies: List.empty,
    magicalStyleDependencies: List.empty,
    blessedStyleDependencies: List.empty,
  })

export const HeroG = makeGetters (HeroCreator)
export const HeroL = makeLenses_ (HeroG) (HeroCreator)

/**
 * Creates a new `Hero` object based on the input the user gives when creating
 * a new hero.
 */
export const getInitialHeroObject =
  (id: string) =>
  (name: string) =>
  (sex: 'm' | 'f') =>
  (experienceLevel: string) =>
  (totalAp: number) =>
  (enableAllRuleBooks: boolean) =>
  (enabledRuleBooks: OrderedSet<string>): Record<HeroDependent> =>
    HeroCreator ({
      id,
      name,
      sex,
      experienceLevel,
      adventurePointsTotal: totalAp,
      rules: RulesCreator ({ enableAllRuleBooks, enabledRuleBooks }),
    })
