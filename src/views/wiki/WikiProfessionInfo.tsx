import { difference } from 'lodash';
import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { ATTRIBUTES } from '../../constants/Categories';
import { AttributeInstance, Book, CantripInstance, CantripsSelection, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, LiturgyInstance, RaceInstance, RaceRequirement, SexRequirement, SkillsSelection, SpecialisationSelection, SpellInstance, TalentInstance } from '../../types/data.d';
import { Profession, UIMessages, IncreasableId } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isRaceRequirement, isRequiringIncreasable, isSexRequirement } from '../../utils/RequirementUtils';

export interface WikiProfessionInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	cantrips: Map<string, CantripInstance>;
	currentObject: Profession;
	liturgicalChants: Map<string, LiturgyInstance>;
	locale: UIMessages;
	sex: 'm' | 'f' | undefined;
	races: Map<string, RaceInstance>;
	skills: Map<string, TalentInstance>;
	spells: Map<string, SpellInstance>;
}

export function WikiProfessionInfo(props: WikiProfessionInfoProps) {
	const { attributes, books, cantrips, currentObject, liturgicalChants, locale, races, sex = 'm', skills, spells } = props;

	let { name, subname } = currentObject;

	if (typeof name === 'object') {
		name = name[sex];
	}
	if (typeof subname === 'object') {
		subname = subname[sex];
	}

	const specializationSelection = currentObject.selections.find(e => e.id === 'SPECIALISATION') as SpecialisationSelection | undefined;
	const specializationSelectionString = specializationSelection && _translate(locale, 'info.specialabilitiesspecialization', Array.isArray(specializationSelection.sid) ? sortStrings(specializationSelection.sid.map(e => skills.get(e)!.name), locale.id).join(_translate(locale, 'info.specialabilitiesspecializationseparator')) : skills.get(specializationSelection.sid)!.name);

	const skillsSelection = currentObject.selections.find(e => e.id === 'SKILLS') as SkillsSelection | undefined;
	const skillsSelectionString = skillsSelection && _translate(locale, 'info.skillsselection', skillsSelection.value, _translate(locale, 'rcpselections.labels.skillgroups')[skillsSelection.gr || 0]);

	const cursesSelection = currentObject.selections.find(e => e.id === 'CURSES') as CursesSelection | undefined;

	const cantripsSelection = currentObject.selections.find(e => e.id === 'CANTRIPS') as CantripsSelection | undefined;

	const languagesLiteracySelection = currentObject.selections.find(e => e.id === 'LANGUAGES_SCRIPTS') as LanguagesScriptsSelection | undefined;

	const combatTechniquesSelection = currentObject.selections.find(e => e.id === 'COMBAT_TECHNIQUES') as CombatTechniquesSelection | undefined;
	const combatTechniquesSecondSelection = currentObject.selections.find(e => e.id === 'COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSecondSelection | undefined;
	const combatTechniquesSelectionString = combatTechniquesSelection && combatTechniquesSecondSelection ? `${_translate(locale, 'info.combattechniquessecondselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6, _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSecondSelection.amount - 1], combatTechniquesSecondSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}` : combatTechniquesSelection && `${_translate(locale, 'info.combattechniquesselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}`;

	const spellsArray = [
		...(cantripsSelection ? [`${_translate(locale, 'info.spellscantrips', _translate(locale, 'info.spellscantripscounter')[cantripsSelection.amount - 1])}${sortStrings(cantripsSelection.sid.map(e => cantrips.get(e)!.name), locale.id).join(', ')}`] : []),
		...sortStrings(currentObject.spells.map(e => `${spells.get(e.id)!.name} ${e.value}`), locale.id)
	];

	const liturgicalChantsArray = sortStrings([
		...(currentObject.blessings.length === 12 ? [_translate(locale, 'info.liturgicalchantsthetwelveblessings')] : []),
		...currentObject.liturgicalChants.map(e => `${liturgicalChants.get(e.id)!.name} ${e.value}`)
	], locale.id);

	const raceRequirement = currentObject.dependencies.find(e => isRaceRequirement(e)) as RaceRequirement | undefined;
	const sexRequirement = currentObject.dependencies.find(e => isSexRequirement(e)) as SexRequirement | undefined;

	const getRaceNameAP = (race: RaceInstance) => `${race.name} (${race.ap} ${_translate(locale, 'apshort')})`;

	const prerequisites = [
		...(raceRequirement ? [`${_translate(locale, 'race')}: ${Array.isArray(raceRequirement.value) ? raceRequirement.value.map(e => getRaceNameAP(races.get(`R_${e}`)!)).join(_translate(locale, 'info.or')) : getRaceNameAP(races.get(`R_${raceRequirement.value}`)!)}`] : []),
		...(currentObject.prerequisitesStart ? [currentObject.prerequisitesStart] : []),
		...sortStrings(currentObject.prerequisites.map(e => {
			if (isRequiringIncreasable(e)) {
				const instance = attributes.get(e.id) || skills.get(e.id);
				let name;
				if (instance && instance.category === ATTRIBUTES) {
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

	return <Scroll>
		<div className="info profession-info">
			<div className="profession-header info-header">
				<p className="title">{subname ? `${name} (${subname})` : name}</p>
			</div>
			<p>
				<span>{_translate(locale, 'info.apvalue')}</span>
				<span>{currentObject.ap} {_translate(locale, 'aptext')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.prerequisites')}</span>
				<span>
					{prerequisites.length > 0 ? prerequisites.join(', ') : _translate(locale, 'info.none')}
					{sexRequirement && `${prerequisites.length > 0 ? '; ' : ''}${_translate(locale, 'charactersheet.main.sex')}: ${sexRequirement.value === 'm' ? _translate(locale, 'herocreation.options.selectsex.male') : _translate(locale, 'herocreation.options.selectsex.female')}`}
				</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.specialabilities')}</span>
				<span>{[
					...(languagesLiteracySelection ? [_translate(locale, 'info.specialabilitieslanguagesandliteracy', languagesLiteracySelection.value)] : []),
					...(specializationSelection ? [specializationSelectionString] : []),
					...(cursesSelection ? [_translate(locale, 'info.specialabilitiescurses', cursesSelection.value)] : []),
					...sortStrings(currentObject.specialAbilities.map(e => e.combinedName), locale.id)
				].join(', ') || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.combattechniques')}</span>
				<span>{[
					...sortStrings(currentObject.combatTechniques.map(e => `${e.name} ${e.value + 6}`), locale.id),
					...(combatTechniquesSelectionString ? [combatTechniquesSelectionString] : [])
				].join(', ') || '-'}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.skills')}</span>
			</p>
			<p className="skill-group">
				<span>{_translate(locale, 'skills.view.groups')[0]}</span>
				<span>{currentObject.physicalSkills.length > 0 ? [
					...sortStrings(currentObject.physicalSkills.map(e => `${e.name} ${e.value}`), locale.id),
					...(skillsSelectionString && skillsSelection!.gr === 1 ? [skillsSelectionString] : [])
				].join(', ') : '-'}</span>
			</p>
			<p className="skill-group">
				<span>{_translate(locale, 'skills.view.groups')[1]}</span>
				<span>{currentObject.socialSkills.length > 0 ? [
					...sortStrings(currentObject.socialSkills.map(e => `${e.name} ${e.value}`), locale.id),
					...(skillsSelectionString && skillsSelection!.gr === 2 ? [skillsSelectionString] : [])
				].join(', ') : '-'}</span>
			</p>
			<p className="skill-group">
				<span>{_translate(locale, 'skills.view.groups')[2]}</span>
				<span>{currentObject.natureSkills.length > 0 ? [
					...sortStrings(currentObject.natureSkills.map(e => `${e.name} ${e.value}`), locale.id),
					...(skillsSelectionString && skillsSelection!.gr === 3 ? [skillsSelectionString] : [])
				].join(', ') : '-'}</span>
			</p>
			<p className="skill-group">
				<span>{_translate(locale, 'skills.view.groups')[3]}</span>
				<span>{currentObject.knowledgeSkills.length > 0 ? [
					...sortStrings(currentObject.knowledgeSkills.map(e => `${e.name} ${e.value}`), locale.id),
					...(skillsSelectionString && skillsSelection!.gr === 4 ? [skillsSelectionString] : [])
				].join(', ') : '-'}</span>
			</p>
			<p className="skill-group">
				<span>{_translate(locale, 'skills.view.groups')[4]}</span>
				<span>{currentObject.craftSkills.length > 0 ? [
					...sortStrings(currentObject.craftSkills.map(e => `${e.name} ${e.value}`), locale.id),
					...(skillsSelectionString && skillsSelection!.gr === 5 ? [skillsSelectionString] : [])
				].join(', ') : '-'}</span>
			</p>
			{spellsArray.length > 0 && <p>
				<span>{_translate(locale, 'info.spells')}</span>
				<span>{spellsArray.join(', ')}</span>
			</p>}
			{liturgicalChantsArray.length > 0 && <p>
				<span>{_translate(locale, 'info.liturgicalchants')}</span>
				<span>{liturgicalChantsArray.join(', ')}</span>
			</p>}
			<p>
				<span>{_translate(locale, 'info.suggestedadvantages')}</span>
				<span>{currentObject.suggestedAdvantagesText || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.suggesteddisadvantages')}</span>
				<span>{currentObject.suggestedDisadvantagesText || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.unsuitableadvantages')}</span>
				<span>{currentObject.unsuitableAdvantagesText || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.unsuitabledisadvantages')}</span>
				<span>{currentObject.unsuitableDisadvantagesText || _translate(locale, 'info.none')}</span>
			</p>
			{currentObject.variants.length > 0 && <p className="profession-variants">
				<span>{_translate(locale, 'info.variants')}</span>
			</p>}
			<ul className="profession-variants">
				{currentObject.variants.map(e => {
					const { selections, fullText } = e;
					let { name } = e;

					if (typeof name === 'object') {
						name = name[sex];
					}

					if (fullText) {
						return <li key={e.id}>
							<span>{name}</span>
							<span>({currentObject.ap + e.ap} {_translate(locale, 'apshort')})</span>
							<span>{fullText}</span>
						</li>;
					}

					const variantLanguagesLiteracySelection = selections.find(e => e.id === 'LANGUAGES_SCRIPTS') as LanguagesScriptsSelection | undefined;
					const variantLanguagesLiteracySelectionString = variantLanguagesLiteracySelection ? languagesLiteracySelection ? <span>{_translate(locale, 'info.specialabilitieslanguagesandliteracy', variantLanguagesLiteracySelection.value)} {_translate(locale, 'info.variantsinsteadof')} {languagesLiteracySelection.value}</span> : <span>{_translate(locale, 'info.specialabilitieslanguagesandliteracy', variantLanguagesLiteracySelection.value)}</span> : undefined;

					const variantSpecializationSelection = selections.find(e => e.id === 'SPECIALISATION') as SpecialisationSelection | undefined;
					let variantSpecializationSelectionString;

					if (variantSpecializationSelection) {
						if (variantSpecializationSelection.active === false) {
							variantSpecializationSelectionString = <span className="disabled">{specializationSelectionString}</span>;
						}
						else {
							const newString = _translate(locale, 'info.specialabilitiesspecialization', Array.isArray(variantSpecializationSelection.sid) ? sortStrings(variantSpecializationSelection.sid.map(e => skills.get(e)!.name), locale.id).join(_translate(locale, 'info.specialabilitiesspecializationseparator')) : skills.get(variantSpecializationSelection.sid)!.name);

							if (specializationSelection) {
								variantSpecializationSelectionString = <span>{newString} {_translate(locale, 'info.variantsinsteadof')} {specializationSelectionString}</span>;
							}
							else {
								variantSpecializationSelectionString = <span>{newString}</span>;
							}
						}
					}

					const variantCombatTechniquesSelection = selections.find(e => e.id === 'COMBAT_TECHNIQUES') as CombatTechniquesSelection | undefined;
					let variantCombatTechniquesSelectionString;

					if (variantCombatTechniquesSelection) {
						if (variantCombatTechniquesSelection.active === false) {
							variantCombatTechniquesSelectionString = <span className="disabled">{combatTechniquesSelectionString}</span>;
						}
						else {
							if (combatTechniquesSelection) {
								if (difference(combatTechniquesSelection.sid, variantCombatTechniquesSelection.sid).length === 0 && combatTechniquesSelection.amount === variantCombatTechniquesSelection.amount) {
									variantCombatTechniquesSelectionString = <span>{sortStrings(combatTechniquesSelection.sid, locale.id).join(_translate(locale, 'info.or'))} {variantCombatTechniquesSelection.value} {_translate(locale, 'info.variantsinsteadof')} {combatTechniquesSelection.value}</span>;
								}
							}
							else {
								const newString = `${_translate(locale, 'info.combattechniquesselection', _translate(locale, 'info.combattechniquesselectioncounter')[variantCombatTechniquesSelection.amount - 1], variantCombatTechniquesSelection.value + 6)}${sortStrings(variantCombatTechniquesSelection.sid, locale.id).join(', ')}`;
								variantCombatTechniquesSelectionString = <span>{newString}</span>;
							}
						}
					}

					const skillsString = [
						...sortStrings(e.combatTechniques.map(({ name, value, previous = 0}) => `${name} ${previous + value + 6} ${_translate(locale, 'info.variantsinsteadof')} ${previous + 6}`), locale.id),
						...sortStrings(e.skills.map(({ name, value, previous = 0}) => `${name} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`), locale.id),
						...sortStrings(combineSpells(e.spells, spells).map(e => {
							if (isCombinedSpell(e)) {
								const { newId, oldId, value } = e;
								return `${spells.has(newId) ? spells.get(newId)!.name : '...'} ${value} ${_translate(locale, 'info.variantsinsteadof')} ${spells.has(oldId) ? spells.get(oldId)!.name : '...'} ${value}`;
							}
							else {
								const { id, value, previous = 0 } = e;
								return `${spells.has(id) ? spells.get(id)!.name : '...'} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`;
							}
						}), locale.id)
					].join(', ');

					return <li key={e.id}>
						<span>{name}</span>
						<span>({currentObject.ap + e.ap} {_translate(locale, 'apshort')})</span>
						<span>
							{e.precedingText && <span>{e.precedingText}</span>}
							{e.prerequisitesModel.length > 0 && <span className="hard-break">{_translate(locale, 'info.prerequisites')}: {e.prerequisitesModel.map(e => {
								return isRequiringIncreasable(e) && attributes.has(e.id) ? <span key={e.id}>{attributes.get(e.id)!.short} {e.value}</span> : '';
							})}</span>}
							{e.specialAbilities.length > 0 && <React.Fragment>{e.specialAbilities.map(e => <span key={e.id}><span className={e.active === false ? 'disabled' : undefined}>{e.combinedName}</span></span>)}</React.Fragment>}
							{variantLanguagesLiteracySelectionString && <span>{variantLanguagesLiteracySelectionString}</span>}
							{variantSpecializationSelectionString && <span>{variantSpecializationSelectionString}</span>}
							{variantCombatTechniquesSelectionString && <span>{variantCombatTechniquesSelectionString}</span>}
							{skillsString && <span>{skillsString}</span>}
							{e.concludingText && `; ${e.concludingText}`}
							</span>
					</li>;
				})}
			</ul>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}

interface CombinedSpell {
	newId: string;
	oldId: string;
	value: number;
}

function isCombinedSpell(obj: IncreasableId | CombinedSpell): obj is CombinedSpell {
	return obj.hasOwnProperty('newId') && obj.hasOwnProperty('oldId') && obj.hasOwnProperty('value');
}

function combineSpells(list: IncreasableId[], allSpells: Map<string, SpellInstance>): (IncreasableId | CombinedSpell)[] {
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
