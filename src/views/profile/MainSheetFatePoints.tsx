import * as React from 'react';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { _translate, UIMessages } from '../../utils/I18n';

export interface SkillsSheetLanguagesProps {
	fatePointsModifier: number;
	locale: UIMessages;
}

export function MainSheetFatePoints(props: SkillsSheetLanguagesProps) {
	const { fatePointsModifier, locale } = props;
	// let bonus = 0;

	// const increaseObject = get('ADV_14') as AdvantageInstance;
	// const decreaseObject = get('DISADV_31') as DisadvantageInstance;
	// if (isActive(increaseObject)) {
	// 	bonus += increaseObject.active[0].tier!;
	// }
	// else if (isActive(decreaseObject)) {
	// 	bonus -= decreaseObject.active[0].tier!;
	// }

	return (
		<TextBox className="fate-points" label={_translate(locale, 'charactersheet.main.fatepoints')}>
			<LabelBox label={_translate(locale, 'charactersheet.main.headers.value')} value="3" />
			<LabelBox label={_translate(locale, 'charactersheet.main.headers.bonus')} value={fatePointsModifier} />
			<LabelBox label={_translate(locale, 'charactersheet.main.headers.max')} value={3 + fatePointsModifier} />
			<LabelBox label={_translate(locale, 'charactersheet.main.headers.current')} value="" />
		</TextBox>
	);
}
