import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { PetsStore } from '../../stores/PetsStore';
import { AttributeInstance, ItemInstance } from '../../types/data.d';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { sort } from '../../utils/ListUtils';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';

const rowCreator = (e: ItemInstance | undefined, i: number) => {
	if (e) {
		return (
			<tr key={e.id}>
				<td className="name">{e.name}</td>
				<td className="amount">{e.amount > 1 && e.amount}</td>
				<td className="price">{e.price > 0 && localizeNumber(e.price)}</td>
				<td className="weight">{e.weight && e.weight > 0 && localizeNumber(localizeWeight(e.weight))}</td>
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

export function BelongingsSheet() {
	const { value } = get('STR') as AttributeInstance;
	const { d, s, h, k } = EquipmentStore.getPurse();
	const items = sort(EquipmentStore.getAll(), EquipmentStore.getSortOrder()) as ItemInstance[];
	const firstColumn = Array.from({ length: 66 }) as Array<ItemInstance | undefined>;
	firstColumn.splice(0, Math.min(items.length, 66), ...items);
	const secondColumn = firstColumn.splice(Math.round(firstColumn.length / 2));
	const pet = PetsStore.getAll()[0];

	return (
		<SheetWrapper>
			<SheetOptions/>
			<Sheet id="belongings" title={translate('charactersheet.belongings.title')}>
				<div className="upper">
					<TextBox label={translate('charactersheet.belongings.equipment.title')} className="equipment">
						<div>
							<table>
								<thead>
									<tr>
										<th className="name">{translate('charactersheet.belongings.equipment.headers.item')}</th>
										<th className="amount">{translate('charactersheet.belongings.equipment.headers.number')}</th>
										<th className="price">{translate('charactersheet.belongings.equipment.headers.price')}</th>
										<th className="weight">{translate('charactersheet.belongings.equipment.headers.weight')}</th>
										<th className="where">{translate('charactersheet.belongings.equipment.headers.carriedwhere')}</th>
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
										<th className="name">{translate('charactersheet.belongings.equipment.headers.item')}</th>
										<th className="amount">{translate('charactersheet.belongings.equipment.headers.number')}</th>
										<th className="price">{translate('charactersheet.belongings.equipment.headers.price')}</th>
										<th className="weight">{translate('charactersheet.belongings.equipment.headers.weight')}</th>
										<th className="where">{translate('charactersheet.belongings.equipment.headers.carriedwhere')}</th>
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
							<label>{translate('charactersheet.belongings.equipment.footers.total')}</label>
							<span>{localizeNumber(Math.round(items.reduce((n, i) => n + i.price || n, 0) * 100) / 100)}</span>
							<span>{localizeNumber(localizeWeight(Math.round(items.reduce((n, i) => i.weight ? n + i.weight : n, 0) * 100) / 100))}</span>
						</div>
					</TextBox>
					<TextBox label={translate('charactersheet.belongings.purse.title')} className="purse">
						<div className="top">
							<LabelBox
								className="money"
								label={translate('charactersheet.belongings.purse.labels.ducats')}
								value={d}
								/>
							<LabelBox
								className="money"
								label={translate('charactersheet.belongings.purse.labels.silverthalers')}
								value={s}
								/>
							<LabelBox
								className="money"
								label={translate('charactersheet.belongings.purse.labels.halers')}
								value={h}
								/>
							<LabelBox
								className="money"
								label={translate('charactersheet.belongings.purse.labels.kreutzers')}
								value={k}
								/>
							<LabelBox
								className="specifics"
								label={translate('charactersheet.belongings.purse.labels.gems')}
								value={items.filter(e => e.gr === 16).map(e => e.name).join(', ')}
								/>
							<LabelBox
								className="specifics"
								label={translate('charactersheet.belongings.purse.labels.jewelry')}
								value={items.filter(e => e.gr === 15).map(e => e.name).join(', ')}
								/>
							<LabelBox
								className="specifics"
								label={translate('charactersheet.belongings.purse.labels.other')}
								value=""
								/>
						</div>
						<div className="fill"></div>
						<div className="carrying-capacity">
							<div className="left">
								<h3>{translate('charactersheet.belongings.carryingcapacity.title')}</h3>
								<p>{translate('charactersheet.belongings.carryingcapacity.calc')}</p>
							</div>
							<LabelBox
								label={translate('charactersheet.belongings.carryingcapacity.label')}
								value={localizeWeight(value * 2)}
								/>
						</div>
					</TextBox>
				</div>
				<div className="fill"></div>
				<div className="pet">
					<TextBox label={translate('charactersheet.belongings.animal.title')}>
						<div className="pet-content">
							<div className="left">
								<div className="row pet-base">
									<div className="name">
										<span className="label">{translate('pet.name')}</span>
										<span className="value">{pet && pet.name}</span>
									</div>
									<div className="size">
										<span className="label">{translate('pet.sizecategory')}</span>
										<span className="value">{pet && pet.size}</span>
									</div>
									<div className="type">
										<span className="label">{translate('pet.type')}</span>
										<span className="value">{pet && pet.type}</span>
									</div>
									<div className="ap">
										<span className="label">{translate('pet.ap')}</span>
										<span className="value">{pet && pet.spentAp}</span>
										<span className="label">/</span>
										<span className="value">{pet && pet.totalAp}</span>
									</div>
								</div>
								<div className="row pet-primary">
									<div>
										<span className="label">{(get('COU') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.cou}</span>
									</div>
									<div>
										<span className="label">{(get('SGC') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.sgc}</span>
									</div>
									<div>
										<span className="label">{(get('INT') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.int}</span>
									</div>
									<div>
										<span className="label">{(get('CHA') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.cha}</span>
									</div>
									<div>
										<span className="label">{(get('DEX') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.dex}</span>
									</div>
									<div>
										<span className="label">{(get('AGI') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.agi}</span>
									</div>
									<div>
										<span className="label">{(get('CON') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.con}</span>
									</div>
									<div>
										<span className="label">{(get('STR') as AttributeInstance).short}</span>
										<span className="value">{pet && pet.str}</span>
									</div>
								</div>
								<div className="row pet-secondary">
									<div className="lp">
										<span className="label">{translate('pet.lp')}</span>
										<span className="value">{pet && pet.lp}</span>
									</div>
									<div className="ae">
										<span className="label">{translate('pet.ae')}</span>
										<span className="value">{pet && pet.ae}</span>
									</div>
									<div className="spi">
										<span className="label">{translate('pet.spi')}</span>
										<span className="value">{pet && pet.spi}</span>
									</div>
									<div className="tou">
										<span className="label">{translate('pet.tou')}</span>
										<span className="value">{pet && pet.tou}</span>
									</div>
									<div className="pro">
										<span className="label">{translate('pet.pro')}</span>
										<span className="value">{pet && pet.pro}</span>
									</div>
									<div className="ini">
										<span className="label">{translate('pet.ini')}</span>
										<span className="value">{pet && pet.ini}</span>
									</div>
									<div className="mov">
										<span className="label">{translate('pet.mov')}</span>
										<span className="value">{pet && pet.mov}</span>
									</div>
								</div>
								<div className="row pet-offensive">
									<div className="attack">
										<span className="label">{translate('pet.attack')}</span>
										<span className="value">{pet && pet.attack}</span>
									</div>
									<div className="at">
										<span className="label">{translate('pet.at')}</span>
										<span className="value">{pet && pet.at}</span>
									</div>
									<div className="pa">
										<span className="label">{translate('pet.pa')}</span>
										<span className="value">{pet && pet.pa}</span>
									</div>
									<div className="dp">
										<span className="label">{translate('pet.dp')}</span>
										<span className="value">{pet && pet.dp}</span>
									</div>
									<div className="reach">
										<span className="label">{translate('pet.reach')}</span>
										<span className="value">{pet && pet.reach}</span>
									</div>
								</div>
								<div className="row pet-actions">
									<div className="actions">
										<span className="label">{translate('pet.actions')}</span>
										<span className="value">{pet && pet.actions}</span>
									</div>
								</div>
								<div className="row pet-skills">
									<div className="skills">
										<span className="label">{translate('pet.skills')}</span>
										<span className="value">{pet && pet.talents}</span>
									</div>
								</div>
								<div className="row pet-specialabilities">
									<div className="specialabilities">
										<span className="label">{translate('pet.specialabilities')}</span>
										<span className="value">{pet && pet.skills}</span>
									</div>
								</div>
								<div className="row pet-notes">
									<div className="notes">
										<span className="label">{translate('pet.notes')}</span>
										<span className="value">{pet && pet.notes}</span>
									</div>
								</div>
							</div>
							<div className="right">
								<AvatarWrapper src={pet && pet.avatar} />
							</div>
						</div>
					</TextBox>
				</div>
			</Sheet>
		</SheetWrapper>
	);
}
