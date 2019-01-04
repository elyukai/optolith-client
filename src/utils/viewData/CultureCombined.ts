import { List } from "../structures/List";
import { fromDefault, Record } from "../structures/Record";
import { Culture } from "../wikiData/Culture";
import { IncreasableForView } from "./IncreasableForView";

export interface CultureCombined {
  wikiEntry: Record<Culture>
  mappedCulturalPackageSkills: List<Record<IncreasableForView>>
}

export const CultureCombined =
  fromDefault<CultureCombined> ({
    wikiEntry: Culture .default,
    mappedCulturalPackageSkills: List.empty,
  })
