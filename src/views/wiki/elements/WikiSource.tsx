import * as React from 'react';
import { UIMessages } from '../../../types/data';
import { Book, SourceLink } from '../../../types/wiki.d';
import { sortStrings } from '../../../utils/FilterSortUtils';

export interface WikiSourceProps {
  books: Map<string, Book>;
  currentObject: {
    src: SourceLink[] | string;
  };
  locale: UIMessages;
}

export function WikiSource(props: WikiSourceProps) {
  const {
    books,
    currentObject: {
      src
    },
    locale
  } = props;

  if (typeof src === 'object') {
    const availableSources = src.filter(e => books.has(e.id));

    const sourceList = availableSources.map(e => {
      const book = books.get(e.id)!.name;
      if (typeof e.page === 'number') {
        return `${book} ${e.page}`;
      }
      return book;
    });

    return (
      <p className="source">
        <span>{sortStrings(sourceList, locale.id).intercalate(', ')}</span>
      </p>
    );
  }

  return (
    <p className="source">
      <span>{books.get('US25001')!.name} {src}</span>
    </p>
  );
}
