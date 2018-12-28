import { AttributeDependent } from '../activeEntries/attributeDependent';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { AttributeCreator } from '../wikiData/AttributeCreator';
import { AttributeCombined } from './AttributeCombined';

export interface AttributeWithRequirements extends AttributeCombined {
  max: Maybe<number>
  min: number
}

export const AttributeWithRequirements =
  fromDefault<AttributeWithRequirements> ({
    wikiEntry: AttributeCreator .default,
    stateEntry: AttributeDependent .default,
    max: Nothing,
    min: 0,
  })

export const AttributeWithRequirementsG = makeGetters (AttributeWithRequirements)
