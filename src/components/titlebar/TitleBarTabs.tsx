import * as React from 'react';
import { Tab, TabBaseProps } from '../Tab';

export interface TitleBarTabProps extends TabBaseProps {
	tag: string;
}

export interface TitleBarTabsProps {
	active: string;
	tabs: TitleBarTabProps[];
	setTab(id: string): void;
}

export class TitleBarTabs extends React.Component<TitleBarTabsProps, {}> {
	handleClick = (tab: string) => this.props.setTab(tab);

	render() {
		const { active, tabs } = this.props;

		return (
			<div className="titlebar-tabs">
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
