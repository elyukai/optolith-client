import { sort } from '../../utils/ListUtils';
import { get } from '../../stores/ListStore';
import * as React from 'react';
import EquipmentStore from '../../stores/EquipmentStore';
import LabelBox from '../../components/LabelBox';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

const dotToComma = (number: number) => number.toString().replace(/\./, ',');

const rowCreator = (e: ItemInstance | undefined, i: number) => {
	if (e) {
		return (
			<tr key={e.id}>
				<td className="name">{e.name}</td>
				<td className="amount">{e.amount > 1 ? e.amount : null}</td>
				<td className="price">{e.price > 0 ? dotToComma(e.price) : null}</td>
				<td className="weight">{e.weight > 0 ? dotToComma(e.weight) : null}</td>
				<td className="where">{e.where}</td>
			</tr>
		);
	}
	else {
		return (
			<tr key={`undefined${i}`}>
				<td className="name"></td>
				<td className="amount"></td>
				<td className="price"></td>
				<td className="weight"></td>
				<td className="where"></td>
			</tr>
		);
	}
};

export default () => {
	const { value } = get('STR') as AttributeInstance;
	const { d, s, h, k } = EquipmentStore.getPurse();
	const items = sort(EquipmentStore.getAll(), EquipmentStore.getSortOrder()) as ItemInstance[];
	const firstColumn = Array(66).fill(undefined) as (ItemInstance | undefined)[];
	firstColumn.splice(0, Math.min(items.length, 66), ...items);
	const secondColumn = firstColumn.splice(Math.round(firstColumn.length / 2));

	return (
		<div className="sheet" id="belongings">
			<SheetHeader title="Besitz" />
			<div className="upper">
				<TextBox label="Ausrüstung" className="equipment">
					<div>
						<table>
							<thead>
								<tr>
									<td className="name">Gegenstand</td>
									<td className="amount">#</td>
									<td className="price">Wert</td>
									<td className="weight">Gew.</td>
									<td className="where">Wo getragen</td>
								</tr>
							</thead>
							<tbody>
								{
									firstColumn.map(rowCreator)
								}
							</tbody>
						</table>
						<table>
							<thead>
								<tr>
									<td className="name">Gegenstand</td>
									<td className="amount">#</td>
									<td className="price">Wert</td>
									<td className="weight">Gew.</td>
									<td className="where">Wo getragen</td>
								</tr>
							</thead>
							<tbody>
								{
									secondColumn.map(rowCreator)
								}
							</tbody>
						</table>
					</div>
					<div className="total">
						<label>Gesamt</label>
						<span>{dotToComma(items.reduce((n, i) => n + i.price, 0))}</span>
						<span>{dotToComma(items.reduce((n, i) => n + i.weight, 0))}</span>
					</div>
				</TextBox>
				<TextBox label="Geldbeutel" className="purse">
					<div className="top">
						<LabelBox
							className="money"
							label="Dukaten"
							value={d}
							/>
						<LabelBox
							className="money"
							label="Silbertaler"
							value={s}
							/>
						<LabelBox
							className="money"
							label="Heller"
							value={h}
							/>
						<LabelBox
							className="money"
							label="Kreuzer"
							value={k}
							/>
						<LabelBox
							className="specifics"
							label="Edelsteine"
							value={items.filter(e => e.gr === 16).map(e => e.name).join(', ')}
							/>
						<LabelBox
							className="specifics"
							label="Schmuck"
							value={items.filter(e => e.gr === 15).map(e => e.name).join(', ')}
							/>
						<LabelBox
							className="specifics"
							label="Sonstiges"
							value=""
							/>
					</div>
					<div className="fill"></div>
					<div className="carrying-capacity">
						<div className="left">
							<h3>Tragkraft</h3>
							<p>(KKx2)</p>
						</div>
						<LabelBox
							label="Wert in Stein"
							value={value * 2}
							/>
					</div>
				</TextBox>
			</div>
		</div>
	);
};
/*			<div className="fill"></div>
			<TextBox label="Tier" className="pet">

			</TextBox>*/
