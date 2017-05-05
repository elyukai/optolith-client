import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { translate } from '../../utils/I18n';
import { ArmorZones } from './ArmorZones';
import { Equipment } from './Equipment';
import { Pets } from './Pets';

export interface BelongingsState {
	tab: string;
}

export class Belongings extends React.Component<{}, BelongingsState> {
	state = {
		tab: 'equipment',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		let element;

		switch (this.state.tab) {
			case 'equipment':
				element = <Equipment />;
				break;
			case 'armorzones':
				element = <ArmorZones />;
				break;
			case 'pets':
				element = <Pets />;
				break;
		}

		const tabs = [
			{
				id: 'equipment',
				label: translate('titlebar.tabs.equipment'),
			},
			{
				id: 'armorzones',
				label: translate('titlebar.tabs.zonearmor'),
			},
			{
				id: 'pets',
				label: translate('titlebar.tabs.pets')
			},
		];

		return (
			<section id="items">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick}
					/>
				{element}
			</section>
		);
	}
}
