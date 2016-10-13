import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';

class Home extends Component {
	render() {
		return (
			<section id="about">
				<div className="page">
					<Scroll>
						<h2>Willkommen im neuen Heldengenerator und Verwaltungstool für DSA5!</h2>

						<h3>Viele Anpassungsmöglichkeiten</h3>
						Die Cha5App hat viele Einstellungen zur Darstellung zu bieten. Dazu zählen u.A. Sortierfilter. Somit könnt ihr euch die Listen immer so anzeigen lassen, wie ihr sie gerade braucht. Aber auch empfohlene Fähigkeiten zählen dazu.

						<h3>Helden teilen</h3>
						Du wollt, dass auch mal jemand anderes einen Blick auf deinen Helden werfen kann, ohne dir über die Schulter zu schauen? Du wirst seinem Account in einem späteren Patch die Erlaubnis erteilen können, dies zu tun. Aber keine Angst, er wird nichts an ihm verändern können. OP bleibt OP.

						<h3>Gruppen</h3>
						Wir werden in einem späteren Patch eine Gruppenverwaltung hinzufügen. Dadurch können Gruppenmitglieder übersichtlich angezeigt und verglichen werden. Außerdem kann dieses Tool auch in-game dazu genutzt werden, die INI-Tabelle in Kombination mit Zustands- und Energieanzeigen darzustellen. Diese Ingame-Tabelle hatten wir vorher einmal unter dem Namen "GameApp" veröffentlicht. Wir werden dieses Tool für DSA5 umschreiben.

						<h3>Ein Wort zur Browserkompatibilität</h3>
						Der Browser wurde mit den neuesten Versionen von Edge, Firefox und Chrome getestet. Die Software ist grundsätzlich darauf ausgelegt, dass der jeweilige Browser die Sprachenspezifikation ES5 (ECMAScript 5) vollständig unterstützt.
					</Scroll>
				</div>
			</section>
		);
	}
}

export default Home;
