import * as React from 'react';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface ApTooltipProps {
	locale?: UIMessages;
	total: number;
	spent: number;
	spentForAttributes: number;
	spentForSkills: number;
	spentForCombatTechniques: number;
	spentForSpells: number;
	spentForLiturgicalChants: number;
	spentForCantrips: number;
	spentForBlessings: number;
	spentForAdvantages: number;
	spentForMagicalAdvantages: number;
	spentForBlessedAdvantages: number;
	spentForDisadvantages: number;
	spentForMagicalDisadvantages: number;
	spentForBlessedDisadvantages: number;
	spentForSpecialAbilities: number;
	spentForEnergies: number;
	spentTotal: number;
	maximumForMagicalAdvantagesDisadvantages: number;
	isSpellcaster: boolean;
	isBlessedOne: boolean;
}

export function ApTooltip(props: ApTooltipProps) {
	const { locale } = props;

	return (
		<div className="ap-details">
			<h4>{_translate(locale, 'titlebar.adventurepoints.title')}</h4>
			<p className="general">
				{_translate(locale, 'titlebar.adventurepoints.total', props.total)}<br/>
				{_translate(locale, 'titlebar.adventurepoints.spent', props.spentTotal)} ({props.spent})
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.advantages', props.spentForAdvantages, 80)}</span>
				<span>{props.spentForMagicalAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', props.spentForMagicalAdvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{props.spentForBlessedAdvantages > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', props.spentForBlessedAdvantages, 50)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.disadvantages', -props.spentForDisadvantages, 80)}</span>
				<span>{props.spentForDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesmagic', -props.spentForMagicalDisadvantages, props.maximumForMagicalAdvantagesDisadvantages)}</span>
				<span>{props.spentForBlessedDisadvantages > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesblessed', -props.spentForBlessedDisadvantages, 50)}</span>
			</p>
			<hr />
			<p>
				<span>{_translate(locale, 'titlebar.adventurepoints.attributes', props.spentForAttributes)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.skills', props.spentForSkills)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.combattechniques', props.spentForCombatTechniques)}</span>
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.spells', props.spentForSpells)}</span>}
				{props.isSpellcaster && <span>{_translate(locale, 'titlebar.adventurepoints.cantrips', props.spentForCantrips)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.liturgicalchants', props.spentForLiturgicalChants)}</span>}
				{props.isBlessedOne && <span>{_translate(locale, 'titlebar.adventurepoints.blessings', props.spentForBlessings)}</span>}
				<span>{_translate(locale, 'titlebar.adventurepoints.specialabilities', props.spentForSpecialAbilities)}</span>
				<span>{_translate(locale, 'titlebar.adventurepoints.energies', props.spentForEnergies)}</span>
			</p>
		</div>
	);
}
