import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { Imprint } from './Imprint';
import { ThirdPartyLicenses } from './ThirdPartyLicenses';
import { TOU } from './TOU';

interface State {
	tab: string;
}

export class About extends React.Component<undefined, State> {
	state = {
		tab: 'imprint',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {

		const { tab } = this.state;

		let element;

		switch (tab) {
			case 'imprint':
				element = <Imprint />;
				break;
			case 'thirdPartyLicenses':
				element = <ThirdPartyLicenses />;
				break;
			case 'tou':
				element = <TOU />;
				break;
		}

		return (
			<section id="about">
				<SubTabs
					tabs={[
						{
							id: 'imprint',
							label: 'Impressum',
						},
						{
							id: 'thirdPartyLicenses',
							label: 'Third-party licenses',
						},
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
