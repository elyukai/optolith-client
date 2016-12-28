import ActionTypes from '../constants/ActionTypes';
import alert from '../utils/alert';
import AppDispatcher from '../dispatcher/AppDispatcher';
import createOverlay from '../utils/createOverlay';
import ForgotPassword from '../views/account/ForgotPassword';
import ForgotUsername from '../views/account/ForgotUsername';
import Login from '../views/account/Login';
import React from 'react';
import Register from '../views/account/Register';
import ResendActivation from '../views/account/ResendActivation';
import WebAPIUtils from '../utils/WebAPIUtils';

export default {
	showRegister: function() {
		createOverlay(<Register />);
	},
	showForgotName: function() {
		createOverlay(<ForgotUsername />);
	},
	showForgotPassword: function() {
		createOverlay(<ForgotPassword />);
	},
	showResend: function() {
		createOverlay(<ResendActivation />);
	},
	showLogin: function() {
		createOverlay(<Login />);
	},
	register: async function(email, username, password) {
		try {
			let existingEmail = await WebAPIUtils.checkEmail(email);
			let existingUsername = await WebAPIUtils.checkEmail(username);

			existingEmail = existingEmail === 'true';
			existingUsername = existingUsername === 'true';

			if (!existingEmail && !existingUsername) {
				WebAPIUtils.register(email, username, password);
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
	forgotPassword: function(email) {
		WebAPIUtils.sendPasswordCode(email);
	},
	forgotUsername: function(email) {
		WebAPIUtils.sendUsername(email);
	},
	resendActivation: function(email) {
		WebAPIUtils.resendActivation(email);
	},
	login: function(username, password) {
		WebAPIUtils.login(username, password);
	},
	logout: function() {
		WebAPIUtils.logout();
	},
	changeUsername: function(username) {
		WebAPIUtils.setNewUsername(username);
	},
	changePassword: function(password) {
		WebAPIUtils.setNewPassword(password);
	},
	deleteConfirm: function() {
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
	delete: function() {
		WebAPIUtils.deleteAccount();
	}
};
