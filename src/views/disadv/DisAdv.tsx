import Advantages from './Advantages';
import Disadvantages from './Disadvantages';
import * as React from 'react';
import SubTabs from '../../components/SubTabs';

interface State {
	tab: string;
}

export default class DisAdv extends React.Component<any, State> {

	state = {
		tab: 'adv'
	};

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'adv':
				element = <Advantages />;
				break;
			case 'disadv':
				element = <Disadvantages />;
				break;
		}

		return (
			<section id="disadv">
				<SubTabs
					tabs={[
						{
							label: 'Vorteile',
							tag: 'adv'
						},
						{
							label: 'Nachteile',
							tag: 'disadv'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
