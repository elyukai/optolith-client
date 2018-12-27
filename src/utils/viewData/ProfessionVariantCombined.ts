import { ActivatableNameCostActive } from '../../types/data';
import { ProfessionRequiresIncreasableObject, ProfessionVariant } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { ProfessionVariantCreator } from '../wikiData/ProfessionVariantCreator';
import { IncreasableForView } from './IncreasableForView';

export interface ProfessionVariantCombined {
  wikiEntry: Record<ProfessionVariant>
  mappedPrerequisites: List<
    Record<ActivatableNameCostActive> |
    Record<ProfessionRequiresIncreasableObject>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostActive>>
  selections: ProfessionVariant['selections']
  mappedCombatTechniques: List<Record<IncreasableForView>>
  mappedSkills: List<Record<IncreasableForView>>
  mappedSpells: List<Record<IncreasableForView>>
  mappedLiturgicalChants: List<Record<IncreasableForView>>
}

export const ProfessionVariantCombined =
  fromDefault<ProfessionVariantCombined> ({
    wikiEntry: ProfessionVariantCreator .default,
    mappedPrerequisites: List.empty,
    mappedSpecialAbilities: List.empty,
    selections: List.empty,
    mappedCombatTechniques: List.empty,
    mappedSkills: List.empty,
    mappedSpells: List.empty,
    mappedLiturgicalChants: List.empty,
  })

export const ProfessionVariantCombinedG = makeGetters (ProfessionVariantCombined)
