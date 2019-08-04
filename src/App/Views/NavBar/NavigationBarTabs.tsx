import * as React from "react";
import { elem, List, map, toArray } from "../../../Data/List";
import { TabId } from "../../Utilities/LocationUtils";
import { Tab, TabBaseProps } from "../Universal/Tab";

export interface NavigationBarTabProps extends TabBaseProps {
  id: TabId
  subTabs?: List<TabId>
}

export interface NavigationBarTabsProps {
  currentTab: TabId
  tabs: List<NavigationBarTabProps>
  setTab (id: TabId): void
}

export function NavigationBarTabs (props: NavigationBarTabsProps) {
  const { currentTab, tabs, setTab } = props

  return (
    <div className="navigationbar-tabs">
      {
        ...toArray (map ((tab: NavigationBarTabProps) => {
                     const { id, subTabs, ...other } = tab
                     const isActive = subTabs ? elem (currentTab) (subTabs) : currentTab === id
                     const set = () => setTab (id)

                     return (
                       <Tab
                         {...other}
                         key={id}
                         active={isActive}
                         onClick={set}
                         />
                     )
                   })
                   (tabs))
      }
    </div>
  )
}
