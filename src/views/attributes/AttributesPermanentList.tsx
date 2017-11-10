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
	addLostLPPoint(): void;
	removeLostLPPoint(): void;
	addLostLPPoints(value: number): void;
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
	const LP = props.derived.find(e => e.id === 'LP') as EnergyWithLoss;
	const AE = props.derived.find(e => e.id === 'AE') as EnergyWithLoss | undefined;
	const KP = props.derived.find(e => e.id === 'KP') as EnergyWithLoss | undefined;

	console.log(props.addBoughtBackKPPoint);

	return (
		<div className="permanent">
			<AttributesPermanentListItem
				{...props}
				id="LP"
				label={_translate(props.locale, 'plp.short')}
				name={_translate(props.locale, 'plp.long')}
				boughtBack={LP.permanentRedeemed}
				lost={LP.permanentLost}
				addLostPoint={props.addLostLPPoint}
				addLostPoints={props.addLostLPPoints}
				removeLostPoint={props.removeLostLPPoint}
				/>
			{ AE !== undefined && typeof AE.value === 'number' ? (
				<AttributesPermanentListItem
					{...props}
					id="AE"
					label={_translate(props.locale, 'attributes.pae.short')}
					name={_translate(props.locale, 'attributes.pae.name')}
					boughtBack={AE.permanentRedeemed}
					lost={AE.permanentLost}
					addBoughtBackPoint={props.addBoughtBackAEPoint}
					addLostPoint={props.addLostAEPoint}
					addLostPoints={props.addLostAEPoints}
					removeBoughtBackPoint={props.removeBoughtBackAEPoint}
					removeLostPoint={props.removeLostAEPoint}
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
					addBoughtBackPoint={props.addBoughtBackKPPoint}
					addLostPoint={props.addLostKPPoint}
					addLostPoints={props.addLostKPPoints}
					removeBoughtBackPoint={props.removeBoughtBackKPPoint}
					removeLostPoint={props.removeLostKPPoint}
					/>
			) }
		</div>
	);
}
