import Equipment from './Equipment';
import Inventory from './Inventory';
import React, { Component } from 'react';
import SubTabs from '../../layout/SubTabs';

class Items extends Component {

	state = {
		tab: 'inventory'
	};

	constructor(props) {
		super(props);
	}

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
							tag: 'equipment'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}

export default Items;
