import * as React from 'react';
import Equipment from './Equipment';
import SubTabs from '../../components/SubTabs';

interface State {
	tab: string;
}

export default class Belongings extends React.Component<undefined, State> {
	state = {
		tab: 'equipment'
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
				label: 'Ausrüstung',
				tag: 'equipment'
			}
		];

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
