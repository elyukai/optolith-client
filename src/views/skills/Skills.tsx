import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { CombatTechniquesContainer } from '../../containers/CombatTechniques';
import { LiturgiesContainer } from '../../containers/Liturgies';
import { SpecialAbilitiesContainer } from '../../containers/SpecialAbilities';
import { SpellsContainer } from '../../containers/Spells';
import { TalentsContainer } from '../../containers/Talents';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface SkillsOwnProps {
	locale: UIMessages;
}

export interface SkillsStateProps {
	showChants: boolean;
	showSpells: boolean;
}

export interface SkillsDispatchProps {}

export type SkillsProps = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps;

export interface SkillsState {
	tab: string;
}

export class Skills extends React.Component<SkillsProps, SkillsState> {
	state = {
		tab: 'talents'
	};

	handleClick = (tab: string) => this.setState({ tab } as SkillsState);

	render() {
		const { locale, showChants, showSpells } = this.props;
		const { tab } = this.state;

		let skillElement;

		switch (tab) {
			case 'talents':
				skillElement = <TalentsContainer locale={locale} />;
				break;
			case 'combat':
				skillElement = <CombatTechniquesContainer locale={locale} />;
				break;
			case 'spells':
				skillElement = <SpellsContainer locale={locale} />;
				break;
			case 'chants':
				skillElement = <LiturgiesContainer locale={locale} />;
				break;
			case 'special':
				skillElement = <SpecialAbilitiesContainer locale={locale} />;
				break;
		}

		const tabs = [
			{
				id: 'talents',
				label: _translate(locale, 'titlebar.tabs.talents'),
			},
			{
				id: 'combat',
				label: _translate(locale, 'titlebar.tabs.combattechniques'),
			},
			{
				id: 'special',
				label: _translate(locale, 'titlebar.tabs.specialabilities'),
			},
		];

		if (showSpells) {
			tabs.push({
				id: 'spells',
				label: _translate(locale, 'titlebar.tabs.spells'),
			});
		}

		if (showChants) {
			tabs.push({
				id: 'chants',
				label: _translate(locale, 'titlebar.tabs.liturgies'),
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
