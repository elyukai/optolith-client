import * as React from 'react';
import { EnergyWithLoss, SecondaryAttribute } from '../../types/data';
import { UIMessages } from '../../types/ui';
import { translate } from '../../utils/I18n';
import { AttributesPermanentListItem } from './AttributesPermanentListItem';

export interface AttributesPermanentListProps {
  derived: SecondaryAttribute[];
  locale: UIMessages;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  getEditPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
  getAddPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
  addLostLPPoint(): void;
  removeLostLPPoint(): void;
  addLostLPPoints(value: number): void;
  addBoughtBackAEPoint(): void;
  removeBoughtBackAEPoint(): void;
  addLostAEPoint(): void;
  removeLostAEPoint(): void;
  addLostAEPoints(value: number): void;
  addBoughtBackKPPoint(): void;
  removeBoughtBackKPPoint(): void;
  addLostKPPoint(): void;
  removeLostKPPoint(): void;
  addLostKPPoints(value: number): void;
  openAddPermanentEnergyLoss(energy: 'LP' | 'AE' | 'KP'): void;
  closeAddPermanentEnergyLoss(): void;
  openEditPermanentEnergy(energy: 'LP' | 'AE' | 'KP'): void;
  closeEditPermanentEnergy(): void;
}

export function AttributesPermanentList(props: AttributesPermanentListProps) {
  const LP = props.derived.find(e => e.id === 'LP') as EnergyWithLoss;
  const AE = props.derived.find(e => e.id === 'AE') as EnergyWithLoss | undefined;
  const KP = props.derived.find(e => e.id === 'KP') as EnergyWithLoss | undefined;

  return (
    <div className="permanent">
      <AttributesPermanentListItem
        {...props}
        id="LP"
        label={translate(props.locale, 'plp.short')}
        name={translate(props.locale, 'plp.long')}
        boughtBack={LP.permanentRedeemed}
        lost={LP.permanentLost}
        addLostPoint={props.addLostLPPoint}
        addLostPoints={props.addLostLPPoints}
        removeLostPoint={props.removeLostLPPoint}
        />
      { AE !== undefined && typeof AE.value === 'number' ? (
        <AttributesPermanentListItem
          {...props}
          id="AE"
          label={translate(props.locale, 'attributes.pae.short')}
          name={translate(props.locale, 'attributes.pae.name')}
          boughtBack={AE.permanentRedeemed}
          lost={AE.permanentLost}
          addBoughtBackPoint={props.addBoughtBackAEPoint}
          addLostPoint={props.addLostAEPoint}
          addLostPoints={props.addLostAEPoints}
          removeBoughtBackPoint={props.removeBoughtBackAEPoint}
          removeLostPoint={props.removeLostAEPoint}
          />
      ) : <div className="placeholder"></div> }
      { KP !== undefined && typeof KP.value === 'number' && (
        <AttributesPermanentListItem
          {...props}
          id="KP"
          label={translate(props.locale, 'attributes.pkp.short')}
          name={translate(props.locale, 'attributes.pkp.name')}
          boughtBack={KP.permanentRedeemed}
          lost={KP.permanentLost}
          addBoughtBackPoint={props.addBoughtBackKPPoint}
          addLostPoint={props.addLostKPPoint}
          addLostPoints={props.addLostKPPoints}
          removeBoughtBackPoint={props.removeBoughtBackKPPoint}
          removeLostPoint={props.removeLostKPPoint}
          />
      ) }
    </div>
  );
}
