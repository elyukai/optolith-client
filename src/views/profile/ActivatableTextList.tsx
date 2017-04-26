import * as React from 'react';
import { ActiveViewObject } from '../../types/data.d';

interface Props {
	list: Array<ActiveViewObject | string>;
}

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

function findTier(name: string) {
	const parts = name.split(' ');
	if (parts[parts.length - 1].match(/[IVX]+/)) {
		const tier = parts.pop()!;
		return [parts.join(' '), tier] as [string, string];
	}
	return parts.join(' ');
}

export function ActivatableTextList(props: Props) {
	const listToString = props.list.filter(obj => typeof obj === 'string' || !['SA_28', 'SA_30'].includes(obj.id)).map(obj => {
		if (typeof obj === 'string') {
			return obj;
		}
		const { tiers, id, tier } = obj;
		let { name } = obj;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
			if (id === 'SA_30' && tier === 4) {
				name += ` MS`;
			}
			else {
				name += ` ${roman[(tier as number) - 1]}`;
			}
		}

		return name;
	});

	listToString.sort();

	const list = listToString.reduce<EnhancedReduce>((previous, current, index, array) => {
		const splitted = findTier(current);
		if (Array.isArray(splitted)) {
			const nextElement = array[index + 1];
			if (typeof nextElement === 'string') {
				const nextSplitted = findTier(nextElement);
				if (Array.isArray(nextSplitted) && splitted[0] === nextSplitted[0]) {
					if (previous.previousLowerTier === true) {
						return previous;
					}
					return {
						final: [ ...previous.final, `${current}-` ],
						previousLowerTier: true
					};
				}
			}
			if (previous.previousLowerTier === true) {
				const other = [ ...previous.final ];
				const last = other.pop();

				return {
					final: [ ...other, `${last}${splitted[1]}` ],
					previousLowerTier: false
				};
			}
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
