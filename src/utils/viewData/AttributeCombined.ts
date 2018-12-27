import { AttributeDependent } from '../../types/data';
import { Attribute } from '../../types/wiki';
import { AttributeDependentCreator } from '../activeEntries/attributeDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { AttributeCreator } from '../wikiData/AttributeCreator';

export interface AttributeCombined {
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
}

export const AttributeCombined =
  fromDefault<AttributeCombined> ({
    wikiEntry: AttributeCreator .default,
    stateEntry: AttributeDependentCreator .default,
  })

export const AttributeCombinedG = makeGetters (AttributeCombined)
