import * as ConvertUtils from './ConvertUtils.js';

function convert(type) {
	const raw = document.querySelector('input').value;
	let data = JSON.parse(raw);

	switch (type) {
		case 'l10n_el': {
			const list = {};
			for (let obj of data) {
				obj.id = `EL_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'attributes':
		case 'l10n_attributes': {
			const list = {};
			for (let obj of data) {
				obj.id = `ATTR_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'races': {
			const races = {};
			for (let obj of data) {
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

				races[obj.id] = obj;
			}
			data = races;
			break;
		}
		case 'l10n_races': {
			const list = {};
			for (let obj of data) {
				obj.id = `R_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'cultures': {
			const cultures = {};
			for (let obj of data) {
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

				cultures[obj.id] = obj;
			}
			data = cultures;
			break;
		}
		case 'l10n_cultures': {
			const list = {};
			for (let obj of data) {
				obj.id = `C_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'professions': {
			const professions = {};
			for (let obj of data) {
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

				obj.combattech = obj.combattech.split('&').map(e => {
					e = e.split('?');
					e[1] = Number.parseInt(e[1]);
					return e;
				});

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

				professions[obj.id] = obj;
			}
			data = professions;
			break;
		}
		case 'l10n_professions': {
			const list = {};
			for (let obj of data) {
				obj.id = `P_${obj.id}`;

				const isNameEqual = obj.name === obj.name_f && obj.subname === obj.subname_f || !obj.name_f && !obj.subname_f || !obj.name && !obj.subname;

				obj.name = isNameEqual ? obj.name : { m: obj.name, f: obj.name_f };
				delete obj.name_f;
				obj.subname = isNameEqual ? obj.subname : { m: obj.subname, f: obj.subname_f };
				delete obj.subname_f;

				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'profvariants': {
			const variants = {};
			for (let obj of data) {
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

				variants[obj.id] = obj;
			}
			data = variants;
			break;
		}
		case 'l10n_profvariants': {
			const list = {};
			for (let obj of data) {
				obj.id = `PV_${obj.id}`;

				const isNameEqual = obj.name === obj.name_f && obj.subname === obj.subname_f || !obj.name_f && !obj.subname_f || !obj.name && !obj.subname;
				obj.name = isNameEqual ? obj.name : { m: obj.name, f: obj.name_f };
				delete obj.name_f;

				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'adv':
		case 'disadv':
		case 'special': {
			const list = {};
			for (const obj of data) {
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
					newObj.sel = obj.sel.split('&').map((e, i) => {
						const ee = e.split('?');
						return ee[1] ? { id: i + 1, name: ee[0], cost: Number.parseInt(ee[1]) } : { id: i + 1, name: ee[0] };
					});
				}
				else if (['SA_3', 'SA_28', 'SA_29', 'SA_30', 'SA_368', 'SA_484'].includes(newObj.id)) {
					newObj.sel = true;
				}
				try {
					newObj.req = obj.req ? obj.req.split('&').map(e => e === 'RCP' ? 'RCP' : JSON.parse(e)) : [];
				}
				catch (err) {
					console.log(obj.req);
					throw err;
				}
				list[newObj.id] = newObj;
			}
			data = list;
			break;
		}
		case 'l10n_adv':
		case 'l10n_disadv':
		case 'l10n_special': {
			const list = {};
			for (const obj of data) {
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
					newObj.sel = obj.sel.split('&').map((e, i) => {
						const ee = e.split('?');
						return ee[1] ? { id: i + 1, name: ee[0], cost: Number.parseInt(ee[1]) } : { id: i + 1, name: ee[0] };
					});
				}
				list[newObj.id] = newObj;
			}
			data = list;
			break;
		}
		case 'talents': {
			const talents = {};
			for (let obj of data) {
				const { id, check, skt, be, gr, spec, spec_input} = obj;
				const newObject = {
					id: `TAL_${id}`,
					check: obj.check.split('&').map(e => `ATTR_${e}`),
					skt,
					be,
					gr
				};
				talents[newObject.id] = newObject;
			}
			data = talents;
			break;
		}
		case 'l10n_talents': {
			const list = {};
			for (let obj of data) {
				const { id, name, spec, spec_input} = obj;
				const newObject = {
					id: `TAL_${id}`,
					name
				};
				if (spec) {
					newObject.spec = ConvertUtils.splitList(spec).map(e => {
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
			data = list;
			break;
		}
		case 'combattech': {
			const combattech = {};
			for (let obj of data) {
				obj.id = 'CT_' + obj.id;
				delete obj.name;
				obj.leit = obj.leit.split('&').map(e => `ATTR_${e}`);
				combattech[obj.id] = obj;
			}
			data = combattech;
			break;
		}
		case 'l10n_combattech': {
			const list = {};
			for (let obj of data) {
				obj.id = `CT_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'spells': {
			const spells = {};
			for (let obj of data) {
				obj.id = 'SPELL_' + obj.id;
				delete obj.name;
				obj.check = obj.check ? obj.check.split('&').map((e,i) => i < 3 ? `ATTR_${e}` : e) : [];
				obj.trad = obj.trad.split('&').map(e => Number.parseInt(e));
				spells[obj.id] = obj;
			}
			data = spells;
			break;
		}
		case 'l10n_spells': {
			const list = {};
			for (let obj of data) {
				obj.id = `SPELL_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'cantrips': {
			const list = {};
			for (let obj of data) {
				obj.id = 'CANTRIP_' + obj.id;
				delete obj.name;
				obj.trad = obj.trad.toString().split('&').map(e => Number.parseInt(e));
				obj.req = obj.req ? obj.req.split('&').map(e => e === 'RCP' ? 'RCP' : JSON.parse(e)) : [];
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'l10n_cantrips': {
			const list = {};
			for (let obj of data) {
				obj.id = `CANTRIP_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'liturgies': {
			const liturgies = {};
			for (let obj of data) {
				obj.id = 'LITURGY_' + obj.id;
				delete obj.name;
				obj.check = obj.check ? obj.check.split('&').map((e,i) => i < 3 ? `ATTR_${e}` : e) : [];
				obj.trad = obj.trad.split('&').map(e => Number.parseInt(e));
				obj.aspc = obj.aspc.split('&').map(e => Number.parseInt(e));
				obj.req = obj.req ? obj.req.split('&').map(e => e === 'RCP' ? 'RCP' : JSON.parse(e)) : [];
				liturgies[obj.id] = obj;
			}
			data = liturgies;
			break;
		}
		case 'l10n_liturgies': {
			const list = {};
			for (let obj of data) {
				obj.id = `LITURGY_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'blessings': {
			const list = {};
			for (let obj of data) {
				obj.id = 'BLESSING_' + obj.id;
				delete obj.name;
				obj.trad = obj.trad.toString().split('&').map(e => Number.parseInt(e));
				obj.aspc = obj.aspc.toString().split('&').map(e => Number.parseInt(e));
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'l10n_blessings': {
			const list = {};
			for (let obj of data) {
				obj.id = `BLESSING_${obj.id}`;
				list[obj.id] = obj;
			}
			data = list;
			break;
		}
		case 'special_profsecret': {
			const list = [];
			for (const sa of data) {
				let { id, req, cost, sec } = sa;
				req = !req ? [] : req.split('&').map(e => JSON.parse(e));
				sec = !!sec
				list.push({ id, cost, req, sec });
			}
			data = list;
			break;
		}
		case 'l10n_special_profsecret': {
			const list = [];
			for (const sa of data) {
				let { id, name } = sa;
				list.push({ id, name });
			}
			data = list;
			break;
		}
		case 'special_literacies': {
			const list = [];
			for (const sa of data) {
				let { id, languages, cost, cont, ext } = sa;
				languages = languages === '' ? [] : languages.split('&').map(r => Number.parseInt(r));
				ext = !!ext;
				list.push({ id, cost, languages, cont, ext });
			}
			data = list;
			break;
		}
		case 'l10n_special_literacies': {
			const list = [];
			for (const sa of data) {
				let { id, name } = sa;
				list.push({ id, name });
			}
			data = list;
			break;
		}
		case 'special_languages': {
			const list = [];
			for (const sa of data) {
				const { id, ext, cont } = sa;
				list.push({ id, ext: !!ext, cont });
			}
			data = list;
			break;
		}
		case 'l10n_special_languages': {
			const list = [];
			for (const sa of data) {
				const { id, name, spec, specInput } = sa;
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
			data = list;
			break;
		}
		case 'special_spellx': {
			const list = [];
			for (const obj of data) {
				delete obj.name;
				obj.target = `SPELL_${obj.target}`;
				obj.req = !obj.req ? [] : obj.req.split('&').map(e => JSON.parse(e));
				list.push(obj);
			}
			data = list;
			break;
		}
		case 'l10n_special_spellx': {
			const list = [];
			for (const obj of data) {
				list.push(obj);
			}
			data = list;
			break;
		}
		case 'items': {
			const items = {};
			for (let obj of data) {
				const { id, price, weight, gr, ct, ddn, dds, df, db, at, pa, re, length, stp, range, rt, am, pro, enc, addp, pryw, two, imp, armty } = obj;

				let result = {
					id: 'ITEMTPL_' + id,
					template: 'ITEMTPL_' + id,
					gr,
					price: price ? Number.parseFloat(price.replace(',','.')) : 0,
					weight: weight ? Number.parseFloat(weight.replace(',','.')) : 0,
					where: ''
				}

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
						pa: typeof pa === 'number' ? at : 0,
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

				items[result.id] = result;
			}
			data = items;
			break;
		}
		case 'l10n_items': {
			const items = {};
			for (let obj of data) {
				const { id, name } = obj;

				let result = {
					id: 'ITEMTPL_' + id,
					name
				};

				items[result.id] = result;
			}
			data = items;
			break;
		}
		case 'books': {
			const list = {};
			for (const obj of data) {
				delete obj.name;
				list[book.id] = obj;
			}
			data = list;
			break;
		}
		case 'l10n_books': {
			const list = {};
			for (const obj of data) {
				list[book.id] = obj;
			}
			data = list;
			break;
		}
	}

	document.querySelector('input').value = JSON.stringify(data);
}
