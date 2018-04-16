import * as React from 'react';
import { Textfit } from 'react-textfit';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { LabelBox } from '../../components/LabelBox';
import { Options } from '../../components/Options';
import { TextBox } from '../../components/TextBox';
import { Purse } from '../../reducers/equipment';
import { PetInstance } from '../../types/data.d';
import { Attribute, Item, UIMessages } from '../../types/view.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { BelongingsSheetTableRow } from './BelongingsSheetTableRow';
import { Sheet } from './Sheet';
import { SheetWrapper } from './SheetWrapper';

export interface BelongingsSheetProps {
	attributes: Attribute[];
	items: Item[];
	locale: UIMessages;
	pet: PetInstance;
	purse: Purse;
	totalPrice: number;
	totalWeight: number;
}

export function BelongingsSheet(props: BelongingsSheetProps) {
	const { attributes, items, locale, pet, purse: { d, s, h, k }, totalPrice, totalWeight } = props;
	const { value } = attributes.find(e => e.id === 'ATTR_8')!;
	const sortedItems = sortObjects(items, locale.id);
	const firstColumn = Array.from({ length: 66 }) as (Item | undefined)[];
	firstColumn.splice(0, Math.min(sortedItems.length, 66), ...sortedItems);
	const secondColumn = firstColumn.splice(Math.round(firstColumn.length / 2));

	return (
		<SheetWrapper>
			<Options/>
			<Sheet
				id="belongings"
				title={_translate(locale, 'charactersheet.belongings.title')}
				attributes={attributes}
				locale={locale}
				>
				<div className="upper">
					<TextBox label={_translate(locale, 'charactersheet.belongings.equipment.title')} className="equipment">
						<div>
							<table>
								<thead>
									<tr>
										<th className="name">{_translate(locale, 'charactersheet.belongings.equipment.headers.item')}</th>
										<th className="amount">{_translate(locale, 'charactersheet.belongings.equipment.headers.number')}</th>
										<th className="price">{_translate(locale, 'charactersheet.belongings.equipment.headers.price')}</th>
										<th className="weight">{_translate(locale, 'charactersheet.belongings.equipment.headers.weight')}</th>
										<th className="where">{_translate(locale, 'charactersheet.belongings.equipment.headers.carriedwhere')}</th>
									</tr>
								</thead>
								<tbody>
									{
										firstColumn.map((e, i) => <BelongingsSheetTableRow key={e ? e.id : `u${i}`} item={e} localeId={locale.id} />)
									}
								</tbody>
							</table>
							<table>
								<thead>
									<tr>
										<th className="name">{_translate(locale, 'charactersheet.belongings.equipment.headers.item')}</th>
										<th className="amount">{_translate(locale, 'charactersheet.belongings.equipment.headers.number')}</th>
										<th className="price">{_translate(locale, 'charactersheet.belongings.equipment.headers.price')}</th>
										<th className="weight">{_translate(locale, 'charactersheet.belongings.equipment.headers.weight')}</th>
										<th className="where">{_translate(locale, 'charactersheet.belongings.equipment.headers.carriedwhere')}</th>
									</tr>
								</thead>
								<tbody>
									{
										secondColumn.map((e, i) => <BelongingsSheetTableRow key={e ? e.id : `u${i}`} item={e} localeId={locale.id} />)
									}
								</tbody>
							</table>
						</div>
						<div className="total">
							<label>{_translate(locale, 'charactersheet.belongings.equipment.footers.total')}</label>
							<span>{_localizeNumber(Math.round(totalPrice * 100) / 100, locale.id)}</span>
							<span>{_localizeNumber(_localizeWeight(Math.round(totalWeight * 100) / 100, locale.id), locale.id)}</span>
						</div>
					</TextBox>
					<TextBox label={_translate(locale, 'charactersheet.belongings.purse.title')} className="purse">
						<div className="top">
							<LabelBox
								className="money"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.ducats')}
								value={d}
								/>
							<LabelBox
								className="money"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.silverthalers')}
								value={s}
								/>
							<LabelBox
								className="money"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.halers')}
								value={h}
								/>
							<LabelBox
								className="money"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.kreutzers')}
								value={k}
								/>
							<LabelBox
								className="specifics"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.gems')}
								value={items.filter(e => e.gr === 16).map(e => e.name).join(', ')}
								/>
							<LabelBox
								className="specifics"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.jewelry')}
								value={items.filter(e => e.gr === 15).map(e => e.name).join(', ')}
								/>
							<LabelBox
								className="specifics"
								label={_translate(locale, 'charactersheet.belongings.purse.labels.other')}
								value=""
								/>
						</div>
						<div className="fill"></div>
						<div className="carrying-capacity">
							<div className="left">
								<h3>{_translate(locale, 'charactersheet.belongings.carryingcapacity.title')}</h3>
								<p>{_translate(locale, 'charactersheet.belongings.carryingcapacity.calc')}</p>
							</div>
							<LabelBox
								label={_translate(locale, 'charactersheet.belongings.carryingcapacity.label')}
								value={_localizeWeight(value * 2, locale.id)}
								/>
						</div>
					</TextBox>
				</div>
				<div className="fill"></div>
				<div className="pet">
					<TextBox label={_translate(locale, 'charactersheet.belongings.animal.title')}>
						<div className="pet-content">
							<div className="left">
								<div className="row pet-base">
									<div className="name">
										<span className="label">{_translate(locale, 'pet.name')}</span>
										<span className="value">
											<Textfit max={11} min={7} mode="single">{pet && pet.name}</Textfit>
										</span>
									</div>
									<div className="size">
										<span className="label">{_translate(locale, 'pet.sizecategory')}</span>
										<span className="value">{pet && pet.size}</span>
									</div>
									<div className="type">
										<span className="label">{_translate(locale, 'pet.type')}</span>
										<span className="value">{pet && pet.type}</span>
									</div>
									<div className="ap">
										<span className="label">{_translate(locale, 'pet.ap')}</span>
										<span className="value">{pet && pet.spentAp}</span>
										<span className="label">/</span>
										<span className="value">{pet && pet.totalAp}</span>
									</div>
								</div>
								<div className="row pet-primary">
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_1')!.short}</span>
										<span className="value">{pet && pet.cou}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_2')!.short}</span>
										<span className="value">{pet && pet.sgc}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_3')!.short}</span>
										<span className="value">{pet && pet.int}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_4')!.short}</span>
										<span className="value">{pet && pet.cha}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_5')!.short}</span>
										<span className="value">{pet && pet.dex}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_6')!.short}</span>
										<span className="value">{pet && pet.agi}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_7')!.short}</span>
										<span className="value">{pet && pet.con}</span>
									</div>
									<div>
										<span className="label">{attributes.find(e => e.id === 'ATTR_8')!.short}</span>
										<span className="value">{pet && pet.str}</span>
									</div>
								</div>
								<div className="row pet-secondary">
									<div className="lp">
										<span className="label">{_translate(locale, 'pet.lp')}</span>
										<span className="value">{pet && pet.lp}</span>
									</div>
									<div className="ae">
										<span className="label">{_translate(locale, 'pet.ae')}</span>
										<span className="value">{pet && pet.ae}</span>
									</div>
									<div className="spi">
										<span className="label">{_translate(locale, 'pet.spi')}</span>
										<span className="value">{pet && pet.spi}</span>
									</div>
									<div className="tou">
										<span className="label">{_translate(locale, 'pet.tou')}</span>
										<span className="value">{pet && pet.tou}</span>
									</div>
									<div className="pro">
										<span className="label">{_translate(locale, 'pet.pro')}</span>
										<span className="value">{pet && pet.pro}</span>
									</div>
									<div className="ini">
										<span className="label">{_translate(locale, 'pet.ini')}</span>
										<span className="value">{pet && pet.ini}</span>
									</div>
									<div className="mov">
										<span className="label">{_translate(locale, 'pet.mov')}</span>
										<span className="value">{pet && pet.mov}</span>
									</div>
								</div>
								<div className="row pet-offensive">
									<div className="attack">
										<span className="label">{_translate(locale, 'pet.attack')}</span>
										<span className="value">{pet && pet.attack}</span>
									</div>
									<div className="at">
										<span className="label">{_translate(locale, 'pet.at')}</span>
										<span className="value">{pet && pet.at}</span>
									</div>
									<div className="pa">
										<span className="label">{_translate(locale, 'pet.pa')}</span>
										<span className="value">{pet && pet.pa}</span>
									</div>
									<div className="dp">
										<span className="label">{_translate(locale, 'pet.dp')}</span>
										<span className="value">{pet && pet.dp}</span>
									</div>
									<div className="reach">
										<span className="label">{_translate(locale, 'pet.reach')}</span>
										<span className="value">{pet && pet.reach}</span>
									</div>
								</div>
								<div className="row pet-actions">
									<div className="actions">
										<span className="label">{_translate(locale, 'pet.actions')}</span>
										<span className="value">
											<Textfit max={11} min={7} mode="single">{pet && pet.actions}</Textfit>
										</span>
									</div>
								</div>
								<div className="row pet-skills">
									<div className="skills">
										<span className="label">{_translate(locale, 'pet.skills')}</span>
										<span className="value">
											<Textfit max={11} min={7} mode="single">{pet && pet.talents}</Textfit>
										</span>
									</div>
								</div>
								<div className="row pet-specialabilities">
									<div className="specialabilities">
										<span className="label">{_translate(locale, 'pet.specialabilities')}</span>
										<span className="value">
											<Textfit max={11} min={7} mode="single">{pet && pet.skills}</Textfit>
										</span>
									</div>
								</div>
								<div className="row pet-notes">
									<div className="notes">
										<span className="label">{_translate(locale, 'pet.notes')}</span>
										<span className="value">
											<Textfit max={11} min={7} mode="single">{pet && pet.notes}</Textfit>
										</span>
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
