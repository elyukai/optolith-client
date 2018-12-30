import { fromDefault, Record } from '../structures/Record';
import { Cantrip } from '../wikiData/Cantrip';
import { IsActive } from './viewTypeHelpers';

export interface CantripCombined extends IsActive {
  wikiEntry: Record<Cantrip>
}

export const CantripCombined =
  fromDefault<CantripCombined> ({
    wikiEntry: Cantrip .default,
    active: false,
  })
