import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { UIMessages } from '../../types/ui.d';
import { Attribute } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { sign } from '../../utils/NumberUtils';

export interface AttributesAdjustmentProps {
	adjustmentValue: number | undefined;
	attributes: Attribute[];
	availableAttributeIds: string[] | undefined;
	currentAttributeId: string | undefined;
	locale: UIMessages;
	setAdjustmentId(id: string): void;
}

export function AttributesAdjustment(props: AttributesAdjustmentProps) {
	const { attributes, locale, currentAttributeId, adjustmentValue, availableAttributeIds, setAdjustmentId } = props;
	return (
		<div className="attribute-adjustment">
			<span className="label">{_translate(locale, 'attributeadjustmentselection')}</span>
			{availableAttributeIds && adjustmentValue && <Dropdown
				options={attributes.filter(e => availableAttributeIds.includes(e.id)).map(({ id, name }) => ({
					id,
					name: `${name} ${sign(adjustmentValue)}`
				}))}
				value={currentAttributeId}
				onChange={setAdjustmentId}
				disabled={currentAttributeId === undefined}
				/>}
		</div>
	);
}
