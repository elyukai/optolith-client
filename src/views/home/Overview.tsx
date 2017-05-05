import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Scroll } from '../../components/Scroll';
import { translate } from '../../utils/I18n';

export function Overview() {
	return (
		<div className="page" id="home-overview">
			<Scroll className="text">
				<h2>
					<div className="scriptorium" />
					{translate('homeintro.title')}
				</h2>
				<ReactMarkdown source={translate('homeintro.text') || '...'} />
			</Scroll>
		</div>
	);
}
/*
			<h3>Testen</h3>
			<p>
				Du möchtest dir nicht sofort ein Konto erstellen, sondern erstmal die Funktionen testen? Kein Problem! Wähle oben rechts einfach "Testen" aus. Du kannst dir damit testweise einen Helden erstellen, allerdings nicht speichern, drucken oder ein Avatarbild hochladen.
			</p>
			<p>
				Wenn du dich dazu entscheidest, ein Konto zu erstellen, kannst du deinen soeben erstellten Helden auch speichern und damit dann alle weiteren Funktionen nutzen. Du darfst vorher nur nicht diese Seite verlassen oder neu geladen haben!
			</p>

			<h3>Helden teilen</h3>
			<p>
				Du wollt, dass auch mal jemand anderes einen Blick auf deinen Helden werfen kann, ohne dir über die Schulter zu schauen? Du wirst seinem Account in einem späteren Patch die Erlaubnis erteilen können, dies zu tun. Aber keine Angst, er wird nichts an ihm verändern können. OP bleibt OP.
			</p>*/
