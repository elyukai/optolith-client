import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { Disadvantage } from "../Wiki/Disadvantage";

export interface ActivatableDeactivationEntryType {
  "@@name": "ActivatableDeactivationEntryType"
  isBlessed: boolean
  isMagical: boolean
  isDisadvantage: boolean
  hairColor: Maybe<number>
  eyeColor: Maybe<number>
  heroEntry: Record<ActivatableDependent>
  wikiEntry: Record<Advantage> | Record<Disadvantage>
}

export const ActivatableDeactivationEntryType =
  fromDefault ("ActivatableDeactivationEntryType")
              <ActivatableDeactivationEntryType> ({
                isBlessed: false,
                isMagical: false,
                isDisadvantage: false,
                hairColor: Nothing,
                eyeColor: Nothing,
                heroEntry: ActivatableDependent.default,
                wikiEntry: Advantage.default,
              })
