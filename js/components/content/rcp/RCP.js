import Cultures from './Cultures';
import Professions from './Professions';
import Races from './Races';
import React, { Component } from 'react';
import SubTabs from '../../layout/SubTabs';

class RCP extends Component {

	state = {
		tab: 'race'
	};

	constructor(props) {
		super(props);
	}

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'race':
				element = <Races changeTab={this.handleClick} />;
				break;
			case 'culture':
				element = <Cultures changeTab={this.handleClick} />;
				break;
			case 'profession':
				element = <Professions changeTab={this.handleClick} />;
				break;
		}

		return (
			<section id="rcp">
				<SubTabs
					tabs={[
						{
							label: 'Spezies',
							tag: 'race'
						},
						{
							label: 'Kultur',
							tag: 'culture'
						},
						{
							label: 'Profession',
							tag: 'profession'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}

export default RCP;
