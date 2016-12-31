import ActionTypes from '../constants/ActionTypes';
import alert from '../utils/alert';
import AppDispatcher from '../dispatcher/AppDispatcher';
import HerolistStore from '../stores/HerolistStore';

export default {
	startLoading(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
	},
	runtimeError(): void {
		alert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_END
		});
	},
	connectionError(error: Error): void {
		alert('Verbindung nicht möglich', 'Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! ' + JSON.stringify(error) + ' Es kann bei diesem Problem auch möglich sein, dass etwas im Programmablauf nicht stimmt. Informiere uns bitte über dein Problem, sollte es deiner Erkenntnis nach nicht an der Verbindung liegen!');
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_END
		});
	},
	
	receiveLists(raw: Object): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_LISTS,
			...raw
		});
	},
	registrationSuccess(): void {
		alert('Konto bestätigen', 'Wir haben dir eine E-Mail an die angegebene Adresse geschickt. Dort wirst du einen Bestätigungslink finden, dem du einfach nur zu folgen brauchst, um dein Konto zu aktivieren.');
		AppDispatcher.dispatch({
			actionType: ActionTypes.REGISTRATION_SUCCESS
		});
	},
	forgotPasswordSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				alert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
		
			default:
				alert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit dem Link zum Zurücksetzen deines Passworts geschickt!');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
		}
	},
	forgotUsernameSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				alert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
		
			default:
				alert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit deinem Benutzernamen geschickt!');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
		}
	},
	resendActivationSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				alert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die Aktivierungsemail erneut geschickt!');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
		}
	},
	receiveAccount(callback: string, name: string): void {
		switch (callback) {
			case 'false':
				alert('Anmeldeversuch fehlgeschlagen', 'Die eigegebene Kombination aus Benutzername und Passwort wurde nicht erkannt. Stelle sicher, dass du dich nicht vertippt hast und versuche es nochmal.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
			case 'notactive':
				alert('Benutzerkonto nicht aktiviert', 'Das hinterlegte Benutzerkonto wurde noch nicht aktivert. Bitte aktiviere das Konto über den Aktivierungslink in der Aktivierungsemail.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
			case 'logged':
				alert('Benutzer bereits angemeldet', 'Das Konto ist momentan an einem anderen Ort (Gerät oder Browser) angemeldet. Es kann nicht mehrere Male auf ein Konto zugegriffen werden.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				break;
			default: {
				// let [ id, heroes ] = JSON.parse(callback);
				let id = parseInt(callback);
				let heroes = [];
				AppDispatcher.dispatch({
					actionType: ActionTypes.RECEIVE_ACCOUNT,
					id, name, heroes
				});
			}
		}
	},
	logoutSuccess(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.LOGOUT_SUCCESS
		});
	},
	changeUsernameSuccess(callback: string, name: string): void {
		switch (callback) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				alert('Passwort erfolgreich geändert', 'Dein Passwort wurde erfolgreich geändert.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.ACCOUNTNAME_CHANGE_SUCCESS,
					name
				});
				break;
		}
	},
	changePasswordSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				alert('Passwort erfolgreich geändert', 'Dein Passwort wurde erfolgreich geändert.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.PASSWORD_CHANGE_SUCCESS
				});
				break;
		}
	},
	deleteAccountSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				alert('Konto gelöscht', 'Dein Konto wurde mitsamt aller Helden und Gruppen erfolgreich gelöscht.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.CLEAR_ACCOUNT
				});
				break;
		}
	},
	herolistRefreshSuccess(rawHeroes: string): void {
		switch (rawHeroes) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				AppDispatcher.dispatch({
					actionType: ActionTypes.RECEIVE_RAW_HEROLIST,
					rawHeroes
				});
				break;
		}
	},
	loadHeroSuccess(id: string, data: string): void {
		var short = HerolistStore.get(id);
		data = JSON.parse(data);
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_HERO,
			...(Object.assign({}, short, data))
		});
	},
	saveHeroSuccess(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SAVE_HERO_SUCCESS
		});
	},
	changeHeroAvatarSuccess(url: string): void {
		switch (url) {
			case 'false':
				this.runtimeError();
				break;
		
			default:
				AppDispatcher.dispatch({
					actionType: ActionTypes.UPDATE_HERO_AVATAR,
					url
				});
				break;
		}
	}
};
