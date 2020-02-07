import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"
import { AttrId } from "../../Constants/Ids"

export interface MagicalTradition {
  "@@name": "MagicalTradition"
  id: string
  numId: Maybe<number>
  primary: Maybe<AttrId>
  aeMod: Maybe<number>
}

export const MagicalTradition =
  fromDefault ("MagicalTradition")
              <MagicalTradition> ({
                id: "",
                numId: Nothing,
                primary: Nothing,
                aeMod: Nothing,
              })
