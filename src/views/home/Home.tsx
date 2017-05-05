import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { translate } from '../../utils/I18n';
import { Overview } from './Overview';

interface State {
	tab: string;
}

export class Home extends React.Component<{}, State> {
	state = {
		tab: 'overview',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		const { tab } = this.state;
		let element;

		switch (tab) {
			case 'overview':
				element = <Overview />;
				break;
		}

		return (
			<section id="home">
				<SubTabs
					tabs={[
						{
							id: 'overview',
							label: translate('titlebar.tabs.homeintro'),
						},
						{
							disabled: true,
							id: 'news',
							label: translate('titlebar.tabs.news'),
						},
						{
							disabled: true,
							id: 'patchnotes',
							label: translate('titlebar.tabs.lastchanges'),
						},
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
