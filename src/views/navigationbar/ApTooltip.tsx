import * as React from 'react';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import { UIMessagesObject } from '../../types/ui';
import { translate } from '../../utils/I18n';

export interface ApTooltipProps {
  locale: UIMessagesObject;
  adventurePoints: AdventurePointsObject;
  maximumForMagicalAdvantagesDisadvantages: number;
  isSpellcaster: boolean;
  isBlessedOne: boolean;
}

export function ApTooltip (props: ApTooltipProps) {
  const { locale, adventurePoints: ap } = props;

  return (
    <div className="ap-details">
      <h4>{translate (locale, 'titlebar.adventurepoints.title')}</h4>
      <p className="general">
        <span>{translate (locale, 'titlebar.adventurepoints.total', ap.total)}</span>
        <span>{translate (locale, 'titlebar.adventurepoints.spent', ap.spent)}</span>
      </p>
      <hr />
      <p>
        <span>
          {translate (locale, 'titlebar.adventurepoints.advantages', ap.spentOnAdvantages, 80)}
        </span>
        <span>
          {ap.spentOnMagicalAdvantages > 0 && translate (
            locale,
            'titlebar.adventurepoints.advantagesmagic',
            ap.spentOnMagicalAdvantages,
            props.maximumForMagicalAdvantagesDisadvantages
          )}
        </span>
        <span>
          {ap.spentOnBlessedAdvantages > 0 && translate (
            locale,
            'titlebar.adventurepoints.advantagesblessed',
            ap.spentOnBlessedAdvantages,
            50
          )}</span>
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.disadvantages',
            -ap.spentOnDisadvantages,
            80
          )}
        </span>
        <span>
          {ap.spentOnMagicalDisadvantages > 0 && translate (
            locale,
            'titlebar.adventurepoints.disadvantagesmagic',
            -ap.spentOnMagicalDisadvantages,
            props.maximumForMagicalAdvantagesDisadvantages
          )}
        </span>
        <span>
          {ap.spentOnBlessedDisadvantages > 0 && translate (
            locale,
            'titlebar.adventurepoints.disadvantagesblessed',
            -ap.spentOnBlessedDisadvantages,
            50
          )}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translate (locale, 'titlebar.adventurepoints.race', ap.spentOnRace, 80)}
        </span>
        {typeof ap.spentOnProfession === 'number' && <span>
          {translate (locale, 'titlebar.adventurepoints.profession', ap.spentOnProfession, 80)}
        </span>}
        <span>
          {translate (locale, 'titlebar.adventurepoints.attributes', ap.spentOnAttributes)}
        </span>
        <span>
          {translate (locale, 'titlebar.adventurepoints.skills', ap.spentOnSkills)}
        </span>
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.combattechniques',
            ap.spentOnCombatTechniques
          )}
        </span>
        {props.isSpellcaster && <span>
          {translate (locale, 'titlebar.adventurepoints.spells', ap.spentOnSpells)}
        </span>}
        {props.isSpellcaster && <span>
          {translate (locale, 'titlebar.adventurepoints.cantrips', ap.spentOnCantrips)}
        </span>}
        {props.isBlessedOne && <span>
          {translate (
            locale,
            'titlebar.adventurepoints.liturgicalchants',
            ap.spentOnLiturgicalChants
          )}
        </span>}
        {props.isBlessedOne && <span>
          {translate (locale, 'titlebar.adventurepoints.blessings', ap.spentOnBlessings)}
        </span>}
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.specialabilities',
            ap.spentOnSpecialAbilities
          )}
        </span>
        <span>
          {translate (locale, 'titlebar.adventurepoints.energies', ap.spentOnEnergies)}
        </span>
      </p>
    </div>
  );
}
