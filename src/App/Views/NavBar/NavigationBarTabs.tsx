import * as React from 'react';
import { TabId } from '../../App/Utils/LocationUtils';
import { Tab, TabBaseProps } from '../../components/Tab';
import { List } from '../../utils/dataUtils';

export interface NavigationBarTabProps extends TabBaseProps {
  id: TabId;
  subTabs?: List<TabId>;
}

export interface NavigationBarTabsProps {
  currentTab: TabId;
  tabs: List<NavigationBarTabProps>;
  setTab (id: TabId): void;
}

export function NavigationBarTabs (props: NavigationBarTabsProps) {
  const { currentTab, tabs, setTab } = props;

  return (
    <div className="navigationbar-tabs">
      {
        tabs.map (tab => {
          const { id, subTabs, ...other } = tab;
          const isActive = subTabs ? subTabs.elem (currentTab) : currentTab === id;
          const set = () => setTab (id);

          return (
            <Tab
              {...other}
              key={id}
              active={isActive}
              onClick={set}
              />
          );
        })
      }
    </div>
  );
}
