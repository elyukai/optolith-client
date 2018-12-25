import { ActivatableDependent, Hero } from '../types/data';
import { SpecialAbility, WikiAll } from '../types/wiki';
import { isActive } from './activatable/isActive';
import { HeroG } from './heroData/HeroCreator';
import { getAllEntriesByGroup } from './heroStateUtils';
import { any, filter, length, List } from './structures/List';
import { Record } from './structures/Record';
import { WikiG } from './wikiData/WikiCreator';

const { specialAbilities: wikiSpecialAbilities } = WikiG
const { specialAbilities } = HeroG

export const getActiveGroupEntries =
  (wiki: Record<WikiAll>) =>
  (state: Hero) =>
  (...groups: number[]): List<Record<ActivatableDependent>> =>
    filter (isActive)
           (getAllEntriesByGroup<Record<ActivatableDependent>, Record<SpecialAbility>>
             (wikiSpecialAbilities (wiki))
             (specialAbilities (state))
             (...groups))

export const countActiveGroupEntries =
  (wiki: Record<WikiAll>) =>
  (state: Hero) =>
  (...groups: number[]): number =>
    length (getActiveGroupEntries (wiki) (state) (...groups))

export const hasActiveGroupEntry =
  (wiki: Record<WikiAll>) =>
  (state: Hero) =>
  (...groups: number[]): boolean =>
    any (isActive)
        (getAllEntriesByGroup<Record<ActivatableDependent>, Record<SpecialAbility>>
          (wikiSpecialAbilities (wiki))
          (specialAbilities (state))
          (...groups))
