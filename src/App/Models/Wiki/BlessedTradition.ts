import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { AttrId } from "../../Constants/Ids"

export interface BlessedTradition {
  "@@name": "BlessedTradition"
  id: string
  numId: number
  name: string
  primary: AttrId
  aspects: Maybe<Pair<number, number>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BlessedTradition =
  fromDefault ("BlessedTradition")
              <BlessedTradition> ({
                id: "",
                numId: 0,
                name: "",
                primary: AttrId.Courage,
                aspects: Nothing,
              })
