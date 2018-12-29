import { isActive } from './activatable/isActive';
import { ActivatableDependent } from './activeEntries/ActivatableDependent';
import { HeroModelG, HeroModelRecord } from './heroData/HeroModel';
import { getAllEntriesByGroup } from './heroStateUtils';
import { any, filter, length, List } from './structures/List';
import { Record } from './structures/Record';
import { SpecialAbility } from './wikiData/SpecialAbility';
import { WikiModelG, WikiModelRecord } from './wikiData/WikiModel';

const { specialAbilities: wikiSpecialAbilities } = WikiModelG
const { specialAbilities } = HeroModelG

export const getActiveGroupEntries =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): List<Record<ActivatableDependent>> =>
    filter (isActive)
           (getAllEntriesByGroup<Record<ActivatableDependent>, Record<SpecialAbility>>
             (wikiSpecialAbilities (wiki))
             (specialAbilities (state))
             (...groups))

export const countActiveGroupEntries =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): number =>
    length (getActiveGroupEntries (wiki) (state) (...groups))

export const hasActiveGroupEntry =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): boolean =>
    any (isActive)
        (getAllEntriesByGroup<Record<ActivatableDependent>, Record<SpecialAbility>>
          (wikiSpecialAbilities (wiki))
          (specialAbilities (state))
          (...groups))
