import * as React from 'react';
import * as AttributesActions from '../../actions/AttributesActions';
import { getAE, getKP } from '../../utils/secondaryAttributes';
import AttributesPermanentListItem from './AttributesPermanentListItem';

interface Props {
	phase: number;
}

export default class AttributesPermanentList extends React.Component<Props, undefined> {
	render() {
		const { phase } = this.props;
		const AE = getAE();
		const KP = getKP();

		return (
			<div className="permanent">
				{ typeof AE.value === 'number' ? (
					<AttributesPermanentListItem
						redeemed={AE.permanentRedeemed}
						lost={AE.permanentLost}
						redeem={AttributesActions.redeemAEPoint}
						removeRedeemed={AttributesActions.removeRedeemedAEPoint}
						removePermanent={AttributesActions.removePermanentAEPoint}
						phase={phase}
						/>
				) : <div className="placeholder"></div> }
				{ typeof KP.value === 'number' ? (
					<AttributesPermanentListItem
						redeemed={KP.permanentRedeemed}
						lost={KP.permanentLost}
						redeem={AttributesActions.redeemKPPoint}
						removeRedeemed={AttributesActions.removeRedeemedKPPoint}
						removePermanent={AttributesActions.removePermanentKPPoint}
						phase={phase}
						/>
				) : null }
			</div>
		);
	}
}
