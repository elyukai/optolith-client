import ActionTypes from '../constants/ActionTypes';
import alert from '../utils/alert';
import AppDispatcher from '../dispatcher/AppDispatcher';
import WebAPIUtils from '../utils/WebAPIUtils';

export async function register(email: string, name: string, displayName: string, password: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.WAIT_START,
		status: 'pending',
		statusMessage: 'Registrierung wird durchgeführt'
	});

	try {
		let existingEmail: string | boolean = await WebAPIUtils.checkEmail(email);
		let existingName: string | boolean = await WebAPIUtils.checkEmail(name);

		existingEmail = existingEmail === 'true';
		existingName = existingName === 'true';

		if (!existingEmail && !existingName) {
			WebAPIUtils.register(email, name, displayName, password);
		}
		else {
			if (existingEmail && !existingName) {
				alert('Email-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
			}
			else if (!existingEmail && existingName) {
				alert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
			}
			else if (existingEmail && existingName) {
				alert('Benutzername und Email-Adresse bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername werden bereits verwendet.');
			}
			AppDispatcher.dispatch({
				type: ActionTypes.REGISTRATION_SUCCESS,
				status: 'success'
			});
		}
	}
	catch (e) {
		WebAPIUtils.connectionError(e);
		AppDispatcher.dispatch({
			type: ActionTypes.REGISTRATION_SUCCESS,
			error: e,
			status: 'error'
		});
	}
}

export function forgotPassword(email: string) {
	WebAPIUtils.sendPasswordCode(email);
}

export function forgotUsername(email: string) {
	WebAPIUtils.sendUsername(email);
}

export function resendActivation(email: string) {
	WebAPIUtils.resendActivation(email);
}

export function login(name: string, password: string) {
	WebAPIUtils.login(name, password);
}

export function logout() {
	WebAPIUtils.logout();
}

export function changeUsername(name: string) {
	WebAPIUtils.setNewUsername(name);
}

export function changePassword(password: string) {
	WebAPIUtils.setNewPassword(password);
}

export function deleteAccountConfirm() {
	alert(
		'Konto wirklich löschen?',
		'Soll dein Konto wirklich gelöscht werden? Wenn du diesem zustimmst, werden sämtliche deiner eigenen Helden und Gruppen unwiederbringlich gelöscht. Möchtest du wirklich fortfahren?',
		[
			{
				label: 'Konto löschen',
				onClick: this.delete
			},
			{
				label: 'Abbrechen'
			}
		]
	);
}

export function deleteAccount() {
	WebAPIUtils.deleteAccount();
}
