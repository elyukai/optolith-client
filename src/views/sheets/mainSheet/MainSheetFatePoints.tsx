import * as React from 'react';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { LabelBox } from '../../../components/LabelBox';
import { TextBox } from '../../../components/TextBox';
import { Just, Nothing } from '../../../utils/dataUtils';

export interface SkillsSheetLanguagesProps {
  fatePointsModifier: number;
  locale: UIMessagesObject;
}

export function MainSheetFatePoints (props: SkillsSheetLanguagesProps) {
  const { fatePointsModifier, locale } = props;

  return (
    <TextBox className="fate-points" label={translate (locale, 'charactersheet.main.fatepoints')}>
      <LabelBox
        label={translate (locale, 'charactersheet.main.headers.value')}
        value={Just (3)}
        />
      <LabelBox
        label={translate (locale, 'charactersheet.main.headers.bonus')}
        value={Just (fatePointsModifier)}
        />
      <LabelBox
        label={translate (locale, 'charactersheet.main.headers.max')}
        value={Just (fatePointsModifier + 3)}
        />
      <LabelBox
        label={translate (locale, 'charactersheet.main.headers.current')}
        value={Nothing ()}
        />
    </TextBox>
  );
}
