import { ActivatableSkillDependent } from '../activeEntries/ActivatableSkillDependent';
import { fromDefault } from '../structures/Record';
import { Spell } from '../wikiData/Spell';
import { SpellCombined } from './SpellCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface SpellWithRequirements extends SpellCombined, IncreasableWithRequirements { }

const SpellWithRequirements =
  fromDefault<SpellWithRequirements> ({
    wikiEntry: Spell .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })
