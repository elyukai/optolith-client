import classNames = require('classnames');
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { ADVANTAGES, ATTRIBUTES, DISADVANTAGES, LITURGIES, SPECIAL_ABILITIES, SPELLS } from '../../constants/Categories';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { get } from '../../selectors/dependentInstancesSelectors';
import { ActivatableBasePrerequisites, ActivatableInstance, ActiveObject, AttributeInstance, Book, RaceInstance, SecondaryAttribute, SpecialAbilityInstance } from '../../types/data.d';
import { RaceRequirement, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute } from '../../types/reusable';
import { UIMessages } from '../../types/view.d';
import { getNameCost, isExtendedSpecialAbility } from '../../utils/ActivatableUtils';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getCategoryById } from '../../utils/IDUtils';
import { getRoman } from '../../utils/NumberUtils';
import { isRaceRequirement, isRequiringActivatable, isRequiringIncreasable, isRequiringPrimaryAttribute } from '../../utils/RequirementUtils';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiActivatableInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	dependent: DependentInstancesState;
	currentObject: ActivatableInstance;
	locale: UIMessages;
	specialAbilities: Map<string, SpecialAbilityInstance>;
}

export function WikiActivatableInfo(props: WikiActivatableInfoProps) {
	const { books, currentObject, locale, specialAbilities, dependent } = props;
	const { apValue, apValueAppend, cost, tiers } = currentObject;

	let costText = `**${_translate(locale, 'info.apvalue')}:** `;

	if (apValue) {
		costText += apValue;
	}
	else if (Array.isArray(cost)) {
		const iteratedCost = currentObject.category === DISADVANTAGES ? cost.map(e => -e) : cost;
		costText += `${_translate(locale, 'info.tier')} ${iteratedCost.map((_, i) => getRoman(i, true)).join('/')}: ${iteratedCost.join('/')} ${_translate(locale, 'aptext')}`;
	}
	else {
		costText += `${currentObject.category === DISADVANTAGES && typeof cost === 'number' ? -cost : cost} ${_translate(locale, 'aptext')}`;

		if (typeof tiers === 'number') {
			costText += ` ${_translate(locale, 'info.pertier')}`;
		}
	}
	if (apValueAppend) {
		costText += ` ${apValueAppend}`;
	}

	if (currentObject.category === SPECIAL_ABILITIES) {
		const headerElement = (
			<div className="specialability-header info-header">
				<p className="title">{currentObject.nameInWiki || currentObject.name}{typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}</p>
				{currentObject.subgr && <p className="title">{_translate(locale, 'info.specialabilities.subgroups')[currentObject.subgr - 1]}</p>}
			</div>
		);

		if (['en-US', 'nl-BE'].includes(locale.id)) {
			return <Scroll>
				<div className="info specialability-info">
					{headerElement}
				</div>
			</Scroll>;
		}

		switch (currentObject.gr) {
			case 5:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
						{currentObject.volume && <WikiProperty locale={locale} title="info.volume">
							{currentObject.volume}
						</WikiProperty>}
						{currentObject.aeCost && <WikiProperty locale={locale} title="info.aecost">
							{currentObject.aeCost}
						</WikiProperty>}
						{currentObject.aeCost === undefined && currentObject.bindingCost === undefined && <WikiProperty locale={locale} title="info.aecost">
							{_translate(locale, 'info.none')}
						</WikiProperty>}
						{currentObject.bindingCost && <WikiProperty locale={locale} title="info.bindingcost">
							{currentObject.bindingCost}
						</WikiProperty>}
						{currentObject.property && <WikiProperty locale={locale} title="info.property">
							{typeof currentObject.property === 'number' ? _translate(locale, 'spells.view.properties')[currentObject.property - 1] : currentObject.property}
						</WikiProperty>}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;

			case 23:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
						{currentObject.aspect && <WikiProperty locale={locale} title="info.aspect">
							{typeof currentObject.aspect === 'number' ? _translate(locale, 'liturgies.view.aspects')[currentObject.aspect - 1] : currentObject.aspect}
						</WikiProperty>}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;

			case 8:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						<WikiProperty locale={locale} title="info.aecost">
							{currentObject.aeCost}
						</WikiProperty>
						<WikiProperty locale={locale} title="info.protectivecircle">
							{currentObject.protectiveCircle}
						</WikiProperty>
						<WikiProperty locale={locale} title="info.wardingcircle">
							{currentObject.wardingCircle}
						</WikiProperty>
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;

			case 28:
			case 29:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						<Markdown source={`${currentObject.rules}`} />
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<p className="source">
							<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
						</p>
					</div>
				</Scroll>;

			case 9:
			case 10:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
						{currentObject.extended && <Markdown source={`**${_translate(locale, 'info.extendedcombatspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
						{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
						{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;

			case 13:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
						{currentObject.extended && <Markdown source={`**${_translate(locale, 'info.extendedmagicalspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;

			case 25: {
				const SA_639 = specialAbilities.get('SA_639');

				const additionalExtended = SA_639 && SA_639.sel && SA_639.sel.reduce<ActiveObject[]>((arr, selectionObject) => {
					if (selectionObject.prerequisites) {
						if (selectionObject.prerequisites.find(e => e.id === currentObject.id || e.id.includes(currentObject.id))) {
							return [
								{ sid: selectionObject.id },
								...arr
							];
						}
					}
					return arr;
				}, []);

				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
						{currentObject.extended && <Markdown source={`**${_translate(locale, 'info.extendedblessedtspecialabilities')}:** ${sortStrings([
							...currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'),
							...(additionalExtended ? additionalExtended.map(e => getNameCost({ id: 'SA_639', index: 0, ...e }, dependent, true, locale).combinedName) : [])
						], locale.id).join(', ')}`} />}
						{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
						{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;
			}

			default:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
						{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
						{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
						{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
						{currentObject.aeCost && <WikiProperty locale={locale} title="info.aecost">
							{currentObject.aeCost}
						</WikiProperty>}
						<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
						<Markdown source={costText} />
						<WikiSource src={currentObject.src} books={books} locale={locale} />
					</div>
				</Scroll>;
		}
	}

	const headerElement = (
		<div className="specialability-header info-header">
			<p className="title">{currentObject.name}{typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}{(Array.isArray(currentObject.reqs) ? currentObject.reqs.includes('RCP') : (currentObject.reqs.has(1) && currentObject.reqs.get(1)!.includes('RCP'))) ? ' (*)' : ''}</p>
		</div>
	);

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info disadv-info">
				{headerElement}
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info disadv-info">
			{headerElement}
			{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
			{currentObject.range && <WikiProperty locale={locale} title="info.range">
				{currentObject.range}
			</WikiProperty>}
			{currentObject.actions && <WikiProperty locale={locale} title="info.actions">
				{currentObject.actions}
			</WikiProperty>}
			<PrerequisitesText entry={currentObject} dependent={dependent} locale={locale} />
			<Markdown source={costText} />
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}

export interface PrerequisitesTextProps {
	entry: ActivatableInstance;
	dependent: DependentInstancesState;
	locale: UIMessages;
}

export function PrerequisitesText(props: PrerequisitesTextProps): JSX.Element {
	const { entry, dependent, locale } = props;

  if (typeof entry.prerequisitesText === 'string') {
		return <Markdown source={`**${_translate(locale, 'info.prerequisites')}:** ${entry.prerequisitesText}`} />;
  }

	const { prerequisitesTextEnd, prerequisitesTextStart, tiers = 1, reqs } = entry;

  if (!Array.isArray(reqs)) {
		const tiersArr = Array.from({ length: tiers }, (_, index) => index + 1);
		return <p>
			<span>{_translate(locale, 'info.prerequisites')}</span>
			<span>
				{prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
				{!reqs.has(1) && `${_translate(locale, 'tier')} I: ${_translate(locale, 'info.none')}; `}
				{tiersArr.map(e => {
					return <span key={e} className="tier">
						{`${_translate(locale, 'tier')} ${getRoman(e)}: `}
						{reqs.has(e) && <Prerequisites list={reqs.get(e)!} entry={entry} dependent={dependent} locale={locale} prerequisitesTextIndex={entry.prerequisitesTextIndex} />}
						{e > 1 && <span>{entry.name} {getRoman(e - 1)}</span>}
					</span>;
				})}
				{prerequisitesTextEnd && <Markdown source={prerequisitesTextEnd} oneLine="span" />}
			</span>
		</p>;
	}

	return <p>
		<span>{_translate(locale, 'info.prerequisites')}</span>
		<span>
			{prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
			<Prerequisites list={reqs} entry={entry} dependent={dependent} locale={locale} prerequisitesTextIndex={entry.prerequisitesTextIndex} />
			{prerequisitesTextEnd && (/^(?:;|,|\.)/.test(prerequisitesTextEnd) ? <Markdown source={prerequisitesTextEnd} oneLine="fragment" /> : <Markdown source={prerequisitesTextEnd} oneLine="span" />)}
		</span>
	</p>;
}

export interface PrerequisitesProps {
	list: ActivatableBasePrerequisites;
	entry: ActivatableInstance;
	locale: UIMessages;
	dependent: DependentInstancesState;
	prerequisitesTextIndex: Map<number, string | false>;
}

export function Prerequisites(props: PrerequisitesProps) {
	const { list, entry, locale, dependent, prerequisitesTextIndex } = props;

	if (list.length === 0 && !isExtendedSpecialAbility(entry)) {
		return <React.Fragment>
			{_translate(locale, 'info.none')}
		</React.Fragment>;
	}

	const items = getCategorizedItems(list, prerequisitesTextIndex);

	const {
		rcp,
		casterBlessedOne,
		traditions,
		attributes,
		primaryAttribute,
		skills,
		activeSkills,
		otherActiveSpecialAbilities,
		inactiveSpecialAbilities,
		otherActiveAdvantages,
		inactiveAdvantages,
		activeDisadvantages,
		inactiveDisadvantages,
		race
	} = items;

	return <React.Fragment>
		{rcp && getPrerequisitesRCPText(rcp, entry, locale)}
		{getPrerequisitesActivatablesText(casterBlessedOne, dependent, locale)}
		{getPrerequisitesActivatablesText(traditions, dependent, locale)}
		{getPrerequisitesAttributesText(attributes, dependent.attributes, locale)}
		{primaryAttribute && getPrerequisitesPrimaryAttributeText(primaryAttribute, locale)}
		{getPrerequisitesSkillsText(skills, dependent, locale)}
		{getPrerequisitesActivatedSkillsText(activeSkills, dependent, locale)}
		{getPrerequisitesActivatablesText(otherActiveSpecialAbilities, dependent, locale)}
		{getPrerequisitesActivatablesText(inactiveSpecialAbilities, dependent, locale)}
		{getPrerequisitesActivatablesText(otherActiveAdvantages, dependent, locale)}
		{getPrerequisitesActivatablesText(inactiveAdvantages, dependent, locale)}
		{getPrerequisitesActivatablesText(activeDisadvantages, dependent, locale)}
		{getPrerequisitesActivatablesText(inactiveDisadvantages, dependent, locale)}
		{race && getPrerequisitesRaceText(race, dependent.races, locale)}
		{entry.category === SPECIAL_ABILITIES ? (entry.gr === 11 ? <span>{_translate(locale, 'appropriatecombatstylespecialability')}</span> : entry.gr === 14 ? <span>{_translate(locale, 'appropriatemagicalstylespecialability')}</span> : entry.gr === 26 ? <span>{_translate(locale, 'appropriateblessedstylespecialability')}</span> : '') : ''}
	</React.Fragment>;
}

interface ActivatableStringObject {
	id: string;
	active: boolean;
	value: string;
}

type ReplacedPrerequisite<T = RequiresActivatableObject> = T | string;
type ActivatablePrerequisiteObjects = RequiresActivatableObject | ActivatableStringObject;
type PrimaryAttributePrerequisiteObjects = RequiresPrimaryAttribute | string;
type IncreasablePrerequisiteObjects = RequiresIncreasableObject | string;
type RacePrerequisiteObjects = RaceRequirement | string;
type RCPPrerequisiteObjects = boolean | string;

function isActivatableStringObject(testObj: ActivatablePrerequisiteObjects): testObj is ActivatableStringObject {
	return testObj.hasOwnProperty('id') && testObj.hasOwnProperty('active') && testObj.hasOwnProperty('value');
}

export function getPrerequisitesRCPText(options: RCPPrerequisiteObjects, entry: ActivatableInstance, locale: UIMessages): JSX.Element {
  return <span>
		{typeof options === 'string' ? options : _translate(locale, 'requiresrcp', entry.name, entry.category === ADVANTAGES ? _translate(locale, 'advantage') : _translate(locale, 'disadvantage'))}
	</span>;
}

export function getPrerequisitesAttributesText(list: IncreasablePrerequisiteObjects[], attributes: Map<string, AttributeInstance>, locale: UIMessages): JSX.Element {
	return list.length > 0 ? <span>
		{list.map(e => {
			if (typeof e === 'string') {
				return e;
			}
			const { id, value } = e;
			return `${Array.isArray(id) ? id.map(a => attributes.get(a)!.short).join(_translate(locale, 'info.or')) : attributes.get(id)!.short} ${value}`;
		}).join(', ')}
	</span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesPrimaryAttributeText(primaryAttribute: PrimaryAttributePrerequisiteObjects, locale: UIMessages): JSX.Element {
	return <span>
		{typeof primaryAttribute === 'string' ? primaryAttribute : `${_translate(locale, 'primaryattributeofthetradition')} ${primaryAttribute.value}`}
	</span>;
}

export function getPrerequisitesSkillsText(list: IncreasablePrerequisiteObjects[], dependent: DependentInstancesState, locale: UIMessages): JSX.Element {
	return list.length > 0 ? <span>
		{sortStrings(list.map(e => {
			if (typeof e === 'string') {
				return e;
			}
			const { id, value } = e;
			return `${Array.isArray(id) ? id.map(a => get(dependent, a)!.name).join(_translate(locale, 'info.or')) : get(dependent, id)!.name} ${value}`;
		}), locale.id).join(', ')}
	</span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesActivatedSkillsText(list: ActivatablePrerequisiteObjects[], dependent: DependentInstancesState, locale: UIMessages): JSX.Element {
	return list.length > 0 ? <span>
	{sortStrings(list.map(e => {
		if (isActivatableStringObject(e)) {
			return e.value;
		}
		const { id } = e;
		if (Array.isArray(id)) {
			const category = getCategoryById(id[0]);
			return `${category === LITURGIES ? _translate(locale, 'knowledgeofliturgicalchant') : _translate(locale, 'knowledgeofspell')} ${id.map(e => get(dependent, e)!.name).join(_translate(locale, 'info.or'))}`;
		}
		const category = getCategoryById(id);
		return `${category === LITURGIES ? _translate(locale, 'knowledgeofliturgicalchant') : _translate(locale, 'knowledgeofspell')} ${get(dependent, id)!.name}`;
	}), locale.id).join(', ')}
	</span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesActivatablesText(list: ActivatablePrerequisiteObjects[], dependent: DependentInstancesState, locale: UIMessages): React.ReactFragment[] {
	return sortObjects(list.map(e => {
		if (isActivatableStringObject(e)) {
			const { id, active, value } = e;
			const category = getCategoryById(id);
			return {
				name: `${category === ADVANTAGES ? `${_translate(locale, 'advantage')} ` : category === DISADVANTAGES ? `${_translate(locale, 'disadvantage')} ` : ''}${value}`,
				active
			};
		}
		const { id, active, sid, sid2, tier } = e;
		return {
			name: Array.isArray(id) ? id.map(a => {
				const category = getCategoryById(a);
				return `${category === ADVANTAGES ? `${_translate(locale, 'advantage')} ` : category === DISADVANTAGES ? `${_translate(locale, 'disadvantage')} ` : ''}${getNameCost({ id: a, sid: sid as string | number | undefined, sid2, tier, index: 0 }, dependent, true, locale).combinedName}`;
			}).join(_translate(locale, 'info.or')) : Array.isArray(sid) ? sid.map(a => {
				const category = getCategoryById(id);
				return `${category === ADVANTAGES ? `${_translate(locale, 'advantage')} ` : category === DISADVANTAGES ? `${_translate(locale, 'disadvantage')} ` : ''}${getNameCost({ id, sid: a, sid2, tier, index: 0 }, dependent, true, locale).combinedName}`;
			}).join(_translate(locale, 'info.or')) : `${getCategoryById(id) === ADVANTAGES ? `${_translate(locale, 'advantage')} ` : getCategoryById(id) === DISADVANTAGES ? `${_translate(locale, 'disadvantage')} ` : ''}${getNameCost({ id, sid, sid2, tier, index: 0 }, dependent, true, locale).combinedName}`,
			active
		};
	}), locale.id).map(e => {
		return <span key={e.name}><span className={classNames(!e.active && 'disabled')}>{e.name}</span></span>;
	});
}

export function getPrerequisitesRaceText(race: RacePrerequisiteObjects, races: Map<string, RaceInstance>, locale: UIMessages): JSX.Element {
	return <span>
		{typeof race === 'string' ? race : `${_translate(locale, 'race')} ${Array.isArray(race.value) ? race.value.map(e => races.get(e)).join(_translate(locale, 'info.or')) : races.get(race.value)}`}
	</span>;
}

interface CategorizedItems {
	rcp: RCPPrerequisiteObjects;
	casterBlessedOne: ActivatablePrerequisiteObjects[];
	traditions: ActivatablePrerequisiteObjects[];
	attributes: ReplacedPrerequisite<RequiresIncreasableObject>[];
	primaryAttribute?: ReplacedPrerequisite<RequiresPrimaryAttribute>;
	skills: ReplacedPrerequisite<RequiresIncreasableObject>[];
	activeSkills: ActivatablePrerequisiteObjects[];
	otherActiveSpecialAbilities: ActivatablePrerequisiteObjects[];
	inactiveSpecialAbilities: ActivatablePrerequisiteObjects[];
	otherActiveAdvantages: ActivatablePrerequisiteObjects[];
	inactiveAdvantages: ActivatablePrerequisiteObjects[];
	activeDisadvantages: ActivatablePrerequisiteObjects[];
	inactiveDisadvantages: ActivatablePrerequisiteObjects[];
	race?: RacePrerequisiteObjects;
}

export function getCategorizedItems(list: ActivatableBasePrerequisites, prerequisitesTextIndex: Map<number, string | false>) {
	return list.reduce<CategorizedItems>((obj, item, index) => {
		const indexSpecial = prerequisitesTextIndex.get(index);
		if (indexSpecial === false) {
			return obj;
		}
		if (item === 'RCP') {
			return {
				...obj,
				rcp: indexSpecial || true
			};
		}
		else if (isRaceRequirement(item)) {
			return {
				...obj,
				race: indexSpecial || item
			};
		}
		else if (isRequiringPrimaryAttribute(item)) {
			return {
				...obj,
				primaryAttribute: indexSpecial || item
			};
		}
		else if (isRequiringIncreasable(item)) {
			const category = Array.isArray(item.id) ? getCategoryById(item.id[0]) : getCategoryById(item.id);
			if (category === ATTRIBUTES) {
				return {
					...obj,
					attributes: [...obj.attributes, indexSpecial || item]
				};
			}
			return {
				...obj,
				skills: [...obj.skills, indexSpecial || item]
			};
		}
		else if (isRequiringActivatable(item)) {
			const category = Array.isArray(item.id) ? getCategoryById(item.id[0]) : getCategoryById(item.id);
			if (category === LITURGIES || category === SPELLS) {
				return {
					...obj,
					activeSkills: [...obj.activeSkills, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
			else if (Array.isArray(item.id) ? item.id.includes('ADV_12') || item.id.includes('ADV_50') : ['ADV_12', 'ADV_50'].includes(item.id)) {
				return {
					...obj,
					casterBlessedOne: [...obj.casterBlessedOne, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
			else if (Array.isArray(item.id) ? item.id.includes('SA_78') || item.id.includes('SA_86') : ['SA_78', 'SA_86'].includes(item.id)) {
				return {
					...obj,
					traditions: [...obj.traditions, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
			else if (category === SPECIAL_ABILITIES) {
				if (item.active === true) {
					return {
						...obj,
						otherActiveSpecialAbilities: [...obj.otherActiveSpecialAbilities, indexSpecial ? { ...item, value: indexSpecial } : item]
					};
				}
				return {
					...obj,
					inactiveSpecialAbilities: [...obj.inactiveSpecialAbilities, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
			else if (category === ADVANTAGES) {
				if (item.active === true) {
					return {
						...obj,
						otherActiveAdvantages: [...obj.otherActiveAdvantages, indexSpecial ? { ...item, value: indexSpecial } : item]
					};
				}
				return {
					...obj,
					inactiveAdvantages: [...obj.inactiveAdvantages, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
			else if (category === DISADVANTAGES) {
				if (item.active === true) {
					return {
						...obj,
						activeDisadvantages: [...obj.activeDisadvantages, indexSpecial ? { ...item, value: indexSpecial } : item]
					};
				}
				return {
					...obj,
					inactiveDisadvantages: [...obj.inactiveDisadvantages, indexSpecial ? { ...item, value: indexSpecial } : item]
				};
			}
		}
		return obj;
	}, {
		rcp: false,
		casterBlessedOne: [],
		traditions: [],
		attributes: [],
		skills: [],
		activeSkills: [],
		otherActiveSpecialAbilities: [],
		inactiveSpecialAbilities: [],
		otherActiveAdvantages: [],
		inactiveAdvantages: [],
		activeDisadvantages: [],
		inactiveDisadvantages: [],
	});
}
