import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { Maybe } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { AttributeBorder } from './AttributeBorder';
import { AttributesRemovePermanent } from './AttributesRemovePermanent';
import { PermanentPoints } from './PermanentPoints';

export interface AttributesPermanentListItemProps {
  locale: UIMessagesObject;
  id: 'LP' | 'AE' | 'KP';
  label: string;
  name: string;
  boughtBack?: number;
  lost: number;
  isRemovingEnabled: boolean;
  getEditPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
  getAddPermanentEnergy: Maybe<'LP' | 'AE' | 'KP'>;
  addBoughtBackPoint? (): void;
  addLostPoint (): void;
  addLostPoints (value: number): void;
  removeBoughtBackPoint? (): void;
  removeLostPoint (): void;
  openAddPermanentEnergyLoss (energy: 'LP' | 'AE' | 'KP'): void;
  closeAddPermanentEnergyLoss (): void;
  openEditPermanentEnergy (energy: 'LP' | 'AE' | 'KP'): void;
  closeEditPermanentEnergy (): void;
}

export class AttributesPermanentListItem extends React.Component<AttributesPermanentListItemProps> {
  openEditPermanentEnergy = () => this.props.openEditPermanentEnergy (this.props.id);
  openAddPermanentEnergyLoss = () => this.props.openAddPermanentEnergyLoss (this.props.id);

  render () {
    const {
      id,
      label,
      locale,
      name,
      isRemovingEnabled,
      addBoughtBackPoint,
      addLostPoints,
      boughtBack,
      lost,
      getEditPermanentEnergy,
      getAddPermanentEnergy,
      closeAddPermanentEnergyLoss,
      closeEditPermanentEnergy,
    } = this.props;

    const available = typeof boughtBack === 'number' ? lost - boughtBack : lost;

    return (
      <AttributeBorder
        label={label}
        value={available}
        tooltip={<div className="calc-attr-overlay">
          <h4><span>{name}</span><span>{available}</span></h4>
          {typeof boughtBack === 'number' ? <p>
            {translate (locale, 'attributes.tooltips.losttotal')}: {lost}<br/>
            {translate (locale, 'attributes.tooltips.boughtback')}: {boughtBack}
          </p> : <p>
            {translate (locale, 'attributes.tooltips.losttotal')}: {lost}
          </p>}
        </div>}
        tooltipMargin={7}
        >
        {isRemovingEnabled && (
          <IconButton
            className="edit"
            icon="&#xE90c;"
            onClick={this.openEditPermanentEnergy}
            />
        )}
        <PermanentPoints
          {...this.props}
          isOpened={Maybe.elem (id) (getEditPermanentEnergy)}
          close={closeEditPermanentEnergy}
          permanentBoughtBack={boughtBack}
          permanentSpent={lost}
          />
        {!isRemovingEnabled && (
          <IconButton
            className="add"
            icon="&#xE908;"
            onClick={this.openAddPermanentEnergyLoss}
            />
        )}
        <AttributesRemovePermanent
          remove={addLostPoints}
          locale={locale}
          isOpened={Maybe.elem (id) (getAddPermanentEnergy)}
          close={closeAddPermanentEnergyLoss}
          />
        {!isRemovingEnabled && addBoughtBackPoint && (
          <IconButton
            className="remove"
            icon="&#xE909;"
            onClick={addBoughtBackPoint}
            disabled={available <= 0}
            />
        )}
      </AttributeBorder>
    );
  }
}
