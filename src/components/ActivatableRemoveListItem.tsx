import classNames from 'classnames';
import * as React from 'react';
import SpecialAbilitiesStore from '../stores/SpecialAbilitiesStore';
import Dropdown from './Dropdown';
import IconButton from './IconButton';

interface RemoveObject {
	id: string;
	cost: number;
	index: number;
}

interface Props {
	item: ActiveViewObject;
	phase: number;
	isImportant?: boolean;
	isTypical?: boolean;
	isUntypical?: boolean;
	setTier(id: string, index: number, tier: number, cost: number): void;
	removeFromList(args: DeactivateArgs): void;
}

const specialAbilityGroupNames = SpecialAbilitiesStore.getGroupNames();

export default class ActivatableRemoveListItem extends React.Component<Props, undefined> {
	handleSelectTier = (selectedTier: number) => {
		const { id, tier, index, cost } = this.props.item;
		const finalCost = (selectedTier - (tier as number)) * (cost as number);
		this.props.setTier(id, index, selectedTier, finalCost);
	}
	removeFromList = (args: DeactivateArgs) => this.props.removeFromList(args);

	render() {
		const { phase, item, isImportant, isTypical, isUntypical } = this.props;
		const { id, tier, tiers, index, disabled, gr } = item;
		let { cost, name } = item;
		let addSpecial = '';

		let tierElement;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
			let array = Array.from(Array(tiers).keys()).map(e => ({ id: e + 1, name: roman[e] }));
			if (id === 'SA_30' && (tier === 4 || this.props.phase < 3)) {
				array.push({ id: 4, name: 'MS' });
			}
			if (this.props.phase === 3) {
				array = array.filter(e => e.id >= tier!);
			}
			if (array.length > 1) {
				tierElement = (
					<Dropdown
						className="tiers"
						value={tier!}
						onChange={this.handleSelectTier}
						options={array} />
				);
			} else {
				addSpecial = ' ' + array[0].name;
			}
			cost = tier === 4 && id === 'SA_30' ? 0 : (cost as number) * tier!;
		}

		if (addSpecial !== '') {
			name += addSpecial;
		}

		const args: RemoveObject = { id, index, cost };

		return (
			<div className={classNames({
				'imp': isImportant,
				'list-item': true,
				'typ': isTypical,
				'untyp': isUntypical,
			})}
			>
				<div className="name">
					<p className="title">{name}</p>
				</div>
				<div className="selections">
					{tierElement}
				</div>
				<div className="hr"></div>
				{gr ? <div className="group">{specialAbilityGroupNames[gr - 1]}</div> : undefined}
				<div className="values">
					<div className="cost">{cost}</div>
				</div>
				<div className="btns">
					{phase === 2 ? (
						<IconButton
							icon="&#xE15B;"
							onClick={this.removeFromList.bind(null, args as DeactivateArgs)}
							disabled={disabled}
							flat
							/>
					) : null}
					<IconButton icon="&#xE88F;" flat disabled />
				</div>
			</div>
		);
	}
}
