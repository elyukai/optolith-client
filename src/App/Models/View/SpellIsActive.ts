import { fromDefault, Record } from "../../../Data/Record"
import { Spell } from "../Wiki/Spell"
import { IsActive } from "./viewTypeHelpers"

export interface SpellIsActive extends IsActive {
  "@@name": "SpellIsActive"
  wikiEntry: Record<Spell>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SpellIsActive =
  fromDefault ("SpellIsActive")
              <SpellIsActive> ({
                wikiEntry: Spell .default,
                active: false,
              })
