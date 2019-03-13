import * as React from 'react';
import { Purse } from '../../App/Models/Hero/heroTypeHelpers';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../App/Utils/I18n';
import { TextField } from '../../components/TextField';
import { Maybe, Record } from '../../utils/dataUtils';

export interface PurseAndTotalsProps {
  carryingCapacity: Maybe<number>;
  hasNoAddedAP: boolean;
  initialStartingWealth: number;
  locale: UIMessagesObject;
  purse: Maybe<Record<Purse>>;
  totalPrice: Maybe<number>;
  totalWeight: Maybe<number>;
  setDucates (value: string): void;
  setSilverthalers (value: string): void;
  setHellers (value: string): void;
  setKreutzers (value: string): void;
}

export function PurseAndTotals (props: PurseAndTotalsProps) {
  const {
    carryingCapacity,
    hasNoAddedAP,
    initialStartingWealth,
    locale,
    purse,
    totalPrice,
    totalWeight,
  } = props;

  return (
    <>
      <div className="purse">
        <h4>{translate (locale, 'equipment.view.purse')}</h4>
        <div className="fields">
          <TextField
            label={translate (locale, 'equipment.view.ducates')}
            value={purse .fmap (Record.get<Purse, 'd'> ('d'))}
            onChangeString={props.setDucates}
            />
          <TextField
            label={translate (locale, 'equipment.view.silverthalers')}
            value={purse .fmap (Record.get<Purse, 's'> ('s'))}
            onChangeString={props.setSilverthalers}
            />
          <TextField
            label={translate (locale, 'equipment.view.hellers')}
            value={purse .fmap (Record.get<Purse, 'h'> ('h'))}
            onChangeString={props.setHellers}
            />
          <TextField
            label={translate (locale, 'equipment.view.kreutzers')}
            value={purse .fmap (Record.get<Purse, 'k'> ('k'))}
            onChangeString={props.setKreutzers}
            />
        </div>
      </div>
      <div className="total-points">
        <h4>
          {hasNoAddedAP && `${translate (locale, 'equipment.view.initialstartingwealth')} & `}
          {translate (locale, 'equipment.view.carringandliftingcapactity')}
        </h4>
        <div className="fields">
          {hasNoAddedAP && Maybe.isJust (totalPrice) && (
            <div>
              {localizeNumber (locale .get ('id')) (Maybe.fromJust (totalPrice))}
              {' / '}
              {localizeNumber (locale .get ('id')) (initialStartingWealth)}
              {' '}
              {translate (locale, 'equipment.view.price')}
            </div>
          )}
          <div>
            {localizeNumber (locale .get ('id'))
                            (localizeWeight (locale .get ('id')) (totalWeight))}
            {' / '}
            {localizeNumber (locale .get ('id'))
                            (localizeWeight (locale .get ('id')) (carryingCapacity))}
            {' '}
            {translate (locale, 'equipment.view.weight')}
          </div>
        </div>
      </div>
    </>
  );
}
