import * as React from 'react';
import { _translate, UIMessages } from '../../utils/I18n';

export interface AdvantagesDisadvantagesAdventurePointsProps {
	total: number;
	magical: number;
	magicalMax: number;
	blessed: number;
	locale: UIMessages;
}

export function AdvantagesDisadvantagesAdventurePoints(props: AdvantagesDisadvantagesAdventurePointsProps) {
	const {
		total,
		magical,
		magicalMax,
		blessed,
		locale,
	} = props;

	return (
		<p>
			{_translate(locale, 'titlebar.adventurepoints.advantages', total, 80)}<br/>
			{magical > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', magical, magicalMax)}
			{magical > 0 && blessed > 0 && <br/>}
			{blessed > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', blessed, 50)}
		</p>
	);
}
