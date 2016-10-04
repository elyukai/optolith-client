import Groups from './Groups';
import InGame from './InGame';
import React, { Component } from 'react';
import SubTabs from '../../layout/SubTabs';

class Master extends Component {

	state = {
		tab: 'ingame'
	};

	constructor(props) {
		super(props);
	}

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'overview':
				element = <Groups />;
				break;
			case 'ingame':
				element = <InGame />;
				break;
		}

		return (
			<section id="master">
				<SubTabs
					tabs={[
						{
							label: 'Übersicht',
							tag: 'overview',
							disabled: true
						},
						{
							label: 'InGame',
							tag: 'ingame'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}

export default Master;
