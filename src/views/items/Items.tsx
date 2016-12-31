import Equipment from './Equipment';
import Inventory from './Inventory';
import React, { Component } from 'react';
import SubTabs from '../../components/SubTabs';

interface State {
	tab: string;
}

export default class Items extends Component<any, State> {

	state = {
		tab: 'inventory'
	};

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'inventory':
				element = <Inventory />;
				break;
			case 'equipment':
				element = <Equipment />;
				break;
		}

		return (
			<section id="items">
				<SubTabs
					tabs={[
						{
							label: 'Inventar',
							tag: 'inventory'
						},
						{
							label: 'Ausrüstung',
							tag: 'equipment',
							disabled: true
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
