import ActionTypes from '../constants/ActionTypes';
import AccountActions from '../actions/AccountActions';
import AccountStore from '../stores/core/AccountStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import jQuery from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import ServerActions from '../actions/ServerActions';

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
						ServerActions.connectionError(error);
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
	loadHero: function(id) {
		ServerActions.loadHeroSuccess(id, {});
		// return new Promise(function(){
		// 	jQuery.ajax(
		// 		{
		// 			url: 'http://cha5app.dsa-sh.de/php/gethero.php?hid=' + id,
		// 			type: 'GET',
		// 			dataType: 'text',
		// 			success: function(result) {
		// 				ServerActions.loadHeroSuccess(id, result);
		// 			},
		// 			error: function(error) {
		// 				ServerActions.connectionError(error);
		// 			}
		// 		}
		// 	);
		// });
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
	saveHero: function(data) {
		// var blob = new Blob([json], { type: "application/json" });
		// var url  = window.URL.createObjectURL(blob);
		// window.open(url);
		// window.open('data:application/json;' + json);
		// var w = window.open();
		// w.document.open();
		// w.document.write('<html><body><pre>' + json + '</pre></body></html>');
		// w.document.close();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/save.php?short=' + data[0] + '&full=' + data[1],
					type: 'POST',
					dataType: 'json',
					success: function() {
						ServerActions.saveHeroSuccess();
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
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
