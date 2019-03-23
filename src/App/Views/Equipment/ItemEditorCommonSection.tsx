import * as React from 'react';
import { ItemEditorInstance } from '../../App/Models/Hero/heroTypeHelpers';
import { ItemTemplate } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { ItemEditorInputValidation } from '../../App/Utils/ItemUtils';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { IconButton } from '../../components/IconButton';
import { TextField } from '../../components/TextField';
import { Just, List, Maybe, Record } from '../../Utilities/dataUtils';

export interface ItemEditorCommonSectionProps {
  isInCreation: Maybe<boolean>;
  item: Record<ItemEditorInstance>;
  locale: UIMessagesObject;
  templates: List<Record<ItemTemplate>>;
  inputValidation: Record<ItemEditorInputValidation>;
  setName (value: string): void;
  setPrice (value: string): void;
  setWeight (value: string): void;
  setAmount (value: string): void;
  setWhere (value: string): void;
  setGroup (gr: number): void;
  setTemplate (template: string): void;
  switchIsImprovisedWeapon (): void;
  setImprovisedWeaponGroup (gr: number): void;
  applyTemplate (): void;
  lockTemplate (): void;
  unlockTemplate (): void;
}

export function ItemEditorCommonSection (props: ItemEditorCommonSectionProps) {
  const { inputValidation, item, locale } = props;

  const gr = item .get ('gr');
  const locked = item .get ('isTemplateLocked');

  const GROUPS_SELECTION = translate (locale, 'equipment.view.groups')
    .imap (index => e => Record.of<DropdownOption> ({ id: index + 1, name: e }));

  const IMP_GROUPS_SELECTION = translate (locale, 'equipment.view.groups') .take (2)
    .imap (index => e => Record.of<DropdownOption> ({ id: index + 1, name: e }));

  const TEMPLATES =
    props.templates
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

  return (gr === 1 || Maybe.elem (1) (item .lookup ('improvisedWeaponGroup')))
    ? (
      <>
        <div className="main">
          <div className="row">
            <TextField
              className="number"
              label={translate (locale, 'itemeditor.options.number')}
              value={item .get ('amount')}
              onChangeString={props.setAmount}
              valid={inputValidation .get ('amount')}
              />
            <TextField
              className="name"
              label={translate (locale, 'itemeditor.options.name')}
              value={item .get ('name')}
              onChangeString={props.setName}
              autoFocus={props.isInCreation}
              disabled={locked}
              valid={inputValidation .get ('name')}
              />
          </div>
          <div className="row">
            <TextField
              className="price"
              label={translate (locale, 'itemeditor.options.price')}
              value={item .get ('price')}
              onChangeString={props.setPrice}
              disabled={locked}
              valid={inputValidation .get ('price')}
              />
            <TextField
              className="weight"
              label={translate (locale, 'itemeditor.options.weight')}
              value={item .get ('weight')}
              onChangeString={props.setWeight}
              disabled={locked}
              valid={inputValidation .get ('weight')}
              />
            <TextField
              className="where"
              label={translate (locale, 'itemeditor.options.carriedwhere')}
              value={item .lookup ('where')}
              onChangeString={props.setWhere}
              />
          </div>
          <div className="row">
            <Dropdown
              className="gr"
              label={translate (locale, 'itemeditor.options.gr')}
              hint={translate (locale, 'itemeditor.options.grhint')}
              value={Just (gr)}
              options={GROUPS_SELECTION}
              onChangeJust={props.setGroup}
              disabled={locked}
              required
              />
          </div>
          {gr > 4 && <div className="row">
            <Checkbox
              className="improvised-weapon"
              label={translate (locale, 'itemeditor.options.improvisedweapon')}
              checked={item .member ('improvisedWeaponGroup')}
              onClick={props.switchIsImprovisedWeapon}
              disabled={locked}
              />
            <Dropdown
              className="gr imp-gr"
              hint={translate (locale, 'itemeditor.options.improvisedweapongr')}
              value={item .lookup ('improvisedWeaponGroup')}
              options={IMP_GROUPS_SELECTION}
              onChangeJust={props.setImprovisedWeaponGroup}
              disabled={locked || item .notMember ('improvisedWeaponGroup')}
              />
          </div>}
          <Hr />
          <div className="row">
            <Dropdown
              className="template"
              label={translate (locale, 'itemeditor.options.template')}
              hint={translate (locale, 'options.none')}
              value={item .lookup ('template')}
              options={TEMPLATES}
              onChangeJust={props.setTemplate}
              disabled={locked}
              />
            <IconButton
              icon="&#xE90a;"
              onClick={props.applyTemplate}
              disabled={item .notMember ('template') || locked}
              />
            {locked ? (
              <IconButton
                icon="&#xE918;"
                onClick={props.unlockTemplate}
                />
            ) : (
              <IconButton
                icon="&#xE917;"
                onClick={props.lockTemplate}
                disabled={item .notMember ('template')}
                />
            )}
          </div>
        </div>
    </>
  )
  : null;
}
