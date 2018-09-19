import * as React from 'react';
import { EnergyWithLoss, SecondaryAttribute } from '../../types/data';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { AttributesPermanentListItem } from './AttributesPermanentListItem';

export interface AttributesPermanentListProps {
  derived: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  getEditPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
  getAddPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
  addLostLPPoint (): void;
  removeLostLPPoint (): void;
  addLostLPPoints (value: number): void;
  addBoughtBackAEPoint (): void;
  removeBoughtBackAEPoint (): void;
  addLostAEPoint (): void;
  removeLostAEPoint (): void;
  addLostAEPoints (value: number): void;
  addBoughtBackKPPoint (): void;
  removeBoughtBackKPPoint (): void;
  addLostKPPoint (): void;
  removeLostKPPoint (): void;
  addLostKPPoints (value: number): void;
  openAddPermanentEnergyLoss (energy: 'LP' | 'AE' | 'KP'): void;
  closeAddPermanentEnergyLoss (): void;
  openEditPermanentEnergy (energy: 'LP' | 'AE' | 'KP'): void;
  closeEditPermanentEnergy (): void;
}

export function AttributesPermanentList (props: AttributesPermanentListProps) {
  const maybeLP =
    props.derived
      .find (e => e .get ('id') === 'LP') as Maybe<Record<EnergyWithLoss>>;

  const maybeAE =
    props.derived
      .find (e => e .get ('id') === 'AE') as Maybe<Record<EnergyWithLoss>>;

  const maybeKP =
    props.derived
      .find (e => e .get ('id') === 'KP') as Maybe<Record<EnergyWithLoss>>;

  return (
    <div className="permanent">
      {
        Maybe.fromMaybe
          (<></>)
          (maybeLP .fmap (
            lp => (
              <AttributesPermanentListItem
                {...props}
                id="LP"
                label={translate (props.locale, 'plp.short')}
                name={translate (props.locale, 'plp.long')}
                lost={lp .get ('permanentLost')}
                addLostPoint={props.addLostLPPoint}
                addLostPoints={props.addLostLPPoints}
                removeLostPoint={props.removeLostLPPoint}
                />
            )
          ))
      }
      {
        Maybe.fromMaybe
          (<div className="placeholder"></div>)
          (maybeAE
            .bind (Maybe.ensure (ae => ae .member ('value')))
            .fmap (
              ae => (
                <AttributesPermanentListItem
                  {...props}
                  id="AE"
                  label={translate (props.locale, 'attributes.pae.short')}
                  name={translate (props.locale, 'attributes.pae.name')}
                  boughtBack={ae .get ('permanentRedeemed')}
                  lost={ae .get ('permanentLost')}
                  addBoughtBackPoint={props.addBoughtBackAEPoint}
                  addLostPoint={props.addLostAEPoint}
                  addLostPoints={props.addLostAEPoints}
                  removeBoughtBackPoint={props.removeBoughtBackAEPoint}
                  removeLostPoint={props.removeLostAEPoint}
                  />
              )
            )
          )
      }
      {
        Maybe.fromMaybe
          (<></>)
          (maybeKP
            .bind (Maybe.ensure (kp => kp .member ('value')))
            .fmap (
              kp => (
                <AttributesPermanentListItem
                  {...props}
                  id="KP"
                  label={translate (props.locale, 'attributes.pkp.short')}
                  name={translate (props.locale, 'attributes.pkp.name')}
                  boughtBack={kp .get ('permanentRedeemed')}
                  lost={kp .get ('permanentLost')}
                  addBoughtBackPoint={props.addBoughtBackKPPoint}
                  addLostPoint={props.addLostKPPoint}
                  addLostPoints={props.addLostKPPoints}
                  removeBoughtBackPoint={props.removeBoughtBackKPPoint}
                  removeLostPoint={props.removeLostKPPoint}
                  />
              )
            )
          )
      }
    </div>
  );
}
