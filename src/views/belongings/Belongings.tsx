import * as React from 'react';
import SubTabs from '../../components/SubTabs';
import Equipment from './Equipment';

interface State {
	tab: string;
}

export default class Belongings extends React.Component<undefined, State> {
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
		}

		const tabs = [
			{
				id: 'equipment',
				label: 'Ausrüstung',
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
