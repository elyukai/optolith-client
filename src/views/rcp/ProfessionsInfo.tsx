import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { CantripInstance, CantripsSelection, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, LiturgyInstance, SMap, SpellInstance } from '../../types/data.d';
import { Profession, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface ProfessionsProps {
	cantrips: SMap<CantripInstance>;
	currentProfessionId?: string;
	liturgicalChants: SMap<LiturgyInstance>;
	locale: UIMessages;
	professions: Profession[];
	sex: 'm' | 'f';
	spells: SMap<SpellInstance>;
}

export function ProfessionsInfo(props: ProfessionsProps) {
	const { cantrips, currentProfessionId, liturgicalChants, locale, professions, sex, spells } = props;

	const profession = currentProfessionId && professions.find(e => currentProfessionId === e.id);

	if (profession) {
		let { name, subname } = profession;

		if (typeof name === 'object') {
			name = name[sex];
		}
		if (typeof subname === 'object') {
			subname = subname[sex];
		}

		const cursesSelection = profession.selections.find(e => e.id === 'CURSES') as CursesSelection | undefined;
		const cantripsSelection = profession.selections.find(e => e.id === 'CANTRIPS') as CantripsSelection | undefined;
		const languagesLiteracySelection = profession.selections.find(e => e.id === 'LANGUAGES_SCRIPTS') as LanguagesScriptsSelection | undefined;
		const combatTechniquesSelection = profession.selections.find(e => e.id === 'COMBAT_TECHNIQUES') as CombatTechniquesSelection | undefined;
		const combatTechniquesSecondSelection = profession.selections.find(e => e.id === 'COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSecondSelection | undefined;

		const spellsArray = [
			...(cantripsSelection ? [`${_translate(locale, 'info.spellscantrips', _translate(locale, 'info.spellscantripscounter')[cantripsSelection.amount - 1])}${sortStrings(cantripsSelection.sid.map(e => cantrips.get(e)!.name), locale.id).join(', ')}`] : []),
			...sortStrings(profession.spells.map(e => `${spells.get(e.id)!.name} ${e.value}`), locale.id)
		];

		const liturgicalChantsArray = sortStrings([
			...(profession.blessings.length === 12 ? [_translate(locale, 'info.liturgicalchantsthetwelveblessings')] : []),
			...profession.liturgicalChants.map(e => `${liturgicalChants.get(e.id)!.name} ${e.value}`)
		], locale.id);

		return (
			<Scroll>
				<div className="info profession-info">
					<div className="profession-header info-header">
						<p className="title">{subname ? `${name} (${subname})` : name}</p>
					</div>
					<p>
						<span>{_translate(locale, 'info.apvalue')}</span>
						<span>{profession.ap} {_translate(locale, 'aptext')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.prerequisites')}</span>
						<span></span>
					</p>
					<p>
						<span>{_translate(locale, 'info.specialabilities')}</span>
						<span>{[
							...(languagesLiteracySelection ? [_translate(locale, 'info.specialabilitieslanguagesandliteracy', languagesLiteracySelection.value)] : []),
							...(cursesSelection ? [_translate(locale, 'info.specialabilitiescurses', cursesSelection.value)] : []),
						].join(', ')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.combattechniques')}</span>
						<span>{[
							...sortStrings(profession.combatTechniques.map(e => `${e.name} ${e.value + 6}`), locale.id),
							...(combatTechniquesSelection && combatTechniquesSecondSelection ? [`${_translate(locale, 'info.combattechniquessecondselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6, _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSecondSelection.amount - 1], combatTechniquesSecondSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}`] : combatTechniquesSelection ? [`${_translate(locale, 'info.combattechniquesselection', _translate(locale, 'info.combattechniquesselectioncounter')[combatTechniquesSelection.amount - 1], combatTechniquesSelection.value + 6)}${sortStrings(combatTechniquesSelection.sid, locale.id).join(', ')}`] : [])
						].join(', ') || '-'}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.skills')}</span>
					</p>
					<p className="skill-group">
						<span>{_translate(locale, 'skills.view.groups')[0]}</span>
						<span>{profession.physicalSkills.length > 0 ? sortStrings(profession.physicalSkills.map(e => `${e.name} ${e.value}`), locale.id).join(', ') : '-'}</span>
					</p>
					<p className="skill-group">
						<span>{_translate(locale, 'skills.view.groups')[1]}</span>
						<span>{profession.socialSkills.length > 0 ? sortStrings(profession.socialSkills.map(e => `${e.name} ${e.value}`), locale.id).join(', ') : '-'}</span>
					</p>
					<p className="skill-group">
						<span>{_translate(locale, 'skills.view.groups')[2]}</span>
						<span>{profession.natureSkills.length > 0 ? sortStrings(profession.natureSkills.map(e => `${e.name} ${e.value}`), locale.id).join(', ') : '-'}</span>
					</p>
					<p className="skill-group">
						<span>{_translate(locale, 'skills.view.groups')[3]}</span>
						<span>{profession.knowledgeSkills.length > 0 ? sortStrings(profession.knowledgeSkills.map(e => `${e.name} ${e.value}`), locale.id).join(', ') : '-'}</span>
					</p>
					<p className="skill-group">
						<span>{_translate(locale, 'skills.view.groups')[4]}</span>
						<span>{profession.craftSkills.length > 0 ? sortStrings(profession.craftSkills.map(e => `${e.name} ${e.value}`), locale.id).join(', ') : '-'}</span>
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
					{profession.variants.length > 0 && <p className="profession-variants">
						<span>{_translate(locale, 'info.variants')}</span>
						<ul>
							{profession.variants.map(e => {
								let { name } = e;
								if (typeof name === 'object') {
									name = name[sex];
								}
								return <li key={e.id}>
									<span>{name}</span>
									<span>({profession.ap + e.ap} {_translate(locale, 'apshort')})</span>
									<span>{[
										...sortStrings(e.combatTechniques.map(({ name, value, previous = 0}) => `${name} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`), locale.id),
										...sortStrings(e.skills.map(({ name, value, previous = 0}) => `${name} ${previous + value} ${_translate(locale, 'info.variantsinsteadof')} ${previous}`), locale.id)
									].join(', ')}</span>
								</li>;
							})}
						</ul>
					</p>}
				</div>
			</Scroll>
		);
	}

	return (
		<div className="info-placeholder">
			&#xE88F;
		</div>
	);
}
