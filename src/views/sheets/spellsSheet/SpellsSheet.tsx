import * as React from 'react';
import { Checkbox } from '../../../components/Checkbox';
import { Options } from '../../../components/Options';
import { ActiveViewObject, SecondaryAttribute } from '../../../types/data';
import { AttributeCombined, SpellCombined } from '../../../types/view';
import { Cantrip, SpecialAbility } from '../../../types/wiki';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { AttributeMods } from '../AttributeMods';
import { Sheet } from '../Sheet';
import { HeaderValue } from '../SheetHeader';
import { SheetWrapper } from '../SheetWrapper';
import { SpellsSheetCantrips } from './SpellsSheetCantrips';
import { SpellsSheetSpecialAbilities } from './SpellsSheetSpecialAbilities';
import { SpellsSheetSpells } from './SpellsSheetSpells';
import { SpellsSheetTraditionsProperties } from './SpellsSheetTraditionsProperties';

export interface SpellsSheetProps {
  attributes: List<Record<AttributeCombined>>;
  cantrips: List<Record<Cantrip>>;
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  magicalPrimary: Maybe<string>;
  magicalSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  magicalTradition: Maybe<string>;
  properties: Maybe<List<string>>;
  spells: Maybe<List<Record<SpellCombined>>>;
  switchAttributeValueVisibility (): void;
}

export function SpellsSheet (props: SpellsSheetProps) {
  const {
    checkAttributeValueVisibility,
    derivedCharacteristics,
    locale,
    switchAttributeValueVisibility,
  } = props;

  const addHeader = List.of<Record<HeaderValue>> (
    Record.ofMaybe<HeaderValue> ({
      id: 'AE_MAX',
      short: translate (locale, 'charactersheet.spells.headers.aemax'),
      value: derivedCharacteristics
        .find (e => e .get ('id') === 'AE')
        .bind (Record.lookup<SecondaryAttribute, 'value'> ('value')),
    }),
    Record.of<HeaderValue> ({
      id: 'AE_CURRENT',
      short: translate (locale, 'charactersheet.spells.headers.aecurrent'),
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
        id="spells-sheet"
        title={translate (locale, 'charactersheet.spells.title')}
        addHeaderInfo={addHeader}
        >
        <div className="all">
          <SpellsSheetSpells {...props} />
          <AttributeMods {...props} />
          <SpellsSheetTraditionsProperties {...props} />
          <SpellsSheetSpecialAbilities {...props} />
          <SpellsSheetCantrips {...props} />
        </div>
      </Sheet>
    </SheetWrapper>
  );
}
