import * as React from 'react';
import { Textfit } from 'react-textfit';
import { Item } from '../../types/view.d';
import { localizeNumber, localizeWeight } from '../../utils/I18n';

export interface BelongingsSheetTableRowProps {
	item: Item | undefined;
	localeId: string;
}

export function BelongingsSheetTableRow(props: BelongingsSheetTableRowProps) {
	const { item, localeId } = props;
	if (item !== undefined) {
		return (
			<tr>
				<td className="name">
					<Textfit max={11} min={7} mode="single">{item.name}</Textfit>
				</td>
				<td className="amount">{item.amount > 1 && item.amount}</td>
				<td className="price">{item.price > 0 && localizeNumber(item.price, localeId)}</td>
				<td className="weight">{item.weight && item.weight > 0 && localizeNumber(localizeWeight(item.weight, localeId), localeId)}</td>
				<td className="where">
					<Textfit max={11} min={7} mode="single">{item.where}</Textfit>
				</td>
			</tr>
		);
	}
	else {
		return (
			<tr>
				<td className="name"></td>
				<td className="amount"></td>
				<td className="price"></td>
				<td className="weight"></td>
				<td className="where"></td>
			</tr>
		);
	}
};
