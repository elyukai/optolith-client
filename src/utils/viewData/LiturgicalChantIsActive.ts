import { LiturgicalChant } from '../../types/wiki';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { LiturgicalChantCreator } from '../wikiData/LiturgicalChantCreator';
import { IsActive } from './viewTypeHelpers';

export interface LiturgicalChantIsActive extends IsActive {
  wikiEntry: Record<LiturgicalChant>
}

export const LiturgicalChantIsActive =
  fromDefault<LiturgicalChantIsActive> ({
    wikiEntry: LiturgicalChantCreator .default,
    active: false,
  })

export const LiturgicalChantIsActiveG = makeGetters (LiturgicalChantIsActive)
