import HeroSection from './HeroSection';
import PaneFooter from './PaneFooter';
import PaneUser from './PaneUser';
import React, { Component, PropTypes } from 'react';
import Scroll from '../layout/Scroll';

class Pane extends Component {

	static propTypes = {
		user: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
	}

	render() {
		const element = this.props.user.id > 0 ? (
			<Scroll>
				<PaneUser name={this.props.user.name} />
				<PaneFooter />
			</Scroll>
		) : null;

		return (
			<nav className="pane">
				{element}
			</nav>
		);
	}
}
				// <HeroSection />

export default Pane;
