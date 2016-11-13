import Avatar from '../components/Avatar';
import React, { Component, PropTypes } from 'react';
import Tab from '../components/Tab';
import TabActions from '../actions/TabActions';
import classNames from 'classnames';

class TitleBarNav extends Component {

	static propTypes = {
		active: PropTypes.string.isRequired,
		tabs: PropTypes.array.isRequired
	};

	handleClick = tab => TabActions.openTab(tab);

	render() {

		const { active, avatar, children, tabs } = this.props;

		const avatarElement = avatar !== undefined ? (
			<div className={classNames( 'avatar-wrapper', !avatar && 'no-avatar' )}>
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
