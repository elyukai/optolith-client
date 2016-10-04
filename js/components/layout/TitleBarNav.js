import Avatar from './Avatar';
import React, { Component, PropTypes } from 'react';
import Tab from './Tab';
import TabActions from '../../actions/TabActions';

class TitleBarNav extends Component {

	static propTypes = {
		active: PropTypes.string.isRequired,
		tabs: PropTypes.array.isRequired
	};

	constructor(props) {
		super(props);
	}

	handleClick = tab => TabActions.openTab(tab);

	render() {

		const { active, avatar, children, tabs } = this.props;

		const avatarElement = avatar ? (
			<div className="avatar-wrapper">
				<Avatar src={avatar} />
			</div>
		) : null;

		return (
			<div className="left">
				{avatarElement}
				{children}
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

export default TitleBarNav;
