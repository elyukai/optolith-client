import * as React from 'react';
import Equipment from './Equipment';
import Inventory from './Inventory';
import SubTabs from '../../components/SubTabs';

interface State {
	tab: string;
}

export default class Items extends React.Component<undefined, State> {
	state = {
		tab: 'inventory'
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		let element;

		switch (this.state.tab) {
			case 'inventory':
				element = <Inventory />;
				break;
			case 'equipment':
				element = <Equipment />;
				break;
		}

		const tabs = [
			{
				label: 'Inventar',
				tag: 'inventory'
			},
			// {
			// 	label: 'Ausrüstung',
			// 	tag: 'equipment',
			// 	disabled: true
			// }
		]

		return (
			<section id="items">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
