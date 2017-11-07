import classNames = require('classnames');
import * as React from 'react';
import { ActiveViewObject, DeactivateArgs, UIMessages } from '../types/data.d';
import { _translate } from '../utils/I18n';
import { getRoman } from '../utils/NumberUtils';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';
import { ListItem } from './ListItem';
import { ListItemButtons } from './ListItemButtons';
import { ListItemGroup } from './ListItemGroup';
import { ListItemName } from './ListItemName';
import { ListItemSelections } from './ListItemSelections';
import { ListItemSeparator } from './ListItemSeparator';
import { ListItemValues } from './ListItemValues';

interface RemoveObject {
	id: string;
	cost: number;
	index: number;
}

export interface ActivatableRemoveListItemProps {
	item: ActiveViewObject;
	locale: UIMessages;
	phase?: number;
	hideGroup?: boolean;
	isImportant?: boolean;
	isTypical?: boolean;
	isUntypical?: boolean;
	setTier(id: string, index: number, tier: number, cost: number): void;
	removeFromList(args: DeactivateArgs): void;
}

export class ActivatableRemoveListItem extends React.Component<ActivatableRemoveListItemProps, undefined> {
	handleSelectTier = (selectedTier: number) => {
		const { id, tier, index, cost } = this.props.item;
		const lower = Math.min(selectedTier, tier!);
		const higher = Math.max(selectedTier, tier!);
		const diff = selectedTier - tier!;
		const finalCost = Array.isArray(cost) ? cost.slice(lower, higher).reduce((a, b) => a + b, 0) * diff / Math.abs(diff) : diff * (cost as number);
		this.props.setTier(id, index, selectedTier, finalCost);
	}
	removeFromList = (args: DeactivateArgs) => this.props.removeFromList(args);

	render() {
		const { phase = 2, hideGroup, item, isImportant, isTypical, isUntypical, locale } = this.props;
		const { id, minTier = 1, tier, tiers, maxTier = Number.MAX_SAFE_INTEGER, index, disabled, gr, customCost } = item;
		let { cost, name } = item;
		let addSpecial = '';

		let tierElement;
		if (tier && tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
			const min = phase === 3 ? tier : Math.max(1, minTier);
			const max = Math.min(tiers, maxTier);
			const array = Array.from({ length: max - min + 1 }, (_, index) => ({ id: index + min, name: getRoman(index + min) }));
			if (id === 'SA_29' && (tier === 4 || phase < 3)) {
				array.push({ id: 4, name: 'MS' });
			}
			if (array.length > 1) {
				tierElement = (
					<Dropdown
						className="tiers"
						value={tier}
						onChange={this.handleSelectTier}
						options={array} />
				);
			}
			else {
				addSpecial = ' ' + array[0].name;
			}
			cost = tier === 4 && id === 'SA_29' ? 0 : Array.isArray(cost) ? cost.slice(0, tier).reduce((a, b) => a + b, 0) : (cost as number) * tier;
		}

		if (addSpecial !== '') {
			name += addSpecial;
		}

		const args: RemoveObject = { id, index, cost };

		return (
			<ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
				<ListItemName name={name} />
				<ListItemSelections>
					{tierElement}
				</ListItemSelections>
				<ListItemSeparator/>
				{!hideGroup && <ListItemGroup list={_translate(locale, 'specialabilities.view.groups')} index={gr} />}
				<ListItemValues>
					<div className={classNames('cost', customCost && 'custom-cost')}>{cost}</div>
				</ListItemValues>
				<ListItemButtons>
					<IconButton
						icon="&#xE90b;"
						onClick={this.removeFromList.bind(null, args as DeactivateArgs)}
						disabled={disabled}
						flat
						/>
					<IconButton icon="&#xE912;" flat disabled />
				</ListItemButtons>
			</ListItem>
		);
	}
}
