import { List } from "../../../Data/List"
import { Pair } from "../../../Data/Tuple"
import { Culture } from "../Wiki/Culture"
import { Skill } from "../Wiki/Skill"

export interface CultureCombined {
  wikiEntry: Culture
  mappedCulturalPackageSkills: List<Pair<Skill, number>>
}
