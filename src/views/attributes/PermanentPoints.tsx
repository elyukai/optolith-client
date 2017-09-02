import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { IconButton } from '../../components/IconButton';
import { store } from '../../stores/AppStore';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface PermanentPointsProps {
	id: 'AE' | 'KP';
	node?: HTMLDivElement;
	locale: UIMessages;
	addBoughtBackAEPoint(): void;
	removeBoughtBackAEPoint(): void;
	addLostAEPoint(): void;
	removeLostAEPoint(): void;
	addBoughtBackKPPoint(): void;
	removeBoughtBackKPPoint(): void;
	addLostKPPoint(): void;
	removeLostKPPoint(): void;
}

export interface PermanentPointsState {
	permanentBoughtBack: number;
	permanentSpent: number;
}

export class PermanentPoints extends React.Component<PermanentPointsProps, PermanentPointsState> {
	state = this.getState();
	unsubscribe: () => void;

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => this.setState(this.getState()));
	}

	private getState(): PermanentPointsState {
		const { lost, redeemed } = store.getState().currentHero.present.energies[this.props.id === 'AE' ? 'permanentArcaneEnergy' : 'permanentKarmaPoints'];
		return {
			permanentBoughtBack: redeemed,
			permanentSpent: lost
		};
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const { id, locale, node, addBoughtBackAEPoint, addBoughtBackKPPoint, addLostAEPoint, addLostKPPoint, removeBoughtBackAEPoint, removeBoughtBackKPPoint, removeLostAEPoint, removeLostKPPoint } = this.props;
		const { permanentBoughtBack, permanentSpent } = this.state;
		return (
			<Dialog
				id="permanent-points-editor"
				title={id === 'AE' ? _translate(locale, 'attributes.pae.name') : _translate(locale, 'attributes.pkp.name')}
				node={node}
				buttons={[{autoWidth: true, label: _translate(locale, 'actions.done')}]}
				>
				<div className="main">
					<div className="column boughtback">
						<div className="value">{permanentBoughtBack}</div>
						<div className="description smallcaps">{_translate(locale, 'permanentpoints.boughtback')}</div>
						<div className="buttons">
							<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? addBoughtBackAEPoint : addBoughtBackKPPoint} disabled={permanentBoughtBack >= permanentSpent} />
							<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? removeBoughtBackAEPoint : removeBoughtBackKPPoint} disabled={permanentBoughtBack <= 0} />
						</div>
					</div>
					<div className="column lost">
						<div className="value">{permanentSpent}</div>
						<div className="description smallcaps">{_translate(locale, 'permanentpoints.spent')}</div>
						<div className="buttons">
							<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? addLostAEPoint : addLostKPPoint} />
							<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? removeLostAEPoint : removeLostKPPoint} disabled={permanentSpent <= 0} />
						</div>
					</div>
				</div>
			</Dialog>
		);
	}
}
