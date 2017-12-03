import classNames = require('classnames');
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { ADVANTAGES, ATTRIBUTES, DISADVANTAGES, LITURGIES, SPECIAL_ABILITIES, SPELLS } from '../../constants/Categories';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { get } from '../../selectors/dependentInstancesSelectors';
import { ActivatableBasePrerequisites, ActivatableInstance, AttributeInstance, Book, SecondaryAttribute, SpecialAbilityInstance } from '../../types/data.d';
import { RaceRequirement, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute } from '../../types/requirements';
import { UIMessages } from '../../types/view.d';
import { getNameCost } from '../../utils/ActivatableUtils';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getCategoryById } from '../../utils/IDUtils';
import { getRoman } from '../../utils/NumberUtils';
import { isRaceRequirement, isRequiringActivatable, isRequiringIncreasable, isRequiringPrimaryAttribute } from '../../utils/RequirementUtils';

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
		costText += `${_translate(locale, 'info.tier')} ${cost.map((_, i) => getRoman(i, true)).join('/')}: ${cost.join('/')} ${_translate(locale, 'aptext')}`;
	}
	else {
		costText += `${cost} ${_translate(locale, 'aptext')}`;

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
						<p>
							<span>{_translate(locale, 'info.volume')}</span>
							<span>{currentObject.volume}</span>
						</p>
						{currentObject.aeCost && <p>
							<span>{_translate(locale, 'info.aecost')}</span>
							<span>{currentObject.aeCost}</span>
						</p>}
						{currentObject.aeCost === undefined && currentObject.bindingCost === undefined && <p>
							<span>{_translate(locale, 'info.aecost')}</span>
							<span>{_translate(locale, 'info.none')}</span>
						</p>}
						{currentObject.bindingCost && <p>
							<span>{_translate(locale, 'info.bindingcost')}</span>
							<span>{currentObject.bindingCost}</span>
						</p>}
						{currentObject.property && <p>
							<span>{_translate(locale, 'info.property')}</span>
							<span>{typeof currentObject.property === 'number' ? _translate(locale, 'spells.view.properties')[currentObject.property - 1] : currentObject.property}</span>
						</p>}
						<Markdown source={costText} />
						<p className="source">
							<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
						</p>
					</div>
				</Scroll>;

			case 23:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
						{currentObject.aspect && <p>
							<span>{_translate(locale, 'info.aspect')}</span>
							<span>{typeof currentObject.aspect === 'number' ? _translate(locale, 'liturgies.view.aspects')[currentObject.aspect - 1] : currentObject.aspect}</span>
						</p>}
						<Markdown source={costText} />
						<p className="source">
							<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
						</p>
					</div>
				</Scroll>;

			case 8:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						<p>
							<span>{_translate(locale, 'info.aecost')}</span>
							<span>{currentObject.aeCost}</span>
						</p>
						<p>
							<span>{_translate(locale, 'info.protectivecircle')}</span>
							<span>{currentObject.protectiveCircle}</span>
						</p>
						<p>
							<span>{_translate(locale, 'info.wardingcircle')}</span>
							<span>{currentObject.wardingCircle}</span>
						</p>
						<Markdown source={costText} />
						<p className="source">
							<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
						</p>
					</div>
				</Scroll>;

			default:
				return <Scroll>
					<div className="info specialability-info">
						{headerElement}
						{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
						{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
						{currentObject.extended && <Markdown source={`**${_translate(locale, 'info.extendedcombatspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
						{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
						{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
						{currentObject.aeCost && <p>
							<span>{_translate(locale, 'info.aecost')}</span>
							<span>{currentObject.aeCost}</span>
						</p>}
						<p>
							<span>{_translate(locale, 'info.prerequisites')}</span>
							<span>{getPrerequisitesText(currentObject, dependent, locale)}</span>
						</p>
						<Markdown source={costText} />
						<p className="source">
							<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
						</p>
					</div>
				</Scroll>;
		}
	}

	const headerElement = (
		<div className="specialability-header info-header">
			<p className="title">{currentObject.name}{typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}{(Array.isArray(currentObject.reqs) ? currentObject.reqs.includes('RCP') : (currentObject.reqs.has(1) && currentObject.reqs.get(1)!.includes('RCP'))) ? ' (*)' : ''}</p>
		</div>
	);

	return <Scroll>
		<div className="info specialability-info">
			{headerElement}
			{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
			{currentObject.range && <p>
				<span>{_translate(locale, 'info.range')}</span>
				<span>{currentObject.range}</span>
			</p>}
			{currentObject.actions && <p>
				<span>{_translate(locale, 'info.actions')}</span>
				<span>{currentObject.actions}</span>
			</p>}
			<Markdown source={costText} />
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}

export function getPrerequisitesText(entry: ActivatableInstance, dependent: DependentInstancesState, locale: UIMessages): JSX.Element {
  if (typeof entry.prerequisitesText === 'string') {
		return <React.Fragment>
			{entry.prerequisitesText}
		</React.Fragment>;
  }

  if (!Array.isArray(entry.reqs)) {
		const tiersArr = [...entry.reqs];
		return <React.Fragment>
			{!entry.reqs.has(1) && `${_translate(locale, 'tier')} I: ${_translate(locale, 'info.none')}; `}
			{tiersArr.map((e, i) => {
				if (i < tiersArr.length - 1) {
					return <React.Fragment key={e[0]}>
						{`${_translate(locale, 'tier')} ${getRoman(e[0])}: `}
						<Prerequisites list={e[1]} entry={entry} dependent={dependent} locale={locale} />
						{'; '}
					</React.Fragment>;
				}
				return <React.Fragment key={e[0]}>
						{`${_translate(locale, 'tier')} ${getRoman(e[0])}: `}
					<Prerequisites list={e[1]} entry={entry} dependent={dependent} locale={locale} />
				</React.Fragment>;
			})}
		</React.Fragment>;
	}

	return <Prerequisites list={entry.reqs} entry={entry} dependent={dependent} locale={locale} />;
}

export interface PrerequisitesProps {
	list: ActivatableBasePrerequisites;
	entry: ActivatableInstance;
	locale: UIMessages;
	dependent: DependentInstancesState;
}

export function Prerequisites(props: PrerequisitesProps) {
	const { list, entry, locale, dependent } = props;

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
	} = getCategorizedItems(list);

	return <React.Fragment>
		{rcp && getPrerequisitesRCPText(entry, locale)}
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
	</React.Fragment>;
}

export function getPrerequisitesRCPText(entry: ActivatableInstance, locale: UIMessages): string {
  return _translate(locale, 'requiresrcp', entry.name, entry.category === ADVANTAGES ? _translate(locale, 'advantage') : _translate(locale, 'disadvantage'));
}

export function getPrerequisitesAttributesText(list: RequiresIncreasableObject[], attributes: Map<string, AttributeInstance>, locale: UIMessages): string[] {
	return list.map(e => {
		const { id, value } = e;
		return `${Array.isArray(id) ? id.map(a => attributes.get(a)!.short).join(_translate(locale, 'info.or')) : attributes.get(id)!.short} ${value}`;
	});
}

export function getPrerequisitesPrimaryAttributeText(primaryAttribute: RequiresPrimaryAttribute, locale: UIMessages): string {
	return `${_translate(locale, 'primaryattributeofthetradition')} ${primaryAttribute.value}`;
}

export function getPrerequisitesSkillsText(list: RequiresIncreasableObject[], dependent: DependentInstancesState, locale: UIMessages): string[] {
	return sortStrings(list.map(e => {
		const { id, value } = e;
		return `${Array.isArray(id) ? id.map(a => get(dependent, a)!.name).join(_translate(locale, 'info.or')) : get(dependent, id)!.name} ${value}`;
	}), locale.id);
}

export function getPrerequisitesActivatedSkillsText(list: RequiresActivatableObject[], dependent: DependentInstancesState, locale: UIMessages): string[] {
	return sortStrings(list.map(e => {
		const { id } = e;
		return `${_translate(locale, 'info.or')} ${get(dependent, id as string)!.name}`;
	}), locale.id);
}

export function getPrerequisitesActivatablesText(list: RequiresActivatableObject[], dependent: DependentInstancesState, locale: UIMessages): React.ReactFragment[] {
	return sortObjects(list.map(e => {
		const { id, active, sid, sid2, tier } = e;
		return {
			name: `${Array.isArray(id) ? id.map(a => {
				return getNameCost({ id: a, sid: sid as string | number | undefined, sid2, tier, index: 0 }, dependent, true, locale).combinedName;
			}).join(_translate(locale, 'info.or')) : Array.isArray(sid) ? sid.map(a => {
				return getNameCost({ id, sid: a, sid2, tier, index: 0 }, dependent, true, locale).combinedName;
			}).join(_translate(locale, 'info.or')) : getNameCost({ id, sid, sid2, tier, index: 0 }, dependent, true, locale).combinedName}`,
			active
		};
	}), locale.id).map(e => {
		return <span key={e.name} className={classNames(!e.active && 'disabled')}>{e.name}</span>;
	});
}

interface CategorizedItems {
	rcp: boolean;
	casterBlessedOne: RequiresActivatableObject[];
	traditions: RequiresActivatableObject[];
	attributes: RequiresIncreasableObject[];
	primaryAttribute?: RequiresPrimaryAttribute;
	skills: RequiresIncreasableObject[];
	activeSkills: RequiresActivatableObject[];
	otherActiveSpecialAbilities: RequiresActivatableObject[];
	inactiveSpecialAbilities: RequiresActivatableObject[];
	otherActiveAdvantages: RequiresActivatableObject[];
	inactiveAdvantages: RequiresActivatableObject[];
	activeDisadvantages: RequiresActivatableObject[];
	inactiveDisadvantages: RequiresActivatableObject[];
	race?: RaceRequirement;
}

export function getCategorizedItems(list: ActivatableBasePrerequisites) {
	return list.reduce<CategorizedItems>((obj, item) => {
		if (item === 'RCP') {
			return {
				...obj,
				rcp: true
			};
		}
		else if (isRaceRequirement(item)) {
			return {
				...obj,
				race: item
			};
		}
		else if (isRequiringPrimaryAttribute(item)) {
			return {
				...obj,
				primaryAttribute: item
			};
		}
		else if (isRequiringIncreasable(item)) {
			const category = Array.isArray(item.id) ? getCategoryById(item.id[0]) : getCategoryById(item.id);
			if (category === ATTRIBUTES) {
				return {
					...obj,
					attributes: [...obj.attributes, item]
				};
			}
			return {
				...obj,
				skills: [...obj.skills, item]
			};
		}
		else if (isRequiringActivatable(item)) {
			const category = Array.isArray(item.id) ? getCategoryById(item.id[0]) : getCategoryById(item.id);
			if (category === LITURGIES || category === SPELLS) {
				return {
					...obj,
					activeSkills: [...obj.activeSkills, item]
				};
			}
			else if (Array.isArray(item.id) ? item.id.includes('ADV_12') || item.id.includes('ADV_50') : ['ADV_12', 'ADV_50'].includes(item.id)) {
				return {
					...obj,
					casterBlessedOne: [...obj.casterBlessedOne, item]
				};
			}
			else if (Array.isArray(item.id) ? item.id.includes('SA_78') || item.id.includes('SA_86') : ['SA_78', 'SA_86'].includes(item.id)) {
				return {
					...obj,
					traditions: [...obj.traditions, item]
				};
			}
			else if (category === SPECIAL_ABILITIES && item.active === true) {
				if (item.active === true) {
					return {
						...obj,
						otherActiveSpecialAbilities: [...obj.otherActiveSpecialAbilities, item]
					};
				}
				return {
					...obj,
					inactiveSpecialAbilities: [...obj.inactiveSpecialAbilities, item]
				};
			}
			else if (category === ADVANTAGES && item.active === true) {
				if (item.active === true) {
					return {
						...obj,
						otherActiveAdvantages: [...obj.otherActiveAdvantages, item]
					};
				}
				return {
					...obj,
					inactiveAdvantages: [...obj.inactiveAdvantages, item]
				};
			}
			else if (category === DISADVANTAGES && item.active === true) {
				if (item.active === true) {
					return {
						...obj,
						activeDisadvantages: [...obj.activeDisadvantages, item]
					};
				}
				return {
					...obj,
					inactiveDisadvantages: [...obj.inactiveDisadvantages, item]
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
