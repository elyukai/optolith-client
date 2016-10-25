import ActionTypes from '../constants/ActionTypes';
import AccountActions from '../actions/AccountActions';
import AccountStore from '../stores/core/AccountStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import jQuery from 'jQuery';
import ProfileStore from '../stores/ProfileStore';
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
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/register.php?e=' + email + '&u=' + username + '&p=' + password,
					type: 'GET',
					dataType: 'text',
					success: function() {
						ServerActions.registrationSuccess();
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	checkEmail: function(email) {
		return new Promise(function(resolve){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/checkemail.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						resolve(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	checkUsername: function(username) {
		return new Promise(function(resolve){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/checkuser.php?u=' + username,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						resolve(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	sendPasswordCode: function(email) {
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/forgetpw.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.forgotPasswordSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	sendUsername: function(email) {
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/forgetusername.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.forgotUsernameSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	resendActivation: function(email) {
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/regmailagain.php?e=' + email,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.resendActivationSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	login: function(username, password) {
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/login.php?u=' + username + '&p=' + password,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.receiveAccount(result, username);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	logout: function() {
		// ServerActions.startLoading();
		ServerActions.logoutSuccess();
		// return new Promise(function(){
		// 	jQuery.ajax(
		// 		{
		// 			url: 'http://cha5app.dsa-sh.de/php/logout.php?uid=' + AccountStore.getID(),
		// 			type: 'GET',
		// 			dataType: 'text',
		// 			success: function(result) {
						// ServerActions.logoutSuccess(result);
		// 			},
		// 			error: function(error) {
		// 				ServerActions.connectionError(error);
		// 			}
		// 		}
		// 	);
		// });
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
	setNewUsername: function(name) {
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/php.php?uid=' + AccountStore.getID() + '&src=username&v=' + name,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.changeUsernameSuccess(result, name);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	setNewPassword: function(password) {
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/php.php?uid=' + AccountStore.getID() + '&src=password&v=' + password,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.changePasswordSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	deleteAccount: function() {
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/deleteaccount.php?uid=' + AccountStore.getID(),
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.deleteAccountSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	getHeroes: function(userid) {
		ServerActions.startLoading();
		return new Promise(function(){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/getherolist.php?uid=' + (typeof userid === 'undefined' ? AccountStore.getID(): userid),
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						ServerActions.herolistRefreshSuccess(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	loadHero: function(id) {
		ServerActions.startLoading();
		ServerActions.loadHeroSuccess(id, `{
			"sex":"m",
			"pers":{
				"_hair": 1,
				"_eyes": 1,
				"_size": 167,
				"_weight": 71
			},
			"attr":{
				"values":[
					["ATTR_1",12,0],
					["ATTR_2",13,0],
					["ATTR_3",12,0],
					["ATTR_4",13,0],
					["ATTR_5",14,1],
					["ATTR_6",13,0],
					["ATTR_7",12,0],
					["ATTR_8",11,0]
				],
				"_le":5,
				"_le_add":0,
				"_ae_add":0,
				"_ke_add":0,
				"_sk":-5,
				"_zk":-5,
				"_gs":8
			},
			"disadv":{
				"active":[
					["ADV_3",{}],["ADV_5",{}],["ADV_40",{}],["ADV_47",{"sid":"CT_2"}],["ADV_49",{}],["DISADV_1",[[2,2]]],["DISADV_15",{}],["DISADV_25",{}],["DISADV_40",{"tier":1}]
				],
				"_showRating":true
			},
			"talents":{
				"active":[["TAL_8",6],["TAL_10",4],["TAL_18",7],["TAL_20",5],["TAL_21",4],["TAL_25",4],["TAL_28",9],["TAL_29",7],["TAL_34",4],["TAL_38",5],["TAL_39",3],["TAL_40",2],["TAL_47",5],["TAL_48",8],["TAL_50",7],["TAL_51",1],["TAL_55",1],["TAL_59",1]],
				"_talentRating":true},
			"ct":{
				"active":[["CT_3",8],["CT_5",8]]},"spells":{"active":[]},"chants":{"active":[]
			},
			"sa":{
				"active":[["SA_10",[["TAL_48","Test"]]],["SA_28",[9,14]],["SA_30",[[8,4],[23,2],[6,1]]]]
			},
			"history": []
		}`);
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
		return new Promise(function(resolve){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/newhero.php?uid=' + AccountStore.getID() + '&n=' + heroname,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						resolve(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	},
	saveHero: function(data) {
		ServerActions.startLoading();
		var blob = new Blob([data], { type: "application/json" });
		var url  = window.URL.createObjectURL(blob);
		window.open(url);
		// window.open('data:application/json;' + json);
		// var w = window.open();
		// w.document.open();
		// w.document.write('<html><body><pre>' + json + '</pre></body></html>');
		// w.document.close();
		// return new Promise(function(){
		// 	jQuery.ajax(
		// 		{
		// 			url: 'http://cha5app.dsa-sh.de/php/save.php?short=' + data[0] + '&full=' + data[1],
		// 			type: 'POST',
		// 			dataType: 'json',
		// 			success: function() {
						ServerActions.saveHeroSuccess();
		// 			},
		// 			error: function(error) {
		// 				ServerActions.connectionError(error);
		// 			}
		// 		}
		// 	);
		// });
	},
	changeHeroAvatar: function(type, data) {
		ServerActions.startLoading();
		var urlAdd = '';
		var finalData;
		if (type === 'ext') {
			urlAdd = '&url=' + data;
		} else if (type === 'file') {
			finalData = new FormData(data);
		}
		return new Promise(function(){
			jQuery.ajax({
				url: 'http://cha5app.dsa-sh.de/php/uploadheropic.php?hid=' + ProfileStore.getID() + '&type=' + type + urlAdd,
				type: 'POST',
				data: finalData,
				success: function(result) {
					ServerActions.changeHeroAvatarSuccess(type === 'file' ? result : data);
				},
				error: function(error) {
					ServerActions.connectionError(error);
				}
			});
		});
	},
	deleteHero: function(heroid) {
		ServerActions.startLoading();
		return new Promise(function(resolve){
			jQuery.ajax(
				{
					url: 'http://cha5app.dsa-sh.de/php/deletehero.php?uid=' + AccountStore.getID() + '&hid=' + heroid,
					type: 'GET',
					dataType: 'text',
					success: function(result) {
						resolve(result);
					},
					error: function(error) {
						ServerActions.connectionError(error);
					}
				}
			);
		});
	}
};

export default WebAPIUtils;
