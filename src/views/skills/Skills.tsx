import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { get } from '../../stores/ListStore';
import { SpecialAbilitiesStore } from '../../stores/SpecialAbilitiesStore';
import { SpecialAbilityInstance } from '../../types/data.d';
import { CombatTechniques } from './CombatTechniques';
import { Liturgies } from './Liturgies';
import { SpecialAbilities } from './SpecialAbilities';
import { Spells } from './Spells';
import { Talents } from './Talents';

interface State {
	tab: string;
	showChants: boolean;
	showSpells: boolean;
}

export class Skills extends React.Component<undefined, State> {

	state = {
		showChants: (get('SA_102') as SpecialAbilityInstance).active.length > 0,
		showSpells: (get('SA_86') as SpecialAbilityInstance).active.length > 0,
		tab: 'talents',
	};

	_updateSpecialAbilitiesStore = () => this.setState({
		showChants: (get('SA_102') as SpecialAbilityInstance).active.length > 0,
		showSpells: (get('SA_86') as SpecialAbilityInstance).active.length > 0,
	} as State)

	handleClick = (tab: string) => this.setState({ tab } as State);

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

		const tabs = [
			{
				id: 'talents',
				label: 'Talente',
			},
			{
				id: 'combat',
				label: 'Kampftechniken',
			},
			{
				id: 'special',
				label: 'Sonderfertigkeiten',
			},
		];

		if (showSpells) {
			tabs.push({
				id: 'spells',
				label: 'Zauber',
			});
		}

		if (showChants) {
			tabs.push({
				id: 'liturgies',
				label: 'Liturgien',
			});
		}

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
