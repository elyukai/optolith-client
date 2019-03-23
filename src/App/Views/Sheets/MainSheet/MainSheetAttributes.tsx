import * as React from 'react';
import { SecondaryAttribute } from '../../../App/Models/Hero/heroTypeHelpers';
import { Race } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { Just, List, Maybe, Nothing, Record } from '../../../Utilities/dataUtils';
import { MainSheetAttributesItem } from './MainSheetAttributesItem';
import { MainSheetFatePoints } from './MainSheetFatePoints';

export interface MainSheetAttributesProps {
  attributes: List<Record<SecondaryAttribute>>;
  fatePointsModifier: number;
  locale: UIMessagesObject;
  race: Maybe<Record<Race>>;
}

export function MainSheetAttributes (props: MainSheetAttributesProps) {
  const { attributes, fatePointsModifier, race, locale } = props;

  return (
    <div className="calculated">
      <div className="calc-header">
        <div>{translate (locale, 'charactersheet.main.headers.value')}</div>
        <div>{translate (locale, 'charactersheet.main.headers.bonuspenalty')}</div>
        <div>{translate (locale, 'charactersheet.main.headers.bought')}</div>
        <div>{translate (locale, 'charactersheet.main.headers.max')}</div>
      </div>
      {
        attributes
          .map (
            attribute => (
              <MainSheetAttributesItem
                key={attribute .get ('id')}
                label={attribute .get ('name')}
                calc={attribute .get ('calc')}
                base={attribute .lookup ('base')}
                max={attribute .lookup ('value')}
                add={attribute .lookup ('mod')}
                purchased={attribute .lookup ('currentAdd')}
                subLabel={(() => {
                  switch (attribute .get ('id')) {
                    case 'LP':
                    case 'SPI':
                    case 'TOU':
                    case 'MOV':
                      return Just (translate (locale, 'charactersheet.main.subheaders.basestat'));

                    case 'AE':
                    case 'KP':
                      return Just (translate (locale, 'charactersheet.main.subheaders.permanent'));

                    default:
                      return Nothing ();
                  }
                }) ()}
                subArray={(() => {
                  switch (attribute .get ('id')) {
                    case 'LP':
                      return Just (
                        List.of (
                          Maybe.fromMaybe (0) (race.fmap (Record.get<Race, 'lp'> ('lp')))
                        )
                      );

                    case 'AE':
                    case 'KP':
                      return Just (
                        List.of (
                          Maybe.fromMaybe (0) (attribute .lookup ('permanentLost')),
                          Maybe.fromMaybe (0) (attribute .lookup ('permanentRedeemed'))
                        )
                      );

                    case 'SPI':
                      return Just (
                        List.of (
                          Maybe.fromMaybe (0) (race.fmap (Record.get<Race, 'spi'> ('spi')))
                        )
                      );

                    case 'TOU':
                      return Just (
                        List.of (
                          Maybe.fromMaybe (0) (race.fmap (Record.get<Race, 'tou'> ('tou')))
                        )
                      );

                    case 'MOV':
                      return Just (
                        List.of (
                          Maybe.fromMaybe (0) (race.fmap (Record.get<Race, 'mov'> ('mov')))
                        )
                      );

                    default:
                      return Nothing ();
                  }
                }) ()}
                empty={(() => {
                  switch (attribute .get ('id')) {
                    case 'AE':
                    case 'KP':
                      return Just (Maybe.isNothing (attribute .lookup ('value')));

                    default:
                      return Nothing ();
                  }
                }) ()}
                />
            )
          )
      }
      <MainSheetFatePoints
        fatePointsModifier={fatePointsModifier}
        locale={locale}
        />
    </div>
  );
}
