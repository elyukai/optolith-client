import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { ArmorZonesContainer } from '../../containers/ArmorZones';
import { EquipmentContainer } from '../../containers/Equipment';
import { ItemEditorContainer } from '../../containers/ItemEditor';
import { PetsContainer } from '../../containers/Pets';
import { _translate, UIMessages } from '../../utils/I18n';

export interface BelongingsOwnProps {
	locale: UIMessages;
}

export interface BelongingsStateProps {}

export interface BelongingsDispatchProps {}

export type BelongingsProps = BelongingsStateProps & BelongingsDispatchProps & BelongingsOwnProps;

export interface BelongingsState {
	tab: string;
}

export class Belongings extends React.Component<BelongingsProps, BelongingsState> {
	state = {
		tab: 'equipment',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		const { locale } = this.props;
		const { tab } = this.state;

		let element;

		switch (tab) {
			case 'equipment':
				element = <EquipmentContainer locale={locale} />;
				break;
			case 'armorzones':
				element = <ArmorZonesContainer locale={locale} />;
				break;
			case 'pets':
				element = <PetsContainer locale={locale} />;
				break;
		}

		const tabs = [
			{
				id: 'equipment',
				label: _translate(locale, 'titlebar.tabs.equipment')
			},
			{
				id: 'armorzones',
				label: _translate(locale, 'titlebar.tabs.zonearmor'),
				disabled: locale.id !== 'de-DE'
			},
			{
				id: 'pets',
				label: _translate(locale, 'titlebar.tabs.pets')
			},
		];

		return (
			<section id="items">
				<SubTabs
					tabs={tabs}
					active={tab}
					onClick={this.handleClick}
					/>
				{element}
				<ItemEditorContainer locale={locale} />
			</section>
		);
	}
}
