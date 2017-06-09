import * as React from 'react';
import { AdventurePoints, UILocale } from '../../types/data.d';
import { getAdvantagesDisadvantagesSubMax } from '../../utils/APUtils';
import { translate } from '../../utils/I18n';

export interface ApTooltipProps {
	ap: AdventurePoints;
	locale: UILocale;
}

export function ApTooltip(props: ApTooltipProps) {
	const { ap: { total, spent, adv, disadv }, locale } = props;
	const magical = getAdvantagesDisadvantagesSubMax(1);

	return (
		<div className="ap-details">
			<h4>{locale['titlebar.adventurepoints.title']}</h4>
			<p className="general">
				{translate('titlebar.adventurepoints.total', total)}<br/>
				{translate('titlebar.adventurepoints.spent', spent)}
			</p>
			<hr />
			<p>
				<span>{translate('titlebar.adventurepoints.advantages', adv[0], 80)}</span>
				<span>{adv[1] > 0 && translate('titlebar.adventurepoints.advantagesmagic', adv[1], magical)}</span>
				<span>{adv[2] > 0 && translate('titlebar.adventurepoints.advantagesblessed', adv[2], 50)}</span>
				<span>{translate('titlebar.adventurepoints.disadvantages', disadv[0], 80)}</span>
				<span>{disadv[1] > 0 && translate('titlebar.adventurepoints.disadvantagesmagic', disadv[1], magical)}</span>
				<span>{disadv[2] > 0 && translate('titlebar.adventurepoints.disadvantagesblessed', disadv[2], 50)}</span>
			</p>
		</div>
	);
}
