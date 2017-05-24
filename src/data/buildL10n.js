const { readFileSync, writeFile } = require('fs');
const { splitList } = require('./buildUtils');
const csvToArray = require('./csvToArray');

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
		list[obj.id] = obj;
	}
	return list;
}

function iterateCulturesL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `C_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateProfessionsL10n(array) {
	const list = {};
	for (let obj of array) {
		obj.id = `P_${obj.id}`;

		const isNameEqual = obj.name === obj.name_f && obj.subname === obj.subname_f || !obj.name_f && !obj.subname_f || !obj.name && !obj.subname;

		obj.name = isNameEqual ? obj.name : { m: obj.name, f: obj.name_f };
		delete obj.name_f;
		obj.subname = isNameEqual ? obj.subname : { m: obj.subname, f: obj.subname_f };
		delete obj.subname_f;

		obj.req = obj.req ? obj.req.split('&').map(e => JSON.parse(e)) : [];

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

		let result = {
			id: 'ITEMTPL_' + id,
			name
		};

		list[result.id] = result;
	}
	return list;
}

module.exports = function buildL10n(locale) {
	const books = iterateBooksL10n(csvToArray(readFileSync(`src/data/TDE5_Books_${locale}.csv`, 'utf8')));
	const el = iterateExperienceLevelsL10n(csvToArray(readFileSync(`src/data/TDE5_ExperienceLevels_${locale}.csv`, 'utf8')));
	const races = iterateRacesL10n(csvToArray(readFileSync(`src/data/TDE5_Races_${locale}.csv`, 'utf8')));
	const cultures = iterateCulturesL10n(csvToArray(readFileSync(`src/data/TDE5_Cultures_${locale}.csv`, 'utf8')));
	const professions = iterateProfessionsL10n(csvToArray(readFileSync(`src/data/TDE5_Professions_${locale}.csv`, 'utf8')));
	const professionvariants = iterateProfessionVariantsL10n(csvToArray(readFileSync(`src/data/TDE5_ProfessionVariants_${locale}.csv`, 'utf8')));
	const advantages = iterateActivatablesL10n(csvToArray(readFileSync(`src/data/TDE5_Advantages_${locale}.csv`, 'utf8')), 'adv');
	const disadvantages = iterateActivatablesL10n(csvToArray(readFileSync(`src/data/TDE5_Disadvantages_${locale}.csv`, 'utf8')), 'disadv');
	const specialabilities = iterateActivatablesL10n(csvToArray(readFileSync(`src/data/TDE5_SpecialAbilities_${locale}.csv`, 'utf8')), 'special');
	const tradeSecrets = iterateSpecialAbilitiesTradeSecretsL10n(csvToArray(readFileSync(`src/data/TDE5_SpecialAbilities_TradeSecrets_${locale}.csv`, 'utf8')));
	const scripts = iterateSpecialAbilitiesScriptsL10n(csvToArray(readFileSync(`src/data/TDE5_SpecialAbilities_Scripts_${locale}.csv`, 'utf8')));
	const languages = iterateSpecialAbilitiesLanguagesL10n(csvToArray(readFileSync(`src/data/TDE5_SpecialAbilities_Languages_${locale}.csv`, 'utf8')));
	if (locale === 'de-DE') {
		const spellExtensions = iterateSpecialAbilitiesSpellExtensionsL10n(csvToArray(readFileSync(`src/data/TDE5_SpecialAbilities_SpellX_${locale}.csv`, 'utf8')));
		specialabilities.SA_484.sel = spellExtensions;
	}
	const attributes = iterateAttributesL10n(csvToArray(readFileSync(`src/data/TDE5_Attributes_${locale}.csv`, 'utf8')));
	const talents = iterateSkillsL10n(csvToArray(readFileSync(`src/data/TDE5_Skills_${locale}.csv`, 'utf8')));
	const combattech = iterateCombatTechniquesL10n(csvToArray(readFileSync(`src/data/TDE5_CombatTechniques_${locale}.csv`, 'utf8')));
	const spells = iterateSpellsL10n(csvToArray(readFileSync(`src/data/TDE5_Spells_${locale}.csv`, 'utf8')));
	const cantrips = iterateCantripsL10n(csvToArray(readFileSync(`src/data/TDE5_Cantrips_${locale}.csv`, 'utf8')));
	const liturgies = iterateChantsL10n(csvToArray(readFileSync(`src/data/TDE5_Chants_${locale}.csv`, 'utf8')));
	const blessings = iterateBlessingsL10n(csvToArray(readFileSync(`src/data/TDE5_Blessings_${locale}.csv`, 'utf8')));
	const items = iterateEquipmentL10n(csvToArray(readFileSync(`src/data/TDE5_Items_${locale}.csv`, 'utf8')));
	const ui = JSON.parse(readFileSync(`src/locales/ui.${locale}.json`, 'utf8'));

	specialabilities.SA_3.sel = tradeSecrets;
	specialabilities.SA_28.sel = scripts;
	specialabilities.SA_30.sel = languages;

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

	writeFile(`resources/locales/${locale}.json`, JSON.stringify(result), (err) => {
		if (err) throw err;
		console.log(`L10n JSON for ${locale} created.`);
	});
}
