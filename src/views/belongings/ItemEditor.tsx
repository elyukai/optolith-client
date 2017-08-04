import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dialog } from '../../components/Dialog';
import { Dropdown } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { IconButton } from '../../components/IconButton';
import { Label } from '../../components/Label';
import { TextField } from '../../components/TextField';
import { InputTextEvent, ItemEditorInstance, ItemInstance } from '../../types/data.d';
import { CombatTechnique } from '../../types/view.d';
import { translate } from '../../utils/I18n';
import { convertToEdit, convertToSave } from '../../utils/ItemUtils';

interface Props {
	create?: boolean;
	item?: ItemInstance;
	node?: HTMLDivElement;
	combatTechniques: CombatTechnique[];
	templates: ItemInstance[];
	addToList(data: ItemInstance): void;
	set(id: string, data: ItemInstance): void;
}

export class ItemEditor extends React.Component<Props, ItemEditorInstance> {
	state: ItemEditorInstance;

	constructor(props: Props) {
		super(props);
		const tempState = this.props.item;
		if (tempState) {
			this.state = convertToEdit(tempState);
		}
		else {
			this.state = {
				movMod: '',
				iniMod: '',
				stabilityMod: '',
				amount: '',
				at: '',
				damageBonus: '',
				damageDiceNumber: '',
				damageFlat: '',
				enc: '',
				gr: 0,
				id: '',
				isParryingWeapon: false,
				isTemplateLocked: false,
				isTwoHandedWeapon: false,
				length: '',
				name: '',
				pa: '',
				price: '',
				pro: '',
				range: ['', '', ''],
				reloadTime: '',
				stp: '',
				weight: '',
				where: '',
			};
		}
	}

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as ItemEditorInstance);
	changePrice = (event: InputTextEvent) => this.setState({ price: event.target.value } as ItemEditorInstance);
	changeWeight = (event: InputTextEvent) => this.setState({ weight: event.target.value } as ItemEditorInstance);
	changeAmount = (event: InputTextEvent) => this.setState({ amount: event.target.value } as ItemEditorInstance);
	changeWhere = (event: InputTextEvent) => this.setState({ where: event.target.value } as ItemEditorInstance);
	changeGroup = (id: number) => this.setState({ gr: id } as ItemEditorInstance);
	changeTemplate = (id: string) => this.setState({ template: id } as ItemEditorInstance);
	changeCombatTechnique = (id: string) => this.setState({ combatTechnique: id } as ItemEditorInstance);
	changeDamageDiceNumber = (event: InputTextEvent) => this.setState({ damageDiceNumber: event.target.value } as ItemEditorInstance);
	changeDamageDiceSides = (id: number) => this.setState({ damageDiceSides: id } as ItemEditorInstance);
	changeDamageFlat = (event: InputTextEvent) => this.setState({ damageFlat: event.target.value } as ItemEditorInstance);
	changeDamageBonus = (event: InputTextEvent) => this.setState({ damageBonus: event.target.value } as ItemEditorInstance);
	changeAT = (event: InputTextEvent) => this.setState({ at: event.target.value } as ItemEditorInstance);
	changePA = (event: InputTextEvent) => this.setState({ pa: event.target.value } as ItemEditorInstance);
	changeReach = (id: number) => this.setState({ reach: id } as ItemEditorInstance);
	changeLength = (event: InputTextEvent) => this.setState({ length: event.target.value } as ItemEditorInstance);
	changeStp = (event: InputTextEvent) => this.setState({ stp: event.target.value } as ItemEditorInstance);
	changeRange = (event: InputTextEvent, index: 1 | 2 | 3) => {
		const range = this.state.range;
		range[index - 1] = event.target.value as string;
		this.setState({ range } as ItemEditorInstance);
	}
	changeRange1 = (event: InputTextEvent) => this.changeRange(event, 1);
	changeRange2 = (event: InputTextEvent) => this.changeRange(event, 2);
	changeRange3 = (event: InputTextEvent) => this.changeRange(event, 3);
	changeReloadTime = (event: InputTextEvent) => this.setState({ reloadTime: event.target.value } as ItemEditorInstance);
	changeAmmunition = (id: string) => this.setState({ ammunition: id } as ItemEditorInstance);
	changePRO = (event: InputTextEvent) => this.setState({ pro: event.target.value } as ItemEditorInstance);
	changeENC = (event: InputTextEvent) => this.setState({ enc: event.target.value } as ItemEditorInstance);
	changeMovMod = (event: InputTextEvent) => this.setState({ movMod: event.target.value } as ItemEditorInstance);
	changeIniMod = (event: InputTextEvent) => this.setState({ iniMod: event.target.value } as ItemEditorInstance);
	changeStabilityMod = (event: InputTextEvent) => this.setState({ stabilityMod: event.target.value } as ItemEditorInstance);
	changeParryingWeapon = () => {
		this.setState(prevState => ({ isParryingWeapon: !prevState.isParryingWeapon } as ItemEditorInstance));
	}
	changeTwoHandedWeapon = () => {
		this.setState(prevState => ({ isTwoHandedWeapon: !prevState.isTwoHandedWeapon } as ItemEditorInstance));
	}
	changeImprovisedWeapon = () => {
		if (typeof this.state.improvisedWeaponGroup === 'number') {
			this.setState({ improvisedWeaponGroup: undefined } as ItemEditorInstance);
		}
		else {
			this.setState({ improvisedWeaponGroup: 0 } as ItemEditorInstance);
		}
	}
	changeImprovisedWeaponGroup = (group: number) => {
		this.setState({ improvisedWeaponGroup: group } as ItemEditorInstance);
	}
	changeLoss = (id?: number) => {
		this.setState({ loss: id } as ItemEditorInstance);
	}
	changeArmorZoneOnly = () => {
		this.setState({ forArmorZoneOnly: !this.state.forArmorZoneOnly } as ItemEditorInstance);
	}
	changeAddPenalties = () => {
		this.setState({ addPenalties: !this.state.addPenalties } as ItemEditorInstance);
	}
	changeArmorType = (id: number) => {
		this.setState({ armorType: id } as ItemEditorInstance);
	}

	getTemplate = (id: string) => this.props.templates.find(e => e.id === id);

	applyTemplate = () => {
		if (typeof this.state.template === 'string') {
			const template = this.getTemplate(this.state.template);
			const { id, where, loss, amount } = this.state;
			if (template !== undefined) {
				this.setState({...convertToEdit(template), id, where, loss, amount, isTemplateLocked: false});
			}
		}
	}
	lockTemplate = () => {
		if (typeof this.state.template === 'string') {
			const template = this.getTemplate(this.state.template);
			const { id, where, loss, amount } = this.state;
			if (template !== undefined) {
				this.setState({...convertToEdit(template), id, where, loss, amount, isTemplateLocked: true});
			}
		}
	}
	unlockTemplate = () => this.setState({ isTemplateLocked: false } as ItemEditorInstance);

	addItem = () => {
		const itemToAdd = convertToSave(this.state);
		this.props.addToList(itemToAdd);
	}
	saveItem = () => {
		const itemToAdd = convertToSave(this.state);
		this.props.set(this.state.id, itemToAdd);
	}

	render() {
		const { combatTechniques, create, node, templates } = this.props;
		const { movMod, iniMod, addPenalties, armorType, stabilityMod, isTwoHandedWeapon, improvisedWeaponGroup, ammunition, amount, at, combatTechnique, damageBonus, damageDiceNumber, damageDiceSides, damageFlat, enc, gr, isParryingWeapon, isTemplateLocked: locked, length, name, pa, price, pro, range: [ range1, range2, range3 ], reach, reloadTime, stp, template, weight, where, loss, forArmorZoneOnly } = this.state;

		const GROUPS_SELECTION = translate('equipment.view.groups').map((e, i) => ({ id: i + 1, name: e }));
		const IMP_GROUPS_SELECTION = [
			{ id: 1, name: translate('equipment.view.groups')[0] },
			{ id: 2, name: translate('equipment.view.groups')[1] }
		];
		// const GROUPS_SELECTION = GROUPS.map((e,i) => [ e, i + 1 ]).sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
		const TEMPLATES = [{name: translate('options.none')} as { id?: string; name: string; }].concat(templates.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		const AMMUNITION = [{name: translate('options.none')} as { id?: string; name: string; }].concat(templates.filter(e => e.gr === 3).map(({ id, name }) => ({ id, name })));
		const armorTypes = translate('equipment.view.armortypes').map((e, i) => ({ id: i + 1, name: e }));

		const dice = [2, 3, 6].map((e, i) => ({ id: e, name: translate('equipment.view.dice')[i] }));
		const lossTiers = [{name: '0'}, {id: 1, name: 'I'}, {id: 2, name: 'II'}, {id: 3, name: 'III'}, {id: 4, name: 'IV'}];

		const regexInt = /^\d+$/;
		const regexIntEmpty = /^\d*$/;
		const regexIntN = /^-?\d+$/;
		const regexIntNEmpty = /^(\d*|-\d+)$/;
		const regexFloatEmpty = /^[\d,\.]*$/;

		const validName = typeof name === 'string' && name.length > 0;
		const validATMod = regexIntN.test(at);
		const validDamageDiceNumber = regexIntEmpty.test(damageDiceNumber);
		const validDamageFlat = regexIntNEmpty.test(damageFlat);
		const validDamageThreshold = regexIntEmpty.test(damageBonus);
		const validENC = regexInt.test(enc);
		const validINIMod = regexIntNEmpty.test(iniMod);
		const validLength = regexIntEmpty.test(length);
		const validMOVMod = regexIntNEmpty.test(movMod);
		const validNumber = regexIntEmpty.test(amount);
		const validPAMod = regexIntN.test(pa);
		const validPrice = regexFloatEmpty.test(price);
		const validPRO = regexInt.test(pro);
		const validRange1 = regexIntEmpty.test(range1);
		const validRange2 = regexIntEmpty.test(range2);
		const validRange3 = regexIntEmpty.test(range3);
		const validStabilityMod = regexIntNEmpty.test(stabilityMod);
		const validStructurePoints = regexIntEmpty.test(stp);
		const validWeight = regexFloatEmpty.test(weight);

		const validMelee = [validATMod, validDamageDiceNumber, validDamageFlat, validDamageThreshold, validLength, validNumber, validPAMod, validPrice, validStabilityMod, validStructurePoints, validWeight, typeof combatTechnique === 'string', typeof reach === 'number'];
		const validRanged = [validDamageDiceNumber, validDamageFlat, validLength, validNumber, validPrice, validRange1, validRange2, validRange3, validStabilityMod, validWeight, typeof combatTechnique === 'string'];
		const validArmor = [validENC, validINIMod, validMOVMod, validNumber, validPrice, validPRO, validStabilityMod, validWeight, typeof armorType === 'number'];
		const validOther = [validNumber, validPrice, validStructurePoints, validWeight];

		return (
			<Dialog
				id="item-editor"
				title={create ? translate('itemeditor.titlecreate') : translate('itemeditor.titleedit')}
				node={node}
				buttons={[
					{
						autoWidth: true,
						disabled: !validNumber || !locked && (typeof gr !== 'number' || gr === 1 && !validMelee.every(e => e) || gr === 2 && !validRanged.every(e => e) || gr === 4 && !validArmor.every(e => e) || !validOther.every(e => e)),
						label: translate('actions.save'),
						onClick: create ? this.addItem : this.saveItem,
					},
				]}>
				<div className="main">
					<div className="row">
						<TextField
							className="number"
							label={translate('itemeditor.options.number')}
							value={amount}
							onChange={this.changeAmount}
							valid={validNumber}
							/>
						<TextField
							className="name"
							label={translate('itemeditor.options.name')}
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
							label={translate('itemeditor.options.price')}
							value={price}
							onChange={this.changePrice}
							disabled={locked}
							valid={validPrice}
							/>
						<TextField
							className="weight"
							label={translate('itemeditor.options.weight')}
							value={weight}
							onChange={this.changeWeight}
							disabled={locked}
							valid={validWeight}
							/>
						<TextField
							className="where"
							label={translate('itemeditor.options.carriedwhere')}
							value={where}
							onChange={this.changeWhere}
							/>
					</div>
					<div className="row">
						<Dropdown
							className="gr"
							label={translate('itemeditor.options.gr')}
							hint={translate('itemeditor.options.grhint')}
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
							label={translate('itemeditor.options.improvisedweapon')}
							checked={typeof improvisedWeaponGroup === 'number'}
							onClick={this.changeImprovisedWeapon}
							disabled={locked}
							/>
						<Dropdown
							className="gr imp-gr"
							hint={translate('itemeditor.options.improvisedweapongr')}
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
							label={translate('itemeditor.options.template')}
							hint={translate('options.none')}
							value={template}
							options={TEMPLATES}
							onChange={this.changeTemplate}
							disabled={locked}
							/>
						<IconButton
							icon="&#xE876;"
							onClick={this.applyTemplate}
							disabled={template === 'ITEMTPL_0' || !template || locked}
							/>
						{locked ? (
							<IconButton
								icon="&#xE898;"
								onClick={this.unlockTemplate}
								/>
						) : (
							<IconButton
								icon="&#xE899;"
								onClick={this.lockTemplate}
								disabled={template === 'ITEMTPL_0' || !template}
								/>
						)}
					</div>
				</div>
				{(gr === 1 || improvisedWeaponGroup === 1) && ( <div className="melee">
					<Hr />
					<div className="row">
						<Dropdown
							className="combattechnique"
							label={translate('itemeditor.options.combattechnique')}
							hint={translate('options.none')}
							value={combatTechnique}
							options={combatTechniques.filter(e => e.gr === 1).map(({ id, name }) => ({ id, name }))}
							onChange={this.changeCombatTechnique}
							disabled={locked}
							required
							/>
						<TextField
							className="damage-bonus"
							label={translate('itemeditor.options.damagethreshold')}
							value={damageBonus}
							onChange={this.changeDamageBonus}
							disabled={locked}
							valid={validDamageThreshold}
							/>
					</div>
					<div className="row">
						<div className="container">
							<Label text={translate('itemeditor.options.damage')} disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.changeDamageDiceNumber}
								disabled={locked}
								valid={validDamageDiceNumber}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint={translate('itemeditor.options.damagedice')}
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
							label={translate('itemeditor.options.bfmod')}
							value={stabilityMod}
							onChange={this.changeStabilityMod}
							disabled={locked}
							valid={validStabilityMod}
							/>
						<Dropdown
							className="weapon-loss"
							label={translate('itemeditor.options.weaponloss')}
							value={loss}
							options={lossTiers}
							onChange={this.changeLoss}
							/>
					</div>
					<div className="row">
						<Dropdown
							className="reach"
							label={translate('itemeditor.options.reach')}
							hint={translate('options.none')}
							value={reach}
							options={[{id: 1, name: translate('itemeditor.options.reachshort')}, {id: 2, name: translate('itemeditor.options.reachmedium')}, {id: 3, name: translate('itemeditor.options.reachlong')}]}
							onChange={this.changeReach}
							disabled={locked}
							required
							/>
						<div className="container">
							<Label text={translate('itemeditor.options.atpamod')} disabled={locked} />
							<TextField
								className="at"
								value={at}
								onChange={this.changeAT}
								disabled={locked}
								valid={validATMod}
								/>
							<TextField
								className="pa"
								value={pa}
								onChange={this.changePA}
								disabled={locked || combatTechnique === 'CT_6'}
								valid={validPAMod}
								/>
						</div>
						{ combatTechnique === 'CT_10' ? (
							<TextField
								className="stp"
								label={translate('itemeditor.options.structurepoints')}
								value={stp}
								onChange={this.changeStp}
								disabled={locked}
								valid={validStructurePoints}
								/>
						) : (
							<TextField
								className="length"
								label={translate('itemeditor.options.length')}
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
							label={translate('itemeditor.options.parryingweapon')}
							checked={!!isParryingWeapon}
							onClick={this.changeParryingWeapon}
							disabled={locked}
							/>
						<Checkbox
							className="twohanded-weapon"
							label={translate('itemeditor.options.twohandedweapon')}
							checked={!!isTwoHandedWeapon}
							onClick={this.changeTwoHandedWeapon}
							disabled={locked}
							/>
					</div>
				</div>)}
				{(gr === 2 || improvisedWeaponGroup === 2) && (<div className="ranged">
					<Hr />
					<div className="row">
						<Dropdown
							className="combattechnique"
							label={translate('itemeditor.options.combattechnique')}
							hint={translate('options.none')}
							value={combatTechnique}
							options={combatTechniques.filter(e => e.gr === 2).map(({ id, name }) => ({ id, name }))}
							onChange={this.changeCombatTechnique}
							disabled={locked}
							required
							/>
						<TextField
							className="reloadtime"
							label={translate('itemeditor.options.reloadtime')}
							value={reloadTime}
							onChange={this.changeReloadTime}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<div className="container">
							<Label text={translate('itemeditor.options.damage')} disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.changeDamageDiceNumber}
								disabled={locked}
								valid={validDamageDiceNumber}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint={translate('itemeditor.options.damagedice')}
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
							label={translate('itemeditor.options.bfmod')}
							value={stabilityMod}
							onChange={this.changeStabilityMod}
							disabled={locked}
							valid={validStabilityMod}
							/>
						<Dropdown
							className="weapon-loss"
							label={translate('itemeditor.options.weaponloss')}
							value={loss}
							options={lossTiers}
							onChange={this.changeLoss}
							/>
					</div>
					<div className="row">
						<div className="container">
							<TextField
								className="range1"
								label={translate('itemeditor.options.rangeclose')}
								value={range1}
								onChange={this.changeRange1}
								disabled={locked}
								valid={validRange1}
								/>
							<TextField
								className="range2"
								label={translate('itemeditor.options.rangemedium')}
								value={range2}
								onChange={this.changeRange2}
								disabled={locked}
								valid={validRange2}
								/>
							<TextField
								className="range3"
								label={translate('itemeditor.options.rangefar')}
								value={range3}
								onChange={this.changeRange3}
								disabled={locked}
								valid={validRange3}
								/>
						</div>
						<Dropdown
							className="ammunition"
							label={translate('itemeditor.options.ammunition')}
							hint={translate('options.none')}
							value={ammunition}
							options={AMMUNITION}
							onChange={this.changeAmmunition}
							disabled={locked}
							/>
						<TextField
							className="length"
							label={translate('itemeditor.options.length')}
							value={length}
							onChange={this.changeLength}
							disabled={locked}
							valid={validLength}
							/>
					</div>
				</div>)}
				{gr === 4 && ( <div className="armor">
					<Hr />
					<div className="row">
						<div className="container">
							<TextField
								className="pro"
								label={translate('itemeditor.options.pro')}
								value={pro}
								onChange={this.changePRO}
								disabled={locked}
								valid={validPRO}
								/>
							<TextField
								className="enc"
								label={translate('itemeditor.options.enc')}
								value={enc}
								onChange={this.changeENC}
								disabled={locked}
								valid={validENC}
								/>
						</div>
						<Dropdown
							className="armor-type"
							label={translate('itemeditor.options.armortype')}
							hint={translate('options.none')}
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
								label={translate('itemeditor.options.stabilitymod')}
								value={stabilityMod}
								onChange={this.changeStabilityMod}
								disabled={locked}
								valid={validStabilityMod}
								/>
							<Dropdown
								className="loss"
								label={translate('itemeditor.options.armorloss')}
								value={loss}
								options={lossTiers}
								onChange={this.changeLoss}
								/>
						</div>
						<Checkbox
							className="only-zones"
							label={translate('itemeditor.options.zonesonly')}
							checked={!!forArmorZoneOnly}
							onClick={this.changeArmorZoneOnly}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<div className="container">
							<TextField
								className="mov"
								label={translate('itemeditor.options.movmod')}
								value={movMod}
								onChange={this.changeMovMod}
								disabled={locked}
								valid={validMOVMod}
								/>
							<TextField
								className="ini"
								label={translate('itemeditor.options.inimod')}
								value={iniMod}
								onChange={this.changeIniMod}
								disabled={locked}
								valid={validINIMod}
								/>
						</div>
						<Checkbox
							className="add-penalties"
							label={translate('itemeditor.options.additionalpenalties')}
							checked={!!addPenalties}
							onClick={this.changeAddPenalties}
							disabled={locked}
							/>
					</div>
				</div>)}
			</Dialog>
		);
	}
}
