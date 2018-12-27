import { WikiAll } from '../../types/wiki';
import { OrderedMap } from '../structures/OrderedMap';
import { fromDefault, makeGetters } from '../structures/Record';

export const WikiCreator =
  fromDefault<WikiAll> ({
    books: OrderedMap.empty,
    experienceLevels: OrderedMap.empty,
    races: OrderedMap.empty,
    raceVariants: OrderedMap.empty,
    cultures: OrderedMap.empty,
    professions: OrderedMap.empty,
    professionVariants: OrderedMap.empty,
    attributes: OrderedMap.empty,
    advantages: OrderedMap.empty,
    disadvantages: OrderedMap.empty,
    specialAbilities: OrderedMap.empty,
    skills: OrderedMap.empty,
    combatTechniques: OrderedMap.empty,
    spells: OrderedMap.empty,
    cantrips: OrderedMap.empty,
    liturgicalChants: OrderedMap.empty,
    blessings: OrderedMap.empty,
    itemTemplates: OrderedMap.empty,
  })

export const WikiG = makeGetters (WikiCreator)

export const createWiki = WikiCreator
