import { List } from "../../../Data/List"
import { fromDefault } from "../../../Data/Record"
import { TabId } from "../../Utilities/LocationUtils"

export interface NavigationBarTabOptions {
  "@@name": "NavigationBarTabOptions"
  id: TabId
  label: string
  subTabs: List<TabId>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NavigationBarTabOptions =
  fromDefault ("NavigationBarTabOptions")
              <NavigationBarTabOptions> ({
                id: TabId.Herolist,
                label: "",
                subTabs: List (),
              })
