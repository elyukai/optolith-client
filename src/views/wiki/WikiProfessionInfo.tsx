import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { ATTRIBUTES } from '../../constants/Categories';
import { AttributeInstance, Book, CantripInstance, CantripsSelection, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, LiturgyInstance, SkillsSelection, SpecialisationSelection, SpellInstance, TalentInstance } from '../../types/data.d';
import { Profession, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isRequiringIncreasable } from '../../utils/RequirementUtils';

export interface WikiProfessionInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	cantrips: Map<string, CantripInstance>;
	currentObject: Profession;
	liturgicalChants: Map<string, LiturgyInstance>;
	locale: UIMessages;
	sex: 'm' | 'f' | undefined;
	skills: Map<string, TalentInstance>;
	spells: Map<string, SpellInstance>;
}

export function WikiProfessionInfo(props: WikiProfessionInfoProps) {
	const { attributes, books, cantrips, currentObject, liturgicalChants, locale, sex = 'm', skills, spells } = props;

	let { name, subname } = currentObject;

	if (typeof name === 'object') {
		name = name[sex];
	}
	if (typeof subname === 'object') {
		subname = subname[sex];
	}

	const specializationSelection = currentObject.selections.find(e => e.id === 'SPECIALISATION') as SpecialisationSelection | undefined;
	const skillsSelection = currentObject.selections.find(e => e.id === 'SKILLS') as SkillsSelection | undefined;
	const skillsSelectionString = skillsSelection && _translate(locale, 'info.skillsselection', skillsSelection.value, _translate(locale, 'rcpselections.labels.skillgroups')[skillsSelection.gr || 0]);
	const cursesSelection = currentObject.selections.find(e => e.id === 'CURSES') as CursesSelection | undefined;
	const cantripsSelection = currentObject.selections.find(e => e.id === 'CANTRIPS') as CantripsSelection | undefined;
	const languagesLiteracySelection = currentObject.selections.find(e => e.id === 'LANGUAGES_SCRIPTS') as LanguagesScriptsSelection | undefined;
	const combatTechniquesSelection = currentObject.selections.find(e => e.id === 'COMBAT_TECHNIQUES') as CombatTechniquesSelection | undefined;
	const combatTechniquesSecondSelection = currentObject.selections.find(e => e.id === 'COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSecondSelection | undefined;

	const spellsArray = [
		...(cantripsSelection ? [`${_translate(locale, 'info.spellscantrips', _translate(locale, 'info.spellscantripscounter')[cantripsSelection.amount - 1])}${sortStrings(cantripsSelection.sid.map(e => cantrips.get(e)!.name), locale.id).join(', ')}`] : []),
		...sortStrings(currentObject.spells.map(e => `${spells.get(e.id)!.name} ${e.value}`), locale.id)
	];

	const liturgicalChantsArray = sortStrings([
		...(currentObject.blessings.length === 12 ? [_translate(locale, 'info.liturgicalchantsthetwelveblessings')] : []),
		...currentObject.liturgicalChants.map(e => `${liturgicalChants.get(e.id)!.name} ${e.value}`)
	], locale.id);

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
					{sortStrings(currentObject.prerequisites.map(e => {
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
					}), locale.id).join(', ') || _translate(locale, 'info.none')}
				</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.specialabilities')}</span>
				<span>{[
					...(languagesLiteracySelection ? [_translate(locale, 'info.specialabilitieslanguagesandliteracy', languagesLiteracySelection.value)] : []),
					...(specializationSelection ? [_translate(locale, 'info.specialabilitiesspecialization', Array.isArray(specializationSelection.sid) ? sortStrings(specializationSelection.sid.map(e => skills.get(e)!.name), locale.id).join(_translate(locale, 'info.specialabilitiesspecializationseparator')) : skills.get(specializationSelection.sid)!.name)] : []),
					...(cursesSelection ? [_translate(locale, 'info.specialabilitiescurses', cursesSelection.value)] : []),
					...sortStrings(currentObject.specialAbilities.map(e => e.combinedName), locale.id)
				].join(', ') || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.combattechniques')}</span>
				<span>{[
					...sortStrings(currentObject.combatTechniques.map(e => `${e.name} ${e.value + 6}`), locale.id),
					...(combatTechniquesSelection && combatTechniquesSecondSelection ? [`${_translate(locale, 'info.combattechniquessecondselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6, _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSecondSelection.amount - 1], combatTechniquesSecondSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}`] : combatTechniquesSelection ? [`${_translate(locale, 'info.combattechniquesselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}`] : [])
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
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.suggesteddisadvantages')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.unsuitableadvantages')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.unsuitabledisadvantages')}</span>
				<span></span>
			</p>
			{currentObject.variants.length > 0 && <p className="profession-variants">
				<span>{_translate(locale, 'info.variants')}</span>
			</p>}
			<ul className="profession-variants">
				{currentObject.variants.map(e => {
					let { name } = e;
					if (typeof name === 'object') {
						name = name[sex];
					}
					return <li key={e.id}>
						<span>{name}</span>
						<span>({currentObject.ap + e.ap} {_translate(locale, 'apshort')})</span>
						<span>{e.precedingText && `${e.precedingText} `}{[
							...sortStrings(e.combatTechniques.map(({ name, value, previous = 0}) => `${name} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`), locale.id),
							...sortStrings(e.skills.map(({ name, value, previous = 0}) => `${name} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`), locale.id)
						].join(', ')}{e.concludingText && `; ${e.concludingText}`}</span>
					</li>;
				})}
			</ul>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
