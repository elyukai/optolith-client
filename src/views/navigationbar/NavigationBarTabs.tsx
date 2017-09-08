import * as React from 'react';
import { Tab, TabBaseProps } from '../../components/Tab';

export interface NavigationBarTabProps extends TabBaseProps {
	tag: string;
}

export interface NavigationBarTabsProps {
	active: string;
	tabs: NavigationBarTabProps[];
	setTab(id: string): void;
}

export class NavigationBarTabs extends React.Component<NavigationBarTabsProps, {}> {
	handleClick = (tab: string) => this.props.setTab(tab);

	render() {
		const { active, tabs } = this.props;

		return (
			<div className="navigationbar-tabs">
				{
					tabs.map(tab => {
						const { tag, ...other } = tab;
						const isActive = active === tag;

						return (
							<Tab
								onClick={this.handleClick.bind(null, tag)}
								{...other}
								key={`tab-${tag}`}
								active={isActive}
								/>
						);
					})
				}
			</div>
		);
	}
}
