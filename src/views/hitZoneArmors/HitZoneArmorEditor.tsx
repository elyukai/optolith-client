import * as React from 'react';
import { ItemTemplate } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { getLossLevelElements } from '../../App/Utils/ItemUtils';
import { Dialog } from '../../components/DialogNew';
import { DropdownOption } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { ArmorZonesEditorInstance, ItemInstance } from '../../types/data';
import { Just, List, Maybe, Record } from '../../utils/dataUtils';
import { sortObjects } from '../../utils/FilterSortUtils';
import { HitZoneArmorEditorRow } from './HitZoneArmorEditorRow';

export interface HitZoneArmorEditorProps {
  armorZonesEditor: Record<ArmorZonesEditorInstance>;
  isInHitZoneArmorCreation: Maybe<boolean>;
  locale: UIMessagesObject;
  items: Maybe<List<Record<ItemInstance>>>;
  templates: List<Record<ItemTemplate>>;
  addToList (): void;
  closeEditor (): void;
  saveItem (): void;
  setName (value: string): void;
  setHead (id: Maybe<string>): void;
  setHeadLoss (id: Maybe<number>): void;
  setLeftArm (id: Maybe<string>): void;
  setLeftArmLoss (id: Maybe<number>): void;
  setLeftLeg (id: Maybe<string>): void;
  setLeftLegLoss (id: Maybe<number>): void;
  setTorso (id: Maybe<string>): void;
  setTorsoLoss (id: Maybe<number>): void;
  setRightArm (id: Maybe<string>): void;
  setRightArmLoss (id: Maybe<number>): void;
  setRightLeg (id: Maybe<string>): void;
  setRightLegLoss (id: Maybe<number>): void;
}

export function HitZoneArmorEditor (props: HitZoneArmorEditorProps) {
  const {
    armorZonesEditor,
    closeEditor,
    isInHitZoneArmorCreation,
    items,
    locale,
    templates,
  } = props;

  const armorList =
    sortObjects<DropdownOption> (
      Maybe.fromJust (
        Just (
          templates .filter (e => e.get ('gr') === 4) as unknown as List<Record<DropdownOption>>
        )
          .mappend (
            items .fmap (
              List.filter (e => e .get ('gr') === 4 && !e .get ('isTemplateLocked'))
            ) as unknown as Maybe<List<Record<DropdownOption>>>
          )
      ),
      locale .get ('id')
    )
      .cons (Record.of<DropdownOption> ({ name: translate (locale, 'options.none') }));

  const lossLevels = getLossLevelElements ();

  return (
    <Dialog
      id="armor-zones-editor"
      title={
        Maybe.elem (true) (isInHitZoneArmorCreation)
          ? translate (locale, 'zonearmoreditor.titlecreate')
          : translate (locale, 'zonearmoreditor.titleedit')
      }
      isOpened
      close={closeEditor}
      buttons={[
        {
          autoWidth: true,
          disabled: armorZonesEditor .get ('name') === '',
          label: translate (locale, 'actions.save'),
          onClick: Maybe.elem (true) (isInHitZoneArmorCreation) ? props.addToList : props.saveItem,
        },
      ]}
      >
      <div className="main">
        <div className="row">
          <TextField
            className="name"
            label={translate (locale, 'zonearmoreditor.options.name')}
            value={armorZonesEditor .get ('name')}
            onChangeString={props.setName}
            autoFocus={Maybe.elem (true) (isInHitZoneArmorCreation)}
            />
        </div>
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('head')}
          componentLoss={armorZonesEditor .lookup ('headLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.head"
          setComponent={props.setHead}
          setComponentLoss={props.setHeadLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('torso')}
          componentLoss={armorZonesEditor .lookup ('torsoLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.torso"
          setComponent={props.setTorso}
          setComponentLoss={props.setTorsoLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('leftArm')}
          componentLoss={armorZonesEditor .lookup ('leftArmLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.leftarm"
          setComponent={props.setLeftArm}
          setComponentLoss={props.setLeftArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('rightArm')}
          componentLoss={armorZonesEditor .lookup ('rightArmLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.rightarm"
          setComponent={props.setRightArm}
          setComponentLoss={props.setRightArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('leftLeg')}
          componentLoss={armorZonesEditor .lookup ('leftLegLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.leftleg"
          setComponent={props.setLeftLeg}
          setComponentLoss={props.setLeftLegLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={armorZonesEditor .lookup ('rightLeg')}
          componentLoss={armorZonesEditor .lookup ('rightLegLoss')}
          locale={locale}
          lossLevels={lossLevels}
          name="zonearmoreditor.options.rightleg"
          setComponent={props.setRightLeg}
          setComponentLoss={props.setRightLegLoss}
          />
      </div>
    </Dialog>
  );
}
