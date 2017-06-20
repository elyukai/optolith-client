const { readFile, readFileSync, writeFile } = require('fs');
const { convertRequirements, splitList } = require('./buildUtils');
const csvToArray = require('./csvToArray');

function iterateBooks(array) {
	const list = {};
	for (const obj of array) {
		delete obj.name;
		list[obj.id] = obj;
	}
	return list;
}

function iterateExperienceLevels(array) {
	const list = {};
	for (const obj of array) {
		obj.id = `EL_${obj.id}`;
		delete obj.name;
		list[obj.id] = obj;
	}
	return list;
}

function iterateRaces(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'R_' + obj.id;

		delete obj.name;

		obj.attr = !obj.attr ? [] : obj.attr.split('&').map(e => e.split('?').map(k => Number.parseInt(k)));

		obj.attr_sel = obj.attr_sel.split('?');
		obj.attr_sel[0] = Number.parseInt(obj.attr_sel[0]);
		obj.attr_sel[1] = obj.attr_sel[1].split('&').map(e => Number.parseInt(e));

		obj.typ_cultures = obj.typ_cultures.split('&');

		obj.auto_adv = obj.auto_adv ? obj.auto_adv.split('&') : [];
		obj.autoAdvCost = obj.autoAdvCost.split('&').map(e => Number.parseInt(e));
		obj.imp_adv = obj.imp_adv ? obj.imp_adv.split('&') : [];
		obj.imp_dadv = obj.imp_dadv ? obj.imp_dadv.split('&') : [];
		obj.typ_adv = !obj.typ_adv ? [] : obj.typ_adv.split('&');
		obj.typ_dadv = !obj.typ_dadv ? [] : obj.typ_dadv.split('&');
		obj.untyp_adv = !obj.untyp_adv ? [] : obj.untyp_adv.split('&');
		obj.untyp_dadv = !obj.untyp_dadv ? [] : obj.untyp_dadv.split('&');

		obj.hair = obj.hair.split('&').map(e => Number.parseInt(e));

		obj.eyes = obj.eyes.split('&').map(e => Number.parseInt(e));

		obj.size = obj.size.split('&').map((e,i) => i === 0 ? Number.parseInt(e): e.split('W').map(k => Number.parseInt(k)));
		obj.weight = obj.weight.split('&').map((e,i) => i === 0 ? Number.parseInt(e): e.split('W').map(k => Number.parseInt(k)));

		list[obj.id] = obj;
	}
	return list;
}

function iterateCultures(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'C_' + obj.id;

		delete obj.name;

		obj.lang = obj.lang.split('&').map(e => Number.parseInt(e));
		obj.literacy = !obj.literacy ? [] : obj.literacy.split('&').map(e => Number.parseInt(e));
		obj.social = obj.social.split('&').map(e => Number.parseInt(e));

		obj.typ_prof = obj.typ_prof.split('&').map(e => {
			if (e === 'true') {
				return true;
			}
			else if (e === 'false') {
				return false;
			}
			const [ reverse, ...list ] = e.split(',');
			return {
				reverse: reverse === 'true',
				list: list.map(n => /^\d+$/.test(n) ? Number.parseInt(n) : n)
			};
		});
		obj.typ_adv = obj.typ_adv.split('&');
		obj.typ_dadv = obj.typ_dadv.split('&');
		obj.untyp_adv = !obj.untyp_adv ? [] : obj.untyp_adv.split('&');
		obj.untyp_dadv = !obj.untyp_dadv ? [] : obj.untyp_dadv.split('&');

		obj.typ_talents = obj.typ_talents.split('&');
		obj.untyp_talents = obj.untyp_talents.split('&');

		obj.talents = obj.talents.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		list[obj.id] = obj;
	}
	return list;
}

function iterateProfessions(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'P_' + obj.id;

		delete obj.name;
		delete obj.name_f;
		delete obj.subname;
		delete obj.subname_f;

		obj.pre_req = obj.pre_req ? obj.pre_req.split('&').map(e => JSON.parse(e)) : [];
		obj.req = obj.req ? obj.req.split('&').map(e => JSON.parse(e)) : [];
		obj.sel = obj.sel ? obj.sel.split('&').map(e => {
			const obj = JSON.parse(e);
			if (obj.id === 'COMBAT_TECHNIQUES') {
				obj.sid = obj.sid.map(e => `CT_${e}`);
			}
			else if (obj.id === 'CANTRIPS') {
				obj.sid = obj.sid.map(e => `CANTRIP_${e}`);
			}
			return obj;
		}) : [];
		obj.sa = obj.sa ? obj.sa.split('&').map(e => JSON.parse(e)) : [];

		obj.combattech = obj.combattech ? obj.combattech.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		}) : [];

		obj.talents = obj.talents.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.spells = !obj.spells ? [] : obj.spells.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.chants = !obj.chants ? [] : obj.chants.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.blessings = !obj.blessings ? [] : obj.blessings.split('&');

		obj.typ_adv = !obj.typ_adv ? [] : obj.typ_adv.split('&');
		obj.typ_dadv = !obj.typ_dadv ? [] : obj.typ_dadv.split('&');
		obj.untyp_adv = !obj.untyp_adv ? [] : obj.untyp_adv.split('&');
		obj.untyp_dadv = !obj.untyp_dadv ? [] : obj.untyp_dadv.split('&');

		obj.vars = !obj.vars ? [] : obj.vars.split('&');

		list[obj.id] = obj;
	}
	return list;
}

function iterateProfessionVariants(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'PV_' + obj.id;

		delete obj.name;
		delete obj.name_f;

		obj.pre_req = obj.pre_req ? obj.pre_req.split('&').map(e => JSON.parse(e)) : [];
		obj.req = obj.req ? obj.req.split('&').map(e => JSON.parse(e)) : [];
		obj.sel = obj.sel ? obj.sel.split('&').map(e => {
			const obj = JSON.parse(e);
			if (obj.id === 'COMBAT_TECHNIQUES' && obj.sid) {
				obj.sid = obj.sid.map(e => `CT_${e}`);
			}
			return obj;
		}) : [];
		obj.sa = obj.sa ? obj.sa.split('&').map(e => JSON.parse(e)) : [];

		obj.combattech = !obj.combattech ? [] : obj.combattech.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.talents = !obj.talents ? [] : obj.talents.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.spells = !obj.spells ? [] : obj.spells.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		obj.chants = !obj.chants ? [] : obj.chants.split('&').map(e => {
			e = e.split('?');
			e[1] = Number.parseInt(e[1]);
			return e;
		});

		list[obj.id] = obj;
	}
	return list;
}

function iterateActivatables(array, type) {
	const list = {};
	for (const obj of array) {
		const prefix = {
			adv: 'ADV_',
			disadv: 'DISADV_',
			special: 'SA_'
		};
		const newObj = {
			id: prefix[type] + obj.id
		};
		if (obj.ap && obj.ap.match('&')) {
			newObj.ap = obj.ap.split('&').map(a => Number.parseInt(a));
		} else if (obj.ap && obj.ap !== 'sel') {
			newObj.ap = Number.parseInt(obj.ap);
		} else if (obj.ap === 'sel') {
			newObj.ap = 'sel';
		}
		if (typeof obj.tiers === 'number') {
			newObj.tiers = obj.tiers;
		}
		if (typeof obj.max === 'number') {
			newObj.max = obj.max;
		}
		if (obj.gr) {
			newObj.gr = obj.gr;
		}
		if (obj.sel) {
			newObj.sel = splitList(obj.sel).map((e, i) => {
				const ee = e.split('?');
				const id = /^\d+$/.test(ee[0]) ? Number.parseInt(ee[0]) : ee[0];
				return ee[2] ? { id, name: ee[1], cost: Number.parseInt(ee[2]) } : ee[1] ? { id, name: ee[1] } : { id };
			});
		}
		else if (['SA_3', 'SA_28', 'SA_29', 'SA_30', 'SA_368', 'SA_484'].includes(newObj.id)) {
			newObj.sel = true;
		}
		newObj.req = convertRequirements(obj.req);
		list[newObj.id] = newObj;
	}
	return list;
}

function iterateAttributes(array) {
	const list = {};
	for (const obj of array) {
		obj.id = `ATTR_${obj.id}`;
		list[obj.id] = obj;
	}
	return list;
}

function iterateSkills(array) {
	const list = {};
	for (const obj of array) {
		const { id, check, skt, be, gr, spec, spec_input} = obj;
		const newObject = {
			id: `TAL_${id}`,
			check: obj.check.split('&').map(e => `ATTR_${e}`),
			skt,
			be,
			gr
		};
		list[newObject.id] = newObject;
	}
	return list;
}

function iterateCombatTechniques(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'CT_' + obj.id;
		delete obj.name;
		obj.leit = obj.leit.split('&').map(e => `ATTR_${e}`);
		list[obj.id] = obj;
	}
	return list;
}

function iterateSpells(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'SPELL_' + obj.id;
		delete obj.name;
		obj.check = obj.check.split('&').map((e,i) => `ATTR_${e}`);
		obj.trad = obj.trad.split('&').map(e => Number.parseInt(e));
		obj.subtrad = obj.subtrad ? obj.subtrad.split('&').map(e => Number.parseInt(e)) : [];
		obj.req = convertRequirements(obj.req);
		list[obj.id] = obj;
	}
	return list;
}

function iterateCantrips(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'CANTRIP_' + obj.id;
		delete obj.name;
		obj.trad = obj.trad.toString().split('&').map(e => Number.parseInt(e));
		obj.req = convertRequirements(obj.req);
		list[obj.id] = obj;
	}
	return list;
}

function iterateChants(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'LITURGY_' + obj.id;
		delete obj.name;
		obj.check = obj.check.split('&').map((e,i) => `ATTR_${e}`);
		obj.trad = obj.trad.split('&').map(e => Number.parseInt(e));
		obj.aspc = obj.aspc ? obj.aspc.split('&').map(e => Number.parseInt(e)) : [];
		obj.req = obj.req ? obj.req.split('&').map(e => e === 'RCP' ? 'RCP' : JSON.parse(e)) : [];
		list[obj.id] = obj;
	}
	return list;
}

function iterateBlessings(array) {
	const list = {};
	for (const obj of array) {
		obj.id = 'BLESSING_' + obj.id;
		delete obj.name;
		obj.trad = obj.trad.toString().split('&').map(e => Number.parseInt(e));
		obj.aspc = obj.aspc.toString().split('&').map(e => Number.parseInt(e));
		list[obj.id] = obj;
	}
	return list;
}

function iterateSpecialAbilitiesTradeSecrets(array) {
	const list = [];
	for (const obj of array) {
		let { id, req, cost, sec } = obj;
		req = !req ? [] : req.split('&').map(e => JSON.parse(e));
		sec = !!sec
		list.push({ id, cost, req, sec });
	}
	return list;
}

function iterateSpecialAbilitiesScripts(array) {
	const list = [];
	for (const obj of array) {
		let { id, languages, cost, cont, ext } = obj;
		languages = languages ? languages.split('&').map(r => Number.parseInt(r)) : [];
		ext = !!ext;
		list.push({ id, cost, languages, cont, ext });
	}
	return list;
}

function iterateSpecialAbilitiesLanguages(array) {
	const list = [];
	for (const obj of array) {
		const { id, ext, cont } = obj;
		list.push({ id, ext: !!ext, cont });
	}
	return list;
}

function iterateSpecialAbilitiesSpellExtensions(array) {
	const list = [];
	for (const obj of array) {
		delete obj.name;
		obj.target = `SPELL_${obj.target}`;
		obj.req = !obj.req ? [] : obj.req.split('&').map(e => JSON.parse(e));
		list.push(obj);
	}
	return list;
}

function iterateEquipment(array) {
	const list = {};
	for (const obj of array) {
		const { id, price, weight, gr, ct, ddn, dds, df, db, at, pa, re, length, stp, range, rt, am, pro, enc, addp, pryw, two, imp, armty } = obj;

		let result = {
			id: 'ITEMTPL_' + id,
			template: 'ITEMTPL_' + id,
			gr,
			price,
			weight,
			where: ''
		};

		if (typeof imp === 'number') {
			result.imp = imp;
		}
		if (typeof stp === 'number') {
			result.stp = stp;
		}

		if (gr === 1 || imp === 1 || gr === 2 || imp === 2) {
			result.combatTechnique = 'CT_' + ct;
			if (typeof df === 'number' && typeof ddn === 'number' && typeof dds === 'number') {
				result.damageDiceNumber = ddn;
				result.damageDiceSides = dds;
				result.damageFlat = df;
			}
		}
		if (gr === 1 || imp === 1) {
			result = Object.assign(result, {
				at: typeof at === 'number' ? at : 0,
				pa: typeof pa === 'number' ? pa : 0,
				reach: typeof re === 'number' ? re : 0,
				length: typeof length === 'number' ? length : 0,
				isParryingWeapon: !!pryw,
				isTwoHanded: !!two
			});
			if (typeof db === 'number') {
				result.damageBonus = db;
			}
		}
		else if (gr === 2 || imp === 2) {
			result = Object.assign(result, {
				range: range.split('&').map(e => Number.parseInt(e)),
				reloadTime: rt || '',
				ammunition: am ? 'ITEMTPL_' + am : undefined,
				length: length || ''
			});
		}
		else if (gr === 4) {
			result = Object.assign(result, {
				pro: pro || 0,
				enc: enc || 0,
				addPenalties: !!addp,
				armorType: armty
			});
		}

		list[result.id] = result;
	}
	return list;
}

const books = iterateBooks(csvToArray(readFileSync('src/data/TDE5_Books.csv', 'utf8')));
const el = iterateExperienceLevels(csvToArray(readFileSync('src/data/TDE5_ExperienceLevels.csv', 'utf8')));
const races = iterateRaces(csvToArray(readFileSync('src/data/TDE5_Races.csv', 'utf8')));
const cultures = iterateCultures(csvToArray(readFileSync('src/data/TDE5_Cultures.csv', 'utf8')));
const professions = iterateProfessions(csvToArray(readFileSync('src/data/TDE5_Professions.csv', 'utf8')));
const professionvariants = iterateProfessionVariants(csvToArray(readFileSync('src/data/TDE5_ProfessionVariants.csv', 'utf8')));
const advantages = iterateActivatables(csvToArray(readFileSync('src/data/TDE5_Advantages.csv', 'utf8')), 'adv');
const disadvantages = iterateActivatables(csvToArray(readFileSync('src/data/TDE5_Disadvantages.csv', 'utf8')), 'disadv');
const principles = JSON.parse(readFileSync('src/data/TDE5_Disadvantages_34.json', 'utf8'));
const obligations = JSON.parse(readFileSync('src/data/TDE5_Disadvantages_50.json', 'utf8'));
const specialabilities = iterateActivatables(csvToArray(readFileSync('src/data/TDE5_SpecialAbilities.csv', 'utf8')), 'special');
const tradeSecrets = iterateSpecialAbilitiesTradeSecrets(csvToArray(readFileSync('src/data/TDE5_SpecialAbilities_TradeSecrets.csv', 'utf8')));
const scripts = iterateSpecialAbilitiesScripts(csvToArray(readFileSync('src/data/TDE5_SpecialAbilities_Scripts.csv', 'utf8')));
const writing = JSON.parse(readFileSync('src/data/TDE5_SpecialAbilities_29.json', 'utf8'));
const languages = iterateSpecialAbilitiesLanguages(csvToArray(readFileSync('src/data/TDE5_SpecialAbilities_Languages.csv', 'utf8')));
const animalTransformation = JSON.parse(readFileSync('src/data/TDE5_SpecialAbilities_368.json', 'utf8'));
const spellExtensions = iterateSpecialAbilitiesSpellExtensions(csvToArray(readFileSync('src/data/TDE5_SpecialAbilities_SpellX.csv', 'utf8')));
const attributes = iterateAttributes(csvToArray(readFileSync('src/data/TDE5_Attributes.csv', 'utf8')));
const talents = iterateSkills(csvToArray(readFileSync('src/data/TDE5_Skills.csv', 'utf8')));
const combattech = iterateCombatTechniques(csvToArray(readFileSync('src/data/TDE5_CombatTechniques.csv', 'utf8')));
const spells = iterateSpells(csvToArray(readFileSync('src/data/TDE5_Spells.csv', 'utf8')));
const cantrips = iterateCantrips(csvToArray(readFileSync('src/data/TDE5_Cantrips.csv', 'utf8')));
const liturgies = iterateChants(csvToArray(readFileSync('src/data/TDE5_Chants.csv', 'utf8')));
const blessings = iterateBlessings(csvToArray(readFileSync('src/data/TDE5_Blessings.csv', 'utf8')));
const items = iterateEquipment(csvToArray(readFileSync('src/data/TDE5_Items.csv', 'utf8')));

disadvantages.DISADV_34.sel = principles;
disadvantages.DISADV_50.sel = obligations;
specialabilities.SA_3.sel = tradeSecrets;
specialabilities.SA_28.sel = scripts;
specialabilities.SA_29.sel = writing;
specialabilities.SA_30.sel = languages;
specialabilities.SA_368.sel = animalTransformation;
specialabilities.SA_484.sel = spellExtensions;

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
	items
};

writeFile('app/data.json', JSON.stringify(result), (err) => {
	if (err) throw err;
	console.log('Data JSON created.');
});
