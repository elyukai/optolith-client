import ActionTypes from '../constants/ActionTypes';
import alert from '../utils/alert';
import AppDispatcher from '../dispatcher/AppDispatcher';
import WebAPIUtils from '../utils/WebAPIUtils';

export default {
	async register(email: string, username: string, displayName: string, password: string) {
		try {
			let existingEmail: string | boolean = await WebAPIUtils.checkEmail(email);
			let existingUsername: string | boolean = await WebAPIUtils.checkEmail(username);

			existingEmail = existingEmail === 'true';
			existingUsername = existingUsername === 'true';

			if (!existingEmail && !existingUsername) {
				WebAPIUtils.register(email, username, displayName, password);
			}
			else if (existingEmail && !existingUsername) {
				alert('Email-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			}
			else if (!existingEmail && existingUsername) {
				alert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			}
			else if (existingEmail && existingUsername) {
				alert('Benutzername und Email-Adresse bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername sind bereits vorhanden.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			}
		}
		catch (e) {
			WebAPIUtils.connectionError(e);
		}
	},
	forgotPassword(email) {
		WebAPIUtils.sendPasswordCode(email);
	},
	forgotUsername(email) {
		WebAPIUtils.sendUsername(email);
	},
	resendActivation(email) {
		WebAPIUtils.resendActivation(email);
	},
	login(username, password) {
		WebAPIUtils.login(username, password);
	},
	logout() {
		WebAPIUtils.logout();
	},
	changeUsername(username) {
		WebAPIUtils.setNewUsername(username);
	},
	changePassword(password) {
		WebAPIUtils.setNewPassword(password);
	},
	deleteConfirm() {
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
	},
	delete() {
		WebAPIUtils.deleteAccount();
	}
};
