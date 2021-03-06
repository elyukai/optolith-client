import { List } from "../../../Data/List"
import { fromDefault } from "../../../Data/Record"
import { AllRequirementObjects } from "./wikiTypeHelpers"

export interface ArcaneDancerTradition {
  "@@name": "ArcaneDancerTradition"
  id: number
  name: string
  prerequisites: List<AllRequirementObjects>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ArcaneDancerTradition =
  fromDefault ("ArcaneDancerTradition")
              <ArcaneDancerTradition> ({
                id: 0,
                name: "",
                prerequisites: List.empty,
              })
