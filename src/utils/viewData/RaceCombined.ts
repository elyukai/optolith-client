import { Race, RaceVariant } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { RaceCreator } from '../wikiData/RaceCreator';

export interface RaceCombined {
  wikiEntry: Record<Race>
  mappedVariants: List<Record<RaceVariant>>
}

export const RaceCombined =
  fromDefault<RaceCombined> ({
    wikiEntry: RaceCreator .default,
    mappedVariants: List.empty,
  })

export const RaceCombinedG = makeGetters (RaceCombined)
