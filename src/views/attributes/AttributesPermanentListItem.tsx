import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { AttributeBorder } from './AttributeBorder';
import { AttributesRemovePermanent } from './AttributesRemovePermanent';
import { PermanentPoints } from './PermanentPoints';

export interface AttributesPermanentListItemProps {
	locale: UIMessages;
	id: 'LP' | 'AE' | 'KP';
	label: string;
	name: string;
	boughtBack?: number;
	lost: number;
	isRemovingEnabled: boolean;
	addBoughtBackPoint?(): void;
	addLostPoint(): void;
	addLostPoints(value: number): void;
	removeBoughtBackPoint?(): void;
	removeLostPoint(): void;
}

export interface AttributesPermanentListItemState {
	isAddDialogOpened: boolean;
	isEditDialogOpened: boolean;
}

export class AttributesPermanentListItem extends React.Component<AttributesPermanentListItemProps, AttributesPermanentListItemState> {
	state = {
		isAddDialogOpened: false,
		isEditDialogOpened: false
	};

	openEditDialog = () => this.setState(() => ({ isEditDialogOpened: true } as AttributesPermanentListItemState));
	openAddDialog = () => this.setState(() => ({ isAddDialogOpened: true } as AttributesPermanentListItemState));
	closeEditDialog = () => this.setState(() => ({ isEditDialogOpened: false } as AttributesPermanentListItemState));
	closeAddDialog = () => this.setState(() => ({ isAddDialogOpened: false } as AttributesPermanentListItemState));

	render() {
		const { id, label, locale, name, isRemovingEnabled, addBoughtBackPoint, addLostPoints, boughtBack, lost, ...other } = this.props;
		const { isAddDialogOpened, isEditDialogOpened } = this.state;
		const available = typeof boughtBack === 'number' ? lost - boughtBack : lost;

		return (
			<AttributeBorder
				label={label}
				value={available}
				tooltip={<div className="calc-attr-overlay">
					<h4><span>{name}</span><span>{available}</span></h4>
					{typeof boughtBack === 'number' ? <p>
						{_translate(locale, 'attributes.tooltips.losttotal')}: {lost}<br/>
						{_translate(locale, 'attributes.tooltips.boughtback')}: {boughtBack}
					</p> : <p>
						{_translate(locale, 'attributes.tooltips.losttotal')}: {lost}
					</p>}
				</div>}
				tooltipMargin={7}
				>
				{isRemovingEnabled && (
					<IconButton
						className="edit"
						icon="&#xE90c;"
						onClick={this.openEditDialog}
						/>
				)}
				<PermanentPoints
					{...other}
					id={id}
					locale={locale}
					isOpened={isEditDialogOpened}
					close={this.closeEditDialog}
					permanentBoughtBack={boughtBack}
					permanentSpent={lost}
					/>
				{!isRemovingEnabled && (
					<IconButton
						className="add"
						icon="&#xE908;"
						onClick={this.openAddDialog}
						/>
				)}
				<AttributesRemovePermanent
					remove={addLostPoints}
					locale={locale}
					isOpened={isAddDialogOpened}
					close={this.closeAddDialog}
					/>
				{!isRemovingEnabled && addBoughtBackPoint && (
					<IconButton
						className="remove"
						icon="&#xE909;"
						onClick={addBoughtBackPoint}
						disabled={available <= 0}
						/>
				)}
			</AttributeBorder>
		);
	}
}
