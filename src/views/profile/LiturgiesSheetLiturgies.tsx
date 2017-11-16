import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SecondaryAttribute } from '../../types/data.d';
import { Attribute, Liturgy, UIMessages } from '../../types/view.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { LiturgiesSheetLiturgiesTableRow } from './LiturgiesSheetLiturgiesTableRow';

export interface LiturgiesSheetLiturgiesProps {
	attributes: Attribute[];
	checkAttributeValueVisibility: boolean;
	derivedCharacteristics: SecondaryAttribute[];
	liturgies: Liturgy[];
	locale: UIMessages;
}

export function LiturgiesSheetLiturgies(props: LiturgiesSheetLiturgiesProps) {
	const { liturgies, locale } = props;
	const sortedLiturgies = sortObjects(liturgies, locale.id);
	const list = Array<Liturgy | undefined>(21).fill(undefined);
	list.splice(0, Math.min(sortedLiturgies.length, 21), ...sortedLiturgies);

	return (
		<TextBox label={_translate(locale, 'charactersheet.chants.chantslist.title')} className="skill-list">
			<table>
				<thead>
					<tr>
						<th className="name">{_translate(locale, 'charactersheet.chants.chantslist.headers.liturgyceremony')}</th>
						<th className="check">{_translate(locale, 'charactersheet.chants.chantslist.headers.check')}</th>
						<th className="value">{_translate(locale, 'charactersheet.chants.chantslist.headers.sr')}</th>
						<th className="cost">{_translate(locale, 'charactersheet.chants.chantslist.headers.cost')}</th>
						<th className="cast-time">{_translate(locale, 'charactersheet.chants.chantslist.headers.castingtime')}</th>
						<th className="range">{_translate(locale, 'charactersheet.chants.chantslist.headers.range')}</th>
						<th className="duration">{_translate(locale, 'charactersheet.chants.chantslist.headers.duration')}</th>
						<th className="aspect">{_translate(locale, 'charactersheet.chants.chantslist.headers.property')}</th>
						<th className="ic">{_translate(locale, 'charactersheet.chants.chantslist.headers.ic')}</th>
						<th className="effect">{_translate(locale, 'charactersheet.chants.chantslist.headers.effect')}</th>
						<th className="ref">{_translate(locale, 'charactersheet.chants.chantslist.headers.page')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) =>
							<LiturgiesSheetLiturgiesTableRow
								{...props}
								key={e ? e.id : `u${i}`}
								liturgy={e}
								/>
						)
					}
				</tbody>
			</table>
		</TextBox>
	);
}
