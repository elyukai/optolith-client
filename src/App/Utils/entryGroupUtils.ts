import { any, filter, length, List } from "../../Data/List";
import { Record } from "../../Data/Record";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { isActive } from "./activatable/isActive";
import { getAllEntriesByGroup } from "./heroStateUtils";

const { specialAbilities: wikiSpecialAbilities } = WikiModel.A
const { specialAbilities } = HeroModel.A

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
