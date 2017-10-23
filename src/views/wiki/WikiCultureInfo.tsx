import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { SpecialAbilityInstance, TalentInstance } from '../../types/data.d';
import { Book, Culture, UIMessages } from '../../types/view.d';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiCultureInfoProps {
	books: Map<string, Book>;
	currentObject: Culture;
	languages: SpecialAbilityInstance;
	locale: UIMessages;
	scripts: SpecialAbilityInstance;
	skills: Map<string, TalentInstance>;
}

export function WikiCultureInfo(props: WikiCultureInfoProps) {
	const { books, currentObject, languages, locale, scripts, skills } = props;

	return <Scroll>
		<div className="info culture-info">
			<div className="culture-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<p>
				<span>{_translate(locale, 'info.language')}</span>
				<span>{sortStrings(currentObject.language.map(id => languages.sel!.find(e => e.id === id)!.name), locale.id).join(_translate(locale, 'info.or'))}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.script')}</span>
				<span>{currentObject.script.length > 0 ? `${sortStrings(currentObject.script.map(id => scripts.sel!.find(e => e.id === id)!.name), locale.id).join(_translate(locale, 'info.or'))} (${scripts.sel!.find(e => e.id === currentObject.script[0])!.cost} ${_translate(locale, 'apshort')})` : _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.areaknowledge')}</span>
				<span>{currentObject.areaKnowledge}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.socialstatus')}</span>
				<span>{currentObject.socialStatus.length > 0 ? sortStrings(currentObject.socialStatus.map(e => _translate(locale, 'socialstatus')[e - 1]), locale.id).join(', ') : _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commonprofessions')}</span>
				{['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? <span>{currentObject.commonMagicProfessions}</span> : undefined}
			</p>
			{!['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? <ul>
				<li><em>{_translate(locale, 'info.commonmundaneprofessions')}:</em> {currentObject.commonMundaneProfessions || '-'}</li>
				<li><em>{_translate(locale, 'info.commonmagicprofessions')}:</em> {currentObject.commonMagicProfessions || '-'}</li>
				<li><em>{_translate(locale, 'info.commonblessedprofessions')}:</em> {currentObject.commonBlessedProfessions || '-'}</li>
			</ul> : undefined}
			<p>
				<span>{_translate(locale, 'info.commonadvantages')}</span>
				<span>{currentObject.commonAdvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commondisadvantages')}</span>
				<span>{currentObject.commonDisadvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommonadvantages')}</span>
				<span>{currentObject.uncommonAdvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommondisadvantages')}</span>
				<span>{currentObject.uncommonDisadvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commonskills')}</span>
				<span>{sortStrings(currentObject.commonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommonskills')}</span>
				<span>{sortStrings(currentObject.uncommonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}</span>
			</p>
			<Markdown source={`**${_translate(locale, 'info.commonnames')}:**\n${currentObject.commonNames || ''}`} />
			<p className="cultural-package">
				<span>{_translate(locale, 'info.culturalpackage', currentObject.name, currentObject.culturalPackageAp)}</span>
				<span>
					{sortObjects(currentObject.culturalPackageSkills, locale.id).map(skill => {
						return `${skill.name} +${skill.value}`;
					}).join(', ')}
				</span>
			</p>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
