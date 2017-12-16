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
	isRemovingEnabled: boolean;
	hideGroup?: boolean;
	isImportant?: boolean;
	isTypical?: boolean;
	isUntypical?: boolean;
	setTier(id: string, index: number, tier: number): void;
	removeFromList(args: DeactivateArgs): void;
	selectForInfo?(id: string): void;
}

export class ActivatableRemoveListItem extends React.Component<ActivatableRemoveListItemProps> {
	handleSelectTier = (selectedTier: number) => {
		const { id, index} = this.props.item;
		this.props.setTier(id, index, selectedTier);
	}
	removeFromList = (args: DeactivateArgs) => this.props.removeFromList(args);

	render() {
		const { isRemovingEnabled, hideGroup, item, isImportant, isTypical, isUntypical, locale, selectForInfo } = this.props;
		const { id, minTier = 1, tier, maxTier = Number.MAX_SAFE_INTEGER, index, disabled, gr, cost, customCost, instance: { tiers } } = item;
		let { name } = item;
		let addSpecial;

		let tierElement;
		if (typeof tier === 'number' && typeof tiers === 'number' && !['DISADV_34', 'DISADV_50'].includes(id)) {
			const min = !isRemovingEnabled ? tier : Math.max(1, minTier);
			const max = Math.min(tiers, maxTier);
			const array = Array.from({ length: max - min + 1 }, (_, index) => ({ id: index + min, name: getRoman(index + min) }));
			if (id === 'SA_29' && (tier === 4 || isRemovingEnabled)) {
				array.push({ id: 4, name: _translate(locale, 'mothertongue.short') });
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
		}

		if (typeof addSpecial === 'string') {
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
					{isRemovingEnabled && <IconButton
						icon="&#xE90b;"
						onClick={this.removeFromList.bind(null, args as DeactivateArgs)}
						disabled={disabled}
						flat
						/>}
					<IconButton icon="&#xE912;" disabled={!selectForInfo} onClick={() => selectForInfo && selectForInfo(id)} flat />
				</ListItemButtons>
			</ListItem>
		);
	}
}
