import React, { Component, PropTypes } from 'react';
import Tab from '../../components/Tab';
import TabActions from '../../actions/TabActions';

export default class TitleBarTabs extends Component {

	static propTypes = {
		active: PropTypes.string.isRequired,
		tabs: PropTypes.array.isRequired
	};

	handleClick = tab => TabActions.showTab(tab);

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
								active={isActive}>
							</Tab>
						);
					})
				}
			</div>
		);
	}
}
