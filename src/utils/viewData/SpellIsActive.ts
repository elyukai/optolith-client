import { Spell } from '../../types/wiki';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SpellCreator } from '../wikiData/SpellCreator';
import { IsActive } from './viewTypeHelpers';

export interface SpellIsActive extends IsActive {
  wikiEntry: Record<Spell>
}

const SpellIsActive =
  fromDefault<SpellIsActive> ({
    wikiEntry: SpellCreator .default,
    active: false,
  })

export const SpellIsActiveG = makeGetters (SpellIsActive)
