import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { IconButton } from '../../components/IconButton';
import { Label } from '../../components/Label';
import { TextField } from '../../components/TextField';
import { AttributeInstance, InputTextEvent, ItemEditorInstance, ItemInstance } from '../../types/data';
import { CombatTechnique } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../utils/I18n';
import { isEmptyOr, isFloat, isInteger, isNaturalNumber } from '../../utils/RegexUtils';

export interface ItemEditorOwnProps {
  locale: UIMessages;
}

export interface ItemEditorStateProps {
  attributes: Map<string, AttributeInstance>;
  combatTechniques: CombatTechnique[];
  create?: boolean;
  item?: ItemEditorInstance;
  templates: ItemInstance[];
}

export interface ItemEditorDispatchProps {
  closeEditor(): void;
  addToList(): void;
  saveItem(): void;
  setName(value: string): void;
  setPrice(value: string): void;
  setWeight(value: string): void;
  setAmount(value: string): void;
  setWhere(value: string): void;
  setGroup(gr: number): void;
  setTemplate(template: string): void;
  setCombatTechnique(id: string): void;
  setDamageDiceNumber(value: string): void;
  setDamageDiceSides(value: number): void;
  setDamageFlat(value: string): void;
  setPrimaryAttribute(primary: string | undefined): void;
  setDamageThreshold(value: string): void;
  setFirstDamageThreshold(value: string): void;
  setSecondDamageThreshold(value: string): void;
  switchIsDamageThresholdSeparated(): void;
  setAttack(value: string): void;
  setParry(value: string): void;
  setReach(id: number): void;
  setLength(value: string): void;
  setStructurePoints(value: string): void;
  setRange(value: string, index: number): void;
  setReloadTime(value: string): void;
  setAmmunition(id: string): void;
  setProtection(value: string): void;
  setEncumbrance(value: string): void;
  setMovementModifier(value: string): void;
  setInitiativeModifier(value: string): void;
  setStabilityModifier(value: string): void;
  switchIsParryingWeapon(): void;
  switchIsTwoHandedWeapon(): void;
  switchIsImprovisedWeapon(): void;
  setImprovisedWeaponGroup(gr: number): void;
  setLoss(id: number | undefined): void;
  switchIsForArmorZonesOnly(): void;
  setHasAdditionalPenalties(): void;
  setArmorType(id: number): void;
  applyTemplate(): void;
  lockTemplate(): void;
  unlockTemplate(): void;
}

export type ItemEditorProps = ItemEditorStateProps & ItemEditorDispatchProps & ItemEditorOwnProps;

export class ItemEditor extends React.Component<ItemEditorProps> {
  changeName = (event: InputTextEvent) => this.props.setName(event.target.value);
  changePrice = (event: InputTextEvent) => this.props.setPrice(event.target.value);
  changeWeight = (event: InputTextEvent) => this.props.setWeight(event.target.value);
  changeAmount = (event: InputTextEvent) => this.props.setAmount(event.target.value);
  changeWhere = (event: InputTextEvent) => this.props.setWhere(event.target.value);
  changeGroup = (id: number) => this.props.setGroup(id);
  changeTemplate = (id: string) => this.props.setTemplate(id);
  changeCombatTechnique = (id: string) => this.props.setCombatTechnique(id);
  changeDamageDiceNumber = (event: InputTextEvent) => this.props.setDamageDiceNumber(event.target.value);
  changeDamageDiceSides = (id: number) => this.props.setDamageDiceSides(id);
  changeDamageFlat = (event: InputTextEvent) => this.props.setDamageFlat(event.target.value);
  changePrimaryAttribute = (primary?: string) => this.props.setPrimaryAttribute(primary);
  changeDamageThreshold = (event: InputTextEvent) => this.props.setDamageThreshold(event.target.value);
  changeFirstDamageThreshold = (event: InputTextEvent) => this.props.setFirstDamageThreshold(event.target.value);
  changeSecondDamageThreshold = (event: InputTextEvent) => this.props.setSecondDamageThreshold(event.target.value);
  changeDamageThresholdSeparation = () => this.props.switchIsDamageThresholdSeparated();
  changeAT = (event: InputTextEvent) => this.props.setAttack(event.target.value);
  changePA = (event: InputTextEvent) => this.props.setParry(event.target.value);
  changeReach = (id: number) => this.props.setReach(id);
  changeLength = (event: InputTextEvent) => this.props.setLength(event.target.value);
  changeStp = (event: InputTextEvent) => this.props.setStructurePoints(event.target.value);
  changeRange = (event: InputTextEvent, index: 1 | 2 | 3) => this.props.setRange(event.target.value, index);
  changeRange1 = (event: InputTextEvent) => this.changeRange(event, 1);
  changeRange2 = (event: InputTextEvent) => this.changeRange(event, 2);
  changeRange3 = (event: InputTextEvent) => this.changeRange(event, 3);
  changeReloadTime = (event: InputTextEvent) => this.props.setReloadTime(event.target.value);
  changeAmmunition = (id: string) => this.props.setAmmunition(id);
  changePRO = (event: InputTextEvent) => this.props.setProtection(event.target.value);
  changeENC = (event: InputTextEvent) => this.props.setEncumbrance(event.target.value);
  changeMovMod = (event: InputTextEvent) => this.props.setMovementModifier(event.target.value);
  changeIniMod = (event: InputTextEvent) => this.props.setInitiativeModifier(event.target.value);
  changeStabilityMod = (event: InputTextEvent) => this.props.setStabilityModifier(event.target.value);
  changeParryingWeapon = () => this.props.switchIsParryingWeapon();
  changeTwoHandedWeapon = () => this.props.switchIsTwoHandedWeapon();
  changeImprovisedWeapon = () => this.props.switchIsImprovisedWeapon();
  changeImprovisedWeaponGroup = (group: number) => this.props.setImprovisedWeaponGroup(group);
  changeLoss = (id?: number) => this.props.setLoss(id);
  changeArmorZoneOnly = () => this.props.switchIsForArmorZonesOnly();
  changeAddPenalties = () => this.props.setHasAdditionalPenalties();
  changeArmorType = (id: number) => this.props.setArmorType(id);
  applyTemplate = () => this.props.applyTemplate();
  lockTemplate = () => this.props.lockTemplate();
  unlockTemplate = () => this.props.unlockTemplate();

  getTemplate = (id: string) => this.props.templates.find(e => e.id === id);

  addItem = () => this.props.addToList();
  saveItem = () => this.props.saveItem();

  render() {
    const { attributes, closeEditor, combatTechniques, create, item, locale, templates } = this.props;
    if (item) {
      const { movMod, iniMod, addPenalties, armorType, stabilityMod, isTwoHandedWeapon, improvisedWeaponGroup, ammunition, amount, at, combatTechnique, damageBonus, damageDiceNumber, damageDiceSides, damageFlat, enc, gr, isParryingWeapon, isTemplateLocked: locked, length, name, pa, price, pro, range: [ range1, range2, range3 ], reach, reloadTime, stp, template, weight, where, loss, forArmorZoneOnly } = item;

      const GROUPS_SELECTION = translate(locale, 'equipment.view.groups').map((e, i) => ({ id: i + 1, name: e }));
      const IMP_GROUPS_SELECTION = [
        { id: 1, name: translate(locale, 'equipment.view.groups')[0] },
        { id: 2, name: translate(locale, 'equipment.view.groups')[1] }
      ];
      const TEMPLATES = [{name: translate(locale, 'options.none')} as { id?: string; name: string; }].concat(templates.map(({ id, name }) => ({ id, name })));
      const AMMUNITION = [{name: translate(locale, 'options.none')} as { id?: string; name: string; }].concat(templates.filter(e => e.gr === 3).map(({ id, name }) => ({ id, name })));
      const armorTypes = sortObjects(translate(locale, 'equipment.view.armortypes').map((e, i) => ({ id: i + 1, name: e })), locale.id);

      const dice = [2, 3, 6].map((e, i) => ({ id: e, name: translate(locale, 'equipment.view.dice')[i] }));
      const lossTiers = [{name: '0'}, {id: 1, name: 'I'}, {id: 2, name: 'II'}, {id: 3, name: 'III'}, {id: 4, name: 'IV'}];

      const validName = typeof name === 'string' && name.length > 0;
      const validATMod = isInteger(at);
      const validDamageDiceNumber = isEmptyOr(isNaturalNumber, damageDiceNumber);
      const validDamageFlat = isEmptyOr(isInteger, damageFlat);
      const validFirstDamageThreshold = Array.isArray(damageBonus.threshold) && isNaturalNumber(damageBonus.threshold[0]);
      const validSecondDamageThreshold = Array.isArray(damageBonus.threshold) && isNaturalNumber(damageBonus.threshold[1]);
      const validDamageThreshold = Array.isArray(damageBonus.threshold) ? validFirstDamageThreshold && validSecondDamageThreshold : isNaturalNumber(damageBonus.threshold);
      const validENC = isNaturalNumber(enc);
      const validINIMod = isEmptyOr(isInteger, iniMod);
      const validLength = isEmptyOr(isNaturalNumber, length);
      const validMOVMod = isEmptyOr(isInteger, movMod);
      const validNumber = isEmptyOr(isNaturalNumber, amount);
      const validPAMod = isInteger(pa);
      const validPrice = isEmptyOr(isFloat, price);
      const validPRO = isNaturalNumber(pro);
      const validRange1 = isEmptyOr(isNaturalNumber, range1);
      const validRange2 = isEmptyOr(isNaturalNumber, range2);
      const validRange3 = isEmptyOr(isNaturalNumber, range3);
      const validStabilityMod = isEmptyOr(isInteger, stabilityMod);
      const validStructurePoints = isEmptyOr(isNaturalNumber, stp);
      const validWeight = isEmptyOr(isFloat, weight);

      const validMelee = combatTechnique === 'CT_7' ? [validDamageDiceNumber, validDamageFlat, validLength, validNumber, validPrice, validStabilityMod, validStructurePoints, validWeight] : [validATMod, validDamageDiceNumber, validDamageFlat, validDamageThreshold, validLength, validNumber, validPAMod, validPrice, validStabilityMod, validStructurePoints, validWeight, typeof combatTechnique === 'string', typeof reach === 'number'];
      const validRanged = [validDamageDiceNumber, validDamageFlat, validLength, validNumber, validPrice, validRange1, validRange2, validRange3, validStabilityMod, validWeight, typeof combatTechnique === 'string'];
      const validArmor = [validENC, validINIMod, validMOVMod, validNumber, validPrice, validPRO, validStabilityMod, validWeight, typeof armorType === 'number'];
      const validOther = [validNumber, validPrice, validStructurePoints, validWeight];

      return (
        <Dialog
          id="item-editor"
          title={create ? translate(locale, 'itemeditor.titlecreate') : translate(locale, 'itemeditor.titleedit')}
          close={closeEditor}
          isOpened
          buttons={[
            {
              autoWidth: true,
              disabled: !validNumber || !locked && (typeof gr !== 'number' || gr === 1 && !validMelee.every(e => e) || gr === 2 && !validRanged.every(e => e) || gr === 4 && !validArmor.every(e => e) || !validOther.every(e => e)),
              label: translate(locale, 'actions.save'),
              onClick: create ? this.addItem : this.saveItem,
            },
          ]}>
          <div className="main">
            <div className="row">
              <TextField
                className="number"
                label={translate(locale, 'itemeditor.options.number')}
                value={amount}
                onChange={this.changeAmount}
                valid={validNumber}
                />
              <TextField
                className="name"
                label={translate(locale, 'itemeditor.options.name')}
                value={name}
                onChange={this.changeName}
                autoFocus={create}
                disabled={locked}
                valid={validName}
                />
            </div>
            <div className="row">
              <TextField
                className="price"
                label={translate(locale, 'itemeditor.options.price')}
                value={price}
                onChange={this.changePrice}
                disabled={locked}
                valid={validPrice}
                />
              <TextField
                className="weight"
                label={translate(locale, 'itemeditor.options.weight')}
                value={weight}
                onChange={this.changeWeight}
                disabled={locked}
                valid={validWeight}
                />
              <TextField
                className="where"
                label={translate(locale, 'itemeditor.options.carriedwhere')}
                value={where}
                onChange={this.changeWhere}
                />
            </div>
            <div className="row">
              <Dropdown
                className="gr"
                label={translate(locale, 'itemeditor.options.gr')}
                hint={translate(locale, 'itemeditor.options.grhint')}
                value={gr}
                options={GROUPS_SELECTION}
                onChange={this.changeGroup}
                disabled={locked}
                required
                />
            </div>
            {gr > 4 && <div className="row">
              <Checkbox
                className="improvised-weapon"
                label={translate(locale, 'itemeditor.options.improvisedweapon')}
                checked={typeof improvisedWeaponGroup === 'number'}
                onClick={this.changeImprovisedWeapon}
                disabled={locked}
                />
              <Dropdown
                className="gr imp-gr"
                hint={translate(locale, 'itemeditor.options.improvisedweapongr')}
                value={improvisedWeaponGroup || 0}
                options={IMP_GROUPS_SELECTION}
                onChange={this.changeImprovisedWeaponGroup}
                disabled={locked || typeof improvisedWeaponGroup !== 'number'}
                />
            </div>}
            <Hr />
            <div className="row">
              <Dropdown
                className="template"
                label={translate(locale, 'itemeditor.options.template')}
                hint={translate(locale, 'options.none')}
                value={template}
                options={TEMPLATES}
                onChange={this.changeTemplate}
                disabled={locked}
                />
              <IconButton
                icon="&#xE90a;"
                onClick={this.applyTemplate}
                disabled={template === 'ITEMTPL_0' || !template || locked}
                />
              {locked ? (
                <IconButton
                  icon="&#xE918;"
                  onClick={this.unlockTemplate}
                  />
              ) : (
                <IconButton
                  icon="&#xE917;"
                  onClick={this.lockTemplate}
                  disabled={template === 'ITEMTPL_0' || !template}
                  />
              )}
            </div>
          </div>
          {(gr === 1 || improvisedWeaponGroup === 1 || gr === 2 || improvisedWeaponGroup === 2 || gr === 4) && <Hr className="vertical" />}
          {(gr === 1 || improvisedWeaponGroup === 1) && ( <div className="melee">
            <div className="row">
              <Dropdown
                className="combattechnique"
                label={translate(locale, 'itemeditor.options.combattechnique')}
                hint={translate(locale, 'options.none')}
                value={combatTechnique}
                options={combatTechniques.filter(e => e.gr === 1).map(({ id, name }) => ({ id, name }))}
                onChange={this.changeCombatTechnique}
                disabled={locked}
                required
                />
            </div>
            <div className="row">
              <Dropdown
                className="primary-attribute-selection"
                label={translate(locale, 'itemeditor.options.primaryattribute')}
                value={damageBonus.primary}
                options={[
                  {name: `${translate(locale, 'itemeditor.options.primaryattributeshort')} (${combatTechnique && combatTechniques.find(e => e.id === combatTechnique)!.primary.map(e => attributes.get(e)!.short).join('/')})`},
                  {id: 'ATTR_5', name: attributes.get('ATTR_5')!.short},
                  {id: 'ATTR_6', name: attributes.get('ATTR_6')!.short},
                  {id: 'ATTR_6_8', name: `${attributes.get('ATTR_6')!.short}/${attributes.get('ATTR_8')!.short}`},
                  {id: 'ATTR_8', name: attributes.get('ATTR_8')!.short}
                ]}
                onChange={this.changePrimaryAttribute}
                disabled={locked || !combatTechnique || combatTechnique === 'CT_7'}
                />
              {Array.isArray(damageBonus.threshold) ? (
                <div className="container damage-threshold">
                  <Label text={translate(locale, 'itemeditor.options.damagethreshold')} disabled={locked || !combatTechnique || combatTechnique === 'CT_7'} />
                  <TextField
                    className="damage-threshold-part"
                    value={damageBonus.threshold[0]}
                    onChange={this.changeFirstDamageThreshold}
                    disabled={locked || !combatTechnique || combatTechnique === 'CT_7'}
                    valid={validFirstDamageThreshold}
                    />
                  <TextField
                    className="damage-threshold-part"
                    value={damageBonus.threshold[1]}
                    onChange={this.changeSecondDamageThreshold}
                    disabled={locked || !combatTechnique || combatTechnique === 'CT_7'}
                    valid={validSecondDamageThreshold}
                    />
                </div>
              ) : (
                <TextField
                  className="damage-threshold"
                  label={translate(locale, 'itemeditor.options.damagethreshold')}
                  value={damageBonus.threshold}
                  onChange={this.changeDamageThreshold}
                  disabled={locked || !combatTechnique || combatTechnique === 'CT_7'}
                  valid={validDamageThreshold}
                  />
              )}
            </div>
            <div className="row">
              <Checkbox
                className="damage-threshold-separated"
                label={translate(locale, 'itemeditor.options.damagethresholdseparated')}
                checked={Array.isArray(damageBonus.threshold)}
                onClick={this.changeDamageThresholdSeparation}
                disabled={locked || !combatTechnique || !(typeof damageBonus.primary === 'string' && damageBonus.primary === 'ATTR_6_8' || typeof combatTechnique === 'string' && combatTechniques.find(e => e.id === combatTechnique)!.primary.length === 2) || combatTechnique === 'CT_7'}
                />
            </div>
            <div className="row">
              <div className="container">
                <Label text={translate(locale, 'itemeditor.options.damage')} disabled={locked} />
                <TextField
                  className="damage-dice-number"
                  value={damageDiceNumber}
                  onChange={this.changeDamageDiceNumber}
                  disabled={locked}
                  valid={validDamageDiceNumber}
                  />
                <Dropdown
                  className="damage-dice-sides"
                  hint={translate(locale, 'itemeditor.options.damagedice')}
                  value={damageDiceSides}
                  options={dice}
                  onChange={this.changeDamageDiceSides}
                  disabled={locked}
                  />
                <TextField
                  className="damage-flat"
                  value={damageFlat}
                  onChange={this.changeDamageFlat}
                  disabled={locked}
                  valid={validDamageFlat}
                  />
              </div>
              <TextField
                className="stabilitymod"
                label={translate(locale, 'itemeditor.options.bfmod')}
                value={stabilityMod}
                onChange={this.changeStabilityMod}
                disabled={locked}
                valid={validStabilityMod}
                />
              <Dropdown
                className="weapon-loss"
                label={translate(locale, 'itemeditor.options.weaponloss')}
                value={loss}
                options={lossTiers}
                onChange={this.changeLoss}
                />
            </div>
            <div className="row">
              <Dropdown
                className="reach"
                label={translate(locale, 'itemeditor.options.reach')}
                hint={translate(locale, 'options.none')}
                value={reach}
                options={[{id: 1, name: translate(locale, 'itemeditor.options.reachshort')}, {id: 2, name: translate(locale, 'itemeditor.options.reachmedium')}, {id: 3, name: translate(locale, 'itemeditor.options.reachlong')}]}
                onChange={this.changeReach}
                disabled={locked || combatTechnique === 'CT_7'}
                required
                />
              <div className="container">
                <Label text={translate(locale, 'itemeditor.options.atpamod')} disabled={locked || combatTechnique === 'CT_7'} />
                <TextField
                  className="at"
                  value={at}
                  onChange={this.changeAT}
                  disabled={locked || combatTechnique === 'CT_7'}
                  valid={validATMod}
                  />
                <TextField
                  className="pa"
                  value={pa}
                  onChange={this.changePA}
                  disabled={locked || combatTechnique === 'CT_6' || combatTechnique === 'CT_7'}
                  valid={validPAMod}
                  />
              </div>
              { combatTechnique === 'CT_10' ? (
                <TextField
                  className="stp"
                  label={translate(locale, 'itemeditor.options.structurepoints')}
                  value={stp}
                  onChange={this.changeStp}
                  disabled={locked}
                  valid={validStructurePoints}
                  />
              ) : (
                <TextField
                  className="length"
                  label={translate(locale, 'itemeditor.options.length')}
                  value={length}
                  onChange={this.changeLength}
                  disabled={locked}
                  valid={validLength}
                  />
              ) }
            </div>
            <div className="row">
              <Checkbox
                className="parrying-weapon"
                label={translate(locale, 'itemeditor.options.parryingweapon')}
                checked={!!isParryingWeapon}
                onClick={this.changeParryingWeapon}
                disabled={locked}
                />
              <Checkbox
                className="twohanded-weapon"
                label={translate(locale, 'itemeditor.options.twohandedweapon')}
                checked={!!isTwoHandedWeapon}
                onClick={this.changeTwoHandedWeapon}
                disabled={locked}
                />
            </div>
          </div>)}
          {(gr === 2 || improvisedWeaponGroup === 2) && (<div className="ranged">
            <div className="row">
              <Dropdown
                className="combattechnique"
                label={translate(locale, 'itemeditor.options.combattechnique')}
                hint={translate(locale, 'options.none')}
                value={combatTechnique}
                options={combatTechniques.filter(e => e.gr === 2).map(({ id, name }) => ({ id, name }))}
                onChange={this.changeCombatTechnique}
                disabled={locked}
                required
                />
              <TextField
                className="reloadtime"
                label={translate(locale, 'itemeditor.options.reloadtime')}
                value={reloadTime}
                onChange={this.changeReloadTime}
                disabled={locked}
                />
            </div>
            <div className="row">
              <div className="container">
                <Label text={translate(locale, 'itemeditor.options.damage')} disabled={locked} />
                <TextField
                  className="damage-dice-number"
                  value={damageDiceNumber}
                  onChange={this.changeDamageDiceNumber}
                  disabled={locked}
                  valid={validDamageDiceNumber}
                  />
                <Dropdown
                  className="damage-dice-sides"
                  hint={translate(locale, 'itemeditor.options.damagedice')}
                  value={damageDiceSides}
                  options={dice}
                  onChange={this.changeDamageDiceSides}
                  disabled={locked}
                  />
                <TextField
                  className="damage-flat"
                  value={damageFlat}
                  onChange={this.changeDamageFlat}
                  disabled={locked}
                  valid={validDamageFlat}
                  />
              </div>
              <TextField
                className="stabilitymod"
                label={translate(locale, 'itemeditor.options.bfmod')}
                value={stabilityMod}
                onChange={this.changeStabilityMod}
                disabled={locked}
                valid={validStabilityMod}
                />
              <Dropdown
                className="weapon-loss"
                label={translate(locale, 'itemeditor.options.weaponloss')}
                value={loss}
                options={lossTiers}
                onChange={this.changeLoss}
                />
            </div>
            <div className="row">
              <div className="container">
                <TextField
                  className="range1"
                  label={translate(locale, 'itemeditor.options.rangeclose')}
                  value={range1}
                  onChange={this.changeRange1}
                  disabled={locked}
                  valid={validRange1}
                  />
                <TextField
                  className="range2"
                  label={translate(locale, 'itemeditor.options.rangemedium')}
                  value={range2}
                  onChange={this.changeRange2}
                  disabled={locked}
                  valid={validRange2}
                  />
                <TextField
                  className="range3"
                  label={translate(locale, 'itemeditor.options.rangefar')}
                  value={range3}
                  onChange={this.changeRange3}
                  disabled={locked}
                  valid={validRange3}
                  />
              </div>
              <Dropdown
                className="ammunition"
                label={translate(locale, 'itemeditor.options.ammunition')}
                hint={translate(locale, 'options.none')}
                value={ammunition}
                options={AMMUNITION}
                onChange={this.changeAmmunition}
                disabled={locked}
                />
              <TextField
                className="length"
                label={translate(locale, 'itemeditor.options.length')}
                value={length}
                onChange={this.changeLength}
                disabled={locked}
                valid={validLength}
                />
            </div>
          </div>)}
          {gr === 4 && ( <div className="armor">
            <div className="row">
              <div className="container">
                <TextField
                  className="pro"
                  label={translate(locale, 'itemeditor.options.pro')}
                  value={pro}
                  onChange={this.changePRO}
                  disabled={locked}
                  valid={validPRO}
                  />
                <TextField
                  className="enc"
                  label={translate(locale, 'itemeditor.options.enc')}
                  value={enc}
                  onChange={this.changeENC}
                  disabled={locked}
                  valid={validENC}
                  />
              </div>
              <Dropdown
                className="armor-type"
                label={translate(locale, 'itemeditor.options.armortype')}
                hint={translate(locale, 'options.none')}
                value={armorType}
                options={armorTypes}
                onChange={this.changeArmorType}
                disabled={locked}
                required
                />
            </div>
            <div className="row">
              <div className="container armor-loss-container">
                <TextField
                  className="stabilitymod"
                  label={translate(locale, 'itemeditor.options.stabilitymod')}
                  value={stabilityMod}
                  onChange={this.changeStabilityMod}
                  disabled={locked}
                  valid={validStabilityMod}
                  />
                <Dropdown
                  className="loss"
                  label={translate(locale, 'itemeditor.options.armorloss')}
                  value={loss}
                  options={lossTiers}
                  onChange={this.changeLoss}
                  />
              </div>
              <Checkbox
                className="only-zones"
                label={translate(locale, 'itemeditor.options.zonesonly')}
                checked={!!forArmorZoneOnly}
                onClick={this.changeArmorZoneOnly}
                disabled={locked}
                />
            </div>
            <div className="row">
              <div className="container">
                <TextField
                  className="mov"
                  label={translate(locale, 'itemeditor.options.movmod')}
                  value={movMod}
                  onChange={this.changeMovMod}
                  disabled={locked}
                  valid={validMOVMod}
                  />
                <TextField
                  className="ini"
                  label={translate(locale, 'itemeditor.options.inimod')}
                  value={iniMod}
                  onChange={this.changeIniMod}
                  disabled={locked}
                  valid={validINIMod}
                  />
              </div>
              <Checkbox
                className="add-penalties"
                label={translate(locale, 'itemeditor.options.additionalpenalties')}
                checked={!!addPenalties}
                onClick={this.changeAddPenalties}
                disabled={locked}
                />
            </div>
          </div>)}
        </Dialog>
      );
    }
    return null;
  }
}
