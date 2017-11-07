import * as React from 'react';
import { EnergyWithLoss, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { AttributesPermanentListItem } from './AttributesPermanentListItem';

export interface AttributesPermanentListProps {
	derived: SecondaryAttribute[];
	locale: UIMessages;
	isInCharacterCreation: boolean;
	isRemovingEnabled: boolean;
	addBoughtBackAEPoint(): void;
	removeBoughtBackAEPoint(): void;
	addLostAEPoint(): void;
	removeLostAEPoint(): void;
	addLostAEPoints(value: number): void;
	addBoughtBackKPPoint(): void;
	removeBoughtBackKPPoint(): void;
	addLostKPPoint(): void;
	removeLostKPPoint(): void;
	addLostKPPoints(value: number): void;
}

export function AttributesPermanentList(props: AttributesPermanentListProps) {
	const AE = props.derived.find(e => e.id === 'AE') as EnergyWithLoss | undefined;
	const KP = props.derived.find(e => e.id === 'KP') as EnergyWithLoss | undefined;

	return (
		<div className="permanent">
			{ AE !== undefined && typeof AE.value === 'number' ? (
				<AttributesPermanentListItem
					{...props}
					id="AE"
					label={_translate(props.locale, 'attributes.pae.short')}
					name={_translate(props.locale, 'attributes.pae.name')}
					boughtBack={AE.permanentRedeemed}
					lost={AE.permanentLost}
					addBoughtBack={props.addBoughtBackAEPoint}
					addLost={props.addLostAEPoints}
					/>
			) : <div className="placeholder"></div> }
			{ KP !== undefined && typeof KP.value === 'number' && (
				<AttributesPermanentListItem
					{...props}
					id="KP"
					label={_translate(props.locale, 'attributes.pkp.short')}
					name={_translate(props.locale, 'attributes.pkp.name')}
					boughtBack={KP.permanentRedeemed}
					lost={KP.permanentLost}
					addBoughtBack={props.addBoughtBackKPPoint}
					addLost={props.addLostKPPoints}
					/>
			) }
		</div>
	);
}
