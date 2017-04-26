import * as React from 'react';
import * as AttributesActions from '../../actions/AttributesActions';
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
					label="pAsP"
					name="Perm. Astralenergie"
					redeemed={AE.permanentRedeemed}
					lost={AE.permanentLost}
					redeem={AttributesActions.redeemAEPoint}
					removeRedeemed={AttributesActions.removeRedeemedAEPoint}
					removePermanent={AttributesActions.removePermanentAEPoint}
					phase={phase}
					/>
			) : <div className="placeholder"></div> }
			{ typeof KP.value === 'number' && (
				<AttributesPermanentListItem
					label="pKaP"
					name="Perm. Karmaenergie"
					redeemed={KP.permanentRedeemed}
					lost={KP.permanentLost}
					redeem={AttributesActions.redeemKPPoint}
					removeRedeemed={AttributesActions.removeRedeemedKPPoint}
					removePermanent={AttributesActions.removePermanentKPPoint}
					phase={phase}
					/>
			) }
		</div>
	);
}
