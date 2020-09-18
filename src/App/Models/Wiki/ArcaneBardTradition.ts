import { List } from "../../../Data/List"
import { fromDefault } from "../../../Data/Record"
import { AllRequirementObjects } from "./wikiTypeHelpers"

export interface ArcaneBardTradition {
  "@@name": "ArcaneBardTradition"
  id: number
  name: string
  prerequisites: List<AllRequirementObjects>
}

export const ArcaneBardTradition =
  fromDefault ("ArcaneBardTradition")
              <ArcaneBardTradition> ({
                id: 0,
                name: "",
                prerequisites: List.empty,
              })
