import AuthStore from '../stores/AuthStore';
import { readFile } from 'fs';
import HerolistStore from '../stores/HerolistStore';
import ProfileStore from '../stores/ProfileStore';
import _ServerActions from '../_actions/ServerActions';
import * as ServerActions from '../actions/ServerActions';

export function connectionError(e: Error) {
	_ServerActions.connectionError(e);
}

export async function getAllData(): Promise<void> {
	try {
		const response = await fetch('data/DSA5.json');
		const result = await response.json() as RawData;
		ServerActions.receiveDataTables(result);
	} catch(e) {
		_ServerActions.connectionError(Error(e));
	}
}

export async function register(email: string, name: string, displayname: string, password: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('data/register.php?email=' + email + '&name=' + name + '&display=' + displayname + '&password=' + password);
		const result = await response.text();
		_ServerActions.registrationSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function checkEmail(email: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkemail.php?e=' + email);
		const result = await response.text();
		return result;
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function checkUsername(name: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkuser.php?e=' + name);
		const result = await response.text();
		return result;
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function sendPasswordCode(email: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/forgetpw.php?e=' + email);
		const result = await response.text();
		_ServerActions.forgotPasswordSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function sendUsername(email: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/forgetusername.php?e=' + email);
		const result = await response.text();
		_ServerActions.forgotUsernameSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function resendActivation(email: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/regmailagain.php?e=' + email);
		const result = await response.text();
		_ServerActions.resendActivationSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function login(name: string, password: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/login.php?u=' + name + '&p=' + password);
		const result = await response.text();
		_ServerActions.receiveAccount(result, name);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export function logout() {
	_ServerActions.logoutSuccess();
}

// async logout(): Promise<void> {
// 	try {
// 		_ServerActions.startLoading();
// 		let response = await fetch('php/logout.php?token=' + AuthStore.getToken());
//  	let result = await response.text();
// 		_ServerActions.logoutSuccess(result);
// 	} catch(e) {
// 		_ServerActions.connectionError(e);
// 	}
// }

export async function setNewUsername(name: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=username&v=' + name);
		const result = await response.text();
		_ServerActions.changeUsernameSuccess(result, name);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function setNewPassword(password: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=password&v=' + password);
		const result = await response.text();
		_ServerActions.changePasswordSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function deleteAccount(): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/deleteaccount.php?token=' + AuthStore.getToken());
		const result = await response.text();
		_ServerActions.deleteAccountSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function getHeroes(): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/getherolist.php?token=' + AuthStore.getToken());
		const result = await response.text();
		_ServerActions.herolistRefreshSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export function requestHero(id: string) {
	ServerActions.receiveHeroData({
		...HerolistStore.get(id),
		pers:{
			family: 'ibn Rashtul',
			placeofbirth: 'Rashdul',
			dateofbirth: '10. Boron 1001 BF',
			age: '6',
			haircolor: 2,
			eyecolor: 3,
			size: '167',
			weight: '71',
			title: "al'Eshta",
			socialstatus: 2,
			characteristics: 'Reibt sich die Hände',
			otherinfo: 'Hat einen Golem ...'
		},
		attr:{
			values:[
				['ATTR_1',12,0],
				['ATTR_2',13,0],
				['ATTR_3',12,0],
				['ATTR_4',13,0],
				['ATTR_5',14,1],
				['ATTR_6',13,0],
				['ATTR_7',12,0],
				['ATTR_8',11,0]
			],
			lp:0,
			ae:0,
			kp:0
		},
		disadv:{
			active:{
				ADV_3:[{}],ADV_5:[{}],ADV_40:[{}],ADV_47:[{sid:'CT_2'}],ADV_49:[{}],ADV_50:[{}],DISADV_1:[[2,2]],DISADV_15:[{}],DISADV_25:[{}],DISADV_40:[{tier:1}]
			},
			showRating:true
		},
		talents:{
			active:{TAL_8:6,TAL_10:4,TAL_18:7,TAL_20:5,TAL_21:4,TAL_25:4,TAL_28:9,TAL_29:7,TAL_34:4,TAL_38:5,TAL_39:3,TAL_40:2,TAL_47:5,TAL_48:8,TAL_50:7,TAL_51:1,TAL_55:1,TAL_59:1},
			talentRating:true
		},
		ct:{
			active:{CT_3:8,CT_5:8}
		},
		spells:{
			active:{}
		},
		chants:{
			active:{}
		},
		sa:{
			active:{SA_10:[['TAL_48','Test']],SA_28:[9,14],SA_30:[[8,4],[23,2],[6,1]],SA_86:[{sid:1}]}
		},
		history: [],
		items: {}
	});
}

// async loadHero(id): Promise<void> {
// 	try {
// 		_ServerActions.startLoading();
// 		let response = await fetch('php/gethero.php?hid=' + id);
//  	let result = await response.text();
// 		_ServerActions.loadHeroSuccess(id, result);
// 	} catch(e) {
// 		_ServerActions.connectionError(e);
// 	}
// }

export async function createNewHero(name: string): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/newhero.php?token=' + AuthStore.getToken() + '&n=' + name);
		const result = await response.text();
		// _ServerActions.createNewHeroSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

// saveHero(data) {
// 	_ServerActions.startLoading();
// 	var blob = new Blob([data], { type: "application/json" });
// 	var url  = window.URL.createObjectURL(blob);
// 	window.open(url);
// }

export async function saveHero(data): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/save.php?short=' + data[0] + '&full=' + data[1], {
			method: 'post',
			body: JSON.stringify(data)
		});
		const result = await response.text();
		// _ServerActions.saveHeroSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function changeHeroAvatar(type, data): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/uploadheropic.php?hid=' + ProfileStore.getID(), {
			method: 'post',
			body: new FormData(data)
		});
		const result = await response.text();
		_ServerActions.changeHeroAvatarSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}

export async function deleteHero(heroid): Promise<void> {
	try {
		_ServerActions.startLoading();
		const response = await fetch('php/deletehero.php?token=' + AuthStore.getToken() + '&hid=' + heroid);
		const result = await response.text();
		// _ServerActions.deleteHeroSuccess(result);
	} catch(e) {
		_ServerActions.connectionError(e);
	}
}
