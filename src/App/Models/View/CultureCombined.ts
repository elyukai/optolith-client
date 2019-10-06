import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Culture } from "../Wiki/Culture";
import { IncreasableForView } from "./IncreasableForView";

export interface CultureCombined {
  "@@name": "CultureCombined"
  wikiEntry: Record<Culture>
  mappedCulturalPackageSkills: List<Record<IncreasableForView>>
}

export const CultureCombined =
  fromDefault ("CultureCombined")
              <CultureCombined> ({
                wikiEntry: Culture .default,
                mappedCulturalPackageSkills: List.empty,
              })

const CCA = CultureCombined.A
const CA = Culture.A

export const CultureCombinedA_ = {
  id: pipe (CCA.wikiEntry, CA.id),
  name: pipe (CCA.wikiEntry, CA.name),
  culturalPackageAdventurePoints: pipe (CCA.wikiEntry, CA.culturalPackageAdventurePoints),
  languages: pipe (CCA.wikiEntry, CA.languages),
  scripts: pipe (CCA.wikiEntry, CA.scripts),
  socialStatus: pipe (CCA.wikiEntry, CA.socialStatus),
  areaKnowledge: pipe (CCA.wikiEntry, CA.areaKnowledge),
  areaKnowledgeShort: pipe (CCA.wikiEntry, CA.areaKnowledgeShort),
  commonProfessions: pipe (CCA.wikiEntry, CA.commonProfessions),
  commonMundaneProfessions: pipe (CCA.wikiEntry, CA.commonMundaneProfessions),
  commonMagicProfessions: pipe (CCA.wikiEntry, CA.commonMagicProfessions),
  commonBlessedProfessions: pipe (CCA.wikiEntry, CA.commonBlessedProfessions),
  commonAdvantages: pipe (CCA.wikiEntry, CA.commonAdvantages),
  commonAdvantagesText: pipe (CCA.wikiEntry, CA.commonAdvantagesText),
  commonDisadvantages: pipe (CCA.wikiEntry, CA.commonDisadvantages),
  commonDisadvantagesText: pipe (CCA.wikiEntry, CA.commonDisadvantagesText),
  uncommonAdvantages: pipe (CCA.wikiEntry, CA.uncommonAdvantages),
  uncommonAdvantagesText: pipe (CCA.wikiEntry, CA.uncommonAdvantagesText),
  uncommonDisadvantages: pipe (CCA.wikiEntry, CA.uncommonDisadvantages),
  uncommonDisadvantagesText: pipe (CCA.wikiEntry, CA.uncommonDisadvantagesText),
  commonSkills: pipe (CCA.wikiEntry, CA.commonSkills),
  uncommonSkills: pipe (CCA.wikiEntry, CA.uncommonSkills),
  commonNames: pipe (CCA.wikiEntry, CA.commonNames),
  culturalPackageSkills: pipe (CCA.wikiEntry, CA.culturalPackageSkills),
  category: pipe (CCA.wikiEntry, CA.category),
  src: pipe (CCA.wikiEntry, CA.src),
}
