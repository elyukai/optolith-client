import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"
import { AttrId } from "../../Constants/Ids"

export interface MagicalTradition {
  "@@name": "MagicalTradition"
  id: string
  numId: Maybe<number>
  name: string
  primary: Maybe<AttrId>
  aeMod: Maybe<number>
  canLearnCantrips: boolean
  canLearnSpells: boolean
  canLearnRituals: boolean
  allowMultipleTraditions: boolean
  isDisAdvAPMaxHalved: boolean
  areDisAdvRequiredApplyToMagActionsOrApps: boolean
}

export const MagicalTradition =
  fromDefault ("MagicalTradition")
              <MagicalTradition> ({
                id: "",
                numId: Nothing,
                name: "",
                primary: Nothing,
                aeMod: Nothing,
                canLearnCantrips: true,
                canLearnSpells: true,
                canLearnRituals: true,
                allowMultipleTraditions: true,
                isDisAdvAPMaxHalved: false,
                areDisAdvRequiredApplyToMagActionsOrApps: false,
              })
