import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { get } from '../../stores/ListStore';
import { SpecialAbilitiesStore } from '../../stores/SpecialAbilitiesStore';
import { SpecialAbilityInstance } from '../../types/data.d';
import { getSids, isActive } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';
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

export class Skills extends React.Component<{}, State> {

	state = {
		showChants: isActive(get('SA_102') as SpecialAbilityInstance),
		showSpells: isActive(get('SA_86') as SpecialAbilityInstance) && getSids(get('SA_86') as SpecialAbilityInstance)[0] !== 9,
		tab: 'talents',
	};

	handleClick = (tab: string) => this.setState({ tab } as State);

	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this.updateSpecialAbilitiesStore);
	}

	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this.updateSpecialAbilitiesStore);
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
				label: translate('titlebar.tabs.talents'),
			},
			{
				id: 'combat',
				label: translate('titlebar.tabs.combattechniques'),
			},
			{
				id: 'special',
				label: translate('titlebar.tabs.specialabilities'),
			},
		];

		if (showSpells) {
			tabs.push({
				id: 'spells',
				label: translate('titlebar.tabs.spells'),
			});
		}

		if (showChants) {
			tabs.push({
				id: 'liturgies',
				label: translate('titlebar.tabs.liturgies'),
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

	private updateSpecialAbilitiesStore = () => {
		this.setState({
			showChants: isActive(get('SA_102') as SpecialAbilityInstance),
			showSpells: isActive(get('SA_86') as SpecialAbilityInstance) && getSids(get('SA_86') as SpecialAbilityInstance)[0] !== 9,
		} as State);
	}
}
