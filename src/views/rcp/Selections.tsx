import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { getAllByGroupFromSlice } from '../../selectors/dependentInstancesSelectors';
import { AttributeInstance, CantripInstance, CantripsSelection, CombatTechniqueInstance, CombatTechniquesSecondSelection, CombatTechniquesSelection, CultureInstance, CursesSelection, LanguagesScriptsSelection, LanguagesSelectionListItem, ProfessionInstance, ProfessionSelection, ProfessionSelectionIds, ProfessionVariantInstance, RaceInstance, ScriptsSelectionListItem, Selections as SelectionsInterface, SkillsSelection, SpecialAbilityInstance, SpecialisationSelection, SpellInstance, TalentInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { getSelectionItem } from '../../utils/ActivatableUtils';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { SelectionsCantrips } from './SelectionsCantrips';
import { SelectionsCt } from './SelectionsCt';
import { SelectionsCurses } from './SelectionsCurses';
import { SelectionsLangLitc } from './SelectionsLangLitc';
import { SelectionsSkills } from './SelectionsSkills';
import { SelectionsTalentSpec } from './SelectionsTalentSpec';

export interface SelectionsOwnProps {
	locale: UIMessages;
	close(): void;
}

export interface SelectionsStateProps {
	attributes: Map<string, AttributeInstance>;
	cantrips: Map<string, CantripInstance>;
	combatTechniques: Map<string, CombatTechniqueInstance>;
	currentRace: RaceInstance;
	currentCulture: CultureInstance;
	currentProfession: ProfessionInstance;
	currentProfessionVariant: ProfessionVariantInstance | undefined;
	skills: Map<string, TalentInstance>;
	spells: Map<string, SpellInstance>;
	specialAbilities: Map<string, SpecialAbilityInstance>;
}

export interface SelectionsDispatchProps {
	setSelections(selections: SelectionsInterface): void;
}

export type SelectionsProps = SelectionsStateProps & SelectionsDispatchProps & SelectionsOwnProps;

export interface SelectionsState {
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
	skills: Map<string, number>;
	spec: [number | null, string];
	specTalentId?: string;
}

export class Selections extends React.Component<SelectionsProps, SelectionsState> {
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
		skills: new Map<string, number>(),
		spec: [null, ''] as [number | null, string],
		specTalentId: undefined,
		useCulturePackage: false,
	};

	changeAttrSel = (option: string) => this.setState({ attrSel: option } as SelectionsState);
	changeCulturePackage = () => this.setState({ useCulturePackage: !this.state.useCulturePackage } as SelectionsState);
	changeLang = (option: number) => this.setState({ lang: option } as SelectionsState);
	changeLiteracy = () => this.setState({ buyLiteracy: !this.state.buyLiteracy } as SelectionsState);
	changeLitc = (option: number) => this.setState({ litc: option } as SelectionsState);

	changeCantrip = (id: string) => {
		const cantrips = this.state.cantrips;
		if (!cantrips.delete(id)) {
			cantrips.add(id);
		}
		this.setState({ cantrips } as SelectionsState);
	}
	changeCombattech = (id: string) => {
		const combattech = this.state.combattech;
		if (!combattech.delete(id)) {
			combattech.add(id);
		}
		this.setState({ combattech } as SelectionsState);
	}
	changeSecondCombatTechniques = (id: string) => {
		const combattech = this.state.combatTechniquesSecond;
		if (!combattech.delete(id)) {
			combattech.add(id);
		}
		this.setState({ combatTechniquesSecond: combattech } as SelectionsState);
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
		this.setState({ curses } as SelectionsState);
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
		this.setState({ langLitc } as SelectionsState);
	}
	changeSpecId = (id: string) => {
		this.setState({ specTalentId: id, spec: [null, ''] } as SelectionsState);
	}
	changeSpec = (value: number | string) => {
		const spec = this.state.spec;
		if (typeof value === 'number') {
			spec[0] = value;
		}
		else {
			spec[1] = value;
		}
		this.setState({ spec } as SelectionsState);
	}
	addSkillPoint = (id: string) => {
		const skills = this.state.skills;
		const current = skills.get(id);
		const ic = this.props.skills.get(id)!.ic;
		if (current) {
			skills.set(id, current + ic);
		}
		else {
			skills.set(id, ic);
		}
		this.setState({ skills } as SelectionsState);
	}
	removeSkillPoint = (id: string) => {
		const skills = this.state.skills;
		const current = skills.get(id);
		const ic = this.props.skills.get(id)!.ic;
		if (current && current === ic) {
			skills.delete(id);
		}
		else if (current) {
			skills.set(id, current - ic);
		}
		this.setState({ skills } as SelectionsState);
	}

	assignRCPEntries = (selMap: Map<ProfessionSelectionIds, ProfessionSelection>) => {
		this.props.setSelections({
			...this.state,
			map: selMap,
			spec: this.state.spec[1] ? this.state.spec[1] : this.state.spec[0]!,
		});
	}

	render() {
		const {
			attributes,
			cantrips: cantripsState,
			close,
			combatTechniques,
			currentCulture,
			currentProfession,
			currentProfessionVariant,
			currentRace,
			locale,
			skills: skillsState,
			specialAbilities,
			spells
		} = this.props;
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
			skills,
			spec,
			specTalentId,
			useCulturePackage,
		} = this.state;

		const selectLang = currentCulture.languages.length > 1;
		const selectLitc = currentCulture.scripts.length > 1;

		const professionSelections = new Map<ProfessionSelectionIds, ProfessionSelection>();

		if (currentProfession.id !== 'P_0') {
			currentProfession.selections.forEach(e => {
				professionSelections.set(e.id, e);
			});
		}

		if (currentProfessionVariant) {
			currentProfessionVariant.selections.forEach(e => {
				if (e.id === 'COMBAT_TECHNIQUES' && e.active === false) {
					professionSelections.delete(e.id);
				}
				else {
					professionSelections.set(e.id, e);
				}
			});
		}

		let buyScriptElement;

		if (currentCulture.scripts.length > 0) {
			const selectionItem = getSelectionItem(specialAbilities.get('SA_28')!, currentCulture.scripts[0]);
			buyScriptElement = (
				<Checkbox checked={buyLiteracy} onClick={this.changeLiteracy} disabled={langLitc.size > 0}>
					{_translate(locale, 'rcpselections.labels.buyscript')}{!selectLitc && selectionItem && ` (${selectionItem.name}, ${selectionItem.cost} AP)`}
				</Checkbox>
			);
		}

		let langLitcElement = null;
		let langLitcApLeft = 0;

		if (professionSelections.has('LANGUAGES_SCRIPTS')) {
			const active = langLitc;
			const { value } = professionSelections.get('LANGUAGES_SCRIPTS') as LanguagesScriptsSelection;

			const SA_28 = specialAbilities.get('SA_28')!;
			const SA_30 = specialAbilities.get('SA_30')!;

			let scripts: ScriptsSelectionListItem[] = [];
			let languages: LanguagesSelectionListItem[] = [];

			const scriptsList = SA_28.sel!;
			const languagesList = SA_30.sel!;

			scriptsList.forEach(e => {
				const { id } = e;
				const obj = getSelectionItem(SA_28, id);
				if (typeof obj === 'object') {
					const { name, cost } = obj;
					if (typeof cost === 'number') {
						const native = buyLiteracy && ((!selectLitc && id === currentCulture.scripts[0]) || id === litc);
						scripts.push({ id: `LITC_${id}`, name, cost, native });
					}
				}
			});

			languagesList.forEach(e => {
				const { id } = e;
				const obj = getSelectionItem(SA_30, id);
				if (typeof obj === 'object') {
					const { name } = obj;
					const native = (selectLang === false && id === currentCulture.languages[0]) || id === lang;
					languages.push({ id: `LANG_${id}`, name, native });
				}
			});

			scripts = sortObjects(scripts, locale.id);
			languages = sortObjects(languages, locale.id);

			langLitcApLeft = value - Array.from(active.values()).reduce((a, b) => a + b, 0);

			langLitcElement = (
				<SelectionsLangLitc
					scripts={scripts}
					languages={languages}
					active={active}
					apTotal={value}
					apLeft={langLitcApLeft}
					change={this.changeLangLitc}
					locale={locale}
					/>
			);
		}

		let cursesElement = null;
		let cursesApLeft = 0;

		if (professionSelections.has('CURSES')) {
			const active = curses;
			const { value } = professionSelections.get('CURSES') as CursesSelection;

			const list = getAllByGroupFromSlice(spells, 3);

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			cursesApLeft = value - (active.size + Array.from(active.values()).reduce((a, b) => a + b, 0)) * 2;

			cursesElement =
				<SelectionsCurses
					list={list}
					active={active}
					apTotal={value}
					apLeft={cursesApLeft}
					change={this.changeCurse}
					locale={locale}
					/>
			;
		}

		let ctElement = null;

		if (professionSelections.has('COMBAT_TECHNIQUES')) {
			const active = combattech;
			const { amount, value, sid } = professionSelections.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection;

			const rawList = [...combatTechniques.values()];
			const list = rawList.filter(e => sid.includes(e.id));

			ctElement = (
				<SelectionsCt
					list={list}
					active={active}
					value={value}
					amount={amount}
					disabled={combatTechniquesSecond}
					change={this.changeCombattech}
					locale={locale}
					/>
			);
		}

		let combatTechniqueSecondElement;

		if (professionSelections.has('COMBAT_TECHNIQUES_SECOND')) {
			const active = combatTechniquesSecond;
			const { amount, value, sid } = professionSelections.get('COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSecondSelection;

			const rawList = [...combatTechniques.values()];
			const list = rawList.filter(e => sid.includes(e.id));

			combatTechniqueSecondElement = (
				<SelectionsCt
					list={list}
					active={active}
					value={value}
					amount={amount}
					disabled={combattech}
					change={this.changeSecondCombatTechniques}
					locale={locale}
					second
					/>
			);
		}

		let cantripsElement = null;

		if (professionSelections.has('CANTRIPS')) {
			const active = cantrips;
			const { amount, sid } = professionSelections.get('CANTRIPS') as CantripsSelection;

			const rawList = [...cantripsState.values()];
			const list = rawList.filter(e => sid.includes(e.id));

			cantripsElement =
				<SelectionsCantrips
					list={list}
					active={active}
					num={amount}
					change={this.changeCantrip}
					locale={locale}
					/>
			;
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
					locale={locale}
					skills={skillsState}
					/>
			);
		}

		let skillsElement;
		let skillsApLeft = 0;

		if (professionSelections.has('SKILLS')) {
			const { gr, value } = professionSelections.get('SKILLS') as SkillsSelection;
			const list = [...skillsState.values()].filter(e => gr === undefined || gr === e.gr);
			skillsApLeft = [...skills.values()].reduce((n, e) => n - e, value);
			skillsElement = (
				<SelectionsSkills
					active={skills}
					add={this.addSkillPoint}
					gr={gr}
					left={skillsApLeft}
					list={list}
					remove={this.removeSkillPoint}
					value={value}
					locale={locale}
					/>
			);
		}

		return (
			<Slidein isOpen close={close}>
				<Scroll>
					<h3>{_translate(locale, 'titlebar.tabs.race')}</h3>
					<Dropdown
						hint={_translate(locale, 'rcpselections.labels.selectattributeadjustment')}
						value={attrSel}
						onChange={this.changeAttrSel}
						options={currentRace.attributeAdjustmentsSelection[1].map(e => {
							const attr = attributes.get(e);
							const value = currentRace.attributeAdjustmentsSelection[0];
							return attr ? { id: attr.id, name: `${attr.name} ${value > 0 ? '+' : ''}${value}` } : { id: e, name: '...' };
						})} />
					<h3>{_translate(locale, 'titlebar.tabs.culture')}</h3>
					<Checkbox checked={useCulturePackage} onClick={this.changeCulturePackage}>
						{_translate(locale, 'rcpselections.labels.buyculturalpackage')} ({currentCulture.ap} AP)
					</Checkbox>
					{
						selectLang && (
							<Dropdown
								hint={_translate(locale, 'rcpselections.labels.selectnativetongue')}
								value={lang}
								onChange={this.changeLang}
								options={currentCulture.languages.map(e => {
									const lang = getSelectionItem(specialAbilities.get('SA_30')!, e);
									return { id: e, name: `${lang && lang.name}` };
								})}
								disabled={langLitc.size > 0} />
						)
					}
					{buyScriptElement}
					{
						selectLitc ? (
							<Dropdown
								hint={_translate(locale, 'rcpselections.labels.selectscript')}
								value={litc}
								onChange={this.changeLitc}
								options={currentCulture.scripts.map(e => {
									const lit = getSelectionItem(specialAbilities.get('SA_28')!, e);
									return { id: e, name: `${lit && lit.name} (${lit && lit.cost} AP)` };
								})}
								disabled={!buyLiteracy || langLitc.size > 0} />
						) : null
					}
					{currentProfession.id !== 'P_0' && <h3>{_translate(locale, 'titlebar.tabs.profession')}</h3>}
					{specElement}
					{langLitcElement}
					{ctElement}
					{combatTechniqueSecondElement}
					{cursesElement}
					{cantripsElement}
					{skillsElement}
					<BorderButton
						label={_translate(locale, 'rcpselections.actions.complete')}
						primary
						disabled={
							attrSel === 'ATTR_0' ||
							(selectLang && lang === 0) ||
							(buyLiteracy && selectLitc && litc === 0) ||
							(professionSelections.has('SPECIALISATION') && (spec[1] === '' && spec[0] === null)) ||
							(professionSelections.has('LANGUAGES_SCRIPTS') && langLitcApLeft !== 0) ||
							(professionSelections.has('CURSES') && cursesApLeft !== 0) ||
							(professionSelections.has('COMBAT_TECHNIQUES') && combattech.size !== (professionSelections.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection).amount) ||
							(professionSelections.has('CANTRIPS') && cantrips.size !== (professionSelections.get('CANTRIPS') as CantripsSelection).amount) ||
							(professionSelections.has('SKILLS') && skillsApLeft > 0)
						}
						onClick={this.assignRCPEntries.bind(null, professionSelections)}
						/>
				</Scroll>
			</Slidein>
		);
	}
}
