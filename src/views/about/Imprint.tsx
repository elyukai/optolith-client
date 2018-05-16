import * as React from 'react';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { UIMessages } from '../../types/ui';
import { translate } from '../../utils/I18n';

export interface ImprintProps {
	locale: UIMessages;
}

export function Imprint(props: ImprintProps) {
	const { locale } = props;
	return (
		<Page id="imprint">
			<Scroll className="text">
				<h2>{translate(locale, 'imprint.title')}</h2>

				<h3>Lukas Obermann</h3>
				<p>
					Ballastbrücke 29<br/>
					24937 Flensburg<br/>
					Germany<br/>
					<a href="mailto:lukas.obermann@outlook.de">lukas.obermann@outlook.de</a><br/>
					<i>{translate(locale, 'imprint.emailhint')}</i>
				</p>

				<h3>Thore Schuchardt</h3>
				<p>
					Lehmberg 7b<br/>
					24361 Groß Wittensee<br/>
					Germany
				</p>
			</Scroll>
		</Page>
	);
}
