import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { NavigationBarTabOptions } from "../../Models/View/NavigationBarTabOptions"
import { TabId } from "../../Utilities/LocationUtils"
import { pipe_ } from "../../Utilities/pipe"
import { NavigationBarTab } from "./NavigationBarTab"

const NBTOA = NavigationBarTabOptions.A

interface Props {
  currentTab: TabId
  tabs: List<Record<NavigationBarTabOptions>>
}

export const NavigationBarTabs: React.FC<Props> = props => {
  const { currentTab, tabs } = props

  return (
    <div className="navigationbar-tabs">
      {pipe_ (
        tabs,
        map (tab => (
          <NavigationBarTab
            key={NBTOA.id (tab)}
            currentTab={currentTab}
            options={tab}
            />
        )),
        toArray
      )}
    </div>
  )
}
