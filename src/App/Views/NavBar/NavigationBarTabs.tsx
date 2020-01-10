import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { TabId } from "../../Utilities/LocationUtils";
import { pipe_ } from "../../Utilities/pipe";
import { NavigationBarTab, NavigationBarTabProps } from "./NavigationBarTab";

export interface NavigationBarTabsProps {
  currentTab: TabId
  tabs: List<NavigationBarTabProps>
}

export const NavigationBarTabs: React.FC<NavigationBarTabsProps> = props => {
  const { currentTab, tabs } = props

  return (
    <div className="navigationbar-tabs">
      {pipe_ (
        tabs,
        map (tab => (
          <NavigationBarTab
            className={tab.className}
            currentTab={currentTab}
            disabled={tab.disabled}
            label={tab.label}
            id={tab.id}
            subTabs={tab.subTabs}
            />
        )),
        toArray
      )}
    </div>
  )
}
