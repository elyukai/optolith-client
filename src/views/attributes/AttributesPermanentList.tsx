import * as React from 'react';
import * as AttributesActions from '../../actions/AttributesActions';
import { translate } from '../../utils/I18n';
import { getAE, getKP } from '../../utils/secondaryAttributes';
import { AttributesPermanentListItem } from './AttributesPermanentListItem';

export interface AttributesPermanentListProps {
	phase: number;
}

export function AttributesPermanentList(props: AttributesPermanentListProps) {
	const { phase } = props;
	const AE = getAE();
	const KP = getKP();

	return (
		<div className="permanent">
			{ typeof AE.value === 'number' ? (
				<AttributesPermanentListItem
					id="AE"
					label={translate('attributes.pae.short')}
					name={translate('attributes.pae.name')}
					boughtBack={AE.permanentRedeemed}
					lost={AE.permanentLost}
					addBoughtBack={AttributesActions.addBoughtBackAEPoint}
					addLost={AttributesActions.addLostAEPoint}
					phase={phase}
					/>
			) : <div className="placeholder"></div> }
			{ typeof KP.value === 'number' && (
				<AttributesPermanentListItem
					id="KP"
					label={translate('attributes.pkp.short')}
					name={translate('attributes.pkp.name')}
					boughtBack={KP.permanentRedeemed}
					lost={KP.permanentLost}
					addBoughtBack={AttributesActions.addBoughtBackKPPoint}
					addLost={AttributesActions.addLostKPPoint}
					phase={phase}
					/>
			) }
		</div>
	);
}
