import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { getICName } from '../../utils/adventurePoints/improvementCostUtils';
import { translate, UIMessages } from '../../utils/I18n';
import { Attribute, Book, CombatTechnique } from '../../utils/wikiData/wikiTypeHelpers';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiCombatTechniqueInfoProps {
  attributes: Map<string, Attribute>;
  books: Map<string, Book>;
  currentObject: CombatTechnique;
  locale: UIMessages;
  sex: 'm' | 'f' | undefined;
}

export function WikiCombatTechniqueInfo(props: WikiCombatTechniqueInfoProps) {
  const { attributes, currentObject, locale } = props;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="combattechnique" title={currentObject.name}>
        <WikiProperty locale={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : '...').intercalate('/')}</WikiProperty>
        <WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="combattechnique" title={currentObject.name}>
      {currentObject.special && <Markdown source={`**${translate(locale, 'info.special')}:** ${currentObject.special}`} />}
      <WikiProperty locale={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : '...').intercalate('/')}</WikiProperty>
      <WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
