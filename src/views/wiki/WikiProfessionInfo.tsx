import { difference } from 'lodash';
import * as React from 'react';
import { Categories } from '../../constants/Categories';
import { CantripsSelection, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, RaceRequirement, SexRequirement, SkillsSelection, SpecialisationSelection } from '../../types/data.d';
import { Increasable, IncreasableId, Profession, ProfessionVariant, UIMessages, NameBySex } from '../../types/view.d';
import { Attribute, Book, Cantrip, LiturgicalChant, Race, Skill, SpecialAbility, Spell, TerrainKnowledgeSelection, ProfessionSelections, Blessing, SpecializationSelection, RemoveSpecializationSelection, RemoveCombatTechniquesSelection } from '../../types/wiki';
import { getSelectOptionName } from '../../utils/ActivatableUtils';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isRaceRequirement, isRequiringIncreasable, isSexRequirement } from '../../utils/RequirementUtils';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';
import { getNumericId } from '../../utils/IDUtils';
import { UIKey } from '../../types/ui';
import { isRemoveSpecializationSelection, isRemoveCombatTechniquesSelection } from '../../utils/WikiUtils';

export interface WikiProfessionInfoProps {
  attributes: Map<string, Attribute>;
  blessings: Map<string, Blessing>;
  books: Map<string, Book>;
  cantrips: Map<string, Cantrip>;
  currentObject: Profession;
  liturgicalChants: Map<string, LiturgicalChant>;
  locale: UIMessages;
  sex: 'm' | 'f' | undefined;
  races: Map<string, Race>;
  skills: Map<string, Skill>;
  spells: Map<string, Spell>;
  specialAbilities: Map<string, SpecialAbility>;
}

export function WikiProfessionInfo(props: WikiProfessionInfoProps) {
  const {
    attributes,
    blessings,
    cantrips,
    currentObject,
    liturgicalChants,
    locale,
    races,
    sex = 'm',
    skills,
    spells,
    specialAbilities,
  } = props;

  const {
    selections
  } = currentObject;

  let { name, subname } = currentObject;

  name = getName(name, sex);
  subname = getName(subname, sex);

  const specializationSelectionString = getSpecializationSelection(selections, skills, locale);
  const skillsSelectionJoinedObject = getSkillSelection(selections, locale);
  const cursesSelection = selections.find(e => e.id === 'CURSES') as CursesSelection | undefined;
  const languagesLiteracySelection = selections.find(e => e.id === 'LANGUAGES_SCRIPTS') as LanguagesScriptsSelection | undefined;
  const combatTechniquesSelectionString = getCombatTechniquesSelection(selections, locale);
  const terrainKnowledgeSelectionString = getTerrainKnowledgeSelection(selections, specialAbilities, locale);

  const spellsString = getSpells(currentObject, selections, spells, cantrips, locale);
  const liturgicalChantsString = getLiturgicalChants(currentObject, liturgicalChants, blessings, locale);

  const raceRequirement = currentObject.dependencies.find(e => isRaceRequirement(e)) as RaceRequirement | undefined;
  const sexRequirement = currentObject.dependencies.find(e => isSexRequirement(e)) as SexRequirement | undefined;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="profession" title={subname ? `${name} (${subname})` : name}>
        <WikiProperty locale={locale} title="info.apvalue">
          {currentObject.ap} {_translate(locale, 'aptext')}
        </WikiProperty>
        <CombatTechniques
          combatTechniquesSelectionString={combatTechniquesSelectionString}
          currentObject={currentObject}
          locale={locale}
          />
        <WikiProperty locale={locale} title="info.skills" />
        <SkillsList
          profession={currentObject}
          locale={locale}
          skillsSelection={skillsSelectionJoinedObject}
          />
        {typeof spellsString === 'string' ? (
          <WikiProperty locale={locale} title="info.spells">
            {spellsString}
          </WikiProperty>
        ) : null}
        {typeof liturgicalChantsString === 'string' ? (
          <WikiProperty locale={locale} title="info.liturgicalchants">
            {liturgicalChantsString}
          </WikiProperty>
        ) : null}
        <VariantList
          {...props}
          combatTechniquesSelectionString={combatTechniquesSelectionString}
          profession={currentObject}
          specializationSelectionString={specializationSelectionString}
          />
      </WikiBoxTemplate>
    );
  }

  const getRaceNameAP = (race: Race) => `${race.name} (${race.ap} ${_translate(locale, 'apshort')})`;

  const prerequisites = [
    ...(raceRequirement ? [`${_translate(locale, 'race')}: ${Array.isArray(raceRequirement.value) ? raceRequirement.value.map(e => getRaceNameAP(races.get(`R_${e}`)!)).join(_translate(locale, 'info.or')) : getRaceNameAP(races.get(`R_${raceRequirement.value}`)!)}`] : []),
    ...(currentObject.prerequisitesStart ? [currentObject.prerequisitesStart] : []),
    ...sortStrings(currentObject.prerequisites.map(e => {
      if (isRequiringIncreasable(e)) {
        const instance = attributes.get(e.id) || skills.get(e.id);
        let name;
        if (instance && instance.category === Categories.ATTRIBUTES) {
          name = instance.short;
        }
        else if (instance) {
          name = instance.name;
        }
        return `${name} ${e.value}`;
      }
      return `${e.combinedName} (${e.currentCost} ${_translate(locale, 'apshort')})`;
    }), locale.id),
    ...(currentObject.prerequisitesEnd ? [currentObject.prerequisitesEnd] : []),
  ];

  return (
    <WikiBoxTemplate className="profession" title={subname ? `${name} (${subname})` : name}>
      <WikiProperty locale={locale} title="info.apvalue">
        {currentObject.ap} {_translate(locale, 'aptext')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.prerequisites">
        {prerequisites.length > 0 ? prerequisites.join(', ') : _translate(locale, 'info.none')}
        {sexRequirement && `${prerequisites.length > 0 ? '; ' : ''}${_translate(locale, 'charactersheet.main.sex')}: ${sexRequirement.value === 'm' ? _translate(locale, 'herocreation.options.selectsex.male') : _translate(locale, 'herocreation.options.selectsex.female')}`}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.specialabilities">
        {[
          ...(languagesLiteracySelection ? [_translate(locale, 'info.specialabilitieslanguagesandliteracy', languagesLiteracySelection.value)] : []),
          ...(typeof specializationSelectionString === 'string' ? [specializationSelectionString] : []),
          ...(typeof terrainKnowledgeSelectionString === 'string' ? [terrainKnowledgeSelectionString] : []),
          ...(cursesSelection ? [_translate(locale, 'info.specialabilitiescurses', cursesSelection.value)] : []),
          ...sortStrings(currentObject.specialAbilities.map(e => e.combinedName), locale.id)
        ].join(', ') || _translate(locale, 'info.none')}
      </WikiProperty>
      <CombatTechniques
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        currentObject={currentObject}
        locale={locale}
        />
      <WikiProperty locale={locale} title="info.skills" />
      <SkillsList
        profession={currentObject}
        locale={locale}
        skillsSelection={skillsSelectionJoinedObject}
        />
      {typeof spellsString === 'string' ? (
        <WikiProperty locale={locale} title="info.spells">
          {spellsString}
        </WikiProperty>
      ) : null}
      {typeof liturgicalChantsString === 'string' ? (
        <WikiProperty locale={locale} title="info.liturgicalchants">
          {liturgicalChantsString}
        </WikiProperty>
      ) : null}
      <WikiProperty locale={locale} title="info.suggestedadvantages">
        {currentObject.suggestedAdvantagesText || _translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.suggesteddisadvantages">
        {currentObject.suggestedDisadvantagesText || _translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.unsuitableadvantages">
        {currentObject.unsuitableAdvantagesText || _translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.unsuitabledisadvantages">
        {currentObject.unsuitableDisadvantagesText || _translate(locale, 'info.none')}
      </WikiProperty>
      <VariantList
        {...props}
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        profession={currentObject}
        specializationSelectionString={specializationSelectionString}
        />
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}

function getName(nameProp: string | NameBySex, sex: 'm' | 'f'): string;
function getName(nameProp: string | NameBySex | undefined, sex: 'm' | 'f'): string | undefined;
function getName(nameProp: string | NameBySex | undefined, sex: 'm' | 'f'): string | undefined {
  if (typeof nameProp === 'object') {
    return nameProp[sex];
  }

  return nameProp;
}

function getSpecializationSelection(
  selections: ProfessionSelections,
  skills: Map<string, Skill>,
  locale: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === 'SPECIALISATION';
  }) as SpecialisationSelection | undefined;

  if (selection === undefined) {
    return;
  }

  let value: string;

  if (Array.isArray(selection.sid)) {
    const selectionArr = selection.sid.map(e => skills.get(e)!.name);
    const sortedArr = sortStrings(selectionArr, locale.id);
    const separator = _translate(locale, 'info.specialabilitiesspecializationseparator');
    value = sortedArr.join(separator);
  }
  else {
    value = skills.get(selection.sid)!.name;
  }

  return _translate(locale, 'info.specialabilitiesspecialization', value);
}

interface CombatTechniquesProps {
  combatTechniquesSelectionString: string | undefined;
  currentObject: Profession;
  locale: UIMessages;
}

function CombatTechniques(props: CombatTechniquesProps): JSX.Element {
  const {
    combatTechniquesSelectionString: selectionString,
    currentObject,
    locale,
  } = props;

  const combatTechniquesList = currentObject.combatTechniques.map(e => {
    return `${e.name} ${e.value + 6}`;
  });

  return (
    <WikiProperty locale={locale} title="info.combattechniques">
      {[
        ...sortStrings(combatTechniquesList, locale.id),
        ...(selectionString ? [selectionString] : [])
      ].join(', ') || '-'}
    </WikiProperty>
  );
}

interface SkillsSelectionJoined {
  properties: SkillsSelection;
  text: string;
}

function getSkillSelection(
  selections: ProfessionSelections,
  locale: UIMessages,
): SkillsSelectionJoined | undefined {
  const selection = selections.find(e => {
    return e.id === 'SKILLS';
  }) as SkillsSelection | undefined;

  if (selection === undefined) {
    return;
  }

  const skillGroup = _translate(locale, 'rcpselections.labels.skillgroups')[selection.gr || 0];

  return {
    properties: selection,
    text: _translate(locale, 'info.skillsselection', selection.value, skillGroup)
  };
}

function getCombatTechniquesSelection(
  selections: ProfessionSelections,
  locale: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === 'COMBAT_TECHNIQUES';
  }) as CombatTechniquesSelection | undefined;

  const secondSelection = selections.find(e => {
    return e.id === 'COMBAT_TECHNIQUES_SECOND';
  }) as CombatTechniquesSecondSelection | undefined;

  if (selection === undefined) {
    return;
  }

  const counter: keyof UIMessages = 'info.combattechniquesselectioncounter';
  const firstCounter = _translate(locale, counter)[selection.amount - 1];
  const firstValue = selection.value + 6;
  const entryList = sortStrings(selection.sid, locale.id).join(', ');

  let value: string;

  if (typeof secondSelection === 'object') {
    const mainString: keyof UIMessages = 'info.combattechniquessecondselection';
    const secondCounter = _translate(locale, counter)[secondSelection.amount - 1];
    const secondValue = secondSelection.value + 6;

    const precedingText = _translate(
      locale,
      mainString,
      firstCounter,
      firstValue,
      secondCounter,
      secondValue
    );

    value = `${precedingText}${entryList}`
  }
  else {
    const mainString: keyof UIMessages = 'info.combattechniquesselection';
    const precedingText = _translate(locale, mainString, firstCounter, firstValue);

    value = `${precedingText}${entryList}`;
  }

  return value;
}

function getTerrainKnowledgeSelection(
  selections: ProfessionSelections,
  specialAbilities: Map<string, SpecialAbility>,
  locale: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === 'TERRAIN_KNOWLEDGE';
  }) as TerrainKnowledgeSelection | undefined;

  if (selection === undefined) {
    return;
  }

  const terrainKnowledge = specialAbilities.get('SA_12')!;

  const optionsString = selection.sid.map(sid => {
    return getSelectOptionName(terrainKnowledge, sid)!;
  });

  const last = optionsString.pop();

  const joinedFirst = optionsString.join(', ');
  const joined = `${joinedFirst} ${_translate(locale, 'info.or')} ${last}`;

  return `${terrainKnowledge.name} (${joined})`;
}

function getSpells(
  profession: Profession,
  selections: ProfessionSelections,
  spells: Map<string, Spell>,
  cantrips: Map<string, Cantrip>,
  locale: UIMessages,
): string | undefined {
  const cantripsSelection = selections.find(e => {
    return e.id === 'CANTRIPS';
  }) as CantripsSelection | undefined;

  let cantripsString = '';

  if (typeof cantripsSelection === 'object') {
    const mainMessage: keyof UIMessages = 'info.spellscantrips';

    const counterMessage: keyof UIMessages = 'info.spellscantripscounter';
    const counter = _translate(locale, counterMessage)[cantripsSelection.amount - 1];

    const precedingText = _translate(locale, mainMessage, counter);

    const options = cantripsSelection.sid.map(e => cantrips.get(e)!.name);
    const sortedOptions = sortStrings(options, locale.id);

    cantripsString = `${precedingText}${sortedOptions.join(', ')}, `;
  }

  const spellsArr = profession.spells.map(e => `${spells.get(e.id)!.name} ${e.value}`);
  const sortedSpells = sortStrings(spellsArr, locale.id);

  if (cantripsString.length === 0 || sortedSpells.length === 0) {
    return;
  }

  return `${cantripsString}${sortedSpells.join(', ')}`;
}

function getLiturgicalChants(
  profession: Profession,
  liturgicalChants: Map<string, LiturgicalChant>,
  blessings: Map<string, Blessing>,
  locale: UIMessages,
): string | undefined {
  let blessingsArr = [];

  const blessingsKey: keyof UIMessages = 'info.thetwelveblessings';
  const blessingsMessage = _translate(locale, blessingsKey);
  const exceptionsKey: keyof UIMessages = 'info.thetwelveblessingsexceptions';

  if (profession.blessings.length === 12) {
    blessingsArr.push(blessingsMessage);
  }
  else if (profession.blessings.length === 9) {
    const allBlessings = [...blessings.values()];
    const notIncluded = allBlessings.filter(e => {
      const numericId = getNumericId(e.id);
      return !profession.blessings.includes(e.id) && numericId <= 12;
    });

    const blessingNameArr = notIncluded.map(e => e.name);
    const sortedBlessings = sortStrings(blessingNameArr, locale.id);
    const exceptionsMessage = _translate(locale, exceptionsKey, ...sortedBlessings);

    blessingsArr.push(`${blessingsMessage}${exceptionsMessage}`);
  }

  const liturgicalChantsArr = profession.liturgicalChants.map(e => {
    return `${liturgicalChants.get(e.id)!.name} ${e.value}`;
  });

  const sortedList = sortStrings([
    ...blessingsArr,
    ...liturgicalChantsArr
  ], locale.id);

  return sortedList.length > 0 ? sortedList.join(', ') : undefined;
}

interface CombinedSpell {
  newId: string;
  oldId: string;
  value: number;
}

function isCombinedSpell(obj: IncreasableId | CombinedSpell): obj is CombinedSpell {
  return obj.hasOwnProperty('newId') && obj.hasOwnProperty('oldId') && obj.hasOwnProperty('value');
}

function combineSpells(list: IncreasableId[], allSpells: Map<string, Spell>): (IncreasableId | CombinedSpell)[] {
  const oldList = [...list];
  const combinedSpells: CombinedSpell[] = [];
  const singleSpells: IncreasableId[] = [];

  while (oldList.length > 0) {
    const base = oldList.shift()!;
    const { id, value, previous } = base;
    const baseSpell = allSpells.get(id);

    if (baseSpell) {
      if (typeof previous === 'number') {
        const matchingSpellIndex = oldList.findIndex(e => {
          const matchingSpellInstance = allSpells.get(e.id);
          return e.value === previous && typeof matchingSpellInstance === 'object';
        });
        if (matchingSpellIndex > -1) {
          const matchingSpell = oldList.splice(matchingSpellIndex, 1)[0];
          combinedSpells.push({
            oldId: id,
            newId: matchingSpell.id,
            value: previous
          });
        }
        else {
          singleSpells.push(base);
        }
      }
      else {
        const matchingSpellIndex = oldList.findIndex(e => {
          const matchingSpellInstance = allSpells.get(e.id);
          return e.previous === value && e.value === 0 && typeof matchingSpellInstance === 'object';
        });
        if (matchingSpellIndex > -1) {
          const matchingSpell = oldList.splice(matchingSpellIndex, 1)[0];
          combinedSpells.push({
            oldId: matchingSpell.id,
            newId: id,
            value
          });
        }
        else {
          singleSpells.push(base);
        }
      }
    }
  }

  return [
    ...combinedSpells,
    ...singleSpells
  ];
}

interface SkillsListProps {
  profession: Profession;
  locale: UIMessages;
  skillsSelection: SkillsSelectionJoined | undefined;
}

function SkillsList(props: SkillsListProps): JSX.Element {
  const {
    profession,
    locale,
    skillsSelection,
  } = props;

  const list = [
    profession.physicalSkills,
    profession.socialSkills,
    profession.natureSkills,
    profession.knowledgeSkills,
    profession.craftSkills,
  ];

  return (
    <>
      {
        list.map((list, index) => (
          <Skills
            key={index}
            groupIndex={index}
            list={list}
            locale={locale}
            skillsSelection={skillsSelection}
            />
        ))
      }
    </>
  );
}

interface SkillProps {
  locale: UIMessages;
  groupIndex: number;
  list: Increasable[];
  skillsSelection: SkillsSelectionJoined | undefined;
}

function Skills(props: SkillProps) {
  const {
    groupIndex,
    list,
    locale,
    skillsSelection,
  } = props;

  const skillsArr = list.map(e => `${e.name} ${e.value}`);
  const sortedSkills = sortStrings(skillsArr, locale.id);

  // Needs array to be able to add no element to the list
  const specialTextArr = [];

  if (skillsSelection) {
    const hasGroup = typeof skillsSelection.properties.gr === 'number';
    const isGroupValid = hasGroup && skillsSelection.properties.gr! - 1 === groupIndex;

    if (isGroupValid) {
      specialTextArr.push(skillsSelection.text);
    }
  }

  const joinedText = [...sortedSkills, ...specialTextArr].join(', ');

  return (
    <p className="skill-group">
      <span>{_translate(locale, 'skills.view.groups')[groupIndex]}</span>
      <span>{list.length > 0 ? joinedText : '-'}</span>
    </p>
  );
}

interface VariantListHeaderProps {
  locale: UIMessages;
}

function VariantListHeader(props: VariantListHeaderProps): JSX.Element {
  const {
    locale,
  } = props;

  return (
    <p className="profession-variants">
      <span>{_translate(locale, 'info.variants')}</span>
    </p>
  );
}

interface VariantListProps {
  attributes: Map<string, Attribute>;
  combatTechniquesSelectionString: string | undefined;
  liturgicalChants: Map<string, LiturgicalChant>;
  locale: UIMessages;
  profession: Profession;
  sex: 'm' | 'f' | undefined;
  skills: Map<string, Skill>;
  specializationSelectionString: string | undefined;
  spells: Map<string, Spell>;
}

function VariantList(props: VariantListProps): JSX.Element | null {
  const {
    locale,
    profession
  } = props;

  if (profession.variants.length > 0) {
    return (
      <>
        <VariantListHeader locale={locale} />
        <ul className="profession-variants">
          {
            profession.variants.map(variant => (
              <Variant
                {...props}
                key={variant.id}
                variant={variant}
                />
            ))
          }
        </ul>
      </>
    );
  }

  return null;
}

interface VariantProps {
  attributes: Map<string, Attribute>;
  combatTechniquesSelectionString: string | undefined;
  liturgicalChants: Map<string, LiturgicalChant>;
  locale: UIMessages;
  profession: Profession;
  sex: 'm' | 'f' | undefined;
  skills: Map<string, Skill>;
  specializationSelectionString: string | undefined;
  spells: Map<string, Spell>;
  variant: ProfessionVariant;
}

function Variant(props: VariantProps) {
  const {
    locale,
    profession,
    sex = 'm',
    variant
  } = props;

  const { fullText } = variant;
  let { name } = variant;

  name = getName(name, sex);

  if (fullText) {
    return (
      <li>
        <span>{name}</span>
        <span>({profession.ap + variant.ap} {_translate(locale, 'apshort')})</span>
        <span>{fullText}</span>
      </li>
    );
  }

  return (
    <li>
      <span>{name}</span>
      <span>({profession.ap + variant.ap} {_translate(locale, 'apshort')})</span>
      <span>
        {variant.precedingText && <span>{variant.precedingText}</span>}
        <VariantPrerequisites {...props} />
        <VariantSpecialAbilities {...props} />
        <VariantLanguagesLiteracySelection {...props} selections={profession.selections} />
        <VariantSpecializationSelection {...props} selections={profession.selections} />
        <VariantCombatTechniquesSelection {...props} selections={profession.selections} />
        <VariantSkillsSelection {...props} />
        {variant.concludingText && `; ${variant.concludingText}`}
      </span>
    </li>
  );
}

interface VariantPrerequisitesProps {
  attributes: Map<string, Attribute>;
  locale: UIMessages;
  skills: Map<string, Skill>;
  variant: ProfessionVariant;
}

interface VariantPrerequisiteIntermediate {
  id: string;
  name: string;
  active?: boolean;
}

function VariantPrerequisites(props: VariantPrerequisitesProps): JSX.Element {
  const {
    attributes,
    locale,
    skills,
    variant
  } = props;

  const reducedNameArr = variant.prerequisites.map<VariantPrerequisiteIntermediate>(e => {
    if (isRequiringIncreasable(e)) {
      const instance = attributes.get(e.id) || skills.get(e.id);
      let name;
      if (instance && instance.category === Categories.ATTRIBUTES) {
        name = instance.short;
      }
      else if (instance) {
        name = instance.name;
      }
      return {
        id: e.id,
        name: `${name} ${e.value}`
      };
    }
    return {
      id: e.id,
      name: `${e.combinedName} (${e.currentCost} ${_translate(locale, 'apshort')})`,
      active: e.active
    };
  });

  const sortedReducedNameArray = sortObjects(reducedNameArr, locale.id);

  return (
    <span className="hard-break">
      {`${_translate(locale, 'info.prerequisites')}: `}
      {
        sortedReducedNameArray.map(e => {
          if (e.active === false) {
            return <span key={e.id}>
              <span className="disabled">{e.name}</span>
            </span>;
          }
          return <span key={e.id}>{e.name}</span>;
        })
      }
    </span>
  )
}

interface VariantSpecialAbilitiesProps {
  variant: ProfessionVariant;
}

function VariantSpecialAbilities(props: VariantSpecialAbilitiesProps): JSX.Element {
  return (
    <>
      {props.variant.specialAbilities.map(e => (
        <span key={e.id}>
          <span className={e.active === false ? 'disabled' : undefined}>
            {e.combinedName}
          </span>
        </span>
      ))}
    </>
  );
}

interface VariantLanguagesLiteracySelectionProps {
  locale: UIMessages;
  selections: ProfessionSelections;
  variant: ProfessionVariant;
}

function VariantLanguagesLiteracySelection(props: VariantLanguagesLiteracySelectionProps): JSX.Element | null {
  const {
    locale,
    selections,
    variant: {
      selections: variantSelections
    }
  } = props;

  const selection = selections.find(e => {
    return e.id === 'LANGUAGES_SCRIPTS';
  }) as LanguagesScriptsSelection | undefined;

  const variantSelection = variantSelections.find(e => {
    return e.id === 'LANGUAGES_SCRIPTS';
  }) as LanguagesScriptsSelection | undefined;

  if (typeof variantSelection === 'object') {
    const mainKey: UIKey = 'info.specialabilitieslanguagesandliteracy';
    const mainString = _translate(locale, mainKey, variantSelection.value);

    if (typeof selection === 'object') {
      const insteadKey: UIKey = 'info.variantsinsteadof';
      const insteadString = _translate(locale, insteadKey);

      return (
        <span>
          <span>{mainString} {insteadString} {selection.value}</span>
        </span>
      );
    }
    else {
      return (
        <span>
          <span>{mainString}</span>
        </span>
      )
    }
  }

  return null;
}

interface VariantSpecializationSelectionProps {
  locale: UIMessages;
  selections: ProfessionSelections;
  skills: Map<string, Skill>;
  specializationSelectionString: string | undefined;
  variant: ProfessionVariant;
}

function VariantSpecializationSelection(props: VariantSpecializationSelectionProps): JSX.Element | null {
  const {
    locale,
    selections,
    skills,
    specializationSelectionString,
    variant: {
      selections: variantSelections
    }
  } = props;

  const selection = selections.find(e => {
    return e.id === 'SPECIALISATION';
  }) as SpecializationSelection | undefined;

  const variantSelection = variantSelections.find(e => {
    return e.id === 'SPECIALISATION';
  }) as SpecializationSelection | RemoveSpecializationSelection | undefined;

  if (variantSelection) {
    if (isRemoveSpecializationSelection(variantSelection)) {
      if (variantSelection.active === false) {
        return (
          <span>
            <span className="disabled">{specializationSelectionString}</span>
          </span>
        );
      }
    }
    else {
      const mainKey: UIKey = 'info.specialabilitiesspecialization';
      const separatorKey: UIKey = 'info.specialabilitiesspecializationseparator';

      let skillText;

      if (typeof variantSelection.sid === 'object') {
        const skillList = variantSelection.sid.map(e => skills.get(e)!.name);
        const separator = _translate(locale, separatorKey);
        skillText = sortStrings(skillList, locale.id).join(separator);
      }
      else {
        skillText = skills.get(variantSelection.sid)!.name;
      }

      const mainText = _translate(locale, mainKey, skillText);

      if (selection) {
        const instead = _translate(locale, 'info.variantsinsteadof');
        return (
          <span>
            <span>{mainText} {instead} {specializationSelectionString}</span>
          </span>
        );
      }
      else {
        return (
          <span>
            <span>{mainText}</span>
          </span>
        );
      }
    }
  }

  return null;
}

interface VariantCombatTechniquesSelectionProps {
  combatTechniquesSelectionString: string | undefined;
  locale: UIMessages;
  selections: ProfessionSelections;
  variant: ProfessionVariant;
}

function VariantCombatTechniquesSelection(props: VariantCombatTechniquesSelectionProps): JSX.Element | null {
  const {
    combatTechniquesSelectionString,
    locale,
    selections,
    variant: {
      selections: variantSelections
    }
  } = props;

  const selection = selections.find(e => {
    return e.id === 'COMBAT_TECHNIQUES';
  }) as CombatTechniquesSelection | undefined;

  const variantSelection = variantSelections.find(e => {
    return e.id === 'COMBAT_TECHNIQUES';
  }) as CombatTechniquesSelection | RemoveCombatTechniquesSelection | undefined;

  if (variantSelection) {
    if (isRemoveCombatTechniquesSelection(variantSelection)) {
      if (variantSelection.active === false) {
        return (
          <span>
            <span className="disabled">{combatTechniquesSelectionString}</span>
          </span>
        );
      }
    }
    else {
      if (selection) {
        const hasSameSids = difference(selection.sid, variantSelection.sid).length === 0;
        const hasSameAmount = variantSelection.amount === variantSelection.amount;

        if (hasSameSids && hasSameAmount) {
          const separator = _translate(locale, 'info.or');
          const instead = _translate(locale, 'info.variantsinsteadof');

          const joinedList = sortStrings(selection.sid, locale.id).join(separator);

          return (
            <span>
              <span>{joinedList} {variantSelection.value} {instead} {selection.value}</span>
            </span>
          );
        }
      }
      else {
        const newString = `${_translate(locale, 'info.combattechniquesselection', _translate(locale, 'info.combattechniquesselectioncounter')[variantSelection.amount - 1], variantSelection.value + 6)}${sortStrings(variantSelection.sid, locale.id).join(', ')}`;
        return (
          <span>
            <span>{newString}</span>
          </span>
        );
      }
    }
  }

  return null;
}

interface VariantSkillsSelectionProps {
  locale: UIMessages;
  liturgicalChants: Map<string, LiturgicalChant>;
  spells: Map<string, Spell>;
  variant: ProfessionVariant;
}

function VariantSkillsSelection(props: VariantSkillsSelectionProps): JSX.Element {
  const {
    locale,
    liturgicalChants,
    spells,
    variant
  } = props;

  const instead = _translate(locale, 'info.variantsinsteadof');

  const combatTechniquesList = variant.combatTechniques.map(e => {
    const { name, value, previous = 0 } = e;
    return `${name} ${previous + value + 6} ${instead} ${previous + 6}`;
  });

  const skillsList = variant.skills.map(e => {
    const { name, value, previous = 0 } = e;
    return `${name} ${previous + value} ${instead} ${previous + 6}`;
  });

  const combinedSpellsList = combineSpells(variant.spells, spells);
  const spellsList = combinedSpellsList.map(e => {
    if (isCombinedSpell(e)) {
      const { newId, oldId, value } = e;
      const newSpellName = spells.has(newId) ? spells.get(newId)!.name : '...';
      const oldSpellName = spells.has(oldId) ? spells.get(oldId)!.name : '...';
      return `${newSpellName} ${value} ${instead} ${oldSpellName} ${value}`;
    }
    else {
      const { id, value, previous = 0 } = e;
      const name = spells.has(id) ? spells.get(id)!.name : '...';
      return `${name} ${previous + value} ${instead} ${previous}`;
    }
  });

  const combinedList = [
    ...sortStrings(combatTechniquesList, locale.id),
    ...sortStrings(skillsList, locale.id),
    ...sortStrings(spellsList, locale.id)
  ].join(', ');

  if (variant.liturgicalChants.length > 0) {
    const blessings = _translate(locale, 'info.thetwelveblessings');

    const liturgicalChantsArr = [];

    if (variant.blessings.length === 12)  {
      liturgicalChantsArr.push(blessings);
    }

    for (const e of variant.liturgicalChants) {
      const name = liturgicalChants.get(e.id)!.name;
      liturgicalChantsArr.push(`${name} ${e.value}`);
    }

    const sortedLiturgicalChants = sortStrings(liturgicalChantsArr, locale.id);

    const main = _translate(locale, 'info.liturgicalchants');

    const liturgicalChantsString = `; ${main}: ${sortedLiturgicalChants.join(', ')}`;

    return (
      <span>{combinedList}{liturgicalChantsString}</span>
    );
  }

  return (
    <span>{combinedList}</span>
  );
}
