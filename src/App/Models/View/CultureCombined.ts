import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
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

export const CultureCombinedA_ = {
  id: pipe (CultureCombined.A.wikiEntry, Culture.A.id),
  name: pipe (CultureCombined.A.wikiEntry, Culture.A.name),
}
