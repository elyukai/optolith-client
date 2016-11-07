import ActionTypes from '../constants/ActionTypes';
import AccountStore from '../stores/AccountStore';
import jQuery from 'jQuery';
import ProfileStore from '../stores/ProfileStore';
import React from 'react';
import ReactDOM from 'react-dom';
import request from './request';
import ServerActions from '../actions/ServerActions';

var WebAPIUtils = {
	getAllData: async function() {
		try {
			let result = await request.get('DSA5.json', 'json');
			ServerActions.receiveLists(result);
		} catch(e) {
			console.log(e);
			ServerActions.connectionError(e);
		}
	},
	register: async function(email, username, password) {
		try {
			ServerActions.startLoading();
			let url = 'php/register.php?e=' + email + '&u=' + username + '&p=' + password;
			let result = await request.get(url);
			ServerActions.registrationSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	checkEmail: async function(email) {
		try {
			let result = await request.get('php/checkemail.php?e=' + email);
			return result;
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	checkUsername: async function(username) {
		try {
			let result = await request.get('php/checkuser.php?e=' + username);
			return result;
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	sendPasswordCode: async function(email) {
		try {
			ServerActions.startLoading();
			let result = await request.get('php/forgetpw.php?e=' + email);
			ServerActions.forgotPasswordSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	sendUsername: async function(email) {
		try {
			ServerActions.startLoading();
			let url = 'php/forgetusername.php?e=' + email;
			let result = await request.get(url);
			ServerActions.forgotUsernameSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	resendActivation: async function(email) {
		try {
			ServerActions.startLoading();
			let result = await request.get('php/regmailagain.php?e=' + email);
			ServerActions.resendActivationSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	login: async function(username, password) {
		try {
			ServerActions.startLoading();
			let result = await request.get('php/login.php?u=' + username + '&p=' + password);
			ServerActions.receiveAccount(result, username);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	logout: function() {
		ServerActions.logoutSuccess();
	},
	// logout: async function() {
	// 	try {
	// 		ServerActions.startLoading();
	// 		let result = await request.get('php/logout.php?uid=' + AccountStore.getID());
	// 		ServerActions.logoutSuccess(result);
	// 	} catch(e) {
	// 		ServerActions.connectionError(e);
	// 	}
	// },
	setNewUsername: async function(name) {
		try {
			ServerActions.startLoading();
			let userID = AccountStore.getID();
			let url = 'php/changeaccount.php?uid=' + userID + '&src=username&v=' + name;
			let result = await request.get(url);
			ServerActions.changeUsernameSuccess(result, name);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	setNewPassword: async function(password) {
		try {
			ServerActions.startLoading();
			let userID = AccountStore.getID();
			let url = 'php/changeaccount.php?uid=' + userID + '&src=password&v=' + password;
			let result = await request.get(url);
			ServerActions.changePasswordSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	deleteAccount: async function() {
		try {
			ServerActions.startLoading();
			let result = await request.get('php/deleteaccount.php?uid=' + AccountStore.getID());
			ServerActions.deleteAccountSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	getHeroes: async function() {
		try {
			ServerActions.startLoading();
			let result = await request.get('php/getherolist.php?uid=' + AccountStore.getID());
			ServerActions.herolistRefreshSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	loadHero: function(id) {
		ServerActions.startLoading();
		ServerActions.loadHeroSuccess(id, `{
			"sex":"m",
			"pers":{
				"_family": "ibn Rashtul",
				"_placeofbirth": "Rashdul",
				"_dateofbirth": "10. Boron 1001 BF",
				"_age": "6",
				"_haircolor": 2,
				"_eyecolor": 3,
				"_size": 167,
				"_weight": 71,
				"_title": "al'Eshta",
				"_socialstatus": 2,
				"_characteristics": "Reibt sich die Hände",
				"_otherinfo": "Hat einen Golem ..."
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
					["ADV_3",{}],["ADV_5",{}],["ADV_40",{}],["ADV_47",{"sid":"CT_2"}],["ADV_49",{}],["ADV_50",{}],["DISADV_1",[[2,2]]],["DISADV_15",{}],["DISADV_25",{}],["DISADV_40",{"tier":1}]
				],
				"_showRating":true
			},
			"talents":{
				"active":[["TAL_8",6],["TAL_10",4],["TAL_18",7],["TAL_20",5],["TAL_21",4],["TAL_25",4],["TAL_28",9],["TAL_29",7],["TAL_34",4],["TAL_38",5],["TAL_39",3],["TAL_40",2],["TAL_47",5],["TAL_48",8],["TAL_50",7],["TAL_51",1],["TAL_55",1],["TAL_59",1]],
				"_talentRating":true
			},
			"ct":{
				"active":[["CT_3",8],["CT_5",8]]
			},
			"spells":{
				"active":[]
			},
			"chants":{
				"active":[]
			},
			"sa":{
				"active":[["SA_10",[["TAL_48","Test"]]],["SA_28",[9,14]],["SA_30",[[8,4],[23,2],[6,1]]],["SA_86",{"sid":1}]]
			},
			"history": []
		}`);
	},
	// loadHero: async function(id) {
	// 	try {
	// 		ServerActions.startLoading();
	// 		let result = await request.get('php/gethero.php?hid=' + id);
	// 		ServerActions.loadHeroSuccess(id, result);
	// 	} catch(e) {
	// 		ServerActions.connectionError(e);
	// 	}
	// },
	createNewHero: async function(heroname) {
		try {
			ServerActions.startLoading();
			let url = 'php/newhero.php?uid=' + AccountStore.getID() + '&n=' + heroname;
			let result = await request.get(url);
			ServerActions.createNewHeroSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	saveHero: function(data) {
		ServerActions.startLoading();
		var blob = new Blob([data], { type: "application/json" });
		var url  = window.URL.createObjectURL(blob);
		window.open(url);
	},
	// saveHero: async function(data) {
	// 	try {
	// 		ServerActions.startLoading();
	// 		let url = 'php/save.php?short=' + data[0] + '&full=' + data[1];
	// 		let result = await request.get(url);
	// 		ServerActions.saveHeroSuccess(result);
	// 	} catch(e) {
	// 		ServerActions.connectionError(e);
	// 	}
	// },
	changeHeroAvatar: async function(type, data) {
		try {
			ServerActions.startLoading();
			var urlAdd = '';
			var finalData;
			if (type === 'ext') {
				urlAdd = '&url=' + data;
			} else if (type === 'file') {
				finalData = new FormData(data);
			}
			let url = 'php/uploadheropic.php?hid=' + ProfileStore.getID() + '&type=' + type + urlAdd;
			let result = await request.post(url, finalData);
			ServerActions.changeHeroAvatarSuccess(type === 'file' ? result : data);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	deleteHero: async function(heroid) {
		try {
			ServerActions.startLoading();
			let url = 'php/deletehero.php?uid=' + AccountStore.getID() + '&hid=' + heroid;
			let result = await request.get(url);
			ServerActions.deleteHeroSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	}
};

export default WebAPIUtils;
