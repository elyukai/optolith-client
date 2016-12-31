import { Component, PropTypes } from 'react';
import * as React from 'react';
import Tab from './Tab';

interface TabProps {
	label: string;
	tag: string;
	disabled?: boolean;
}

interface Props {
	active: string;
	onClick: (tab: string) => void;
	tabs: TabProps[];
}

export default class Subtabs extends Component<Props, any> {

	static propTypes = {
		active: PropTypes.string,
		onClick: PropTypes.func,
		tabs: PropTypes.array
	};

	render() {
		return (
			<div className="subtabs">
				{
					this.props.tabs.map((tab, index) => {
						const { tag, ...other } = tab;
						return (
							<Tab
								key={'subtab-' + index}
								{...other}
								active={this.props.active === tag}
								onClick={this.props.onClick.bind(null, tag)}
								/>
						);
					})
				}
			</div>
		);
	}
}
