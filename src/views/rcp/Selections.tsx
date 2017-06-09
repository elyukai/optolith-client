import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import * as Categories from '../../constants/Categories';
import { CultureStore } from '../../stores/CultureStore';
import { get, getAllByCategory, getAllByCategoryGroup } from '../../stores/ListStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { RaceStore } from '../../stores/RaceStore';
import { CantripInstance, CantripsSelection, CombatTechniqueInstance, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, LanguagesSelectionListItem, ProfessionSelection, ProfessionSelectionIds, ScriptsSelectionListItem, SpecialAbilityInstance, SpecialisationSelection, SpellInstance } from '../../types/data.d';
import { getSelectionItem } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';
import { sortByName } from '../../utils/ListUtils';
import { SelectionsCantrips } from './SelectionsCantrips';
import { SelectionsCt } from './SelectionsCt';
import { SelectionsCurses } from './SelectionsCurses';
import { SelectionsLangLitc } from './SelectionsLangLitc';
import { SelectionsTalentSpec } from './SelectionsTalentSpec';

interface Props {
	close(): void;
}

interface State {
	attrSel: string;
	useCulturePackage: boolean;
	lang: number;
	buyLiteracy: boolean;
	litc: number;
	cantrips: Set<string>;
	combattech: Set<string>;
	combatTechniquesSecond: Set<string>;
	curses: Map<string, number>;
	langLitc: Map<string, number>;
	spec: [number | null, string];
	specTalentId?: string;
}

export class Selections extends React.Component<Props, State> {
	state = {
		attrSel: 'ATTR_0',
		buyLiteracy: false,
		cantrips: new Set<string>(),
		combatTechniquesSecond: new Set<string>(),
		combattech: new Set<string>(),
		curses: new Map<string, number>(),
		lang: 0,
		langLitc: new Map<string, number>(),
		litc: 0,
		spec: [null, ''] as [number | null, string],
		specTalentId: undefined,
		useCulturePackage: false,
	};

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
	changeSecondCombatTechniques = (id: string) => {
		const combattech = this.state.combatTechniquesSecond;
		if (!combattech.delete(id)) {
			combattech.add(id);
		}
		this.setState({ combatTechniquesSecond: combattech } as State);
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
	changeSpecId = (id: string) => {
		this.setState({ specTalentId: id, spec: [null, ''] } as State);
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
	}

	assignRCPEntries = (selMap: Map<ProfessionSelectionIds, ProfessionSelection>) => {
		ProfessionActions.setSelections({
			...this.state,
			map: selMap,
			spec: this.state.spec[1] ? this.state.spec[1] : this.state.spec[0]!,
		});
	}

	render() {
		const race = RaceStore.getCurrent()!;
		const culture = CultureStore.getCurrent()!;
		const profession = ProfessionStore.getCurrent()!;
		const professionVariant = ProfessionVariantStore.getCurrent();

		const { close } = this.props;
		const {
			attrSel,
			buyLiteracy,
			cantrips,
			combattech,
			combatTechniquesSecond,
			curses,
			lang,
			langLitc,
			litc,
			spec,
			specTalentId,
			useCulturePackage,
		} = this.state;

		const selectLang = culture.languages.length > 1;
		const selectLitc = culture.scripts.length > 1;

		const professionSelections = new Map<ProfessionSelectionIds, ProfessionSelection>();

		if (![undefined, 'P_0'].includes(ProfessionStore.getCurrentId())) {
			profession.selections.forEach(e => {
				professionSelections.set(e.id, e);
			});
		}

		if (professionVariant) {
			professionVariant.selections.forEach(e => {
				if (e.id === 'COMBAT_TECHNIQUES' && e.active === false) {
					professionSelections.delete(e.id);
				}
				else {
					professionSelections.set(e.id, e);
				}
			});
		}

		let buyScriptElement;

		if (culture.scripts.length > 0) {
			const selectionItem = getSelectionItem(get('SA_28') as SpecialAbilityInstance, culture.scripts[0]);
			buyScriptElement = (
				<Checkbox checked={buyLiteracy} onClick={this.changeLiteracy} disabled={langLitc.size > 0}>
					{translate('rcpselections.labels.buyscript')}{!selectLitc && selectionItem && ` (${selectionItem.name}, ${selectionItem.cost} AP)`}
				</Checkbox>
			);
		}

		let langLitcElement = null;
		let langLitcApLeft = 0;

		if (professionSelections.has('LANGUAGES_SCRIPTS')) {
			const active = langLitc;
			const { value } = professionSelections.get('LANGUAGES_SCRIPTS') as LanguagesScriptsSelection;

			const SA_28 = get('SA_28') as SpecialAbilityInstance;
			const SA_30 = get('SA_30') as SpecialAbilityInstance;

			const scripts: ScriptsSelectionListItem[] = [];
			const languages: LanguagesSelectionListItem[] = [];

			const scriptsList = SA_28.sel!;
			const languagesList = SA_30.sel!;

			scriptsList.forEach(e => {
				const sid = e.id as number;
				const cost = scriptsList[sid - 1].cost!;
				const name = scriptsList[sid - 1].name;
				const native = buyLiteracy && ((!selectLitc && sid === culture.scripts[0]) || (selectLitc && sid === litc));
				scripts.push({ id: `LITC_${sid}`, name, cost, native });
			});

			languagesList.forEach(e => {
				const sid = e.id as number;
				const name = languagesList[sid - 1].name;
				const native = (!selectLang && sid === culture.languages[0]) || (selectLang && sid === lang);
				languages.push({ id: `LANG_${sid}`, name, native });
			});

			scripts.sort(sortByName);
			languages.sort(sortByName);

			langLitcApLeft = value - Array.from(active.values()).reduce((a, b) => a + b, 0);

			langLitcElement = (
				<SelectionsLangLitc
					scripts={scripts}
					languages={languages}
					active={active}
					apTotal={value}
					apLeft={langLitcApLeft}
					change={this.changeLangLitc}
					/>
			);
		}

		let cursesElement = null;
		let cursesApLeft = 0;

		if (professionSelections.has('CURSES')) {
			const active = curses;
			const { value } = professionSelections.get('CURSES') as CursesSelection;

			const list = getAllByCategoryGroup(Categories.SPELLS, 3) as SpellInstance[];

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			cursesApLeft = value - (active.size + Array.from(active.values()).reduce((a, b) => a + b, 0)) * 2;

			cursesElement = <SelectionsCurses list={list} active={active} apTotal={value} apLeft={cursesApLeft} change={this.changeCurse} />;
		}

		let ctElement = null;

		if (professionSelections.has('COMBAT_TECHNIQUES')) {
			const active = combattech;
			const { amount, value, sid } = professionSelections.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection;

			const rawList = getAllByCategory(Categories.COMBAT_TECHNIQUES) as CombatTechniqueInstance[];
			const list = rawList.filter(e => sid.includes(e.id));

			ctElement = (
				<SelectionsCt
					list={list}
					active={active}
					value={value}
					amount={amount}
					disabled={combatTechniquesSecond}
					change={this.changeCombattech}
					/>
			);
		}

		let combatTechniqueSecondElement;

		if (professionSelections.has('COMBAT_TECHNIQUES_SECOND')) {
			const active = combatTechniquesSecond;
			const { amount, value, sid } = professionSelections.get('COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSecondSelection;

			const rawList = getAllByCategory(Categories.COMBAT_TECHNIQUES) as CombatTechniqueInstance[];
			const list = rawList.filter(e => sid.includes(e.id));

			combatTechniqueSecondElement = (
				<SelectionsCt
					list={list}
					active={active}
					value={value}
					amount={amount}
					disabled={combattech}
					change={this.changeCombattech}
					/>
			);
		}

		let cantripsElement = null;

		if (professionSelections.has('CANTRIPS')) {
			const active = cantrips;
			const { amount, sid } = professionSelections.get('CANTRIPS') as CantripsSelection;

			const rawList = getAllByCategory(Categories.CANTRIPS) as CantripInstance[];
			const list = rawList.filter(e => sid.includes(e.id));

			cantripsElement = <SelectionsCantrips list={list} active={active} num={amount} change={this.changeCantrip} />;
		}

		let specElement = null;

		if (professionSelections.has('SPECIALISATION')) {
			const options = professionSelections.get('SPECIALISATION') as SpecialisationSelection;
			specElement = (
				<SelectionsTalentSpec
					options={options}
					active={spec}
					activeId={specTalentId}
					change={this.changeSpec}
					changeId={this.changeSpecId}
					/>
			);
		}

		return (
			<Slidein isOpen close={close}>
				<Scroll>
					<h3>{translate('titlebar.tabs.race')}</h3>
					<Dropdown
						hint={translate('rcpselections.labels.selectattributeadjustment')}
						value={attrSel}
						onChange={this.changeAttrSel}
						options={race.attributeSelection[1].map(e => {
							const attr = get(e);
							const value = race.attributeSelection[0];
							return attr ? { id: attr.id, name: `${attr.name} ${value > 0 ? '+' : ''}${value}` } : { id: e, name: '...' };
						})} />
					<h3>{translate('titlebar.tabs.culture')}</h3>
					<Checkbox checked={useCulturePackage} onClick={this.changeCulturePackage}>
						{translate('rcpselections.labels.buyculturalpackage')} ({culture.ap} AP)
					</Checkbox>
					{
						selectLang && (
							<Dropdown
								hint={translate('rcpselections.labels.selectnativetongue')}
								value={lang}
								onChange={this.changeLang}
								options={culture.languages.map(e => {
									const lang = getSelectionItem(get('SA_30') as SpecialAbilityInstance, e);
									return { id: e, name: `${lang && lang.name}` };
								})}
								disabled={langLitc.size > 0} />
						)
					}
					{buyScriptElement}
					{
						selectLitc ? (
							<Dropdown
								hint={translate('rcpselections.labels.selectscript')}
								value={litc}
								onChange={this.changeLitc}
								options={culture.scripts.map(e => {
									const lit = getSelectionItem(get('SA_28') as SpecialAbilityInstance, e);
									return { id: e, name: `${lit && lit.name} (${lit && lit.cost} AP)` };
								})}
								disabled={!buyLiteracy || langLitc.size > 0} />
						) : null
					}
					{ProfessionStore.getCurrentId() !== 'P_0' && <h3>{translate('titlebar.tabs.profession')}</h3>}
					{specElement}
					{langLitcElement}
					{ctElement}
					{combatTechniqueSecondElement}
					{cursesElement}
					{cantripsElement}
					<BorderButton
						label={translate('rcpselections.actions.complete')}
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
