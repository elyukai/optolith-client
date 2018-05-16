import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Book, Culture, Skill, SpecialAbility } from '../../types/wiki';
import { sortObjects, sortStrings } from '../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../utils/I18n';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiCultureInfoProps {
  books: Map<string, Book>;
  currentObject: Culture;
  languages: SpecialAbility;
  locale: UIMessages;
  scripts: SpecialAbility;
  skills: Map<string, Skill>;
}

export function WikiCultureInfo(props: WikiCultureInfoProps) {
  const { currentObject, languages, locale, scripts, skills } = props;

  const culturalPackageSkills = currentObject.culturalPackageSkills.map(e => {
    const { id, value } = e;
    return {
      name: skills.get(id)!.name,
      value
    };
  })

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="culture" title={currentObject.name}>
        <p className="cultural-package">
          <span>{translate(locale, 'info.culturalpackage', currentObject.name, currentObject.culturalPackageAdventurePoints)}</span>
          <span>
            {sortObjects(culturalPackageSkills, locale.id).map(skill => {
              return `${skill.name} +${skill.value}`;
            }).join(', ')}
          </span>
        </p>
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="culture" title={currentObject.name}>
      <WikiProperty locale={locale} title="info.language">
        {sortStrings(currentObject.languages.map(id => languages.select!.find(e => e.id === id)!.name), locale.id).join(translate(locale, 'info.or'))}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.script">
        {currentObject.scripts.length > 0 ? `${sortStrings(currentObject.scripts.map(id => scripts.select!.find(e => e.id === id)!.name), locale.id).join(translate(locale, 'info.or'))} (${scripts.select!.find(e => e.id === currentObject.scripts[0])!.cost} ${translate(locale, 'apshort')})` : translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.areaknowledge">
        {currentObject.areaKnowledge}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.socialstatus">
        {currentObject.socialStatus.length > 0 ? sortStrings(currentObject.socialStatus.map(e => translate(locale, 'socialstatus')[e - 1]), locale.id).join(', ') : translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.commonprofessions">
        {['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? currentObject.commonMagicProfessions : undefined}
      </WikiProperty>
      {!['C_19', 'C_20', 'C_21'].includes(currentObject.id) ? <ul>
        <li><em>{translate(locale, 'info.commonmundaneprofessions')}:</em> {currentObject.commonMundaneProfessions || '-'}</li>
        <li><em>{translate(locale, 'info.commonmagicprofessions')}:</em> {currentObject.commonMagicProfessions || '-'}</li>
        <li><em>{translate(locale, 'info.commonblessedprofessions')}:</em> {currentObject.commonBlessedProfessions || '-'}</li>
      </ul> : undefined}
      <WikiProperty locale={locale} title="info.commonadvantages">
        {currentObject.commonAdvantagesText || translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.commondisadvantages">
        {currentObject.commonDisadvantagesText || translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.uncommonadvantages">
        {currentObject.uncommonAdvantagesText || translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.uncommondisadvantages">
        {currentObject.uncommonDisadvantagesText || translate(locale, 'info.none')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.commonskills">
        {sortStrings(currentObject.commonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}
      </WikiProperty>
      <WikiProperty locale={locale} title="info.uncommonskills">
        {sortStrings(currentObject.uncommonSkills.map(e => skills.get(e)!.name), locale.id).join(', ')}
      </WikiProperty>
      <Markdown source={`**${translate(locale, 'info.commonnames')}:**\n${currentObject.commonNames || ''}`} />
      <p className="cultural-package">
        <span>{translate(locale, 'info.culturalpackage', currentObject.name, currentObject.culturalPackageAdventurePoints)}</span>
        <span>
          {sortObjects(culturalPackageSkills, locale.id).map(skill => {
            return `${skill.name} +${skill.value}`;
          }).join(', ')}
        </span>
      </p>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
