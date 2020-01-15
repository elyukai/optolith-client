import * as React from "react";
import { useDispatch } from "react-redux";
import { elem } from "../../../Data/List";
import { Record } from "../../../Data/Record";
import { setTab } from "../../Actions/LocationActions";
import { NavigationBarTabOptions } from "../../Models/View/NavigationBarTabOptions";
import { TabId } from "../../Utilities/LocationUtils";
import { Tab } from "../Universal/Tab";

const NBTOA = NavigationBarTabOptions.A

interface Props {
  className?: string
  currentTab: TabId
  options: Record<NavigationBarTabOptions>
}

export const NavigationBarTab: React.FC<Props> = props => {
  const {
    className,
    currentTab,
    options,
  } = props

  const id = NBTOA.id (options)
  const label = NBTOA.label (options)
  const subTabs = NBTOA.subTabs (options)

  const dispatch = useDispatch ()

  const handleSetTab = React.useCallback (
    () => dispatch (setTab (id)),
    [ dispatch, id ]
  )

  const isActive = typeof subTabs === "object" ? elem (currentTab) (subTabs) : currentTab === id

  return (
    <Tab
      key={id}
      active={isActive}
      onClick={handleSetTab}
      className={className}
      label={label}
      />
  )
}
