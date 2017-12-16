import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { Culture, UIMessages } from '../../types/view.d';
import { Book, Skill, SpecialAbility } from '../../types/wiki';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiCultureInfoProps {
	books: Map<string, Book>;
	currentObject: Culture;
	languages: SpecialAbility;
	locale: UIMessages;
	scripts: SpecialAbility;
	skills: Map<string, Skill>;
}

export function WikiCultureInfo(props: WikiCultureInfoProps) {
	const { books, currentObject, languages, locale, scripts, skills } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info culture-info">
				<div className="culture-header info-header">
					<p className="title">{currentObject.name}</p>
				</div>
				<p className="cultural-package">
					<span>{_translate(locale, 'info.culturalpackage', currentObject.name, currentObject.culturalPackageAp)}</span>
					<span>
						{sortObjects(currentObject.culturalPackageSkills, locale.id).map(skill => {
							return `${skill.name} +${skill.value}`;
						}).join(', ')}
					</span>
				</p>
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info culture-info">
			<div className="culture-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<WikiProperty locale={locale} title="info.language">
				{sortStrings(currentObject.language.map(id => languages.select!.find(e => e.id === id)!.name), locale.id).join(_translate(locale, 'info.or'))}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.script">
				{currentObject.script.length > 0 ? `${sortStrings(currentObject.script.map(id => scripts.select!.find(e => e.id === id)!.name), locale.id).join(_translate(locale, 'info.or'))} (${scripts.select!.find(e => e.id === currentObject.script[0])!.cost} ${_translate(locale, 'apshort')})` : _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.areaknowledge">
				{currentObject.areaKnowledge}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.socialstatus">
				{currentObject.socialStatus.length > 0 ? sortStrings(currentObject.socialStatus.map(e => _translate(locale, 'socialstatus')[e - 1]), locale.id).join(', ') : _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.commonprofessions">
				{['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? currentObject.commonMagicProfessions : undefined}
			</WikiProperty>
			{!['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? <ul>
				<li><em>{_translate(locale, 'info.commonmundaneprofessions')}:</em> {currentObject.commonMundaneProfessions || '-'}</li>
				<li><em>{_translate(locale, 'info.commonmagicprofessions')}:</em> {currentObject.commonMagicProfessions || '-'}</li>
				<li><em>{_translate(locale, 'info.commonblessedprofessions')}:</em> {currentObject.commonBlessedProfessions || '-'}</li>
			</ul> : undefined}
			<WikiProperty locale={locale} title="info.commonadvantages">
				{currentObject.commonAdvantages || _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.commondisadvantages">
				{currentObject.commonDisadvantages || _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.uncommonadvantages">
				{currentObject.uncommonAdvantages || _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.uncommondisadvantages">
				{currentObject.uncommonDisadvantages || _translate(locale, 'info.none')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.commonskills">
				{sortStrings(currentObject.commonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.uncommonskills">
				{sortStrings(currentObject.uncommonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}
			</WikiProperty>
			<Markdown source={`**${_translate(locale, 'info.commonnames')}:**\n${currentObject.commonNames || ''}`} />
			<p className="cultural-package">
				<span>{_translate(locale, 'info.culturalpackage', currentObject.name, currentObject.culturalPackageAp)}</span>
				<span>
					{sortObjects(currentObject.culturalPackageSkills, locale.id).map(skill => {
						return `${skill.name} +${skill.value}`;
					}).join(', ')}
				</span>
			</p>
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
