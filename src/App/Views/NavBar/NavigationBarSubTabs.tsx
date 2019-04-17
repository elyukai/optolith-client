import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { SubTab } from "../../Models/Hero/heroTypeHelpers";
import { TabId } from "../../Utilities/LocationUtils";
import { pipe_ } from "../../Utilities/pipe";
import { Tab } from "../Universal/Tab";

export interface NavigationBarSubTabsProps {
  currentTab: TabId
  tabs: List<SubTab>
  setTab (tab: TabId): void
}

export function NavigationBarSubTabs (props: NavigationBarSubTabsProps) {
  return (
    <div className="navigationbar-subtabs">
      {pipe_ (
        props.tabs,
        map (tab => {
          const { id, ...other } = tab
          const isActive = props.currentTab === id
          const set = () => props.setTab (id)

          return (
            <Tab
              {...other}
              key={id}
              active={isActive}
              onClick={set}
              />
          )
        }),
        toArray
      )}
    </div>
  )
}
