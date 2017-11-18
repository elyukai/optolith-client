import { last } from 'lodash';
import * as React from 'react';
import { ActiveViewObject } from '../../types/data.d';
import { getRoman } from '../../utils/NumberUtils';

interface Props {
	list: (ActiveViewObject | string)[];
}

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

function findTier(name: string) {
	const parts = name.split(' ');
	if (parts[parts.length - 1].match(/[IVX]+$/)) {
		const tier = parts.pop()!;
		return [parts.join(' '), tier] as [string, string];
	}
	return parts.join(' ');
}

export function ActivatableTextList(props: Props) {
	const listToString = props.list.filter(obj => typeof obj === 'string' || !['SA_27', 'SA_29'].includes(obj.id)).map(obj => {
		if (typeof obj === 'string') {
			return obj;
		}
		const { instance: { tiers }, id, tier } = obj;
		let { name } = obj;
		if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
			if (id === 'SA_29' && tier === 4) {
				name += ` MS`;
			}
			else {
				name += ` ${getRoman(tier!)}`;
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
