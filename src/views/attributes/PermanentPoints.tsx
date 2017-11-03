import * as React from 'react';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { IconButton } from '../../components/IconButton';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface PermanentPointsProps extends DialogProps {
	id: 'AE' | 'KP';
	locale: UIMessages;
	permanentBoughtBack: number;
	permanentSpent: number;
	addBoughtBackAEPoint(): void;
	removeBoughtBackAEPoint(): void;
	addLostAEPoint(): void;
	removeLostAEPoint(): void;
	addBoughtBackKPPoint(): void;
	removeBoughtBackKPPoint(): void;
	addLostKPPoint(): void;
	removeLostKPPoint(): void;
}

export function PermanentPoints(props: PermanentPointsProps) {
	const { id, locale, addBoughtBackAEPoint, addBoughtBackKPPoint, addLostAEPoint, addLostKPPoint, permanentBoughtBack, permanentSpent, removeBoughtBackAEPoint, removeBoughtBackKPPoint, removeLostAEPoint, removeLostKPPoint } = props;
	return (
		<Dialog
			{...props}
			className="permanent-points-editor"
			title={id === 'AE' ? _translate(locale, 'attributes.pae.name') : _translate(locale, 'attributes.pkp.name')}
			buttons={[{autoWidth: true, label: _translate(locale, 'actions.done')}]}
			>
			<div className="main">
				<div className="column boughtback">
					<div className="value">{permanentBoughtBack}</div>
					<div className="description smallcaps">{_translate(locale, 'permanentpoints.boughtback')}</div>
					<div className="buttons">
						<IconButton className="add" icon="&#xE908;" onClick={id === 'AE' ? addBoughtBackAEPoint : addBoughtBackKPPoint} disabled={permanentBoughtBack >= permanentSpent} />
						<IconButton className="remove" icon="&#xE909;" onClick={id === 'AE' ? removeBoughtBackAEPoint : removeBoughtBackKPPoint} disabled={permanentBoughtBack <= 0} />
					</div>
				</div>
				<div className="column lost">
					<div className="value">{permanentSpent}</div>
					<div className="description smallcaps">{_translate(locale, 'permanentpoints.spent')}</div>
					<div className="buttons">
						<IconButton className="add" icon="&#xE908;" onClick={id === 'AE' ? addLostAEPoint : addLostKPPoint} />
						<IconButton className="remove" icon="&#xE909;" onClick={id === 'AE' ? removeLostAEPoint : removeLostKPPoint} disabled={permanentSpent <= 0} />
					</div>
				</div>
			</div>
		</Dialog>
	);
}
