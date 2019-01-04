import { fromDefault, Record } from "../structures/Record";
import { LiturgicalChant } from "../wikiData/LiturgicalChant";
import { IsActive } from "./viewTypeHelpers";

export interface LiturgicalChantIsActive extends IsActive {
  wikiEntry: Record<LiturgicalChant>
}

export const LiturgicalChantIsActive =
  fromDefault<LiturgicalChantIsActive> ({
    wikiEntry: LiturgicalChant .default,
    active: false,
  })
