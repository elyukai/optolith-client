import React, { Component, PropTypes } from 'react';
import Tab from './Tab';

export default class Subtabs extends Component {

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
