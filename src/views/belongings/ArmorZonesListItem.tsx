import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { ArmorZonesInstance } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { ArmorZonesEditor } from './ArmorZonesEditor';

interface Props {
	data: ArmorZonesInstance;
}

export class ArmorZonesListItem extends React.Component<Props, undefined> {
	edit = () => {
		const item = EquipmentStore.getArmorZones(this.props.data.id);
		createOverlay(<ArmorZonesEditor item={item} />);
	}
	delete = () => EquipmentActions.removeArmorZonesFromList(this.props.data.id);
	add = () => EquipmentActions.addArmorZonesToList(this.props.data);

	render() {

		const { data: item } = this.props;
		const { name } = item;

		return (
			<TooltipToggle content={
				<div className="inventory-item">
					<h4><span>{name}</span></h4>
				</div>
			} margin={11}>
				<ListItem>
					<ListItemName name={name} />
					<ListItemSeparator />
					<ListItemButtons>
						<IconButton
							icon="&#xE254;"
							onClick={this.edit}
							flat
							/>
						<IconButton
							icon="&#xE872;"
							onClick={this.delete}
							flat
							/>
					</ListItemButtons>
				</ListItem>
			</TooltipToggle>
		);
	}
}
