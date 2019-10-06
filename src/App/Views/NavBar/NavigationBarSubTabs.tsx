import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { SubTab } from "../../Models/Hero/heroTypeHelpers";
import { TabId } from "../../Utilities/LocationUtils";
import { pipe_ } from "../../Utilities/pipe";
import { NavigationBarSubTab } from "./NavigationBarSubTab";

export interface NavigationBarSubTabsProps {
  currentTab: TabId
  tabs: List<SubTab>
  setTab (tab: TabId): void
}

export function NavigationBarSubTabs (props: NavigationBarSubTabsProps) {
  const { currentTab, tabs, setTab } = props

  return (
    <div className="navigationbar-subtabs">
      {pipe_ (
        tabs,
        map (tab => (
          <NavigationBarSubTab
            key={tab .id}
            currentTab={currentTab}
            tab={tab}
            setTab={setTab}
            />
        )),
        toArray
      )}
    </div>
  )
}
