import AuthStore from '../stores/AuthStore';
import ProfileStore from '../stores/ProfileStore';
import ServerActions from '../actions/ServerActions';

export default {
	connectionError: function(e: Error): void {
		ServerActions.connectionError(e);	
	},
	
	getAllData: async function(): Promise<void> {
		try {
			let response = await fetch('data/DSA5.json');
			let result = await response.json();
			ServerActions.receiveLists(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	register: async function(email: string, name: string, displayname: string, password: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('data/register.php?email=' + email + '&name=' + name + '&display=' + displayname + '&password=' + password);
			let result = await response.text();
			ServerActions.registrationSuccess();
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	checkEmail: async function(email: string): Promise<string> {
		try {
			let response = await fetch('data/checkemail.php?e=' + email);
			let result = await response.text();
			return result;
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	checkUsername: async function(name: string): Promise<string> {
		try {
			let response = await fetch('data/checkuser.php?e=' + name);
			let result = await response.text();
			return result;
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	sendPasswordCode: async function(email: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/forgetpw.php?e=' + email);
			let result = await response.text();
			ServerActions.forgotPasswordSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	sendUsername: async function(email: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/forgetusername.php?e=' + email);
			let result = await response.text();
			ServerActions.forgotUsernameSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	resendActivation: async function(email: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/regmailagain.php?e=' + email);
			let result = await response.text();
			ServerActions.resendActivationSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	login: async function(name: string, password: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/login.php?u=' + name + '&p=' + password);
			let result = await response.text();
			ServerActions.receiveAccount(result, name);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	logout: function(): void {
		ServerActions.logoutSuccess();
	},
	// logout: async function(): Promise<void> {
	// 	try {
	// 		ServerActions.startLoading();
	// 		let response = await fetch('php/logout.php?uid=' + AuthStore.getID());
	//		let result = await response.text();
	// 		ServerActions.logoutSuccess(result);
	// 	} catch(e) {
	// 		ServerActions.connectionError(e);
	// 	}
	// },
	setNewUsername: async function(name: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/changeaccount.php?uid=' + AuthStore.getID() + '&src=username&v=' + name);
			let result = await response.text();
			ServerActions.changeUsernameSuccess(result, name);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	setNewPassword: async function(password: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/changeaccount.php?uid=' + AuthStore.getID() + '&src=password&v=' + password);
			let result = await response.text();
			ServerActions.changePasswordSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	deleteAccount: async function(): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/deleteaccount.php?uid=' + AuthStore.getID());
			let result = await response.text();
			ServerActions.deleteAccountSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	getHeroes: async function(): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/getherolist.php?uid=' + AuthStore.getID());
			let result = await response.text();
			ServerActions.herolistRefreshSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	loadHero: function(id: string): void {
		ServerActions.startLoading();
		ServerActions.loadHeroSuccess(id, `{
			"pers":{
				"family": "ibn Rashtul",
				"placeofbirth": "Rashdul",
				"dateofbirth": "10. Boron 1001 BF",
				"age": "6",
				"haircolor": 2,
				"eyecolor": 3,
				"size": 167,
				"weight": 71,
				"title": "al'Eshta",
				"socialstatus": 2,
				"characteristics": "Reibt sich die Hände",
				"otherinfo": "Hat einen Golem ..."
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
				"le":5,
				"le_add":0,
				"ae_add":0,
				"ke_add":0,
				"sk":-5,
				"zk":-5,
				"gs":8
			},
			"disadv":{
				"active":[
					["ADV_3",{}],["ADV_5",{}],["ADV_40",{}],["ADV_47",{"sid":"CT_2"}],["ADV_49",{}],["ADV_50",{}],["DISADV_1",[[2,2]]],["DISADV_15",{}],["DISADV_25",{}],["DISADV_40",{"tier":1}]
				],
				"showRating":true
			},
			"talents":{
				"active":[["TAL_8",6],["TAL_10",4],["TAL_18",7],["TAL_20",5],["TAL_21",4],["TAL_25",4],["TAL_28",9],["TAL_29",7],["TAL_34",4],["TAL_38",5],["TAL_39",3],["TAL_40",2],["TAL_47",5],["TAL_48",8],["TAL_50",7],["TAL_51",1],["TAL_55",1],["TAL_59",1]],
				"talentRating":true
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
	// loadHero: async function(id): Promise<void> {
	// 	try {
	// 		ServerActions.startLoading();
	// 		let response = await fetch('php/gethero.php?hid=' + id);
	//		let result = await response.text();
	// 		ServerActions.loadHeroSuccess(id, result);
	// 	} catch(e) {
	// 		ServerActions.connectionError(e);
	// 	}
	// },
	createNewHero: async function(name: string): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/newhero.php?uid=' + AuthStore.getID() + '&n=' + name);
			let result = await response.text();
			// ServerActions.createNewHeroSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	// saveHero: function(data) {
	// 	ServerActions.startLoading();
	// 	var blob = new Blob([data], { type: "application/json" });
	// 	var url  = window.URL.createObjectURL(blob);
	// 	window.open(url);
	// },
	saveHero: async function(data): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/save.php?short=' + data[0] + '&full=' + data[1], {
				method: 'post',
				body: JSON.stringify(data)
			});
			let result = await response.text();
			// ServerActions.saveHeroSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	changeHeroAvatar: async function(type, data): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/uploadheropic.php?hid=' + ProfileStore.getID(), {
				method: 'post',
				body: new FormData(data)
			});
			let result = await response.text();
			ServerActions.changeHeroAvatarSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	},
	deleteHero: async function(heroid): Promise<void> {
		try {
			ServerActions.startLoading();
			let response = await fetch('php/deletehero.php?uid=' + AuthStore.getID() + '&hid=' + heroid);
			let result = await response.text();
			// ServerActions.deleteHeroSuccess(result);
		} catch(e) {
			ServerActions.connectionError(e);
		}
	}
};
