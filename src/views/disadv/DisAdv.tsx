import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { translate } from '../../utils/I18n';
import { Advantages } from './Advantages';
import { Disadvantages } from './Disadvantages';

interface State {
	tab: string;
}

export class DisAdv extends React.Component<{}, State> {
	state = {
		tab: 'adv',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		let element;

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
							id: 'adv',
							label: translate('titlebar.tabs.advantages'),
						},
						{
							id: 'disadv',
							label: translate('titlebar.tabs.disadvantages'),
						},
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
