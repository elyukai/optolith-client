import * as React from 'react';
import { BorderButton } from '../../../components/BorderButton';
import { Options } from '../../../components/Options';
import { TextBox } from '../../../components/TextBox';
import { AdventurePointsObject } from '../../../selectors/adventurePointsSelectors';
import * as Data from '../../../types/data';
import { UIMessagesObject } from '../../../types/ui';
import * as View from '../../../types/view';
import * as Wiki from '../../../types/wiki';
import { compressList } from '../../../utils/activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate } from '../../../utils/I18n';
import { Sheet } from '../Sheet';
import { SheetWrapper } from '../SheetWrapper';
import { MainSheetAttributes } from './MainSheetAttributes';
import { MainSheetPersonalData } from './MainSheetPersonalData';

export interface MainSheetProps {
  advantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Advantage>>>>;
  ap: Record<AdventurePointsObject>;
  attributes: List<Record<View.AttributeCombined>>;
  avatar: Maybe<string>;
  culture: Maybe<Record<Wiki.Culture>>;
  derivedCharacteristics: List<Record<Data.SecondaryAttribute>>;
  disadvantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Disadvantage>>>>;
  el: Maybe<Record<Wiki.ExperienceLevel>>;
  fatePointsModifier: number;
  generalsaActive: Maybe<List<string | Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>;
  locale: UIMessagesObject;
  name: Maybe<string>;
  professionName: Maybe<string>;
  profile: Maybe<Record<Data.PersonalData>>;
  race: Maybe<Record<Wiki.Race>>;
  sex: Maybe<Data.Sex>;
  printToPDF (): void;
}

export function MainSheet (props: MainSheetProps) {
  const {
    advantagesActive: maybeAdvantagesActive,
    ap,
    avatar,
    attributes,
    culture,
    derivedCharacteristics,
    disadvantagesActive: maybeDisadvantagesActive,
    el,
    fatePointsModifier,
    generalsaActive: maybeGeneralsaActive,
    name,
    professionName,
    profile,
    locale,
    printToPDF,
    race,
    sex,
  } = props;

  return (
    <SheetWrapper>
      <Options>
        <BorderButton
          className="print-document"
          label={translate (locale, 'charactersheet.actions.printtopdf')}
          onClick={printToPDF}
          />
      </Options>
      <Sheet
        id="main-sheet"
        title={translate (locale, 'charactersheet.main.title')}
        attributes={attributes}
        locale={locale}
        >
        <MainSheetPersonalData
          ap={ap}
          avatar={avatar}
          culture={culture}
          el={el}
          eyeColorTags={translate (locale, 'eyecolors')}
          hairColorTags={translate (locale, 'haircolors')}
          locale={locale}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
          socialstatusTags={translate (locale, 'socialstatus')}
          />
        <div className="lower">
          <div className="lists">
            {Maybe.fromMaybe
              (<></>)
              (maybeAdvantagesActive .fmap (
                advantagesActive => (
                  <TextBox
                    className="activatable-list"
                    label={translate (locale, 'charactersheet.main.advantages')}
                    value={
                      compressList (
                        advantagesActive as List<Record<Data.ActiveViewObject>>,
                        locale
                      )
                    }
                    />
                )
              ))}
            {Maybe.fromMaybe
                (<></>)
                (maybeDisadvantagesActive .fmap (
                  disadvantagesActive => (
                    <TextBox
                      className="activatable-list"
                      label={translate (locale, 'charactersheet.main.disadvantages')}
                      value={
                        compressList (
                          disadvantagesActive as List<Record<Data.ActiveViewObject>>,
                          locale
                        )
                      }
                      />
                )
              ))}
            {Maybe.fromMaybe
                (<></>)
                (maybeGeneralsaActive .fmap (
                  generalsaActive => (
                    <TextBox
                      className="activatable-list"
                      label={translate (locale, 'charactersheet.main.generalspecialabilites')}
                      value={
                        compressList (
                          generalsaActive as List<Record<Data.ActiveViewObject>>,
                          locale
                        )
                      }
                      />
                )
              ))}
          </div>
          <MainSheetAttributes
            attributes={derivedCharacteristics}
            fatePointsModifier={fatePointsModifier}
            locale={locale}
            race={race}
            />
        </div>
      </Sheet>
    </SheetWrapper>
  );
}
