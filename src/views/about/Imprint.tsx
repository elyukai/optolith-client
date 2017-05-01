import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { getLocale } from '../../stores/LocaleStore';

export function Imprint() {
	return (
		<div className="page" id="imprint">
			<Scroll className="text">
				<h2>{getLocale()['imprint.title']}</h2>

				<h3>Lukas Obermann</h3>
				<p>
					Eekholl 11<br/>
					24361 Groß Wittensee<br/>
					Germany<br/>
					<a href="mailto:lukas.obermann@live.de">lukas.obermann@live.de</a>
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
