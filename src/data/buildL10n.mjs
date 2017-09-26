import fs from 'fs';
import xlsx from 'xlsx';
import { splitList } from './buildUtils.mjs';
import { csvToArray } from './csvToArray.mjs';

function iterateBooksL10n(array) {
	const list = {};
	for (const obj of array) {
		list[obj.id] = obj;
	}
	return list;
}

function iterateExperienceLevelsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `EL_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateRacesL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `R_${obj.id}`;
		obj.attributeAdjustments = (obj.attributeAdjustments || '').replace(/^"(.+)"$/, '$1');
		obj.src = obj.src ? (typeof obj.src === 'number' ? [obj.src] : obj.src.split('&').map(e => Number.parseInt(e))) : [];
		list[obj.id] = obj;
	}
	return list;
}

function iterateCulturesL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `C_${obj.id}`;
		obj.src = obj.src ? (typeof obj.src === 'number' ? [obj.src] : obj.src.split('&').map(e => Number.parseInt(e))) : [];
		list[obj.id] = obj;
	}
	return list;
}

function iterateProfessionsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `P_${obj.id}`;

		const isNameEqual = obj.name === obj.name_f;
		const isSubNameEqual = obj.subname === obj.subname_f;

		obj.name = isNameEqual || !obj.name_f || !obj.name ? obj.name : { m: obj.name, f: obj.name_f };
		delete obj.name_f;
		obj.subname = isSubNameEqual || !obj.subname_f || !obj.subname ? obj.subname : { m: obj.subname, f: obj.subname_f };
		if (obj.subname === '') {
			delete obj.subname;
		}
		delete obj.subname_f;

		obj.req = obj.req ? obj.req.split('&').map(e => JSON.parse(e)) : [];

		obj.src = obj.src ? (typeof obj.src === 'number' ? [obj.src] : obj.src.split('&').map(e => Number.parseInt(e))) : [];

		list[obj.id] = obj;
	}
	return list;
}

function iterateProfessionVariantsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `PV_${obj.id}`;

		const isNameEqual = obj.name === obj.name_f && obj.subname === obj.subname_f || !obj.name_f && !obj.subname_f || !obj.name && !obj.subname;
		obj.name = isNameEqual ? obj.name : { m: obj.name, f: obj.name_f };
		delete obj.name_f;

		list[obj.id] = obj;
	}
	return list;
}

function iterateActivatablesL10n(array, type) {
	const list = {};
	for (const obj of array) {
		const { name } = obj;
		const prefix = {
			adv: 'ADV_',
			disadv: 'DISADV_',
			special: 'SA_'
		};
		const newObj = {
			id: prefix[type] + obj.id,
			name
		};
		if (obj.input) {
			newObj.input = obj.input;
		}
		if (obj.sel) {
			newObj.sel = splitList(obj.sel).map((e, i) => {
				const ee = e.split('?');
				const id = /^\d+$/.test(ee[0]) ? Number.parseInt(ee[0]) : ee[0];
				return { id, name: ee[1] };
			});
		}
		list[newObj.id] = newObj;
	}
	return list;
}

function iterateAttributesL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `ATTR_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateSkillsL10n(array) {
	const list = {};
	for (let obj of array) {
		const { id, name, spec, spec_input, tools, quality, failed, critical, botch, src } = obj;
		const newObject = {
			id: `TAL_${id}`,
			name, tools, quality, failed, critical, botch, src
		};
		if (spec) {
			newObject.spec = splitList(spec).map(e => {
				const src = e.split('?');
				return {
					id: Number.parseInt(src[0]),
					name: src[1]
				};
			});
		}
		if (spec_input) {
			newObject.spec_input = spec_input;
		}
		list[newObject.id] = newObject;
	}
	return list;
}

function iterateCombatTechniquesL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `CT_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateSpellsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `SPELL_${obj.id}`;
		obj.src = obj.src ? (typeof obj.src === 'number' ? [obj.src] : obj.src.split('&').map(e => Number.parseInt(e))) : [];
		list[obj.id] = obj;
	}
	return list;
}

function iterateCantripsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `CANTRIP_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateChantsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `LITURGY_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateBlessingsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `BLESSING_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateSpecialAbilitiesTradeSecretsL10n(array) {
	const list = [];
	for (const obj of array) {
		let { id, name } = obj;
		list.push({ id, name });
	}
	return list;
}

function iterateSpecialAbilitiesScriptsL10n(array) {
	const list = [];
	for (const obj of array) {
		let { id, name } = obj;
		list.push({ id, name });
	}
	return list;
}

function iterateSpecialAbilitiesLanguagesL10n(array) {
	const list = [];
	for (const obj of array) {
		const { id, name, spec, specInput } = obj;
		const newObj = {
			id,
			name,
			spec: !spec ? [] : spec.split('&')
		};
		if (specInput) {
			newObj.specInput = specInput;
		}
		list.push(newObj);
	}
	return list;
}

function iterateSpecialAbilitiesSpellExtensionsL10n(array) {
	const list = [];
	for (const obj of array) {
		list.push(obj);
	}
	return list;
}

function iterateEquipmentL10n(array) {
	const list = {};
	for (let obj of array) {
		const { id, name } = obj;

		const result = {
			id: 'ITEMTPL_' + id,
			name
		};

		list[result.id] = result;
	}
	return list;
}

export function buildL10n(locale) {
	const file = xlsx.readFile(`src/data/TDE5_${locale}.xlsx`);
	const allWorksheets = file.SheetNames.reduce((m, name) => {
		return m.set(name, xlsx.utils.sheet_to_csv(file.Sheets[name], { FS: ';;', blankrows: false }));
	}, new Map());

	const books = iterateBooksL10n(csvToArray(allWorksheets.get('BOOKS')));
	const el = iterateExperienceLevelsL10n(csvToArray(allWorksheets.get('EXPERIENCE_LEVELS')));
	const races = iterateRacesL10n(csvToArray(allWorksheets.get('RACES')));
	const cultures = iterateCulturesL10n(csvToArray(allWorksheets.get('CULTURES')));
	const professions = iterateProfessionsL10n(csvToArray(allWorksheets.get('PROFESSIONS')));
	const professionvariants = iterateProfessionVariantsL10n(csvToArray(allWorksheets.get('PROFESSION_VARIANTS')));
	const advantages = iterateActivatablesL10n(csvToArray(allWorksheets.get('ADVANTAGES')), 'adv');
	const disadvantages = iterateActivatablesL10n(csvToArray(allWorksheets.get('DISADVANTAGES')), 'disadv');
	const specialabilities = iterateActivatablesL10n(csvToArray(allWorksheets.get('SPECIAL_ABILITIES')), 'special');
	const tradeSecrets = iterateSpecialAbilitiesTradeSecretsL10n(csvToArray(allWorksheets.get('TradeSecr')));
	const scripts = iterateSpecialAbilitiesScriptsL10n(csvToArray(allWorksheets.get('Scripts')));
	const languages = iterateSpecialAbilitiesLanguagesL10n(csvToArray(allWorksheets.get('Languages')));
	if (locale === 'de-DE') {
		const spellExtensions = iterateSpecialAbilitiesSpellExtensionsL10n(csvToArray(allWorksheets.get('SpellX')));
		const chantExtensions = iterateSpecialAbilitiesSpellExtensionsL10n(csvToArray(allWorksheets.get('ChantX')));
		specialabilities.SA_414.sel = spellExtensions;
		specialabilities.SA_663.sel = chantExtensions;
	}
	const attributes = iterateAttributesL10n(csvToArray(allWorksheets.get('ATTRIBUTES')));
	const talents = iterateSkillsL10n(csvToArray(allWorksheets.get('SKILLS')));
	const combattech = iterateCombatTechniquesL10n(csvToArray(allWorksheets.get('COMBAT_TECHNIQUES')));
	const spells = iterateSpellsL10n(csvToArray(allWorksheets.get('SPELLS')));
	const cantrips = iterateCantripsL10n(csvToArray(allWorksheets.get('CANTRIPS')));
	const liturgies = iterateChantsL10n(csvToArray(allWorksheets.get('CHANTS')));
	const blessings = iterateBlessingsL10n(csvToArray(allWorksheets.get('BLESSINGS')));
	const items = iterateEquipmentL10n(csvToArray(allWorksheets.get('EQUIPMENT')));
	const ui = JSON.parse(fs.readFileSync(`src/locales/ui.${locale}.json`, 'utf8'));

	specialabilities.SA_3.sel = tradeSecrets;
	specialabilities.SA_27.sel = scripts;
	specialabilities.SA_29.sel = languages;

	const result = {
		books,
		el,
		races,
		cultures,
		professions,
		professionvariants,
		advantages,
		disadvantages,
		specialabilities,
		attributes,
		talents,
		combattech,
		spells,
		cantrips,
		liturgies,
		blessings,
		items,
		ui
	};

	fs.writeFile(`app/locales/${locale}.json`, JSON.stringify(result), err => {
		if (err) {
			throw err;
		}
		console.log(`L10n JSON for ${locale} created.`);
	});
}
