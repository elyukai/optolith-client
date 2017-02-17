import * as React from 'react';

export default class RegistrationConfirm extends React.Component<undefined, undefined> {

	render() {
		return (
			<div id="confirmregistration">
				<h2 className="header">Konto bestätigen</h2>
				<p>
					Wir haben dir eine E-Mail an die angegebene Adresse geschickt. Dort wirst du einen Bestätigungslink finden, dem du einfach nur zu folgen brauchst, um dein Konto zu aktivieren.
				</p>
				<p>
					<span className="link">
						Zurück zur Anmeldeseite
					</span>
				</p>
			</div>
		);
	}
}
