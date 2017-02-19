import { readFile } from 'fs';
import * as ServerActions from '../actions/ServerActions';
import alert from '../utils/alert';
import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AuthStore from '../stores/AuthStore';
import HerolistStore from '../stores/HerolistStore';
import ProfileStore from '../stores/ProfileStore';

function connectionError(error: Error) {
	alert('Verbindung nicht möglich', 'Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! ' + JSON.stringify(error) + ' Es kann bei diesem Problem auch möglich sein, dass etwas im Programmablauf nicht stimmt. Informiere uns bitte über dein Problem, sollte es deiner Erkenntnis nach nicht an der Verbindung liegen!');
	AppDispatcher.dispatch<RequestFailedAction>({
		type: ActionTypes.REQUEST_FAILED
	});
}

export async function getAllData(): Promise<void> {
	try {
		const response = await fetch('data/DSA5.json');
		const result = await response.json() as RawData;
		ServerActions.receiveDataTables(result);
	} catch(e) {
		connectionError(Error(e));
	}
}

export async function checkEmail(email: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkemail.php?e=' + email);
		const result = await response.text();
		return result;
	} catch(e) {
		connectionError(e);
	}
}

export async function checkUsername(name: string): Promise<string | void> {
	try {
		const response = await fetch('data/checkuser.php?e=' + name);
		const result = await response.text();
		return result;
	} catch(e) {
		connectionError(e);
	}
}

export async function register(email: string, name: string, displayname: string, password: string): Promise<void> {
	try {
		const existingEmail: string | void = await checkEmail(email);
		const existingName: string | void = await checkEmail(name);

		const emailValid = (existingEmail as string) === 'false';
		const nameValid = (existingName as string) === 'false';

		if (emailValid && nameValid) {
			const response = await fetch('data/register.php?email=' + email + '&name=' + name + '&display=' + displayname + '&password=' + password);
			const result = await response.text();
			ServerActions.receiveRegistration();
		}
		else {
			if (!emailValid && !nameValid) {
				alert('Benutzername und Email-Adresse bereits vorhanden', 'Sowohl die E-Mail-Adresse als auch der Benutzername werden bereits verwendet.');
			}
			else if (!emailValid) {
				alert('Email-Adresse bereits vorhanden', 'Die E-Mail-Adresse wird bereits verwendet.');
			}
			else if (!nameValid) {
				alert('Benutzername bereits vorhanden', 'Der Benutzername wird bereits verwendet.');
			}
			AppDispatcher.dispatch<RequestFailedAction>({
				type: ActionTypes.REQUEST_FAILED
			});
		}
	} catch(e) {
		connectionError(e);
	}
}

export async function sendPasswordCode(email: string): Promise<void> {
	try {
		const response = await fetch('php/forgetpw.php?e=' + email);
		const result = await response.text();
		ServerActions.receivePasswordReset();
	} catch(e) {
		connectionError(e);
	}
}

export async function sendUsername(email: string): Promise<void> {
	try {
		const response = await fetch('php/forgetusername.php?e=' + email);
		const result = await response.text();
		ServerActions.receiveUsername();
	} catch(e) {
		connectionError(e);
	}
}

export async function resendActivation(email: string): Promise<void> {
	try {
		const response = await fetch('php/regmailagain.php?e=' + email);
		const result = await response.text();
		ServerActions.receiveAccountActivationEmail();
	} catch(e) {
		connectionError(e);
	}
}

export async function login(username: string, password: string): Promise<void> {
	try {
		const response = await fetch('php/login.php?u=' + username + '&p=' + password);
		const result = await response.json() as {
			name: string;
			displayName: string;
			email: string;
			sessionToken: string;
			heroes: { [id: string]: RawHero };
		};
		const { name, displayName, email, sessionToken, heroes } = result;
		ServerActions.receiveLogin(name, displayName, email, sessionToken, heroes);
	} catch(e) {
		connectionError(e);
	}
}

export function logout() {
	ServerActions.receiveLogout();
}

// async logout(): Promise<void> {
// 	try {
// 		let response = await fetch('php/logout.php?token=' + AuthStore.getToken());
//  	let result = await response.text();
// 		ServerActions.receiveLogout();
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export async function setNewUsername(name: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=username&v=' + name);
		const result = await response.text();
		ServerActions.receiveNewUsername(name);
	} catch(e) {
		connectionError(e);
	}
}

export async function setNewDisplayName(name: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=displayname&v=' + name);
		const result = await response.text();
		ServerActions.receiveNewDisplayName(name);
	} catch(e) {
		connectionError(e);
	}
}

export async function setNewPassword(password: string): Promise<void> {
	try {
		const response = await fetch('php/changeaccount.php?token=' + AuthStore.getToken() + '&src=password&v=' + password);
		const result = await response.text();
		ServerActions.receiveNewPassword();
	} catch(e) {
		connectionError(e);
	}
}

const deleteAccountConfirmation = () => new Promise((resolve: (value: boolean) => void) => {
	alert(
		'Konto wirklich löschen?',
		'Soll dein Konto wirklich gelöscht werden? Wenn du diesem zustimmst, werden sämtliche deiner eigenen Helden und Gruppen unwiederbringlich gelöscht. Möchtest du wirklich fortfahren?',
		[
			{
				label: 'Konto löschen',
				onClick: () => resolve(true)
			},
			{
				label: 'Abbrechen',
				onClick: () => resolve(false)
			}
		]
	);
});

export async function deleteAccount(): Promise<void> {
	try {
		const comfirmed = await deleteAccountConfirmation();
		if (comfirmed) {
			const response = await fetch('php/deleteaccount.php?token=' + AuthStore.getToken());
			const result = await response.text();
			ServerActions.receiveUserDeletion();
		}
		else {
			AppDispatcher.dispatch<RequestFailedAction>({
				type: ActionTypes.REQUEST_FAILED
			});
		}
	} catch(e) {
		connectionError(e);
	}
}

export async function getHeroes(): Promise<void> {
	try {
		const response = await fetch('php/getherolist.php?token=' + AuthStore.getToken());
		const result = await response.json() as RawHerolist;
		ServerActions.receiveHerolist(result);
	} catch(e) {
		connectionError(e);
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
			kp:0,
			permanentAE:{
				lost:0,
				redeemed:0
			},
			permanentKP:{
				lost:0,
				redeemed:0
			}
		},
		activatable:{
			ADV_3:[{}],ADV_5:[{}],ADV_40:[{}],ADV_47:[{sid:'CT_2'}],ADV_49:[{}],ADV_50:[{}],DISADV_1:[{sid:2,tier:2}],DISADV_15:[{}],DISADV_25:[{}],DISADV_40:[{tier:1}],SA_10:[{sid:'TAL_48',sid2:'Test'}],SA_28:[{sid:9},{sid:14}],SA_30:[{sid:8,tier:4},{sid:23,tier:2},{sid:6,tier:1}],SA_86:[{sid:1}]
		},
		disadv:{
			ratingVisible:true
		},
		talents:{
			active:{TAL_8:6,TAL_10:4,TAL_18:7,TAL_20:5,TAL_21:4,TAL_25:4,TAL_28:9,TAL_29:7,TAL_34:4,TAL_38:5,TAL_39:3,TAL_40:2,TAL_47:5,TAL_48:8,TAL_50:7,TAL_51:1,TAL_55:1,TAL_59:1},
			ratingVisible:true
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
			active:{SA_10:[{sid:'TAL_48',sid2:'Test'}],SA_28:[{sid:9},{sid:14}],SA_30:[{sid:8,tier:4},{sid:23,tier:2},{sid:6,tier:1}],SA_86:[{sid:1}]}
		},
		history: [],
		items: {}
	});
}

// async loadHero(id): Promise<void> {
// 	try {
// 		let response = await fetch('php/gethero.php?hid=' + id);
//  	let result = await response.text();
// 		ServerActions.loadHeroSuccess(id, result);
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export async function createNewHero(name: string): Promise<void> {
	try {
		const response = await fetch('php/newhero.php?token=' + AuthStore.getToken() + '&n=' + name);
		const result = await response.text();
		// ServerActions.createNewHeroSuccess(result);
	} catch(e) {
		connectionError(e);
	}
}

export function saveHero(data: SaveData) {
	const part = JSON.stringify(data);
	const blob = new Blob([part], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	window.open(url, '_blank');
}

// export async function saveHero(data): Promise<void> {
// 	try {
// 		ServerActions.startLoading();
// 		const response = await fetch('php/save.php?short=' + data[0] + '&full=' + data[1], {
// 			method: 'post',
// 			body: JSON.stringify(data)
// 		});
// 		const result = await response.text();
// 		// ServerActions.saveHeroSuccess(result);
// 	} catch(e) {
// 		connectionError(e);
// 	}
// }

export function changeHeroAvatar(data: File) {
	const reader = new FileReader();
	reader.onload = async (event) => {
		try {
			const response = await fetch('php/uploadheropic.php?hid=' + ProfileStore.getID(), {
				method: 'post',
				body: event.target.result
			});
			const result = await response.text();
			ServerActions.receiveHeroAvatar(result);
		} catch(e) {
			connectionError(e);
		}
	};
	reader.readAsText(data);
}

export async function deleteHero(id: string): Promise<void> {
	try {
		const response = await fetch('php/deletehero.php?token=' + AuthStore.getToken() + '&hid=' + id);
		const result = await response.text();
		// ServerActions.deleteHeroSuccess(result);
	} catch(e) {
		connectionError(e);
	}
}
