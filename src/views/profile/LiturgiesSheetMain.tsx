import * as classNames from 'classnames';
import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { LiturgiesStore } from '../../stores/LiturgiesStore';
import { AttributeInstance, LiturgyInstance, SpecialAbilityInstance } from '../../types/data.d';
import { getSids } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';
import { sort } from '../../utils/ListUtils';
import { getAspectsOfTradition } from '../../utils/LiturgyUtils';
import { get as getSec } from '../../utils/secondaryAttributes';

interface Props {
	attributeValueVisibility: boolean;
}

export function LiturgiesSheetMain(props: Props) {
	const filtered = LiturgiesStore.getAll().filter(e => e.active);
	const liturgies = sort(filtered, LiturgiesStore.getSortOrder());
	const list = Array<LiturgyInstance | undefined>(21).fill(undefined);
	list.splice(0, Math.min(liturgies.length, 21), ...liturgies);

	const rowIterator = (e: LiturgyInstance, i: number) => {
		if (e) {
			const rawCheck = e.check;
			const checkmod = rawCheck.splice(3)[0] as 'SPI' | 'TOU' | undefined;
			const check = rawCheck.map(attr => {
				const attribute = get(attr) as AttributeInstance;
				if (props.attributeValueVisibility === true) {
					return attribute.value;
				}
				else {
					return attribute.short;
				}
			}).join('/');
			const traditionId = getSids(get('SA_102') as SpecialAbilityInstance)[0];
			const aspectIds = e.aspects.filter(e => getAspectsOfTradition(traditionId as number + 1).includes(e));
			const aspects = aspectIds.map(e => translate('liturgies.view.aspects')[e - 1]).sort();

			return (
				<tr key={e.id}>
					<td className="name">{e.name}</td>
					<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${getSec(checkmod).short})` : null}</td>
					<td className="value">{e.value}</td>
					<td className="cost"></td>
					<td className="cast-time"></td>
					<td className="range"></td>
					<td className="duration"></td>
					<td className={classNames('aspect', checkmod && 'multi')}>{aspects.join(', ')}</td>
					<td className="ic">{['A', 'B', 'C', 'D'][e.ic - 1]}</td>
					<td className="effect"></td>
					<td className="ref"></td>
				</tr>
			);
		}
		else {
			return (
				<tr key={`undefined${i}`}>
					<td className="name"></td>
					<td className="check"></td>
					<td className="value"></td>
					<td className="cost"></td>
					<td className="cast-time"></td>
					<td className="range"></td>
					<td className="duration"></td>
					<td className="aspect"></td>
					<td className="ic"></td>
					<td className="effect"></td>
					<td className="ref"></td>
				</tr>
			);
		}
	};

	return (
		<TextBox label={translate('charactersheet.chants.chantslist.title')} className="skill-list">
			<table>
				<thead>
					<tr>
						<th className="name">{translate('charactersheet.chants.chantslist.headers.liturgyceremony')}</th>
						<th className="check">{translate('charactersheet.chants.chantslist.headers.check')}</th>
						<th className="value">{translate('charactersheet.chants.chantslist.headers.sr')}</th>
						<th className="cost">{translate('charactersheet.chants.chantslist.headers.cost')}</th>
						<th className="cast-time">{translate('charactersheet.chants.chantslist.headers.castingtime')}</th>
						<th className="range">{translate('charactersheet.chants.chantslist.headers.range')}</th>
						<th className="duration">{translate('charactersheet.chants.chantslist.headers.duration')}</th>
						<th className="aspect">{translate('charactersheet.chants.chantslist.headers.property')}</th>
						<th className="ic">{translate('charactersheet.chants.chantslist.headers.ic')}</th>
						<th className="effect">{translate('charactersheet.chants.chantslist.headers.effect')}</th>
						<th className="ref">{translate('charactersheet.chants.chantslist.headers.page')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map(rowIterator)
					}
				</tbody>
			</table>
		</TextBox>
	);
}
