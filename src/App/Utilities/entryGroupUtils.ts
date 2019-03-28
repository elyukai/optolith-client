import { any, filter, flength, List } from "../../Data/List";
import { Record } from "../../Data/Record";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { isActive } from "./A/Activatable/isActive";
import { getAllEntriesByGroup } from "./heroStateUtils";

const { specialAbilities: wikiSpecialAbilities } = WikiModel.AL
const { specialAbilities } = HeroModel.AL

/**
 * Return all active special ability `ActivatableDependent` entries of the
 * specified group(s).
 */
export const getActiveGroupEntries =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): List<Record<ActivatableDependent>> =>
    filter (isActive)
           (getAllEntriesByGroup (wikiSpecialAbilities (wiki))
                                 (specialAbilities (state))
                                 (...groups))

/**
 * Count all active special abilitys of the specified group(s).
 */
export const countActiveGroupEntries =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): number =>
    flength (getActiveGroupEntries (wiki) (state) (...groups))

/**
 * Checks if there is at least one active special ability `ActivatableDependent`
 * of the specified group(s).
 */
export const hasActiveGroupEntry =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): boolean =>
    any (isActive)
        (getAllEntriesByGroup (wikiSpecialAbilities (wiki))
                              (specialAbilities (state))
                              (...groups))
