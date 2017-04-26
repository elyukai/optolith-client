import * as React from 'react';
import { SubTab } from '../types/data.d';
import { Tab } from './Tab';

export interface SubtabsProps {
	active: string;
	tabs: SubTab[];
	onClick(tab: string): void;
}

export class SubTabs extends React.Component<SubtabsProps, {}> {
	setTab = (tab: string) => this.props.onClick(tab);

	render() {
		return (
			<div className="subtabs">
				{
					this.props.tabs.map((tab, index) => {
						const { id, ...other } = tab;
						const set = () => this.setTab(id);
						return (
							<Tab
								key={'subtab-' + index}
								{...other}
								active={this.props.active === id}
								onClick={set}
								/>
						);
					})
				}
			</div>
		);
	}
}
