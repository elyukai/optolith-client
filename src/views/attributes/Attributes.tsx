import * as React from 'react';
import { AttributeWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SecondaryAttribute } from '../../types/data';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { AttributeCalc } from './AttributeCalc';
import { AttributeList } from './AttributeList';
import { AttributesAdjustment } from './AttributesAdjustment';
import { AttributesPermanentList } from './AttributesPermanentList';

export interface AttributesOwnProps {
  locale: UIMessagesObject;
}

export interface AttributesStateProps {
  attributes: List<Record<AttributeWithRequirements>>;
  derived: List<Record<SecondaryAttribute>>;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  maxTotalAttributeValues: Maybe<number>;
  sum: number;
  adjustmentValue: Maybe<number>;
  availableAttributeIds: Maybe<List<string>>;
  currentAttributeId: Maybe<string>;
  getEditPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
  getAddPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
}

export interface AttributesDispatchProps {
  addPoint (id: string): void;
  removePoint (id: string): void;
  addLifePoint (): void;
  addArcaneEnergyPoint (): void;
  addKarmaPoint (): void;
  removeLifePoint (): void;
  removeArcaneEnergyPoint (): void;
  removeKarmaPoint (): void;
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
  setAdjustmentId (id: Maybe<string>): void;
  openAddPermanentEnergyLoss (energy: 'LP' | 'AE' | 'KP'): void;
  closeAddPermanentEnergyLoss (): void;
  openEditPermanentEnergy (energy: 'LP' | 'AE' | 'KP'): void;
  closeEditPermanentEnergy (): void;
}

export type AttributesProps = AttributesStateProps & AttributesDispatchProps & AttributesOwnProps;

export function Attributes (props: AttributesProps) {
  const { locale, isInCharacterCreation, maxTotalAttributeValues, sum } = props;

  return (
    <Page id="attribute">
      <Scroll>
        <div className="counter">
          {translate (locale, 'attributes.view.attributetotal')}
          {': '}
          {sum}
          {isInCharacterCreation && ` / ${Maybe.fromMaybe (0) (maxTotalAttributeValues)}`}
        </div>
        <AttributeList {...props} />
        <div className="secondary">
          {isInCharacterCreation && <AttributesAdjustment {...props} />}
          <AttributeCalc {...props} locale={locale} />
          <AttributesPermanentList {...props} locale={locale} />
        </div>
      </Scroll>
    </Page>
  );
}
