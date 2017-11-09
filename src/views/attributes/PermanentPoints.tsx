import * as React from 'react';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { IconButton } from '../../components/IconButton';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface PermanentPointsProps extends DialogProps {
	id: 'LP' | 'AE' | 'KP';
	locale: UIMessages;
	permanentBoughtBack?: number;
	permanentSpent: number;
	addBoughtBackPoint?(): void;
	addLostPoint(): void;
	removeBoughtBackPoint?(): void;
	removeLostPoint(): void;
}

export function PermanentPoints(props: PermanentPointsProps) {
	const { id, locale, addBoughtBackPoint, addLostPoint, permanentBoughtBack, permanentSpent, removeBoughtBackPoint, removeLostPoint } = props;
	return (
		<Dialog
			{...props}
			className="permanent-points-editor"
			title={id === 'AE' ? _translate(locale, 'attributes.pae.name') : id === 'KP' ? _translate(locale, 'attributes.pkp.name') : _translate(locale, 'plp.long')}
			buttons={[{autoWidth: true, label: _translate(locale, 'actions.done')}]}
			>
			<div className="main">
				{addBoughtBackPoint && removeBoughtBackPoint && typeof permanentBoughtBack === 'number' && <div className="column boughtback">
					<div className="value">{permanentBoughtBack}</div>
					<div className="description smallcaps">{_translate(locale, 'permanentpoints.boughtback')}</div>
					<div className="buttons">
						<IconButton className="add" icon="&#xE908;" onClick={addBoughtBackPoint} disabled={permanentBoughtBack >= permanentSpent} />
						<IconButton className="remove" icon="&#xE909;" onClick={removeBoughtBackPoint} disabled={permanentBoughtBack <= 0} />
					</div>
				</div>}
				<div className="column lost">
					<div className="value">{permanentSpent}</div>
					<div className="description smallcaps">{_translate(locale, 'permanentpoints.spent')}</div>
					<div className="buttons">
						<IconButton className="add" icon="&#xE908;" onClick={addLostPoint} />
						<IconButton className="remove" icon="&#xE909;" onClick={removeLostPoint} disabled={permanentSpent <= 0} />
					</div>
				</div>
			</div>
		</Dialog>
	);
}
