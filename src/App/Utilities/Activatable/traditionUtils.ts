import { filter, List } from "../../../Data/List";
import { bindF, mapMaybe } from "../../../Data/Maybe";
import { elems, find, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { isBlessedTraditionId, isMagicalTraditionId } from "../IDUtils";
import { pipe } from "../pipe";
import { isActive } from "./isActive";

const { id } = ActivatableDependent.AL

const isActiveMagicalTradition =
  (e: Record<ActivatableDependent>) => isMagicalTraditionId (id (e)) && isActive (e)

const isActiveBlessedTradition =
  (e: Record<ActivatableDependent>) => isBlessedTraditionId (id (e)) && isActive (e)

/**
 * Get magical traditions' dependent entries.
 * @param list
 */
export const getMagicalTraditionsHeroEntries =
  pipe (
    elems as
      (list: OrderedMap<any, Record<ActivatableDependent>>) => List<Record<ActivatableDependent>>,
    filter (isActiveMagicalTradition)
  )

/**
 * Get magical traditions' wiki entries.
 * @param wiki
 * @param list
 */
export const getMagicalTraditionsFromWiki =
  (wiki: OrderedMap<string, Record<SpecialAbility>>) =>
    pipe (getMagicalTraditionsHeroEntries, mapMaybe (pipe (id, lookupF (wiki))))

/**
 * Get blessed traditions' dependent entry.
 * @param list
 */
export const getBlessedTradition = find (isActiveBlessedTradition)

/**
 * Get blessed tradition's' wiki entry.
 * @param wiki
 * @param list
 */
export const getBlessedTraditionFromWiki =
  (wiki: OrderedMap<string, Record<SpecialAbility>>) =>
    pipe (getBlessedTradition, bindF (pipe (id, lookupF (wiki))))
