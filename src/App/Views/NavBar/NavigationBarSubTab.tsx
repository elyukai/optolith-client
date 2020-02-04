import * as React from "react"
import { SubTab } from "../../Models/Hero/heroTypeHelpers"
import { TabId } from "../../Utilities/LocationUtils"
import { Tab } from "../Universal/Tab"

interface Props {
  currentTab: TabId
  tab: SubTab
  setTab (tab: TabId): void
}

export const NavigationBarSubTab: React.FC<Props> = props => {
  const { currentTab, tab, setTab } = props

  const { id, label, disabled } = tab

  const is_active = currentTab === id

  const handleTab = React.useCallback (() => setTab (id), [ setTab, id ])

  return (
    <Tab
      active={is_active}
      onClick={handleTab}
      label={label}
      disabled={disabled}
      />
  )
}
