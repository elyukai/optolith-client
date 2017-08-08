import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Scroll } from '../../components/Scroll';
import { Race, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface RacesProps {
	currentId?: string;
	locale: UIMessages;
	races: Race[];
}

export function RacesInfo(props: RacesProps) {
	const { currentId, locale, races } = props;

	const race = currentId && races.find(e => currentId === e.id);

	return (
		<Aside>
			{race ? (() => {
				return (
					<Scroll>
						<div className="info race-info">
							<div className="race-header info-header">
								<p className="title">{race.name}</p>
							</div>
							<p className="rule">
								<span>{_translate(locale, 'races.info.apvalue')}</span>
								<span>{race.ap} {_translate(locale, 'aptext')}</span>
							</p>
							<p className="rule">
								<span>{_translate(locale, 'races.info.lifepointbasevalue')}</span>
								<span>{race.lp}</span>
							</p>
							<p className="rule">
								<span>{_translate(locale, 'races.info.spiritbasevalue')}</span>
								<span>{race.spi}</span>
							</p>
							<p className="rule">
								<span>{_translate(locale, 'races.info.toughnessbasevalue')}</span>
								<span>{race.tou}</span>
							</p>
							<p className="rule">
								<span>{_translate(locale, 'races.info.attributeadjustments')}</span>
								<span>{race.attributeAdjustments}</span>
							</p>
							{race.automaticAdvantages && <p className="note">
								<span>{_translate(locale, 'races.info.automaticadvantages')}</span>
								<span>{race.automaticAdvantages}</span>
							</p>}
							{race.stronglyRecommendedAdvantages && <p className="note">
								<span>{_translate(locale, 'races.info.stronglyrecommendedadvantages')}</span>
								<span>{race.stronglyRecommendedAdvantages}</span>
							</p>}
							{race.stronglyRecommendedDisadvantages && <p className="note">
								<span>{_translate(locale, 'races.info.stronglyrecommendeddisadvantages')}</span>
								<span>{race.stronglyRecommendedDisadvantages}</span>
							</p>}
							<p className="note">
								<span>{_translate(locale, 'races.info.commoncultures')}</span>
								<span>{sortStrings(race.commonCultures, locale.id).join(', ')}</span>
							</p>
							<p className="note">
								<span>{_translate(locale, 'races.info.commonadvantages')}</span>
								<span>{race.commonAdvantages || _translate(locale, 'info.none')}</span>
							</p>
							<p className="note">
								<span>{_translate(locale, 'races.info.commondisadvantages')}</span>
								<span>{race.commonDisadvantages || _translate(locale, 'info.none')}</span>
							</p>
							<p className="note">
								<span>{_translate(locale, 'races.info.uncommonadvantages')}</span>
								<span>{race.uncommonAdvantages || _translate(locale, 'info.none')}</span>
							</p>
							<p className="note">
								<span>{_translate(locale, 'races.info.uncommondisadvantages')}</span>
								<span>{race.uncommonDisadvantages || _translate(locale, 'info.none')}</span>
							</p>
						</div>
					</Scroll>
				);
			})() : (
				<div className="info-placeholder">
					&#xE88F;
				</div>
			)}
		</Aside>
	);
}
