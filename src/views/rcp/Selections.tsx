import { get, getAllByCategory, getAllByCategoryGroup } from '../../stores/ListStore';
import * as Categories from '../../constants/Categories';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as React from 'react';
import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import Dropdown from '../../components/Dropdown';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import Scroll from '../../components/Scroll';
import SelectionsCantrips from './SelectionsCantrips';
import SelectionsCt from './SelectionsCt';
import SelectionsCurses from './SelectionsCurses';
import SelectionsLangLitc from './SelectionsLangLitc';
import SelectionsTalentSpec from './SelectionsTalentSpec';
import Slidein from '../../components/Slidein';

interface Props {
	close: () => void;
}

interface State {
	attrSel: string;
	useCulturePackage: boolean;
	lang: number;
	buyLiteracy: boolean;
	litc: number;
	cantrips: Set<string>;
	combattech: Set<string>;
	curses: Map<string, number>;
	langLitc: Map<string, number>;
	spec: [number | null, string];
}

export default class Selections extends React.Component<Props, State> {
	state = {
		attrSel: 'ATTR_0',
		useCulturePackage: true,
		lang: 0,
		buyLiteracy: false,
		litc: 0,
		cantrips: new Set(),
		combattech: new Set(),
		curses: new Map(),
		langLitc: new Map(),
		spec: [null, '']
	} as State;

	changeAttrSel = (option: string) => this.setState({ attrSel: option } as State);
	changeCulturePackage = () => this.setState({ useCulturePackage: !this.state.useCulturePackage } as State);
	changeLang = (option: number) => this.setState({ lang: option } as State);
	changeLiteracy = () => this.setState({ buyLiteracy: !this.state.buyLiteracy } as State);
	changeLitc = (option: number) => this.setState({ litc: option } as State);

	changeCantrip = (id: string) => {
		const cantrips = this.state.cantrips;
		if (!cantrips.delete(id)) {
			cantrips.add(id);
		}
		this.setState({ cantrips } as State);
	}
	changeCombattech = (id: string) => {
		const combattech = this.state.combattech;
		if (!combattech.delete(id)) {
			combattech.add(id);
		}
		this.setState({ combattech } as State);
	}
	changeCurse = (id: string, option: 'add' | 'remove') => {
		const { curses } = this.state;
		switch (option) {
			case 'add':
				curses.set(id, (curses.get(id) as number) + 1);
				break;
			case 'remove':
				curses.set(id, (curses.get(id) as number) - 1);
				break;
			default:
				if (!curses.delete(id)) {
					curses.set(id, 0);
				}
		}
		this.setState({ curses } as State);
	}
	changeLangLitc = (id: string, ap: number) => {
		const langLitc = this.state.langLitc;
		if (langLitc.has(id)) {
			if (langLitc.get(id) !== ap) {
				langLitc.set(id, ap);
			}
			else {
				langLitc.delete(id);
			}
		} else {
			langLitc.set(id, ap);
		}
		this.setState({ langLitc } as State);
	}
	changeSpec = (value: number | string) => {
		const spec = this.state.spec;
		if (typeof value === 'number') {
			spec[0] = value;
		}
		else {
			spec[1] = value;
		}
		this.setState({ spec } as State);
	};

	assignRCPEntries = (selMap: Map<ProfessionSelectionIds, ProfessionSelection>) => {
		ProfessionActions.setSelections({
			...this.state,
			map: selMap,
			spec: this.state.spec[1] ? this.state.spec[1] : this.state.spec[0]!
		});
	};

	render() {
		const race = RaceStore.getCurrent();
		const culture = CultureStore.getCurrent();
		const profession = ProfessionStore.getCurrent();
		const professionVariant = ProfessionVariantStore.getCurrent();

		const { close } = this.props;
		const { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = this.state;

		const selectLang = culture.languages.length > 1;
		const selectLitc = culture.scripts.length > 1;

		const professionSelections = new Map<ProfessionSelectionIds, ProfessionSelection>();

		if (![null, 'P_0'].includes(ProfessionStore.getCurrentId())) {
			profession.selections.forEach(e => {
				professionSelections.set(e.id, e);
			});
		}

		if (ProfessionVariantStore.getCurrentID() !== null) {
			professionVariant.selections.forEach(e => {
				if (e.id === 'COMBAT_TECHNIQUES' && e.active === false) {
					professionSelections.delete(e.id);
				}
				else {
					professionSelections.set(e.id, e);
				}
			});
		}

		let langLitcElement = null;
		let langLitcApLeft = 0;

		if (professionSelections.has('LANGUAGES_SCRIPTS')) {
			const active = langLitc;
			const { value } = professionSelections.get('LANGUAGES_SCRIPTS') as LanguagesScriptsSelection;

			const SA_28 = get('SA_28') as SpecialAbilityInstance;
			const SA_30 = get('SA_30') as SpecialAbilityInstance;

			const list: LanguagesScriptsSelectionListItem[] = [];

			SA_28.sel.forEach(e => {
				const sid = e.id as number;
				const cost = SA_28.sel[sid - 1].cost;
				const name = SA_28.sel[sid - 1].name;
				const disabled = buyLiteracy && ((!selectLitc && sid === culture.scripts[0]) || (selectLitc && sid === litc));
				list.push({ id: `LITC_${sid}`, name, cost, disabled });
			});

			SA_30.sel.forEach(e => {
				const sid = e.id as number;
				const name = SA_30.sel[sid - 1].name;
				const disabled = (!selectLang && sid === culture.languages[0]) || (selectLang && sid === lang);
				list.push({ id: `LANG_${sid}`, name, disabled });
			});

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			langLitcApLeft = value - Array.from(active.values()).reduce((a,b) => a + b, 0);

			langLitcElement = <SelectionsLangLitc list={list} active={active} apTotal={value} apLeft={langLitcApLeft} change={this.changeLangLitc} />;
		}

		let cursesElement = null;
		let cursesApLeft = 0;

		if (professionSelections.has('CURSES')) {
			const active = curses;
			const { value } = professionSelections.get('CURSES') as CursesSelection;

			const list = getAllByCategoryGroup(Categories.SPELLS, 3);

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			cursesApLeft = value - (active.size + Array.from(active.values()).reduce((a,b) => a + b, 0)) * 2;

			cursesElement = <SelectionsCurses list={list} active={active} apTotal={value} apLeft={cursesApLeft} change={this.changeCurse} />;
		}

		let ctElement = null;

		if (professionSelections.has('COMBAT_TECHNIQUES')) {
			const active = combattech;
			const { amount, value, sid } = professionSelections.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection;

			const rawList = getAllByCategory(Categories.COMBAT_TECHNIQUES) as CombatTechniqueInstance[];
			const list = rawList.filter(e => sid.includes(e.id));

			ctElement = <SelectionsCt list={list} active={active} num={value} amount={amount} change={this.changeCombattech} />;
		}

		let cantripsElement = null;

		if (professionSelections.has('CANTRIPS')) {
			const active = cantrips;
			const { amount, sid } = professionSelections.get('CANTRIPS') as CantripsSelection;

			const rawList = getAllByCategory(Categories.SPELLS) as SpellInstance[];
			const list = rawList.filter(e => sid.includes(e.id));

			cantripsElement = <SelectionsCantrips list={list} active={active} num={amount} change={this.changeCantrip} />;
		}

		let specElement = null;

		if (professionSelections.has('SPECIALISATION')) {
			const active = spec;
			const { sid } = professionSelections.get('SPECIALISATION') as SpecialisationSelection;

			const talent = get(sid) as TalentInstance;
			const name = talent.name;
			const list = talent.specialisation.map((e, id) => ({ id, name: e }));
			const input = talent.specialisationInput;

			specElement = <SelectionsTalentSpec list={list} active={active} name={name} input={input} change={this.changeSpec} />;
		}

		return (
			<Slidein isOpen close={close}>
				<Scroll>
					<h3>Spezies</h3>
					<Dropdown
						hint="Eigenschaftsmodifikation auswählen"
						value={attrSel}
						onChange={this.changeAttrSel}
						options={race.attributeSelection[1].map(e => {
							const attr = get(e);
							const value = race.attributeSelection[0];
							return { id: attr.id, name: `${attr.name} ${value > 0 ? '+' : ''}${value}` };
						})} />
					<h3>Kultur</h3>
					<Checkbox checked={useCulturePackage} onClick={this.changeCulturePackage}>
						Kulturpaket kaufen ({culture.ap} AP)
					</Checkbox>
					{
						selectLang ? (
							<Dropdown
								hint="Muttersprache auswählen"
								value={lang}
								onChange={this.changeLang}
								options={culture.languages.map(e => {
									const lang = (get('SA_30') as SpecialAbilityInstance).sel[e - 1];
									return { id: e, name: lang.name };
								})}
								disabled={langLitc.size > 0} />
						) : null
					}
					<Checkbox checked={buyLiteracy} onClick={this.changeLiteracy} disabled={langLitc.size > 0}>
						Schrift kaufen{
							!selectLitc ? ` (${(get('SA_28') as SpecialAbilityInstance).sel[culture.scripts[0] - 1].name}, ${(get('SA_28') as SpecialAbilityInstance).sel[culture.scripts[0] - 1].cost} AP)` : ''
						}
					</Checkbox>
					{
						selectLitc ? (
							<Dropdown
								hint="Schrift auswählen"
								value={litc}
								onChange={this.changeLitc}
								options={culture.scripts.map(e => {
									const lit = (get('SA_28') as SpecialAbilityInstance).sel[e - 1];
									return { id: e, name: `${lit.name} (${lit.cost} AP)` };
								})}
								disabled={!buyLiteracy || langLitc.size > 0} />
						) : null
					}
					{ProfessionStore.getCurrentId() !== 'P_0' ? <h3>Profession</h3> : null}
					{specElement}
					{langLitcElement}
					{ctElement}
					{cursesElement}
					{cantripsElement}
					<BorderButton
						label="Fertigstellen"
						primary
						disabled={
							attrSel === 'ATTR_0' ||
							(selectLang && lang === 0) ||
							(buyLiteracy && selectLitc && litc === 0) ||
							(professionSelections.has('SPECIALISATION') && (spec[1] === '' && spec[0] === null)) ||
							(professionSelections.has('LANGUAGES_SCRIPTS') && langLitcApLeft !== 0) ||
							(professionSelections.has('CURSES') && cursesApLeft !== 0) ||
							(professionSelections.has('COMBAT_TECHNIQUES') && combattech.size !== (professionSelections.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection).amount) ||
							(professionSelections.has('CANTRIPS') && cantrips.size !== (professionSelections.get('CANTRIPS') as CantripsSelection).amount)
						}
						onClick={this.assignRCPEntries.bind(null, professionSelections)}
						/>
				</Scroll>
			</Slidein>
		);
	}
}
