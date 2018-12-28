import { AttributeDependent } from '../activeEntries/AttributeDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { Attribute } from '../wikiData/Attribute';

export interface AttributeCombined {
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
}

export const AttributeCombined =
  fromDefault<AttributeCombined> ({
    wikiEntry: Attribute .default,
    stateEntry: AttributeDependent .default,
  })

export const AttributeCombinedG = makeGetters (AttributeCombined)
