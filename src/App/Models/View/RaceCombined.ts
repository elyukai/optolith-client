import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Race } from "../Wiki/Race";
import { RaceVariant } from "../Wiki/RaceVariant";

export interface RaceCombined {
  "@@name": "RaceCombined"
  wikiEntry: Record<Race>
  mappedVariants: List<Record<RaceVariant>>
}

export const RaceCombined =
  fromDefault ("RaceCombined")
              <RaceCombined> ({
                wikiEntry: Race .default,
                mappedVariants: List.empty,
              })

export const RaceCombinedA_ = {
  id: pipe (RaceCombined.A.wikiEntry, Race.A.id),
  name: pipe (RaceCombined.A.wikiEntry, Race.A.name),
  ap: pipe (RaceCombined.A.wikiEntry, Race.A.ap),
  lp: pipe (RaceCombined.A.wikiEntry, Race.A.lp),
  spi: pipe (RaceCombined.A.wikiEntry, Race.A.spi),
  tou: pipe (RaceCombined.A.wikiEntry, Race.A.tou),
  mov: pipe (RaceCombined.A.wikiEntry, Race.A.mov),
  attributeAdjustmentsText: pipe (RaceCombined.A.wikiEntry, Race.A.attributeAdjustmentsText),
  automaticAdvantagesText: pipe (RaceCombined.A.wikiEntry, Race.A.automaticAdvantagesText),
  stronglyRecommendedAdvantagesText:
    pipe (RaceCombined.A.wikiEntry, Race.A.stronglyRecommendedAdvantagesText),
  stronglyRecommendedDisadvantagesText:
    pipe (RaceCombined.A.wikiEntry, Race.A.stronglyRecommendedDisadvantagesText),
  commonAdvantagesText: pipe (RaceCombined.A.wikiEntry, Race.A.commonAdvantagesText),
  commonDisadvantagesText: pipe (RaceCombined.A.wikiEntry, Race.A.commonDisadvantagesText),
  commonCultures: pipe (RaceCombined.A.wikiEntry, Race.A.commonCultures),
  uncommonAdvantagesText: pipe (RaceCombined.A.wikiEntry, Race.A.uncommonAdvantagesText),
  uncommonDisadvantagesText: pipe (RaceCombined.A.wikiEntry, Race.A.uncommonDisadvantagesText),
  variants: pipe (RaceCombined.A.wikiEntry, Race.A.variants),
  src: pipe (RaceCombined.A.wikiEntry, Race.A.src),
}
