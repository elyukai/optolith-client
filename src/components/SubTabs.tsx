import * as React from 'react';
import Tab from './Tab';

interface Props {
	active: string;
	tabs: SubTab[];
	onClick(tab: string): void;
}

export default class Subtabs extends React.Component<Props, undefined> {
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
