import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { SecondaryAttribute } from '../../types/data';
import { Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { sign } from '../../utils/NumberUtils';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeCalcItemProps {
  attribute: Record<SecondaryAttribute>;
  locale: UIMessagesObject;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  addLifePoint (): void;
  addArcaneEnergyPoint (): void;
  addKarmaPoint (): void;
  removeLifePoint (): void;
  removeArcaneEnergyPoint (): void;
  removeKarmaPoint (): void;
}

export class AttributeCalcItem extends React.Component<AttributeCalcItemProps, {}> {
  addMaxEnergyPoint = () => {
    if (this.props.attribute .get ('id') === 'LP') {
      this.props.addLifePoint ();
    }
    else if (this.props.attribute .get ('id') === 'AE') {
      this.props.addArcaneEnergyPoint ();
    }
    else if (this.props.attribute .get ('id') === 'KP') {
      this.props.addKarmaPoint ();
    }
  }
  removeMaxEnergyPoint = () => {
    if (this.props.attribute .get ('id') === 'LP') {
      this.props.removeLifePoint ();
    }
    else if (this.props.attribute .get ('id') === 'AE') {
      this.props.removeArcaneEnergyPoint ();
    }
    else if (this.props.attribute .get ('id') === 'KP') {
      this.props.removeKarmaPoint ();
    }
  }

  // tslint:disable-next-line:cyclomatic-complexity
  render () {
    const {
      attribute,
      locale,
      isInCharacterCreation,
      isRemovingEnabled,
    } = this.props;

    const base = attribute .get ('base');
    const mod = attribute .lookup ('mod');
    const maybeCurrentAdd = attribute .lookup ('currentAdd');
    const maybeMaxAdd = attribute .lookup ('maxAdd');
    const value = Maybe.fromMaybe<string | number> ('-') (attribute .lookup ('value'));
    const maybePermanentLost = attribute .lookup ('permanentLost');
    const maybePermanentRedeemed = attribute .lookup ('permanentRedeemed');

    return (
      <AttributeBorder
        label={attribute .get ('short')}
        value={value}
        tooltip={(
          <div className="calc-attr-overlay">
            <h4><span>{attribute .get ('name')}</span><span>{value}</span></h4>
            <p className="calc-text">
              {attribute .get ('calc')}
              {' = '}
              {base > 0 ? base : '-'}
            </p>
            {(Maybe.isJust (mod) || (Maybe.isJust (maybeCurrentAdd) && !isInCharacterCreation)) && (
              <p>
                {Maybe.isJust (mod) && (
                  <span className="mod">
                    {translate (locale, 'attributes.tooltips.modifier')}
                    {': '}
                    {sign (Maybe.fromJust (mod))}
                    <br/>
                  </span>
                )}
                {Maybe.isJust (maybeCurrentAdd) && !isInCharacterCreation && (
                  <span className="add">
                    {translate (locale, 'attributes.tooltips.bought')}
                    {': '}
                    {Maybe.fromJust (maybeCurrentAdd)}
                    {' / '}
                    {Maybe.fromMaybe<string | number> ('-') (maybeMaxAdd)}
                  </span>
                )}
              </p>
            )}
          </div>
        )}
        tooltipMargin={7}>
        {
          Maybe.fromMaybe
            (<></>)
            (maybeMaxAdd
              .bind (Maybe.ensure (maxAdd => !isInCharacterCreation && maxAdd > 0))
              .fmap (maxAdd => (<NumberBox current={maybeCurrentAdd} max={maxAdd} />)))
        }
        {
          typeof value === 'number'
          && !isInCharacterCreation
          && Maybe.fromMaybe
            (<></>)
            (Maybe.liftM2<number, number, JSX.Element>
              (currentAdd => maxAdd => (
                <IconButton
                  className="add"
                  icon="&#xE908;"
                  onClick={this.addMaxEnergyPoint}
                  disabled={
                    currentAdd >= maxAdd
                    || Maybe.elem
                      (true)
                      (maybePermanentLost
                        .fmap (
                          permanentLost =>
                            permanentLost - Maybe.fromMaybe (0) (maybePermanentRedeemed) > 0
                        ))
                  }
                  />
              ))
              (maybeCurrentAdd)
              (maybeMaxAdd))
        }
        {
          typeof value === 'number'
          && !isInCharacterCreation
          && isRemovingEnabled
          && Maybe.isJust (maybeMaxAdd)
          && Maybe.fromMaybe
            (<></>)
            (maybeCurrentAdd
              .fmap (currentAdd => (
                <IconButton
                  className="remove"
                  icon="&#xE909;"
                  onClick={this.removeMaxEnergyPoint}
                  disabled={
                    currentAdd <= 0
                    || Maybe.elem
                      (true)
                      (maybePermanentLost
                        .fmap (
                          permanentLost =>
                            permanentLost - Maybe.fromMaybe (0) (maybePermanentRedeemed) > 0
                        ))
                  }
                  />
              )))
        }
      </AttributeBorder>
    );
  }
}
