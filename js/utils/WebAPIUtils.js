import ActionTypes from '../constants/ActionTypes';
import AccountActions from '../actions/AccountActions';
import AccountStore from '../stores/core/AccountStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import jQuery from 'jQuery';
import React from 'react';
import reactAlert from './reactAlert';
import ReactDOM from 'react-dom';
import ServerActions from '../actions/ServerActions';

function connectionError(error) {
	reactAlert('Verbindung nicht möglich', `Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! ${error}`);
}

var WebAPIUtils = {
	getAllData: function() {
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'DSA5.json',
					type: 'GET',
					dataType: 'json',
					success: function(result) {
						ServerActions.receiveLists(result);
					},
					error: function(error) {
						connectionError(error);
						AppDispatcher.dispatch({
							actionType: ActionTypes.WAIT_END
						});
					}
				}
			);
		});
	},
	register: function(email, username, password) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/register.php?e=' + email + '&u=' + username + '&p=' + password,
					type: 'GET',
					dataType: 'text',
					success: function() {
						ServerActions.registrationSuccess();
					},
					error: function(error) {
						connectionError(error);
						reject();
					}
				}
			);
		});
	},
	checkEmail: function(email) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/checkemail.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	checkUsername: function(username) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/checkuser.php?u=' + username,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	sendPasswordCode: function(email) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/forgetpw.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	sendUsername: function(email) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/forgetusername.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	resendActivation: function(email) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/regmailagain.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	login: function(username, password) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/login.php?u=' + username + '&p=' + password,
					type: 'GET',
					dataType: 'text',
					success: function(result) { 
						ServerActions.receiveUser(result);
					},
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	logout: function() {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/logout.php?uid=' + AccountStore.getID(),
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	logoutSync: function() {
		jQuery.ajax(
			{
				url: 'http://cha5app.dsa-sh.de/php/logout.php?uid=' + AccountStore.getID(),
				type: 'GET',
				dataType: 'text',
				async: false
			}
		);
	},
	setNewUsername: function(username) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/php.php?uid=' + AccountStore.getID() + '&src=username&v=' + username,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	setNewPassword: function(password) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/php.php?uid=' + AccountStore.getID() + '&src=password&v=' + password,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	deleteAccount: function() {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/deleteaccount.php?uid=' + AccountStore.getID(),
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	getHeroes: function(userid) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/getherolist.php?uid=' + (typeof userid === 'undefined' ? AccountStore.getID(): userid),
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	getHero: function(heroid) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/gethero.php?hid=' + heroid,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	createNewHero: function(heroname) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/newhero.php?uid=' + AccountStore.getID() + '&n=' + heroname,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	},
	saveHero: function() {
		// var herolist, heroPosition;
			
		// if (WebHeroList !== undefined) {
		// 	herolist = JSON.parse(WebHeroList);
		// } else {
		// 	herolist = [];
		// }
			
		// for (var i = 0; i < herolist.length; i++) {
		// 	if (herolist[i].id === obj.id) {
		// 		heroPosition = i;
		// 		break;
		// 	}
		// }
		
		// if (heroPosition === undefined) {
		// 	herolist.push(obj);
		// 	herolist[herolist.length - 1].id = herolist.length;
		// 	herolist[herolist.length - 1].g = 1;
		// } else {
		// 	herolist[heroPosition] = obj;
		// }
		
		// WebHeroList = JSON.stringify(herolist);
		
		console.log('FEATURE MISSING');
		
		return true;
	},
	deleteHero: function(heroid) {
		return new Promise(function(resolve, reject){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/deletehero.php?uid=' + AccountStore.getID() + '&hid=' + heroid,
					type: 'GET',
					dataType: 'text',
					success: function(result) { resolve(result); },
					error: function(error) { connectionError(error); reject(); }
				}
			);
		});
	}
};

export default WebAPIUtils;
