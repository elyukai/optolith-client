import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface PersonalData {
  "@@name": "PersonalData"
  family: Maybe<string>
  placeOfBirth: Maybe<string>
  dateOfBirth: Maybe<string>
  age: Maybe<string>
  hairColor: Maybe<number>
  eyeColor: Maybe<number>
  size: Maybe<string>
  weight: Maybe<string>
  title: Maybe<string>
  socialStatus: Maybe<number>
  characteristics: Maybe<string>
  otherInfo: Maybe<string>
  cultureAreaKnowledge: Maybe<string>
}

/**
 * Create a new `PersonalData` object.
 */
export const PersonalData =
  fromDefault ("PersonalData")
              <PersonalData> ({
                family: Nothing,
                placeOfBirth: Nothing,
                dateOfBirth: Nothing,
                age: Nothing,
                hairColor: Nothing,
                eyeColor: Nothing,
                size: Nothing,
                weight: Nothing,
                title: Nothing,
                socialStatus: Nothing,
                characteristics: Nothing,
                otherInfo: Nothing,
                cultureAreaKnowledge: Nothing,
              })

export const PersonalDataL = makeLenses (PersonalData)
