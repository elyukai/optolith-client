import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { AdvantagesContainer } from '../../containers/Advantages';
import { DisadvantagesContainer } from '../../containers/Disadvantages';
import { UIMessages } from '../../types/ui';
import { _translate } from '../../utils/I18n';

export interface AdvantagesDisadvantagesProps {
	locale: UIMessages;
}

export interface AdvantagesDisadvantagesState {
	tab: string;
}

export class AdvantagesDisadvantages extends React.Component<AdvantagesDisadvantagesProps, AdvantagesDisadvantagesState> {
	state = {
		tab: 'adv',
	};

	handleClick = (tab: string) => this.setState({ tab });

	render() {
		const { locale } = this.props;
		const { tab } = this.state;

		let element;

		switch (tab) {
			case 'adv':
				element = <AdvantagesContainer locale={locale} />;
				break;
			case 'disadv':
				element = <DisadvantagesContainer locale={locale} />;
				break;
		}

		return (
			<section id="disadv">
				<SubTabs
					tabs={[
						{
							id: 'adv',
							label: _translate(locale, 'titlebar.tabs.advantages'),
						},
						{
							id: 'disadv',
							label: _translate(locale, 'titlebar.tabs.disadvantages'),
						},
					]}
					active={tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
