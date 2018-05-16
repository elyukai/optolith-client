import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { Categories } from '../../../constants/Categories';
import { SkillExtension, SpecialAbility } from '../../../types/wiki';
import { sortObjects } from '../../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../../utils/I18n';

export interface WikiExtensionsProps {
	currentObject: {
		id: string;
    category: Categories;
	};
  extensions: SpecialAbility | undefined;
	locale: UIMessages;
}

export function WikiExtensions(props: WikiExtensionsProps) {
  const {
    currentObject: {
      id,
      category,
    },
    extensions,
    locale
  } = props;

  let key: keyof UIMessages = 'spellextensions';
  let extensionsList = extensions && (extensions.select as SkillExtension[]);

  if (category === Categories.LITURGIES) {
    key = 'liturgicalchantextensions';
  }

  if (typeof extensionsList === 'object') {
    extensionsList = extensionsList.filter(e => e.target === id);
    extensionsList = sortObjects(extensionsList, locale.id, 'tier');
  }

  if (extensionsList && extensionsList.length === 3) {
    return (
      <>
        <p className="extensions-title">
          <span>{translate(locale, key)}</span>
        </p>
        <ul className="extensions">
          {extensionsList.map(({ cost, effect, id, name, tier }) => {
            const srText = `${translate(locale, 'sr.short')} ${tier * 4 + 4}`;
            const apText = `${cost} ${translate(locale, 'apshort')}`;
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
