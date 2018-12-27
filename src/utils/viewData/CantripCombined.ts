import { Cantrip } from '../../types/wiki';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { CantripCreator } from '../wikiData/CantripCreator';
import { IsActive } from './viewTypeHelpers';

export interface CantripCombined extends IsActive {
  wikiEntry: Record<Cantrip>
}

export const CantripCombined =
  fromDefault<CantripCombined> ({
    wikiEntry: CantripCreator .default,
    active: false,
  })

export const CantripCombinedG = makeGetters (CantripCombined)
