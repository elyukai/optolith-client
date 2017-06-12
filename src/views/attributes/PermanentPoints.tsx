import * as React from 'react';
import * as AttributesActions from '../../actions/AttributesActions';
import { Dialog } from '../../components/Dialog';
import { IconButton } from '../../components/IconButton';
import { AttributeStore } from '../../stores/AttributeStore';
import { translate } from '../../utils/I18n';

export interface PermanentPointsProps {
	id: 'AE' | 'KP';
	node?: HTMLDivElement;
}

export interface PermanentPointsState {
	permanentBoughtBack: number;
	permanentSpent: number;
}

export class PermanentPoints extends React.Component<PermanentPointsProps, PermanentPointsState> {
	state = {
		permanentBoughtBack: AttributeStore.getAddEnergies().permanentAE.redeemed,
		permanentSpent: AttributeStore.getAddEnergies().permanentAE.lost
	};

	componentDidMount() {
		AttributeStore.addChangeListener(this.updateAttributeStore);
	}

	componentWillUnmount() {
		AttributeStore.removeChangeListener(this.updateAttributeStore);
	}

	render() {
		const { id, node } = this.props;
		const { permanentBoughtBack, permanentSpent } = this.state;
		return (
			<Dialog
				id="permanent-points-editor"
				title={id === 'AE' ? translate('attributes.pae.name') : translate('attributes.pkp.name')}
				node={node}
				buttons={[{autoWidth: true, label: translate('actions.done')}]}
				>
				<div className="main">
					<div className="column boughtback">
						<div className="value">{permanentBoughtBack}</div>
						<div className="description smallcaps">{translate('permanentpoints.boughtback')}</div>
						<div className="buttons">
							<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? AttributesActions.addBoughtBackAEPoint : AttributesActions.addBoughtBackKPPoint} disabled={permanentBoughtBack >= permanentSpent} />
							<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? AttributesActions.removeBoughtBackAEPoint : AttributesActions.removeBoughtBackKPPoint} disabled={permanentBoughtBack <= 0} />
						</div>
					</div>
					<div className="column lost">
						<div className="value">{permanentSpent}</div>
						<div className="description smallcaps">{translate('permanentpoints.spent')}</div>
						<div className="buttons">
							<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? AttributesActions.addLostAEPoint : AttributesActions.addLostKPPoint} />
							<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? AttributesActions.removeLostAEPoint : AttributesActions.removeLostKPPoint} disabled={permanentSpent <= 0} />
						</div>
					</div>
				</div>
			</Dialog>
		);
	}

	private updateAttributeStore = () => {
		this.setState({
			permanentBoughtBack: AttributeStore.getAddEnergies().permanentAE.redeemed,
			permanentSpent: AttributeStore.getAddEnergies().permanentAE.lost
		});
	}
}
