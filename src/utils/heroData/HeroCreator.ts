import { HeroDependent } from '../../types/data';
import { currentVersion } from '../raw/compatibilityUtils';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { OrderedSet } from '../structures/OrderedSet';
import { fromDefault, makeGetters, makeLenses_, Record } from '../structures/Record';
import { BelongingsCreator } from './BelongingsCreator';
import { EnergiesCreator } from './EnergiesCreator';
import { PersonalDataCreator } from './PersonalDataCreator';
import { RulesCreator } from './RulesCreator';

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
