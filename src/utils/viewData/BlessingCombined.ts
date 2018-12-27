import { Blessing } from '../../types/wiki';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { BlessingCreator } from '../wikiData/BlessingCreator';
import { IsActive } from './viewTypeHelpers';

export interface BlessingCombined extends IsActive {
  wikiEntry: Record<Blessing>
}

export const BlessingCombined =
  fromDefault<BlessingCombined> ({
    wikiEntry: BlessingCreator .default,
    active: false,
  })

export const BlessingCombinedG = makeGetters (BlessingCombined)
