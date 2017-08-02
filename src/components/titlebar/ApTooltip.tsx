import * as React from 'react';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { AdventurePoints } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { getAdvantagesDisadvantagesSubMax } from '../../utils/APUtils';
import { _translate } from '../../utils/I18n';

export interface ApTooltipProps {
	ap: AdventurePoints;
	dependent: DependentInstancesState;
	locale?: UIMessages;
}

export function ApTooltip(props: ApTooltipProps) {
	const { ap: { total, spent, adv, disadv }, dependent, locale } = props;
	const magical = getAdvantagesDisadvantagesSubMax(dependent, 1);

	return (
		<div className="ap-details">
			<h4>{_translate(locale, 'titlebar.adventurepoints.title')}</h4>
			<p className="general">
				{_translate(locale, 'titlebar.adventurepoints.total', total)}<br/>
				{_translate(locale, 'titlebar.adventurepoints.spent', spent)}
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.advantages', adv[0], 80)}</span>
				<span>{adv[1] > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', adv[1], magical)}</span>
				<span>{adv[2] > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', adv[2], 50)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.disadvantages', disadv[0], 80)}</span>
				<span>{disadv[1] > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesmagic', disadv[1], magical)}</span>
				<span>{disadv[2] > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesblessed', disadv[2], 50)}</span>
			</p>
		</div>
	);
}
