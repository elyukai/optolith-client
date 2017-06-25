import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { IconButton } from '../../components/IconButton';
import { translate } from '../../utils/I18n';

export interface PermanentPointsProps {
	id: 'AE' | 'KP';
	node?: HTMLDivElement;
	permanentBoughtBack: number;
	permanentSpent: number;
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

export function PermanentPoints(props: PermanentPointsProps) {
	const { id, node, permanentBoughtBack, permanentSpent } = props;
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
						<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? props.addBoughtBackAEPoint : props.addBoughtBackKPPoint} disabled={permanentBoughtBack >= permanentSpent} />
						<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? props.removeBoughtBackAEPoint : props.removeBoughtBackKPPoint} disabled={permanentBoughtBack <= 0} />
					</div>
				</div>
				<div className="column lost">
					<div className="value">{permanentSpent}</div>
					<div className="description smallcaps">{translate('permanentpoints.spent')}</div>
					<div className="buttons">
						<IconButton className="add" icon="&#xE145;" onClick={id === 'AE' ? props.addLostAEPoint : props.addLostKPPoint} />
						<IconButton className="remove" icon="&#xE15B;" onClick={id === 'AE' ? props.removeLostAEPoint : props.removeLostKPPoint} disabled={permanentSpent <= 0} />
					</div>
				</div>
			</div>
		</Dialog>
	);
}
