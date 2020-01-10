import * as React from "react";
import { useDispatch } from "react-redux";
import { elem, List } from "../../../Data/List";
import { setTab } from "../../Actions/LocationActions";
import { TabId } from "../../Utilities/LocationUtils";
import { Tab, TabBaseProps } from "../Universal/Tab";

export interface NavigationBarTabProps extends TabBaseProps {
  currentTab: TabId
  id: TabId
  subTabs?: List<TabId>
}

export const NavigationBarTab: React.FC<NavigationBarTabProps> = props => {
  const {
    className,
    currentTab,
    disabled,
    label,
    id,
    subTabs,
  } = props

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
      disabled={disabled}
      label={label}
      />
  )
}
