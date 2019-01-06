import * as React from 'react';
import { ItemEditorInstance } from '../../App/Models/Hero/heroTypeHelpers';
import { CombatTechnique, ItemTemplate } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { getLossLevelElements, ItemEditorInputValidation } from '../../App/Utils/ItemUtils';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { Label } from '../../components/Label';
import { TextField } from '../../components/TextField';
import { List, Maybe, OrderedMap, Record } from '../../utils/dataUtils';

export interface ItemEditorRangedSectionProps {
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>;
  item: Record<ItemEditorInstance>;
  locale: UIMessagesObject;
  templates: List<Record<ItemTemplate>>;
  inputValidation: Record<ItemEditorInputValidation>;
  setCombatTechnique (id: string): void;
  setDamageDiceNumber (value: string): void;
  setDamageDiceSides (value: number): void;
  setDamageFlat (value: string): void;
  setLength (value: string): void;
  setRange (index: 1 | 2 | 3): (value: string) => void;
  setReloadTime (value: string): void;
  setAmmunition (id: string): void;
  setStabilityModifier (value: string): void;
  setLoss (id: Maybe<number>): void;
}

export function ItemEditorRangedSection (props: ItemEditorRangedSectionProps) {
  const { combatTechniques, inputValidation, item, locale, templates } = props;

  const dice =
    List.zipWith<string, number, Record<DropdownOption>>
      (name => id => Record.of<DropdownOption> ({ id, name }))
      (translate (locale, 'equipment.view.dice'))
      (List.of (2, 3, 6));

  const gr = item .get ('gr');
  const locked = item .get ('isTemplateLocked');
  const combatTechnique = item .lookup ('combatTechnique');

  const AMMUNITION =
    templates
      .filter (e => e .get ('gr') === 3)
      .map (
        e => Record.of<DropdownOption> ({
          id: e .get ('id'),
          name: e .get ('name'),
        })
      )
      .cons (
        Record.of<DropdownOption> ({
          name: translate (locale, 'options.none'),
        })
      );

  return (gr === 2 || Maybe.elem (2) (item .lookup ('improvisedWeaponGroup')))
    ? (
      <>
        <Hr className="vertical" />
        <div className="ranged">
          <div className="row">
            <Dropdown
              className="combattechnique"
              label={translate (locale, 'itemeditor.options.combattechnique')}
              hint={translate (locale, 'options.none')}
              value={combatTechnique}
              options={
                combatTechniques
                  .elems ()
                  .filter (e => e .get ('gr') === 2) as unknown as List<Record<DropdownOption>>
              }
              onChangeJust={props.setCombatTechnique}
              disabled={locked}
              required
              />
            <TextField
              className="reloadtime"
              label={translate (locale, 'itemeditor.options.reloadtime')}
              value={item .get ('reloadTime')}
              onChangeString={props.setReloadTime}
              disabled={locked}
              />
          </div>
          <div className="row">
            <div className="container">
              <Label text={translate (locale, 'itemeditor.options.damage')} disabled={locked} />
              <TextField
                className="damage-dice-number"
                value={item .get ('damageDiceNumber')}
                onChangeString={props.setDamageDiceNumber}
                disabled={locked}
                valid={inputValidation .get ('damageDiceNumber')}
                />
              <Dropdown
                className="damage-dice-sides"
                hint={translate (locale, 'itemeditor.options.damagedice')}
                value={item .lookup ('damageDiceSides')}
                options={dice}
                onChangeJust={props.setDamageDiceSides}
                disabled={locked}
                />
              <TextField
                className="damage-flat"
                value={item .get ('damageFlat')}
                onChangeString={props.setDamageFlat}
                disabled={locked}
                valid={inputValidation .get ('damageFlat')}
                />
            </div>
            <TextField
              className="stabilitymod"
              label={translate (locale, 'itemeditor.options.bfmod')}
              value={item .get ('stabilityMod')}
              onChangeString={props.setStabilityModifier}
              disabled={locked}
              valid={inputValidation .get ('stabilityMod')}
              />
            <Dropdown
              className="weapon-loss"
              label={translate (locale, 'itemeditor.options.weaponloss')}
              value={item .lookup ('stabilityMod')}
              options={getLossLevelElements ()}
              onChange={props.setLoss}
              />
          </div>
          <div className="row">
            <div className="container">
              <TextField
                className="range1"
                label={translate (locale, 'itemeditor.options.rangeclose')}
                value={item .get ('range') .subscript (0)}
                onChangeString={props.setRange (1)}
                disabled={locked}
                valid={inputValidation .get ('range1')}
                />
              <TextField
                className="range2"
                label={translate (locale, 'itemeditor.options.rangemedium')}
                value={item .get ('range') .subscript (1)}
                onChangeString={props.setRange (2)}
                disabled={locked}
                valid={inputValidation .get ('range2')}
                />
              <TextField
                className="range3"
                label={translate (locale, 'itemeditor.options.rangefar')}
                value={item .get ('range') .subscript (2)}
                onChangeString={props.setRange (3)}
                disabled={locked}
                valid={inputValidation .get ('range3')}
                />
            </div>
            <Dropdown
              className="ammunition"
              label={translate (locale, 'itemeditor.options.ammunition')}
              hint={translate (locale, 'options.none')}
              value={item .lookup ('ammunition')}
              options={AMMUNITION}
              onChangeJust={props.setAmmunition}
              disabled={locked}
              />
            <TextField
              className="length"
              label={translate (locale, 'itemeditor.options.length')}
              value={item .get ('length')}
              onChangeString={props.setLength}
              disabled={locked}
              valid={inputValidation .get ('length')}
              />
          </div>
        </div>
    </>
  )
  : null;
}
