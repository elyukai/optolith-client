import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { UIMessages } from '../../types/ui';
import { _translate } from '../../utils/I18n';

export interface ImprintProps {
	locale: UIMessages;
}

export function Imprint(props: ImprintProps) {
	const { locale } = props;
	return (
		<div className="page" id="imprint">
			<Scroll className="text">
				<h2>{_translate(locale, 'imprint.title')}</h2>

				<h3>Lukas Obermann</h3>
				<p>
					Eekholl 11<br/>
					24361 Groß Wittensee<br/>
					Germany<br/>
					<a href="mailto:lukas.obermann@live.de">lukas.obermann@live.de</a><br/>
					<i>{_translate(locale, 'imprint.emailhint')}</i>
				</p>

				<h3>Thore Schuchardt</h3>
				<p>
					Lehmberg 7b<br/>
					24361 Groß Wittensee<br/>
					Germany
				</p>
			</Scroll>
		</div>
	);
}
