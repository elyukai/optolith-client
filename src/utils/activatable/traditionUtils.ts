import { pipe } from 'ramda';
import { SpecialAbility } from '../../types/wiki';
import { ActivatableDependent, ActivatableDependentG } from '../activeEntries/ActivatableDependent';
import { isBlessedTraditionId, isMagicalTraditionId } from '../IDUtils';
import { filter, List } from '../structures/List';
import { bind_, mapMaybe } from '../structures/Maybe';
import { elems, find, lookup_, OrderedMap } from '../structures/OrderedMap';
import { Record } from '../structures/Record';
import { isActive } from './isActive';

const { id } = ActivatableDependentG

const isActiveMagicalTradition =
  (e: Record<ActivatableDependent>) => isMagicalTraditionId (id (e)) && isActive (e)

const isActiveBlessedTradition =
  (e: Record<ActivatableDependent>) => isBlessedTraditionId (id (e)) && isActive (e)

/**
 * Get magical traditions' dependent entries.
 * @param list
 */
export const getMagicalTraditions =
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
    pipe (getMagicalTraditions, mapMaybe (pipe (id, lookup_ (wiki))))

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
    pipe (getBlessedTradition, bind_ (pipe (id, lookup_ (wiki))))
