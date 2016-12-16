import CombatTechniques from './CombatTechniques';
import Liturgies from './Liturgies';
import React, { Component } from 'react';
import SpecialAbilities from './SpecialAbilities';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import { get } from '../../stores/ListStore';
import Spells from './Spells';
import SubTabs from '../../components/SubTabs';
import Talents from './Talents';

export default class Skills extends Component {

	state = {
		tab: 'talents',
		showSpells: get('SA_86').active,
		showChants: get('SA_102').active
	};
	
	_updateSpecialAbilitiesStore = () => this.setState({
		showSpells: get('SA_86').active,
		showChants: get('SA_102').active
	});

	handleClick = tab => this.setState({ tab });
	
	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this._updateSpecialAbilitiesStore );
	}
	
	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this._updateSpecialAbilitiesStore );
	}

	render() {

		const { showChants, showSpells, tab } = this.state;

		let skillElement;

		switch (tab) {
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

		if (showSpells) tabs.push({
			label: 'Zauber',
			tag: 'spells'
		});
		
		if (showChants) tabs.push({
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
