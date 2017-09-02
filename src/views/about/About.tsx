import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { UIMessages } from '../../types/ui';
import { _translate } from '../../utils/I18n';
import { Imprint } from './Imprint';
import { ThirdPartyLicenses } from './ThirdPartyLicenses';

export interface AboutProps {
	locale: UIMessages;
}

export interface AboutState {
	tab: string;
}

export class About extends React.Component<AboutProps, AboutState> {
	state = {
		tab: 'imprint',
	};

	handleClick = (tab: string) => this.setState({ tab } as AboutState);

	render() {
		const { locale } = this.props;
		const { tab } = this.state;

		let element;

		switch (tab) {
			case 'imprint':
				element = <Imprint locale={locale} />;
				break;
			case 'thirdPartyLicenses':
				element = <ThirdPartyLicenses />;
				break;
		}

		return (
			<section id="about">
				<SubTabs
					tabs={[
						{
							id: 'imprint',
							label: _translate(locale, 'titlebar.tabs.imprint'),
						},
						{
							id: 'thirdPartyLicenses',
							label: _translate(locale, 'titlebar.tabs.thirdpartylicenses'),
						},
						{
							id: 'lastchanges',
							label: _translate(locale, 'titlebar.tabs.lastchanges'),
							disabled: true
						},
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}

