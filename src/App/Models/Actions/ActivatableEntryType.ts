import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Advantage } from "../Wiki/Advantage";
import { Disadvantage } from "../Wiki/Disadvantage";

export interface ActivatableEntryType {
  isBlessed: boolean
  isMagical: boolean
  isDisadvantage: boolean
  hairColor: Maybe<number>
  eyeColor: Maybe<number>
  wikiEntry: Record<Advantage> | Record<Disadvantage>
}

export const ActivatableEntryType =
  fromDefault<ActivatableEntryType> ({
    isBlessed: false,
    isMagical: false,
    isDisadvantage: false,
    hairColor: Nothing,
    eyeColor: Nothing,
    wikiEntry: Advantage.default,
  })
