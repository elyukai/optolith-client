import * as React from 'react';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { AdvantageInstance, DisadvantageInstance } from '../../types/data.d';
import { isActive } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';

export function MainSheetFatePoints() {
	let bonus = 0;

	const increaseObject = get('ADV_14') as AdvantageInstance;
	const decreaseObject = get('DISADV_31') as DisadvantageInstance;
	if (isActive(increaseObject)) {
		bonus += increaseObject.active[0].tier!;
	}
	else if (isActive(decreaseObject)) {
		bonus -= decreaseObject.active[0].tier!;
	}

	return (
		<TextBox className="fate-points" label={translate('charactersheet.main.fatepoints')}>
			<LabelBox label={translate('charactersheet.main.headers.value')} value="3" />
			<LabelBox label={translate('charactersheet.main.headers.bonus')} value={bonus} />
			<LabelBox label={translate('charactersheet.main.headers.max')} value={3 + bonus} />
			<LabelBox label={translate('charactersheet.main.headers.current')} value="" />
		</TextBox>
	);
}
