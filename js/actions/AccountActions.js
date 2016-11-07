import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';
import createOverlay from '../utils/createOverlay';
import ForgotUsername from '../components/content/account/ForgotUsername';
import ForgotPassword from '../components/content/account/ForgotPassword';
import Login from '../components/content/account/Login';
import React from 'react';
import reactAlert from '../utils/reactAlert';
import ReactDOM from 'react-dom';
import Register from '../components/content/account/Register';
import ResendActivation from '../components/content/account/ResendActivation';

var AccountActions = {
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
	register: function(email, username, password) {
		Promise.all([ WebAPIUtils.checkEmail(email), WebAPIUtils.checkUsername(username) ])
		.then(function([ v_email, v_name ]){
			if (v_email === 'true' && v_name === 'true') {
				reactAlert('Benutzername und Email-Adresse bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername sind bereits vorhanden.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			} else if (v_email === 'true' && v_name === 'false') {
				reactAlert('Email-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			} else if (v_email === 'false' && v_name === 'true') {
				reactAlert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			} else if (v_email && v_name ) {
				WebAPIUtils.register(email, username, password);
			}
		});
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
		reactAlert(
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

export default AccountActions;
