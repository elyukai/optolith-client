import { any, filter, flength, List } from "../../Data/List"
import { Record } from "../../Data/Record"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { isActive } from "./Activatable/isActive"
import { getAllEntriesByGroup } from "./heroStateUtils"

const SDA = StaticData.A
const HA = HeroModel.A

/**
 * Return all active special ability `ActivatableDependent` entries of the
 * specified group(s).
 */
export const getActiveGroupEntries =
  (wiki: StaticDataRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): List<Record<ActivatableDependent>> =>
    filter (isActive)
           (getAllEntriesByGroup (SDA.specialAbilities (wiki))
                                 (HA.specialAbilities (state))
                                 (...groups))

/**
 * Count all active special abilitys of the specified group(s).
 */
export const countActiveGroupEntries =
  (wiki: StaticDataRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): number =>
    flength (getActiveGroupEntries (wiki) (state) (...groups))

/**
 * Checks if there is at least one active special ability `ActivatableDependent`
 * of the specified group(s).
 */
export const hasActiveGroupEntry =
  (wiki: StaticDataRecord) =>
  (state: HeroModelRecord) =>
  (...groups: number[]): boolean =>
    any (isActive)
        (getAllEntriesByGroup (SDA.specialAbilities (wiki))
                              (HA.specialAbilities (state))
                              (...groups))
