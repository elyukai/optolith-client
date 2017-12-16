import * as React from 'react';
import { UIMessages } from '../../types/data';
import { Book, SourceLink } from '../../types/wiki.d';
import { sortStrings } from '../../utils/FilterSortUtils';

export interface WikiSourceProps {
	books: Map<string, Book>;
	src: SourceLink[];
	locale: UIMessages;
}

export function WikiSource(props: WikiSourceProps) {
	const { books, src, locale } = props;

	return <p className="source">
		<span>{sortStrings(src.map(e => e.page ? `${books.get(e.id)!.name} ${e.page}` : books.get(e.id)!.name), locale.id).join(', ')}</span>
	</p>;
}
