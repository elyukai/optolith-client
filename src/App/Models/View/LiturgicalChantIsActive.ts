import { fromDefault, Record } from "../../../Data/Record"
import { LiturgicalChant } from "../Wiki/LiturgicalChant"
import { IsActive } from "./viewTypeHelpers"

export interface LiturgicalChantIsActive extends IsActive {
  "@@name": "LiturgicalChantIsActive"
  wikiEntry: Record<LiturgicalChant>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LiturgicalChantIsActive =
  fromDefault ("LiturgicalChantIsActive")
              <LiturgicalChantIsActive> ({
                wikiEntry: LiturgicalChant .default,
                active: false,
              })
