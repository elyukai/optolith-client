import { Component, PropTypes } from 'react';
import * as React from 'react';
import TabProps from '../../components/Tab';
import TabActions from '../../actions/TabActions';

interface Props {
	active: string;
	tabs: any[];
}

export default class TitleBarTabs extends Component<Props, any> {

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
							<TabProps
								onClick={this.handleClick.bind(null, tag)}
								{...other}
								key={`tab-${tag}`}
								active={isActive}>
							</TabProps>
						);
					})
				}
			</div>
		);
	}
}
