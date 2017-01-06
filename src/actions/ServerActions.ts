import * as ActionTypes from '../constants/ActionTypes';
import alert from '../utils/alert';
import AppDispatcher from '../dispatcher/AppDispatcher';
import HerolistStore from '../stores/HerolistStore';
import { RawRace } from '../reducers/RacesReducer';
import { Hero } from '../reducers/HerolistReducer';

export interface RawCore {
	id: string;
	name: string | { m: string, f: string };
}

export interface RawAdvantage extends RawCore {
	name: string;
	ap: number | number[] | string;
	tiers: number | null;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
}

export interface RawAttribute extends RawCore {
	name: string;
	short: string;
}

export interface RawCombatTechnique extends RawCore {
	name: string;
	skt: number;
	leit: string[];
	gr: number;
}

export interface RawCulture extends RawCore {
	name: string;
	ap: number;
	lang: string[];
	literacy: string[];
	social: number[];
	typ_prof: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	typ_talents: string[];
	untyp_talents: string[];
	talents: [string, number][];
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawLiturgy extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

export interface RawProfession extends RawCore {
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: any[][];
	sa: (string | number | boolean)[][];
	combattech: [string, number][];
	talents: [string, number][];
	spells: [string, number | null][];
	chants: [string, number | null][];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	vars: string[];
}

export interface RawProfessionVariant extends RawCore {
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: any[][];
	sa: (string | number | boolean)[][];
	combattech: [string, number][];
	talents: [string, number][];
}

export interface RawSpecialAbility extends RawCore {
	name: string;
	ap: number | number[] | string;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
	gr: number;
}

export interface RawSpell extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	trad: number[];
	merk: number;
	gr: number;
}

export interface RawTalent extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'evtl';
	gr: number;
	spec: string[];
	spec_input: string | null;
}

export interface RawData {
	adv: { [id: string]: RawAdvantage };
	attributes: { [id: string]: RawAttribute };
	combattech: { [id: string]: RawCombatTechnique };
	cultures: { [id: string]: RawCulture };
	disadv: { [id: string]: RawDisadvantage };
	liturgies: { [id: string]: RawLiturgy };
	professions: { [id: string]: RawProfession };
	professionVariants: { [id: string]: RawProfessionVariant };
	races: { [id: string]: RawRace };
	specialabilities: { [id: string]: RawSpecialAbility };
	spells: { [id: string]: RawSpell };
	talents: { [id: string]: RawTalent };
}

export interface ReceiveDataTablesAction {
	type: ActionTypes.RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
		pending?: boolean
	};
}

export const receiveDataTables = (data: RawData) => ({
	type: ActionTypes.RECEIVE_DATA_TABLES,
	payload: {
		data,
		pending: false
	}
});

export interface ReceiveHeroDataAction {
	type: ActionTypes.RECEIVE_HERO_DATA;
	payload: {
		data: Hero;
		pending?: boolean
	};
}

export const receiveHeroData = (data: Hero) => ({
	type: ActionTypes.RECEIVE_HERO_DATA,
	payload: {
		data,
		pending: false
	}
});

export default {
	startLoading(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.WAIT_START
		});
	},
	runtimeError(): void {
		alert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.WAIT_END
		});
	},
	connectionError(error: Error): void {
		alert('Verbindung nicht möglich', 'Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! ' + JSON.stringify(error) + ' Es kann bei diesem Problem auch möglich sein, dass etwas im Programmablauf nicht stimmt. Informiere uns bitte über dein Problem, sollte es deiner Erkenntnis nach nicht an der Verbindung liegen!');
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.WAIT_END
		});
	},

	receiveLists(raw: Object): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.RECEIVE_RAW_LISTS,
			...raw
		});
	},
	registrationSuccess(): void {
		alert('Konto bestätigen', 'Wir haben dir eine E-Mail an die angegebene Adresse geschickt. Dort wirst du einen Bestätigungslink finden, dem du einfach nur zu folgen brauchst, um dein Konto zu aktivieren.');
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.REGISTRATION_SUCCESS
		});
	},
	forgotPasswordSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				alert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;

			default:
				alert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit dem Link zum Zurücksetzen deines Passworts geschickt!');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;
		}
	},
	forgotUsernameSuccess(callback: string): void {
		switch (callback) {
			case 'false':
				alert('E-Mail nicht vorhanden', 'Die eingegebene E-Mail-Adresse ist nicht registriert.');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;

			default:
				alert('E-Mail erfolgreich verschickt', 'Du kannst jetzt in dein Postfach schauen; wir haben dir die E-Mail mit deinem Benutzernamen geschickt!');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
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
					type: ActionTypes.ATS.WAIT_END
				});
				break;
		}
	},
	receiveAccount(callback: string, name: string): void {
		switch (callback) {
			case 'false':
				alert('Anmeldeversuch fehlgeschlagen', 'Die eigegebene Kombination aus Benutzername und Passwort wurde nicht erkannt. Stelle sicher, dass du dich nicht vertippt hast und versuche es nochmal.');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;
			case 'notactive':
				alert('Benutzerkonto nicht aktiviert', 'Das hinterlegte Benutzerkonto wurde noch nicht aktivert. Bitte aktiviere das Konto über den Aktivierungslink in der Aktivierungsemail.');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;
			case 'logged':
				alert('Benutzer bereits angemeldet', 'Das Konto ist momentan an einem anderen Ort (Gerät oder Browser) angemeldet. Es kann nicht mehrere Male auf ein Konto zugegriffen werden.');
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.WAIT_END
				});
				break;
			default: {
				// let [ id, heroes ] = JSON.parse(callback);
				let id = parseInt(callback);
				let heroes = [];
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.RECEIVE_ACCOUNT,
					id, name, heroes
				});
			}
		}
	},
	logoutSuccess(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.LOGOUT_SUCCESS
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
					type: ActionTypes.ATS.ACCOUNTNAME_CHANGE_SUCCESS,
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
					type: ActionTypes.ATS.PASSWORD_CHANGE_SUCCESS
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
					type: ActionTypes.ATS.CLEAR_ACCOUNT
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
					type: ActionTypes.ATS.RECEIVE_RAW_HEROLIST,
					rawHeroes
				});
				break;
		}
	},
	loadHeroSuccess(id: string, data: string): void {
		var short = HerolistStore.get(id);
		data = JSON.parse(data);
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.RECEIVE_HERO,
			...(Object.assign({}, short, data))
		});
	},
	saveHeroSuccess(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.SAVE_HERO_SUCCESS
		});
	},
	changeHeroAvatarSuccess(url: string): void {
		switch (url) {
			case 'false':
				this.runtimeError();
				break;

			default:
				AppDispatcher.dispatch({
					type: ActionTypes.ATS.UPDATE_HERO_AVATAR,
					url
				});
				break;
		}
	}
};
