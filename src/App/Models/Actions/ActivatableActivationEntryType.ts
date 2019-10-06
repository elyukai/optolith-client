import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { Disadvantage } from "../Wiki/Disadvantage";

export interface ActivatableActivationEntryType {
  "@@name": "ActivatableActivationEntryType"
  isBlessed: boolean
  isMagical: boolean
  isDisadvantage: boolean
  hairColor: Maybe<number>
  eyeColor: Maybe<number>
  heroEntry: Maybe<Record<ActivatableDependent>>
  wikiEntry: Record<Advantage> | Record<Disadvantage>
}

export const ActivatableActivationEntryType =
  fromDefault ("ActivatableActivationEntryType")
              <ActivatableActivationEntryType> ({
                isBlessed: false,
                isMagical: false,
                isDisadvantage: false,
                hairColor: Nothing,
                eyeColor: Nothing,
                heroEntry: Nothing,
                wikiEntry: Advantage.default,
              })
