import { List } from "../../../Data/List"
import { TabId } from "../../Utilities/LocationUtils"

export interface NavigationBarTabOptions {
  id: TabId
  label: string
  subTabs: List<TabId>
}
