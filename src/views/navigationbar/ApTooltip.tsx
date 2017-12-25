import * as React from 'react';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface ApTooltipProps {
	locale?: UIMessages;
	adventurePoints: AdventurePointsObject;
	maximumForMagicalAdvantagesDisadvantages: number;
	isSpellcaster: boolean;
	isBlessedOne: boolean;
}

export function ApTooltip(props: ApTooltipProps) {
	const { locale, adventurePoints: ap } = props;

	return (
		<div className="ap-details">
			<h4>{_translate(locale, 'titlebar.adventurepoints.title')}</h4>
			<p className="general">
				<span>{_translate(locale, 'titlebar.adventurepoints.total', ap.total)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.spent', ap.spent)}</span>
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.advantages', ap.spentOnAdvantages, 80)}</span>
				<span>{ap.spentOnMagicalAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', ap.spentOnMagicalAdvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{ap.spentOnBlessedAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', ap.spentOnBlessedAdvantages, 50)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.disadvantages', -ap.spentOnDisadvantages, 80)}</span>
				<span>{ap.spentOnMagicalDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesmagic', -ap.spentOnMagicalDisadvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{ap.spentOnBlessedDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesblessed', -ap.spentOnBlessedDisadvantages, 50)}</span>
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.attributes', ap.spentOnAttributes)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.skills', ap.spentOnSkills)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.combattechniques', ap.spentOnCombatTechniques)}</span>
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.spells', ap.spentOnSpells)}</span>}
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.cantrips', ap.spentOnCantrips)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.liturgicalchants', ap.spentOnLiturgicalChants)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.blessings', ap.spentOnBlessings)}</span>}
				<span>{_translate(locale, 'titlebar.adventurepoints.specialabilities', ap.spentOnSpecialAbilities)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.energies', ap.spentOnEnergies)}</span>
			</p>
		</div>
	);
}
