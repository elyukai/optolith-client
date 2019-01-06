import * as React from 'react';
import { SecondaryAttribute } from '../../../App/Models/Hero/heroTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { Box } from '../../../components/Box';
import { LabelBox } from '../../../components/LabelBox';
import { TextBox } from '../../../components/TextBox';
import { Just, List, Maybe, Nothing, Record } from '../../../utils/dataUtils';

export interface CombatSheetLifePointsProps {
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
}

export function CombatSheetLifePoints (props: CombatSheetLifePointsProps) {
  const { derivedCharacteristics, locale } = props;

  const lifePoints =
    Maybe.fromMaybe (0)
                    (derivedCharacteristics
                      .find (e => e .get ('id') === 'LP')
                      .bind (Record.lookup<SecondaryAttribute, 'value'> ('value')));

  return (
    <TextBox
      className="life-points"
      label={translate (locale, 'charactersheet.combat.lifepoints.title')}
      >
      <div className="life-points-first">
        <LabelBox
          label={translate (locale, 'charactersheet.combat.lifepoints.labels.max')}
          value={Just (lifePoints)}
          />
        <LabelBox
          label={translate (locale, 'charactersheet.combat.lifepoints.labels.current')}
          value={Nothing ()}
          />
      </div>
      <div className="life-points-second">
        <Box />
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.75)}</Box>
        {translate (locale, 'charactersheet.combat.lifepoints.labels.pain1')}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.5)}</Box>
        {translate (locale, 'charactersheet.combat.lifepoints.labels.pain2')}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.25)}</Box>
        {translate (locale, 'charactersheet.combat.lifepoints.labels.pain3')}
      </div>
      <div className="tiers">
        <Box>5</Box>
        {translate (locale, 'charactersheet.combat.lifepoints.labels.pain4')}
      </div>
      <div className="tiers">
        <Box>0</Box>
        {translate (locale, 'charactersheet.combat.lifepoints.labels.dying')}
      </div>
    </TextBox>
  );
}
