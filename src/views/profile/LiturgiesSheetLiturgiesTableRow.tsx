import * as React from 'react';
import { Textfit } from 'react-textfit';
import { SecondaryAttribute } from '../../types/data.d';
import { Attribute, Liturgy, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

interface LiturgiesSheetLiturgiesTableRowProps {
	attributes: Attribute[];
	checkAttributeValueVisibility: boolean;
	derivedCharacteristics: SecondaryAttribute[];
	liturgy: Liturgy | undefined;
	locale: UIMessages;
}

export function LiturgiesSheetLiturgiesTableRow(props: LiturgiesSheetLiturgiesTableRowProps) {
	const { attributes, checkAttributeValueVisibility, derivedCharacteristics, liturgy, locale } = props;
	if (liturgy) {
		const { aspects: aspectIds, checkmod, ic, name, value } = liturgy;
		const check = liturgy.check.map(attr => {
			const attribute = attributes.find(e => e.id === attr)!;
			if (checkAttributeValueVisibility === true) {
				return attribute.value;
			}
			else {
				return attribute.short;
			}
		}).join('/');
		const aspectNames = translate(locale, 'liturgies.view.aspects');
		const aspects = sortStrings(aspectIds.map(e => aspectNames[e - 1]), locale.id);
		return (
			<tr>
				<td className="name">
					<Textfit max={11} min={7} mode="single">{name}</Textfit>
				</td>
				<td className="check">
					<Textfit max={11} min={7} mode="single">{check}{checkmod && ` (+${derivedCharacteristics.find(e => e.id === checkmod)!.short})`}</Textfit>
				</td>
				<td className="value">{value}</td>
				<td className="cost"></td>
				<td className="cast-time"></td>
				<td className="range"></td>
				<td className="duration"></td>
				<td className="aspect">
					<Textfit max={11} min={7} mode="single">{aspects.join(', ')}</Textfit>
				</td>
				<td className="ic">{getICName(ic)}</td>
				<td className="effect"></td>
				<td className="ref"></td>
			</tr>
		);
	}
	else {
		return (
			<tr>
				<td className="name"></td>
				<td className="check"></td>
				<td className="value"></td>
				<td className="cost"></td>
				<td className="cast-time"></td>
				<td className="range"></td>
				<td className="duration"></td>
				<td className="aspect"></td>
				<td className="ic"></td>
				<td className="effect"></td>
				<td className="ref"></td>
			</tr>
		);
	}
}
