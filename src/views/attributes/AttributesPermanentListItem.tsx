import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { createOverlay } from '../../utils/createOverlay';
import { translate } from '../../utils/I18n';
import { AttributeBorder } from './AttributeBorder';
import { AttributesRemovePermanent } from './AttributesRemovePermanent';
import { PermanentPoints } from './PermanentPoints';

export interface AttributesPermanentListItemProps {
	id: 'AE' | 'KP';
	label: string;
	name: string;
	boughtBack: number;
	lost: number;
	phase: number;
	addBoughtBack(): void;
	addLost(value: number): void;
}

export function AttributesPermanentListItem(props: AttributesPermanentListItemProps) {
	const { id, label, name, phase, addBoughtBack, addLost, boughtBack, lost } = props;
	const available = lost - boughtBack;

	return (
		<AttributeBorder
			label={label}
			value={available}
			tooltip={<div className="calc-attr-overlay">
				<h4><span>{name}</span><span>{available}</span></h4>
				<p>
					{translate('attributes.tooltips.losttotal')}: {lost}<br/>
					{translate('attributes.tooltips.boughtback')}: {boughtBack}
				</p>
			</div>}
			tooltipMargin={7}
			>
			{phase === 2 && (
				<IconButton
					className="edit"
					icon="&#xE254;"
					onClick={() => createOverlay(<PermanentPoints id={id} />)}
					/>
			)}
			{phase === 3 && (
				<IconButton
					className="add"
					icon="&#xE318;"
					onClick={() => createOverlay(<AttributesRemovePermanent remove={addLost} />)}
					disabled={available > 0}
					/>
			)}
			{phase === 3 && (
				<IconButton
					className="remove"
					icon="&#xE15B;"
					onClick={addBoughtBack}
					disabled={available <= 0}
					/>
			)}
		</AttributeBorder>
	);
}
