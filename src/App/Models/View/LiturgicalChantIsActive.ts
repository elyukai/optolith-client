import { fromDefault, Record } from "../../../Data/Record";
import { LiturgicalChant } from "../Wiki/LiturgicalChant";
import { IsActive } from "./viewTypeHelpers";

export interface LiturgicalChantIsActive extends IsActive {
  wikiEntry: Record<LiturgicalChant>
}

export const LiturgicalChantIsActive =
  fromDefault<LiturgicalChantIsActive> ({
    wikiEntry: LiturgicalChant .default,
    active: false,
  })
