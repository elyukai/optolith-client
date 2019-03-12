import * as React from 'react';
import { AdventurePointsObject } from '../../App/Selectors/adventurePointsSelectors';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { Maybe, Record } from '../../utils/dataUtils';

export interface ApTooltipProps {
  locale: UIMessagesObject;
  adventurePoints: Record<AdventurePointsObject>;
  maximumForMagicalAdvantagesDisadvantages: Maybe<number>;
  isSpellcaster: boolean;
  isBlessedOne: boolean;
}

export function ApTooltip (props: ApTooltipProps) {
  const { locale, adventurePoints: ap } = props;

  return (
    <div className="ap-details">
      <h4>{translate (locale, 'titlebar.adventurepoints.title')}</h4>
      <p className="general">
        <span>{translate (locale, 'titlebar.adventurepoints.total', ap.get ('total'))}</span>
        <span>{translate (locale, 'titlebar.adventurepoints.spent', ap.get ('spent'))}</span>
      </p>
      <hr />
      <p>
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.advantages',
            ap.get ('spentOnAdvantages'),
            80
          )}
        </span>
        <span>
          {ap.get ('spentOnMagicalAdvantages') > 0 && translate (
            locale,
            'titlebar.adventurepoints.advantagesmagic',
            ap.get ('spentOnMagicalAdvantages'),
            Maybe.fromMaybe (0) (props.maximumForMagicalAdvantagesDisadvantages)
          )}
        </span>
        <span>
          {ap.get ('spentOnBlessedAdvantages') > 0 && translate (
            locale,
            'titlebar.adventurepoints.advantagesblessed',
            ap.get ('spentOnBlessedAdvantages'),
            50
          )}</span>
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.disadvantages',
            ap.get ('spentOnDisadvantages'),
            80
          )}
        </span>
        <span>
          {ap.get ('spentOnMagicalDisadvantages') > 0 && translate (
            locale,
            'titlebar.adventurepoints.disadvantagesmagic',
            ap.get ('spentOnMagicalDisadvantages'),
            Maybe.fromMaybe (0) (props.maximumForMagicalAdvantagesDisadvantages)
          )}
        </span>
        <span>
          {ap.get ('spentOnBlessedDisadvantages') > 0 && translate (
            locale,
            'titlebar.adventurepoints.disadvantagesblessed',
            ap.get ('spentOnBlessedDisadvantages'),
            50
          )}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translate (locale, 'titlebar.adventurepoints.race', ap.get ('spentOnRace'), 80)}
        </span>
        {Maybe.fromMaybe
          (<></>)
          (ap.lookup ('spentOnProfession')
            .fmap (
              spentOnProfession => (
                <span>
                  {translate (
                    locale,
                    'titlebar.adventurepoints.profession',
                    spentOnProfession,
                    80
                  )}
                </span>
              )
            ))}
        <span>
          {translate (locale, 'titlebar.adventurepoints.attributes', ap.get ('spentOnAttributes'))}
        </span>
        <span>
          {translate (locale, 'titlebar.adventurepoints.skills', ap.get ('spentOnSkills'))}
        </span>
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.combattechniques',
            ap.get ('spentOnCombatTechniques')
          )}
        </span>
        {props.isSpellcaster && <span>
          {translate (locale, 'titlebar.adventurepoints.spells', ap.get ('spentOnSpells'))}
        </span>}
        {props.isSpellcaster && <span>
          {translate (locale, 'titlebar.adventurepoints.cantrips', ap.get ('spentOnCantrips'))}
        </span>}
        {props.isBlessedOne && <span>
          {translate (
            locale,
            'titlebar.adventurepoints.liturgicalchants',
            ap.get ('spentOnLiturgicalChants')
          )}
        </span>}
        {props.isBlessedOne && <span>
          {translate (locale, 'titlebar.adventurepoints.blessings', ap.get ('spentOnBlessings'))}
        </span>}
        <span>
          {translate (
            locale,
            'titlebar.adventurepoints.specialabilities',
            ap.get ('spentOnSpecialAbilities')
          )}
        </span>
        <span>
          {translate (locale, 'titlebar.adventurepoints.energies', ap.get ('spentOnEnergies'))}
        </span>
      </p>
    </div>
  );
}
