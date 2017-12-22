import * as React from 'react';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface ApTooltipProps {
	locale?: UIMessages;
	adventurePoints: AdventurePointsObject;
	spent: number;
	maximumForMagicalAdvantagesDisadvantages: number;
	isSpellcaster: boolean;
	isBlessedOne: boolean;
}

export function ApTooltip(props: ApTooltipProps) {
	const { locale, adventurePoints } = props;

	return (
		<div className="ap-details">
			<h4>{_translate(locale, 'titlebar.adventurepoints.title')}</h4>
			<p className="general">
				{_translate(locale, 'titlebar.adventurepoints.total', adventurePoints.total)}<br/>
				{_translate(locale, 'titlebar.adventurepoints.spent', adventurePoints.spent)} ({props.spent})
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.advantages', adventurePoints.spentOnAdvantages, 80)}</span>
				<span>{adventurePoints.spentOnMagicalAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', adventurePoints.spentOnMagicalAdvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{adventurePoints.spentOnBlessedAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', adventurePoints.spentOnBlessedAdvantages, 50)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.disadvantages', -adventurePoints.spentOnDisadvantages, 80)}</span>
				<span>{adventurePoints.spentOnDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesmagic', -adventurePoints.spentOnMagicalDisadvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{adventurePoints.spentOnBlessedDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesblessed', -adventurePoints.spentOnBlessedDisadvantages, 50)}</span>
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.attributes', adventurePoints.spentOnAttributes)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.skills', adventurePoints.spentOnSkills)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.combattechniques', adventurePoints.spentOnCombatTechniques)}</span>
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.spells', adventurePoints.spentOnSpells)}</span>}
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.cantrips', adventurePoints.spentOnCantrips)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.liturgicalchants', adventurePoints.spentOnLiturgicalChants)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.blessings', adventurePoints.spentOnBlessings)}</span>}
				<span>{_translate(locale, 'titlebar.adventurepoints.specialabilities', adventurePoints.spentOnSpecialAbilities)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.energies', adventurePoints.spentOnEnergies)}</span>
			</p>
		</div>
	);
}
