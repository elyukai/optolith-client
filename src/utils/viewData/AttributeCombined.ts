import { Attribute } from '../../types/wiki';
import { AttributeDependent } from '../activeEntries/attributeDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { AttributeCreator } from '../wikiData/AttributeCreator';

export interface AttributeCombined {
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
}

export const AttributeCombined =
  fromDefault<AttributeCombined> ({
    wikiEntry: AttributeCreator .default,
    stateEntry: AttributeDependent .default,
  })

export const AttributeCombinedG = makeGetters (AttributeCombined)
