import { FetchDataTablesAction } from '../actions/ServerActions';
import { LoginAction, LogoutAction } from '../actions/AuthActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = FetchDataTablesAction | LoginAction | LogoutAction;

interface AdventurePoints {
	readonly total: number;
	readonly spent: number;
	readonly adv: [number, number, number];
	readonly disadv: [number, number, number];
}

export interface RawHero {
	readonly clientVersion: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	readonly player?: User;
	readonly id: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar: string;
	readonly ap: AdventurePoints;
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	readonly pv: string | null;
	readonly sex: string;
}

export interface Hero {
	readonly clientVersion: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	readonly player?: string;
	readonly id: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar: string;
	readonly ap: AdventurePoints;
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	readonly pv: string | null;
	readonly sex: string;
}

interface User {
	readonly id: string;
	readonly displayName: string;
}

export interface HerolistState {
	readonly heroesById: {
		[id: string]: Hero
	};
	readonly heroes: string[];
	readonly usersById: {
		[id: string]: User
	};
	readonly users: string[];
}

const initialState = <HerolistState>{
	heroesById: {},
	heroes: [],
	usersById: {},
	users: []
};

export default (state = initialState, action: Action): HerolistState => {
	switch (action.type) {
		// Only for test purpose:
		case ActionTypes.FETCH_DATA_TABLES:
			return {
				heroesById: {
					H_1: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						player: 'U_1',
						id: 'H_1',
						phase: 2,
						name: 'Shimo ibn Rashdul',
						avatar: 'images/portrait.png',
						ap: {
							total: 1784,
							spent: 1775,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_5',
						c: 'C_7',
						p: 'P_24',
						pv: null,
						sex: 'm'
					},
					H_2: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_2',
						phase: 2,
						name: 'Yendan Keres, Arran Ssitt\'Zzss',
						avatar: 'images/portrait2.png',
						ap: {
							total: 1705,
							spent: 1704,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_1',
						c: 'C_8',
						p: 'P_23',
						pv: null,
						sex: 'm'
					},
					H_3: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_3',
						phase: 3,
						name: 'Aki Raskirson',
						avatar: '',
						ap: {
							total: 1100,
							spent: 1100,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_4',
						c: 'C_17',
						p: 'P_23',
						pv: null,
						sex: 'm'
					},
					H_4: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_4',
						phase: 3,
						name: 'Coran Sero',
						avatar: 'images/portrait4.png',
						ap: {
							total: 1102,
							spent: 1102,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_1',
						c: 'C_15',
						p: 'P_22',
						pv: null,
						sex: 'm'
					},
					H_5: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_5',
						phase: 2,
						name: 'Aon Sgarr',
						avatar: 'images/portrait5.jpg',
						ap: {
							total: 1400,
							spent: 1391,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_1',
						c: 'C_8',
						p: 'P_26',
						pv: null,
						sex: 'm'
					},
					H_6: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_6',
						phase: 3,
						name: 'Zakhabar iban Bashur ban Mhadjâduri / Karmold',
						avatar: 'images/portrait6.png',
						ap: {
							total: 1567,
							spent: 1559,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_5',
						c: 'C_14',
						p: 'P_4',
						pv: 'PV_13',
						sex: 'm'
					},
					H_7: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_7',
						phase: 3,
						name: 'Jindrik aus Wallingheim',
						avatar: 'images/portrait7.jpg',
						ap: {
							total: 900,
							spent: 900,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_1',
						r: 'R_1',
						c: 'C_1',
						p: 'P_16',
						pv: null,
						sex: 'm'
					},
					H_8: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						id: 'H_8',
						phase: 2,
						name: 'Takate',
						avatar: 'images/portrait8.jpg',
						ap: {
							total: 1100,
							spent: 1100,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_6',
						c: 'C_9',
						p: 'P_4',
						pv: null,
						sex: 'm'
					},
					H_9: {
						clientVersion: '1.0.0',
						dateCreated: new Date('2016-10-18T16:18:28.420Z'),
						dateModified: new Date('2016-10-18T16:18:28.420Z'),
						player: 'U_5',
						id: 'H_9',
						phase: 2,
						name: 'Adario Orelio von Paligan',
						avatar: 'images/portrait9.jpg',
						ap: {
							total: 1777,
							spent: 1677,
							adv: [63, 0, 0],
							disadv: [39, 0, 0]
						},
						el: 'EL_3',
						r: 'R_1',
						c: 'C_15',
						p: 'P_24',
						pv: null,
						sex: 'm'
					}
				},
				heroes: ['H_1', 'H_2', 'H_3', 'H_4', 'H_5', 'H_6', 'H_7', 'H_8', 'H_9'],
				usersById: {
					U_1: {
						id: 'U_1',
						displayName: 'schuchi'
					},
					U_2: {
						id: 'U_3',
						displayName: 'Maradas'
					}
				},
				users: ['U_1', 'U_3']
			};

		case ActionTypes.LOGIN: {
			const usersById: { [id: string]: User } = {};
			const users: string[] = [];
			const heroesById: { [id: string]: Hero } = {};
			const heroes: string[] = [];
			for (const id in action.payload.heroes) {
				const hero = action.payload.heroes[id];
				const user = hero.player;
				if (user && !users.includes(user.id)) {
					usersById[user.id] = user;
					users.push(user.id);
				}
				heroesById[id] = { ...(hero as Hero), player: user && user.id};
				heroes.push(id);
			}
			return { heroes, heroesById, users, usersById };
		}

		case ActionTypes.LOGOUT:
			return {
				heroesById: {},
				heroes: [],
				usersById: {},
				users: []
			};

		default:
			return state;
	}
};
