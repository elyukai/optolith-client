import * as React from 'react';
import { Item } from '../../types/view.d';
import { _localizeNumber, _localizeWeight } from '../../utils/I18n';

export interface BelongingsSheetTableRowProps {
	item: Item | undefined;
	localeId: string;
}

export function BelongingsSheetTableRow(props: BelongingsSheetTableRowProps) {
	const { item, localeId } = props;
	if (item !== undefined) {
		return (
			<tr>
				<td className="name">{item.name}</td>
				<td className="amount">{item.amount > 1 && item.amount}</td>
				<td className="price">{item.price > 0 && _localizeNumber(item.price, localeId)}</td>
				<td className="weight">{item.weight && item.weight > 0 && _localizeNumber(_localizeWeight(item.weight, localeId), localeId)}</td>
				<td className="where">{item.where}</td>
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
