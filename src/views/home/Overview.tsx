import React, { Component } from 'react';
import Scroll from '../../components/Scroll';

export default class Overview extends Component<any, any> {
	render() {
		return (
			<div className="page" id="home-overview">
				<Scroll className="text">
					<h2>Willkommen im DSA5 Heldentool!</h2>

					<h3>Viele Anpassungsmöglichkeiten</h3>
					<p>
						Du kannst dir die Seiten immer so anzeigen lassen, wie du sie gerade benötigst. Das geht mit Textfiltern, Sortierfiltern und Kategoriefiltern. Aber auch empfohlene Fähigkeiten, wie sie z.B. bei einer Kultur vorkommen, können angezeigt werden. Falls du meinst, dass eine Option fehlt, die Arbeit ersparen würde, zögere nicht, uns deinen Vorschlag mitzuteilen!
					</p>

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
					</p>

					<h3>Gruppen</h3>
					<p>
						Wir werden in einem späteren Patch eine Gruppenverwaltung hinzufügen. Dadurch können Gruppenmitglieder übersichtlich angezeigt und verglichen werden. Außerdem kann dieses Tool auch in-game dazu genutzt werden, die INI-Tabelle in Kombination mit Zustands- und Energieanzeigen darzustellen. Diese Ingame-Tabelle hatten wir vorher einmal unter dem Namen "GameApp" veröffentlicht. Wir werden dieses Tool für DSA5 umschreiben.
					</p>

					<h3>Hausregeln</h3>
					<p>
						Was wäre DSA5 ohne Regelelemente, die man nicht in Kürze selbst erstellen oder auch verändern kann? Wie eine neue Sonderfertigkeit. Oder eine eigene Rasse oder ein eigenes Professionspaket. Ja, kommt noch. Laut Plan und Idee. Aber erst später.
					</p>

					<h3>Ein Wort (vielleicht auch mehr) zur Browserkompatibilität</h3>
					<p>
						Der Browser wurde mit den neuesten Versionen von Edge, Firefox und Chrome getestet. Du solltest keinen älteren Browser verwenden, da dort möglicherweise (mehr) Fehler (als sonst) auftreten können! Die App ist (noch) nicht auf Mobilgeräte angepasst worden. Die Funktionalität kann im Vergleich zum Desktopbrowser auch unterschiedlich sein!
					</p>
				</Scroll>
			</div>
		);
	}
}
