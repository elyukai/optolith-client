import * as React from 'react';
import { Checkbox } from '../../../components/Checkbox';
import { Options } from '../../../components/Options';
import { ActiveViewObject, SecondaryAttribute } from '../../../types/data';
import { AttributeCombined, BlessingCombined, LiturgicalChantWithRequirements } from '../../../types/view';
import { SpecialAbility } from '../../../types/wiki';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { AttributeMods } from '../AttributeMods';
import { Sheet } from '../Sheet';
import { HeaderValue } from '../SheetHeader';
import { SheetWrapper } from '../SheetWrapper';
import { LiturgicalChantsSheetBlessings } from './LiturgicalChantsSheetBlessings';
import { LiturgicalChantsSheetLiturgicalChants } from './LiturgicalChantsSheetLiturgicalChants';
import { LiturgicalChantsSheetSpecialAbilities } from './LiturgicalChantsSheetSpecialAbilities';
import { LiturgicalChantsSheetTraditionsAspects } from './LiturgicalChantsSheetTraditionsAspects';

export interface LiturgicalChantsSheetProps {
  aspects: Maybe<List<string>>;
  attributes: List<Record<AttributeCombined>>;
  blessedPrimary: Maybe<string>;
  blessedSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  blessedTradition: Maybe<string>;
  blessings: Maybe<List<Record<BlessingCombined>>>;
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>;
  locale: UIMessagesObject;
  switchAttributeValueVisibility (): void;
}

export function LiturgicalChantsSheet (props: LiturgicalChantsSheetProps) {
  const {
    checkAttributeValueVisibility,
    derivedCharacteristics,
    locale,
    switchAttributeValueVisibility,
  } = props;

  const addHeader = List.of<Record<HeaderValue>> (
    Record.ofMaybe<HeaderValue> ({
      id: 'KP_MAX',
      short: translate (locale, 'charactersheet.chants.headers.kpmax'),
      value: derivedCharacteristics
        .find (e => e .get ('id') === 'KP')
        .bind (Record.lookup<SecondaryAttribute, 'value'> ('value')),
    }),
    Record.of<HeaderValue> ({
      id: 'KP_CURRENT',
      short: translate (locale, 'charactersheet.chants.headers.kpcurrent'),
    })
  );

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (locale, 'charactersheet.options.showattributevalues')}
        </Checkbox>
      </Options>
      <Sheet
        {...props}
        id="liturgies-sheet"
        title={translate (locale, 'charactersheet.chants.title')}
        addHeaderInfo={addHeader}
        >
        <div className="all">
          <LiturgicalChantsSheetLiturgicalChants {...props} />
          <AttributeMods {...props} />
          <LiturgicalChantsSheetTraditionsAspects {...props} />
          <LiturgicalChantsSheetSpecialAbilities {...props} />
          <LiturgicalChantsSheetBlessings {...props} />
        </div>
      </Sheet>
    </SheetWrapper>
  );
}
