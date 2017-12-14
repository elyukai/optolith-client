import * as React from 'react';
import { Tab, TabBaseProps } from '../../components/Tab';
import { TabId } from '../../utils/LocationUtils';

export interface NavigationBarTabProps extends TabBaseProps {
	id: TabId;
	subTabs?: TabId[];
}

export interface NavigationBarTabsProps {
	currentTab: TabId;
	tabs: NavigationBarTabProps[];
	setTab(id: TabId): void;
}

export function NavigationBarTabs(props: NavigationBarTabsProps) {
	const { currentTab, tabs, setTab } = props;

	return (
		<div className="navigationbar-tabs">
			{
				tabs.map(tab => {
					const { id, subTabs, ...other } = tab;
					const isActive = subTabs ? subTabs.includes(currentTab) : currentTab === id;
					const set = () => setTab(id);

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
