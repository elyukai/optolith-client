import { List } from "../../../Data/List"
import { fromDefault } from "../../../Data/Record"
import { TabId } from "../../Utilities/LocationUtils"

export interface NavigationBarTabOptions {
  "@@name": "NavigationBarTabOptions"
  id: TabId
  label: string
  subTabs: List<TabId>
}

export const NavigationBarTabOptions =
  fromDefault ("NavigationBarTabOptions")
              <NavigationBarTabOptions> ({
                id: TabId.Herolist,
                label: "",
                subTabs: List (),
              })
