import CultureStore from '../stores/CultureStore';
import ProfessionStore from '../stores/ProfessionStore';
import RaceStore from '../stores/RaceStore';
import { get, getPrimaryAttr, getAllByCategoryGroup } from '../stores/ListStore';

export const fn = (req: 'RCP' | [string, string | number | boolean, string | number | boolean | undefined], id?: string) => {
	if (req === 'RCP') {
		let currentRace = RaceStore.getCurrent() || {};
		let currentCulture = CultureStore.getCurrent() || {};
		let currentProfession = ProfessionStore.getCurrent() || {};
		let array = [];

		if (currentRace.hasOwnProperty('imp_adv')) {
			array.push(...currentRace.importantAdvantages.map(e => e[0] as string));
		}
		if (currentRace.hasOwnProperty('imp_dadv')) {
			array.push(...currentRace.importantDisadvantages.map(e => e[0] as string));
		}
		if (currentRace.hasOwnProperty('typ_adv')) {
			array.push(...currentRace.typicalAdvantages);
		}
		if (currentRace.hasOwnProperty('typ_dadv')) {
			array.push(...currentRace.typicalDisadvantages);
		}

		if (currentCulture.hasOwnProperty('typ_adv')) {
			array.push(...currentCulture.typ_adv);
		}
		if (currentCulture.hasOwnProperty('typ_dadv')) {
			array.push(...currentCulture.typ_dadv);
		}

		if (currentProfession.hasOwnProperty('typ_adv')) {
			array.push(...currentProfession.typ_adv);
		}
		if (currentProfession.hasOwnProperty('typ_dadv')) {
			array.push(...currentProfession.typ_dadv);
		}

		return array.some(e => e === id);
	} else if (req.length === 2) {
		if (req[0] === 'r')
			return req[1].map(e => `R_${e}`).indexOf(RaceStore.getCurrentID) > -1;
		let obj = get(req[0]);
		if (!obj.hasOwnProperty('active') && typeof req[1] === 'number') {
			if (obj.hasOwnProperty('fw')) {
				return obj.fw >= req[1];
			} else if (obj.hasOwnProperty('value')) {
				return obj.value >= req[1];
			}
		} else {
			return (obj.max !== null && obj.active.length > 0 === req[1]) || obj.active === req[1];
		}
	} else if (req.length === 3) {
		if (req[0] === 'ATTR_PRIMARY') {
			let obj = getPrimaryAttr(req[2]);
			return obj === undefined ? false : obj.value >= req[1];
		}
		let obj = get(req[0]);
		if (req[2] === 'sel') {
			return true;
		} else if (typeof req[2] !== 'number' && req[2].match('GR')) {
			let gr = parseInt(req[2].split('_')[2]);
			var arr = getAllByCategoryGroup('talents', gr).map(e => e.id);
			for (let n = 0; n < obj.active.length; n++) {
				if (arr.indexOf(obj.active[n]) > -1) return false;
			}
			return true;
		} else {
			let req2 = Number.isNaN(parseInt(req[2])) ? req[2] : parseInt(req[2]);
			if (obj.max === null) {
				return (req2 === obj.sid) === req[1];
			} else {
				return !obj.active.every(e => Array.isArray(e) ? e[1] !== req2 : e !== req2) === req[1];
			}
		}
	}
};

export default (reqs: Array<[string, string | number | boolean, string | number | boolean | undefined]>, id?: string): boolean => reqs.every(req => fn(req, id));
