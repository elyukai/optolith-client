import { PersonalData } from '../../types/data';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

/**
 * Create a new `PersonalData` object.
 */
export const PersonalDataCreator =
  fromDefault<PersonalData> ({
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

export const PersonalDataG = makeGetters (PersonalDataCreator)
export const PersonalDataL = makeLenses_ (PersonalDataG) (PersonalDataCreator)
