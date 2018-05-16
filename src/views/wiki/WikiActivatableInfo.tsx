import classNames = require('classnames');
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Categories } from '../../constants/Categories';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { WikiState } from '../../reducers/wikiReducer';
import { ActivatableBasePrerequisites, ActivatableInstance, ActiveObject, SecondaryAttribute } from '../../types/data.d';
import { RaceRequirement, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute } from '../../types/reusable';
import { UIMessages } from '../../types/view.d';
import { Attribute, Book, Race, SpecialAbility } from '../../types/wiki';
import { getNameCostForWiki, isExtendedSpecialAbility } from '../../utils/ActivatableUtils';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { getCategoryById } from '../../utils/IDUtils';
import { getRoman } from '../../utils/NumberUtils';
import { isRaceRequirement, isRequiringActivatable, isRequiringIncreasable, isRequiringPrimaryAttribute } from '../../utils/RequirementUtils';
import { getWikiEntry } from '../../utils/WikiUtils';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiActivatableInfoProps {
  attributes: Map<string, Attribute>;
  books: Map<string, Book>;
  derivedCharacteristics: Map<string, SecondaryAttribute>;
  dependent: DependentInstancesState;
  wiki: WikiState;
  currentObject: ActivatableInstance;
  locale: UIMessages;
  specialAbilities: Map<string, SpecialAbility>;
}

export function WikiActivatableInfo(props: WikiActivatableInfoProps) {
  const { currentObject, locale, specialAbilities, wiki } = props;
  const { apValue, apValueAppend, cost, tiers } = currentObject;

  let costText = `**${translate(locale, 'info.apvalue')}:** `;

  if (apValue) {
    costText += apValue;
  }
  else if (Array.isArray(cost)) {
    const iteratedCost = currentObject.category === Categories.DISADVANTAGES ? cost.map(e => -e) : cost;
    costText += `${translate(locale, 'info.tier')} ${iteratedCost.map((_, i) => getRoman(i, true)).join('/')}: ${iteratedCost.join('/')} ${translate(locale, 'aptext')}`;
  }
  else {
    costText += `${currentObject.category === Categories.DISADVANTAGES && typeof cost === 'number' ? -cost : cost} ${translate(locale, 'aptext')}`;

    if (typeof tiers === 'number') {
      costText += ` ${translate(locale, 'info.pertier')}`;
    }
  }
  if (apValueAppend) {
    costText += ` ${apValueAppend}`;
  }

  if (currentObject.category === Categories.SPECIAL_ABILITIES) {
    const headerName = `${currentObject.nameInWiki || currentObject.name}${typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}`;
    const headerSubName = currentObject.subgr && (
      <p className="title">
        {translate(locale, 'info.specialabilities.subgroups')[currentObject.subgr - 1]}
      </p>
    );

    if (['nl-BE'].includes(locale.id)) {
      return (
        <WikiBoxTemplate
          className="specialability"
          title={headerName}
          subtitle={headerSubName}
          />
      );
    }

    switch (currentObject.gr) {
      case 5:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.effect && <Markdown source={`**${translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
            {currentObject.volume && <WikiProperty locale={locale} title="info.volume">
              {currentObject.volume}
            </WikiProperty>}
            {currentObject.aeCost && <WikiProperty locale={locale} title="info.aecost">
              {currentObject.aeCost}
            </WikiProperty>}
            {currentObject.aeCost === undefined && currentObject.bindingCost === undefined && <WikiProperty locale={locale} title="info.aecost">
              {translate(locale, 'info.none')}
            </WikiProperty>}
            {currentObject.bindingCost && <WikiProperty locale={locale} title="info.bindingcost">
              {currentObject.bindingCost}
            </WikiProperty>}
            {currentObject.property && <WikiProperty locale={locale} title="info.property">
              {typeof currentObject.property === 'number' ? translate(locale, 'spells.view.properties')[currentObject.property - 1] : currentObject.property}
            </WikiProperty>}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 23:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.effect && <Markdown source={`**${translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
            {currentObject.aspect && <WikiProperty locale={locale} title="info.aspect">
              {typeof currentObject.aspect === 'number' ? translate(locale, 'liturgies.view.aspects')[currentObject.aspect - 1] : currentObject.aspect}
            </WikiProperty>}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 8:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
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
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 28:
      case 29:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            <Markdown source={`${currentObject.rules}`} />
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 9:
      case 10:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.rules && <Markdown source={`**${translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(locale, 'info.extendedcombatspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 13:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.rules && <Markdown source={`**${translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(locale, 'info.extendedmagicalspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );

      case 25: {
        const SA_639 = specialAbilities.get('SA_639');

        const additionalExtended = SA_639 && SA_639.select && SA_639.select.reduce<ActiveObject[]>((arr, selectionObject) => {
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

        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.rules && <Markdown source={`**${translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(locale, 'info.extendedblessedtspecialabilities')}:** ${sortStrings([
              ...currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : '...'),
              ...(additionalExtended ? additionalExtended.map(e => getNameCostForWiki({ id: 'SA_639', index: 0, ...e }, wiki, locale).combinedName) : [])
            ], locale.id).join(', ')}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );
      }

      default:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={headerName}
            subtitle={headerSubName}
            >
            {currentObject.rules && <Markdown source={`**${translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
            {currentObject.effect && <Markdown source={`**${translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
            {currentObject.aeCost && <WikiProperty locale={locale} title="info.aecost">
              {currentObject.aeCost}
            </WikiProperty>}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            <WikiSource {...props} />
          </WikiBoxTemplate>
        );
    }
  }

  const headerName = `${currentObject.name}${typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}${(Array.isArray(currentObject.reqs) ? currentObject.reqs.includes('RCP') : (currentObject.reqs.has(1) && currentObject.reqs.get(1)!.includes('RCP'))) ? ' (*)' : ''}`;

  if (['en-US', 'nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="race" title={headerName} />
    );
  }

  return (
    <WikiBoxTemplate className="disadv" title={headerName}>
      {currentObject.rules && <Markdown source={`**${translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
      {currentObject.range && <WikiProperty locale={locale} title="info.range">
        {currentObject.range}
      </WikiProperty>}
      {currentObject.actions && <WikiProperty locale={locale} title="info.actions">
        {currentObject.actions}
      </WikiProperty>}
      <PrerequisitesText {...props} entry={currentObject} />
      <Markdown source={costText} />
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}

export interface PrerequisitesTextProps {
  entry: ActivatableInstance;
  dependent: DependentInstancesState;
  locale: UIMessages;
  wiki: WikiState;
}

export function PrerequisitesText(props: PrerequisitesTextProps): JSX.Element {
  const { entry, locale } = props;

  if (typeof entry.prerequisitesText === 'string') {
    return <Markdown source={`**${translate(locale, 'info.prerequisites')}:** ${entry.prerequisitesText}`} />;
  }

  const { prerequisitesTextEnd, prerequisitesTextStart, tiers = 1, reqs } = entry;

  if (!Array.isArray(reqs)) {
    const tiersArr = Array.from({ length: tiers }, (_, index) => index + 1);
    return <p>
      <span>{translate(locale, 'info.prerequisites')}</span>
      <span>
        {prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
        {!reqs.has(1) && `${translate(locale, 'tier')} I: ${translate(locale, 'info.none')}; `}
        {tiersArr.map(e => {
          return <span key={e} className="tier">
            {`${translate(locale, 'tier')} ${getRoman(e)}: `}
            {reqs.has(e) && <Prerequisites {...props} list={reqs.get(e)!} prerequisitesTextIndex={entry.prerequisitesTextIndex} />}
            {e > 1 && <span>{entry.name} {getRoman(e - 1)}</span>}
          </span>;
        })}
        {prerequisitesTextEnd && <Markdown source={prerequisitesTextEnd} oneLine="span" />}
      </span>
    </p>;
  }

  return <p>
    <span>{translate(locale, 'info.prerequisites')}</span>
    <span>
      {prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
      <Prerequisites {...props} list={reqs} prerequisitesTextIndex={entry.prerequisitesTextIndex} />
      {prerequisitesTextEnd && (/^(?:;|,|\.)/.test(prerequisitesTextEnd) ? <Markdown source={prerequisitesTextEnd} oneLine="fragment" /> : <Markdown source={prerequisitesTextEnd} oneLine="span" />)}
    </span>
  </p>;
}

export interface PrerequisitesProps {
  list: ActivatableBasePrerequisites;
  entry: ActivatableInstance;
  locale: UIMessages;
  prerequisitesTextIndex: Map<number, string | false>;
  wiki: WikiState;
}

export function Prerequisites(props: PrerequisitesProps) {
  const { list, entry, locale, prerequisitesTextIndex, wiki } = props;

  if (list.length === 0 && !isExtendedSpecialAbility(entry)) {
    return <React.Fragment>
      {translate(locale, 'info.none')}
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
    {getPrerequisitesActivatablesText(casterBlessedOne, wiki, locale)}
    {getPrerequisitesActivatablesText(traditions, wiki, locale)}
    {getPrerequisitesAttributesText(attributes, wiki.attributes, locale)}
    {primaryAttribute && getPrerequisitesPrimaryAttributeText(primaryAttribute, locale)}
    {getPrerequisitesSkillsText(skills, wiki, locale)}
    {getPrerequisitesActivatedSkillsText(activeSkills, wiki, locale)}
    {getPrerequisitesActivatablesText(otherActiveSpecialAbilities, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveSpecialAbilities, wiki, locale)}
    {getPrerequisitesActivatablesText(otherActiveAdvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveAdvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(activeDisadvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveDisadvantages, wiki, locale)}
    {race && getPrerequisitesRaceText(race, wiki.races, locale)}
    {entry.category === Categories.SPECIAL_ABILITIES ? (entry.gr === 11 ? <span>{translate(locale, 'appropriatecombatstylespecialability')}</span> : entry.gr === 14 ? <span>{translate(locale, 'appropriatemagicalstylespecialability')}</span> : entry.gr === 26 ? <span>{translate(locale, 'appropriateblessedstylespecialability')}</span> : '') : ''}
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
    {typeof options === 'string' ? options : translate(locale, 'requiresrcp', entry.name, entry.category === Categories.ADVANTAGES ? translate(locale, 'advantage') : translate(locale, 'disadvantage'))}
  </span>;
}

export function getPrerequisitesAttributesText(list: IncreasablePrerequisiteObjects[], attributes: Map<string, Attribute>, locale: UIMessages): JSX.Element {
  return list.length > 0 ? <span>
    {list.map(e => {
      if (typeof e === 'string') {
        return e;
      }
      const { id, value } = e;
      return `${Array.isArray(id) ? id.map(a => attributes.get(a)!.short).join(translate(locale, 'info.or')) : attributes.get(id)!.short} ${value}`;
    }).join(', ')}
  </span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesPrimaryAttributeText(primaryAttribute: PrimaryAttributePrerequisiteObjects, locale: UIMessages): JSX.Element {
  return <span>
    {typeof primaryAttribute === 'string' ? primaryAttribute : `${translate(locale, 'primaryattributeofthetradition')} ${primaryAttribute.value}`}
  </span>;
}

export function getPrerequisitesSkillsText(list: IncreasablePrerequisiteObjects[], wiki: WikiState, locale: UIMessages): JSX.Element {
  return list.length > 0 ? <span>
    {sortStrings(list.map(e => {
      if (typeof e === 'string') {
        return e;
      }
      const { id, value } = e;
      return `${Array.isArray(id) ? id.map(a => getWikiEntry(wiki, a)!.name).join(translate(locale, 'info.or')) : getWikiEntry(wiki, id)!.name} ${value}`;
    }), locale.id).join(', ')}
  </span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesActivatedSkillsText(list: ActivatablePrerequisiteObjects[], wiki: WikiState, locale: UIMessages): JSX.Element {
  return list.length > 0 ? <span>
  {sortStrings(list.map(e => {
    if (isActivatableStringObject(e)) {
      return e.value;
    }
    const { id } = e;
    if (Array.isArray(id)) {
      const category = getCategoryById(id[0]);
      return `${category === Categories.LITURGIES ? translate(locale, 'knowledgeofliturgicalchant') : translate(locale, 'knowledgeofspell')} ${id.map(e => getWikiEntry(wiki, e)!.name).join(translate(locale, 'info.or'))}`;
    }
    const category = getCategoryById(id);
    return `${category === Categories.LITURGIES ? translate(locale, 'knowledgeofliturgicalchant') : translate(locale, 'knowledgeofspell')} ${getWikiEntry(wiki, id)!.name}`;
  }), locale.id).join(', ')}
  </span> : <React.Fragment></React.Fragment>;
}

export function getPrerequisitesActivatablesText(list: ActivatablePrerequisiteObjects[], wiki: WikiState, locale: UIMessages): React.ReactFragment[] {
  return sortObjects(list.map(e => {
    if (isActivatableStringObject(e)) {
      const { id, active, value } = e;
      const category = getCategoryById(id);
      return {
        name: `${category === Categories.ADVANTAGES ? `${translate(locale, 'advantage')} ` : category === Categories.DISADVANTAGES ? `${translate(locale, 'disadvantage')} ` : ''}${value}`,
        active,
        id
      };
    }
    const { id, active, sid, sid2, tier } = e;
    return {
      name: Array.isArray(id) ? id.filter(a => typeof getWikiEntry(wiki, a) === 'object').map(a => {
        const category = getCategoryById(a);
        return `${category === Categories.ADVANTAGES ? `${translate(locale, 'advantage')} ` : category === Categories.DISADVANTAGES ? `${translate(locale, 'disadvantage')} ` : ''}${getNameCostForWiki({ id: a, sid: sid as string | number | undefined, sid2, tier, index: 0 }, wiki, locale).combinedName}`;
      }).join(translate(locale, 'info.or')) : typeof getWikiEntry(wiki, id) === 'object' ? (Array.isArray(sid) ? sid.map(a => {
        const category = getCategoryById(id);
        return `${category === Categories.ADVANTAGES ? `${translate(locale, 'advantage')} ` : category === Categories.DISADVANTAGES ? `${translate(locale, 'disadvantage')} ` : ''}${getNameCostForWiki({ id, sid: a, sid2, tier, index: 0 }, wiki, locale).combinedName}`;
      }).join(translate(locale, 'info.or')) : `${getCategoryById(id) === Categories.ADVANTAGES ? `${translate(locale, 'advantage')} ` : getCategoryById(id) === Categories.DISADVANTAGES ? `${translate(locale, 'disadvantage')} ` : ''}${getNameCostForWiki({ id, sid, sid2, tier, index: 0 }, wiki, locale).combinedName}`) : undefined,
      active,
      id
    };
  }), locale.id).map(e => {
    return <span key={e.name || typeof e.id === 'string' ? e.id as string : ''}>
      <span className={classNames(!e.active && 'disabled')}>{e.name}</span>
    </span>;
  });
}

export function getPrerequisitesRaceText(race: RacePrerequisiteObjects, races: Map<string, Race>, locale: UIMessages): JSX.Element {
  return <span>
    {typeof race === 'string' ? race : `${translate(locale, 'race')} ${Array.isArray(race.value) ? race.value.filter(e => races.has(`R_${e}`)).map(e => races.get(`R_${e}`)!.name).join(translate(locale, 'info.or')) : races.has(`R_${race.value}`) && races.get(`R_${race.value}`)!.name}`}
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
      if (category === Categories.ATTRIBUTES) {
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
      if (category === Categories.LITURGIES || category === Categories.SPELLS) {
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
      else if (category === Categories.SPECIAL_ABILITIES) {
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
      else if (category === Categories.ADVANTAGES) {
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
      else if (category === Categories.DISADVANTAGES) {
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
