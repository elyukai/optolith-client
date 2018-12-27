import { Culture } from '../../types/wiki';
import { List } from '../structures/List';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { CultureCreator } from '../wikiData/CultureCreator';
import { IncreasableForView } from './IncreasableForView';

export interface CultureCombined {
  wikiEntry: Record<Culture>
  mappedCulturalPackageSkills: List<Record<IncreasableForView>>
}

export const CultureCombined =
  fromDefault<CultureCombined> ({
    wikiEntry: CultureCreator .default,
    mappedCulturalPackageSkills: List.empty,
  })

export const CultureCombinedG = makeGetters (CultureCombined)
