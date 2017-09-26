import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { TalentInstance } from '../../types/data.d';
import { Book, Culture, UIMessages } from '../../types/view.d';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiCultureInfoProps {
	books: Map<string, Book>;
	currentObject: Culture;
	locale: UIMessages;
	skills: Map<string, TalentInstance>;
}

export function WikiCultureInfo(props: WikiCultureInfoProps) {
	const { books, currentObject, locale, skills } = props;

	return <Scroll>
		<div className="info culture-info">
			<div className="culture-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<p>
				<span>{_translate(locale, 'info.language')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.script')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.areaknowledge')}</span>
				<span>{currentObject.areaKnowledge}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.socialstatus')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commonprofessions')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commonadvantages')}</span>
				<span>{currentObject.commonAdvantages}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commondisadvantages')}</span>
				<span>{currentObject.commonDisadvantages}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommonadvantages')}</span>
				<span>{currentObject.uncommonAdvantages}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommondisadvantages')}</span>
				<span>{currentObject.uncommonDisadvantages}</span>
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
