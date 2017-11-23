import { last } from 'lodash';
import * as React from 'react';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';

interface ActivatableTextListProps {
	list: (ActiveViewObject | string)[];
	locale: UIMessages;
}

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

export function ActivatableTextList(props: ActivatableTextListProps) {
	const listToString = sortStrings(props.list.filter(obj => typeof obj === 'string' || !['SA_27', 'SA_29'].includes(obj.id)).map(obj => {
		if (typeof obj === 'string') {
			return obj;
		}
		return obj.name;
	}), props.locale.id);

	const list = listToString.reduce<EnhancedReduce>((previous, current) => {
		const prevElement = last(previous.final);
		if (prevElement && prevElement.split(' (')[0] === current.split(' (')[0] && /\(.+\)(?: [IVX]+)?$/.test(prevElement)) {
			const prevElementSplitted = prevElement.split(/\)/);
			const optionalTier = prevElementSplitted.pop() || '';
			const beginning = `${prevElementSplitted.join(')')}${optionalTier}`;
			const currentSplitted = current.split(/\(/);
			const continuing = currentSplitted.slice(1).join('(').replace(/\)((?: [IVX]+)?)$/, '$1)');

			const other = previous.final.slice(0, -1);

			return {
				...previous,
				final: [ ...other, `${beginning}, ${continuing}` ]
			};
		}
		return {
			final: [ ...previous.final, current ],
			previousLowerTier: false
		};
	}, {
		final: [],
		previousLowerTier: false
	}).final.join(', ');

	return (
		<div className="list">{list}</div>
	);
}
