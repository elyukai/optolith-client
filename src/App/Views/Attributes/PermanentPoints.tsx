import * as React from 'react';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { IconButton } from '../../components/IconButton';

export interface PermanentPointsProps extends DialogProps {
  id: 'LP' | 'AE' | 'KP';
  locale: UIMessagesObject;
  permanentBoughtBack?: number;
  permanentSpent: number;
  addBoughtBackPoint? (): void;
  addLostPoint (): void;
  removeBoughtBackPoint? (): void;
  removeLostPoint (): void;
}

export function PermanentPoints (props: PermanentPointsProps) {
  const {
    id,
    locale,
    addBoughtBackPoint,
    addLostPoint,
    permanentBoughtBack,
    permanentSpent,
    removeBoughtBackPoint,
    removeLostPoint,
  } = props;

  return (
    <Dialog
      {...props}
      className="permanent-points-editor"
      title={
        id === 'AE'
          ? translate (locale, 'attributes.pae.name')
          : id === 'KP'
          ? translate (locale, 'attributes.pkp.name')
          : translate (locale, 'plp.long')
      }
      buttons={[
        {
          autoWidth: true,
          label: translate (locale, 'actions.done'),
        },
      ]}
      >
      <div className="main">
        {addBoughtBackPoint && removeBoughtBackPoint && typeof permanentBoughtBack === 'number' && (
          <div className="column boughtback">
            <div className="value">{permanentBoughtBack}</div>
            <div className="description smallcaps">
              {translate (locale, 'permanentpoints.boughtback')}
            </div>
            <div className="buttons">
              <IconButton
                className="add"
                icon="&#xE908;"
                onClick={addBoughtBackPoint}
                disabled={permanentBoughtBack >= permanentSpent}
                />
              <IconButton
                className="remove"
                icon="&#xE909;"
                onClick={removeBoughtBackPoint}
                disabled={permanentBoughtBack <= 0}
                />
            </div>
          </div>
        )}
        <div className="column lost">
          <div className="value">{permanentSpent}</div>
          <div className="description smallcaps">{translate (locale, 'permanentpoints.spent')}</div>
          <div className="buttons">
            <IconButton className="add" icon="&#xE908;" onClick={addLostPoint} />
            <IconButton
              className="remove"
              icon="&#xE909;"
              onClick={removeLostPoint}
              disabled={permanentSpent <= 0}
              />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
