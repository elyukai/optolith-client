import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { Equipment } from './Equipment';
import { Pets } from './Pets';

export interface BelongingsState {
	tab: string;
}

export class Belongings extends React.Component<undefined, BelongingsState> {
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
			case 'pets':
				element = <Pets />;
				break;
		}

		const tabs = [
			{
				id: 'equipment',
				label: 'Ausrüstung',
			},
			{
				id: 'pets',
				label: 'Begleiter'
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
