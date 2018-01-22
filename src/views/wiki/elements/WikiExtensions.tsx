import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { SkillExtension, SpecialAbility } from '../../../types/wiki';
import { sortObjects } from '../../../utils/FilterSortUtils';
import { _translate, UIMessages } from '../../../utils/I18n';

export interface WikiExtensionsProps {
	currentObject: {
		id: string;
	};
  extensions: SpecialAbility | undefined;
	locale: UIMessages;
}

export function WikiExtensions(props: WikiExtensionsProps) {
  const {
    currentObject: {
      id
    },
    extensions,
    locale
  } = props;

  let extensionsList = extensions && (extensions.select as SkillExtension[]);

  if (typeof extensionsList === 'object') {
    extensionsList = extensionsList.filter(e => e.target === id);
    extensionsList = sortObjects(extensionsList, locale.id, 'tier');
  }

  if (extensionsList && extensionsList.length === 3) {
    return (
      <>
        <p className="extensions-title">
          <span>{_translate(locale, 'spellextensions')}</span>
        </p>
        <ul className="extensions">
          {extensionsList.map(({ cost, effect, id, name, tier }) => {
            const srText = `${_translate(locale, 'sr.short')} ${tier * 4 + 4}`;
            const apText = `${cost} ${_translate(locale, 'apshort')}`;
            return (
              <Markdown
                key={id}
                source={`*${name}* (${srText}, ${apText}): ${effect}`}
                isListElement
                />
            );
          })}
        </ul>
      </>
    );
  }

  return null;
}
