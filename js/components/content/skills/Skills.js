import CombatTechniques from './CombatTechniques';
import Liturgies from './Liturgies';
import React, { Component } from 'react';
import SpecialAbilities from './SpecialAbilities';
import SpecialAbilitiesStore from '../../../stores/SpecialAbilitiesStore';
import Spells from './Spells';
import SubTabs from '../../layout/SubTabs';
import Talents from './Talents';

class Skills extends Component {

	state = {
		tab: 'talents',
		showSpells: SpecialAbilitiesStore.get('SA_86').active,
		showChants: SpecialAbilitiesStore.get('SA_102').active
	};

	constructor(props) {
		super(props);
	}
	
	_updateSpecialAbilitiesStore = () => this.setState({
		showSpells: SpecialAbilitiesStore.get('SA_86').active,
		showChants: SpecialAbilitiesStore.get('SA_102').active
	});

	handleClick = tab => this.setState({ tab });
	
	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this._updateSpecialAbilitiesStore );
	}
	
	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this._updateSpecialAbilitiesStore );
	}

	render() {

		var skillElement;

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

export default Skills;
