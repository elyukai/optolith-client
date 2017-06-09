import { readFile } from 'fs';
import * as ServerActions from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { AuthStore } from '../stores/AuthStore';
import { HerolistStore } from '../stores/HerolistStore';
import { HeroForSave, ToListById } from '../types/data.d';
import { RawHero, RawHerolist } from '../types/rawdata.d';
import { alert } from '../utils/alert';

function connectionError(error: Error) {
	alert('Verbindung nicht möglich', `Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! Es kann bei diesem Problem auch möglich sein, dass etwas im Programmablauf nicht stimmt. Informiere uns bitte über dein Problem, sollte es deiner Erkenntnis nach nicht an der Verbindung liegen!

	(Fehler: ${JSON.stringify(error)})`);
	AppDispatcher.dispatch<ServerActions.RequestFailedAction>({
		type: ActionTypes.REQUEST_FAILED,
	});
}

export async function getAllData(): Promise<void> {
	readFile('./dist/data/DSA5.json', 'utf8', (e, data) => {
		if (e) {
			connectionError(e);
		}
		else {
			const result = JSON.parse(data);
			ServerActions.receiveDataTables(result);
		}
	});
}

export async function checkEmail(email: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkemail.php?e=' + email);
		const result = await response.text();
		return result;
	} catch (e) {
		connectionError(e);
	}
}

export async function checkUsername(name: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkuser.php?e=' + name);
		const result = await response.text();
		return result;
	} catch (e) {
		connectionError(e);
	}
}

export async function register(email: string, name: string, displayname: string, password: string): Promise<void> {
	try {
		const existingEmail: string | void = await checkEmail(email);
		const existingName: string | void = await checkEmail(name);

		const emailValid = (existingEmail as string) === 'false';
		const nameValid = (existingName as string) === 'false';

		if (emailValid && nameValid) {
			const response = await fetch('data/register.php?email=' + email + '&name=' + name + '&display=' + displayname + '&password=' + password);
			const result = await response.text();
			console.log(result);
			ServerActions.receiveRegistration();
		}
		else {
			if (!emailValid && !nameValid) {
				alert('Benutzername und Email-Adresse bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername werden bereits verwendet.');
			}
			else if (!emailValid) {
				alert('Email-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
			}
			else if (!nameValid) {
				alert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
			}
			AppDispatcher.dispatch<ServerActions.RequestFailedAction>({
				type: ActionTypes.REQUEST_FAILED
			});
		}
	} catch (e) {
		connectionError(e);
	}
}

export async function sendPasswordCode(email: string): Promise<void> {
	try {
		const response = await fetch('php/forgetpw.php?e=' + email);
		const result = await response.text();
		console.log(result);
		ServerActions.receivePasswordReset();
	} catch (e) {
		connectionError(e);
	}
}

export async function sendUsername(email: string): Promise<void> {
	try {
		const response = await fetch('php/forgetusername.php?e=' + email);
		const result = await response.text();
		console.log(result);
		ServerActions.receiveUsername();
	} catch (e) {
		connectionError(e);
	}
}

export async function resendActivation(email: string): Promise<void> {
	try {
		const response = await fetch('php/regmailagain.php?e=' + email);
		const result = await response.text();
		console.log(result);
		ServerActions.receiveAccountActivationEmail();
	} catch (e) {
		connectionError(e);
	}
}

export async function login(username: string, password: string): Promise<void> {
	try {
		const response = await fetch('php/login.php?u=' + username + '&p=' + password);
		const result = await response.json() as {
			name: string;
			displayName: string;
			email: string;
			sessionToken: string;
			heroes: ToListById<RawHero>;
		};
		const { name, displayName, email, sessionToken, heroes } = result;
		ServerActions.receiveLogin(name, displayName, email, sessionToken, heroes);
	} catch (e) {
		connectionError(e);
	}
}

export function logout() {
	ServerActions.receiveLogout();
}

// async logout(): Promise<void> {
// 	try {
// 		let response = await fetch('php/logout.php?token=' + AuthStore.getToken());
//  	let result = await response.text();
// 		ServerActions.receiveLogout();
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export async function setNewUsername(name: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=username&v=' + name);
		const result = await response.text();
		console.log(result);
		ServerActions.receiveNewUsername(name);
	} catch (e) {
		connectionError(e);
	}
}

export async function setNewDisplayName(name: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=displayname&v=' + name);
		const result = await response.text();
		console.log(result);
		ServerActions.receiveNewDisplayName(name);
	} catch (e) {
		connectionError(e);
	}
}

export async function setNewPassword(password: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=password&v=' + password);
		const result = await response.text();
		console.log(result);
		ServerActions.receiveNewPassword();
	} catch (e) {
		connectionError(e);
	}
}

const deleteAccountConfirmation = () => new Promise((resolve: (value: boolean) => void) => {
	alert(
		'Konto wirklich löschen?',
		'Soll dein Konto wirklich gelöscht werden? Wenn du diesem zustimmst, werden sämtliche deiner eigenen Helden und Gruppen unwiederbringlich gelöscht. Möchtest du wirklich fortfahren?',
		[
			{
				label: 'Konto löschen',
				onClick: () => resolve(true)
			},
			{
				label: 'Abbrechen',
				onClick: () => resolve(false)
			}
		]
	);
});

export async function deleteAccount(): Promise<void> {
	try {
		const comfirmed = await deleteAccountConfirmation();
		if (comfirmed) {
			const response = await fetch('php/deleteaccount.php?token=' + AuthStore.getToken());
			const result = await response.text();
		console.log(result);
			ServerActions.receiveUserDeletion();
		}
		else {
			AppDispatcher.dispatch<ServerActions.RequestFailedAction>({
				type: ActionTypes.REQUEST_FAILED
			});
		}
	} catch (e) {
		connectionError(e);
	}
}

export async function getHeroes(): Promise<void> {
	try {
		const response = await fetch('php/getherolist.php?token=' + AuthStore.getToken());
		const result = await response.json() as RawHerolist;
		ServerActions.receiveHerolist(result);
	} catch (e) {
		connectionError(e);
	}
}

export function requestHero(id: string) {
	ServerActions.receiveHeroData({
		...HerolistStore.get(id)
	});
}

// async loadHero(id): Promise<void> {
// 	try {
// 		let response = await fetch('php/gethero.php?hid=' + id);
//  	let result = await response.text();
// 		ServerActions.loadHeroSuccess(id, result);
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export async function createNewHero(name: string): Promise<void> {
	try {
		const response = await fetch('php/newhero.php?token=' + AuthStore.getToken() + '&n=' + name);
		const result = await response.text();
		console.log(result);
		// ServerActions.createNewHeroSuccess(result);
	} catch (e) {
		connectionError(e);
	}
}

export function saveHero(data: HeroForSave) {
	const part = JSON.stringify(data);
	const blob = new Blob([part], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${data.name}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// export async function saveHero(data): Promise<void> {
// 	try {
// 		ServerActions.startLoading();
// 		const response = await fetch('php/save.php?short=' + data[0] + '&full=' + data[1], {
// 			method: 'post',
// 			body: JSON.stringify(data)
// 		});
// 		const result = await response.text();
// 		// ServerActions.saveHeroSuccess(result);
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export function changeHeroAvatar(data: File) {
	const reader = new FileReader();
	reader.onload = async event => {
		try {
			const response = await fetch('php/uploadheropic.php?hid=' + HerolistStore.getCurrentId(), {
				body: event.target.result,
				method: 'post',
			});
			const result = await response.text();
			ServerActions.receiveHeroAvatar(result);
		} catch (e) {
			connectionError(e);
		}
	};
	reader.readAsText(data);
}

export async function deleteHero(id: string): Promise<void> {
	try {
		const response = await fetch('php/deletehero.php?token=' + AuthStore.getToken() + '&hid=' + id);
		const result = await response.text();
		console.log(result);
		// ServerActions.deleteHeroSuccess(result);
	} catch (e) {
		connectionError(e);
	}
}
