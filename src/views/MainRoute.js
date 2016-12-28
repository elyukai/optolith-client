import CombatTechniques from './CombatTechniques';
import Liturgies from './Liturgies';
import React, { Component, PropTypes } from 'react';
import SpecialAbilities from './SpecialAbilities';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import Spells from './Spells';
import SubTabs from '../../components/SubTabs';
import Talents from './Talents';

export default class extends Component {

	static propTypes = {
		tabs: PropTypes.array
	};

	state = {
		currentTab: this.props.tabs[0].key
	};
	
	handleClick = tab => this.setState({ currentTab: tab });

	render() {

		const { tabs } = this.props;
		const { currentTab } = this.state;

		let current;

		tabs.some((tab,i) => {
			if (tab) {}
		});

		switch (this.state.tab) {
			case 'talents':
				skillElement = <Talents />;
				break;
			case 'combat':
				skillElement = <CombatTechniques />;
				break;
			case 'spells':
				skillElement = <Spells />;
				break;
			case 'liturgies':
				skillElement = <Liturgies />;
				break;
			case 'special':
				skillElement = <SpecialAbilities />;
				break;
		}

		let tabs = [
			{
				label: 'Talente',
				tag: 'talents'
			},
			{
				label: 'Kampftechniken',
				tag: 'combat'
			},
			{
				label: 'Sonderfertigkeiten',
				tag: 'special'
			}
		];

		if (this.state.showSpells) tabs.push({
			label: 'Zauber',
			tag: 'spells'
		});
		
		if (this.state.showChants) tabs.push({
			label: 'Liturgien',
			tag: 'liturgies'
		});

		return (
			<section id="skills">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick} />
				{skillElement}
			</section>
		);
	}
}
