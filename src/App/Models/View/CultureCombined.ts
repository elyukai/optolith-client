import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { Culture } from "../Wiki/Culture";
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
