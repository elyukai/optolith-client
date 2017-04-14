import { omit } from 'lodash';
import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import Checkbox from '../../components/Checkbox';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import Hr from '../../components/Hr';
import IconButton from '../../components/IconButton';
import Label from '../../components/Label';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import EquipmentStore from '../../stores/EquipmentStore';
import alert from '../../utils/alert';
import { containsNaN, convertToEdit, convertToSave } from '../../utils/ItemUtils';

interface Props {
	create?: boolean;
	item?: ItemInstance;
	node?: HTMLDivElement;
}

const FIELDS = {
	amount: 'Anzahl',
	at: 'AT',
	damageBonus: 'Schadensschwelle',
	damageDiceNumber: 'Anzahl Schadenswürfel',
	damageFlat: 'Zusätzlicher Schaden',
	enc: 'BE',
	length: 'Länge',
	pa: 'PA',
	price: 'Preis',
	pro: 'RS',
	range: 'Reichweite',
	reloadTime: 'Ladezeit',
	stp: 'Strukturpunkte',
	weight: 'Gewicht',
};

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

const GROUPS_SELECTION = GROUPS.map((e, i) => ({ id: i + 1, name: e }));
const IMP_GROUPS_SELECTION = [
	{ id: 1, name: GROUPS[0] },
	{ id: 2, name: GROUPS[1] }
];
// const GROUPS_SELECTION = GROUPS.map((e,i) => [ e, i + 1 ]).sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);

export default class ItemEditor extends React.Component<Props, ItemEditorInstance> {
	state: ItemEditorInstance;

	constructor(props: Props) {
		super(props);
		let tempState = this.props.item;
		if (tempState) {
			if (tempState.isTemplateLocked) {
				const { id, where } = tempState;
				tempState = { ...EquipmentStore.getTemplate(tempState.template), id, where };
			}
			this.state = convertToEdit(tempState);
		}
		else {
			this.state = {
				addMOVPenalty: '',
				addINIPenalty: '',
				stabilityMod: '',
				ammunition: null,
				amount: '',
				at: '',
				combatTechnique: 'CT_0',
				damageBonus: '',
				damageDiceNumber: '',
				damageDiceSides: 0,
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
				reach: 0,
				reloadTime: '',
				stp: '',
				template: 'ITEMTPL_0',
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
		range[index] = event.target.value as string;
		this.setState({ range } as ItemEditorInstance);
	}
	changeRange1 = (event: InputTextEvent) => this.changeRange(event, 1);
	changeRange2 = (event: InputTextEvent) => this.changeRange(event, 2);
	changeRange3 = (event: InputTextEvent) => this.changeRange(event, 3);
	changeReloadTime = (event: InputTextEvent) => this.setState({ reloadTime: event.target.value } as ItemEditorInstance);
	changeAmmunition = (id: string) => this.setState({ ammunition: id } as ItemEditorInstance);
	changePRO = (event: InputTextEvent) => this.setState({ pro: event.target.value } as ItemEditorInstance);
	changeENC = (event: InputTextEvent) => this.setState({ enc: event.target.value } as ItemEditorInstance);
	changeAddGSPenalty = (event: InputTextEvent) => this.setState({ addMOVPenalty: event.target.value } as ItemEditorInstance);
	changeAddINIPenalty = (event: InputTextEvent) => this.setState({ addINIPenalty: event.target.value } as ItemEditorInstance);
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

	applyTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			const template = { ...EquipmentStore.getTemplate(this.state.template), id: this.state.id, isTemplateLocked: false };
			this.setState(convertToEdit(template));
		}
	}
	lockTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			const template = { ...EquipmentStore.getTemplate(this.state.template), id: this.state.id };
			this.setState(convertToEdit(template));
		}
	}
	unlockTemplate = () => this.setState({ isTemplateLocked: false } as ItemEditorInstance);

	addItem = () => {
		const itemToAdd = convertToSave(this.state);
		const nanKeys = containsNaN(itemToAdd);
		if (nanKeys) {
			alert('Eingabefehler', `Bitte überprüfe folgende Felder: ${nanKeys.map((e: keyof typeof FIELDS) => FIELDS[e]).join(', ')}`);
		}
		else {
			EquipmentActions.addToList(itemToAdd);
		}
	}
	saveItem = () => {
		const itemToAdd = convertToSave(this.state);
		const nanKeys = containsNaN(itemToAdd);
		if (nanKeys) {
			alert('Eingabefehler', `Bitte überprüfe folgende Felder: ${nanKeys.map((e: keyof typeof FIELDS) => FIELDS[e])}`);
		}
		else {
			EquipmentActions.set(this.state.id, itemToAdd);
		}
	}

	render() {
		const { create, node } = this.props;
		const { addMOVPenalty, addINIPenalty, stabilityMod, isTwoHandedWeapon, improvisedWeaponGroup, ammunition, amount, at, combatTechnique, damageBonus, damageDiceNumber, damageDiceSides, damageFlat, enc, gr, isParryingWeapon, isTemplateLocked: locked, length, name, pa, price, pro, range: [ range1, range2, range3 ], reach, reloadTime, stp, template, weight, where } = this.state;

		const TEMPLATES = [{id: 'ITEMTPL_0', name: 'Keine Vorlage'}].concat(EquipmentStore.getAllTemplates().map(({ id, name }) => ({ id, name })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		const AMMUNITION = [{id: null, name: 'Keine'} as { id: string | null; name: string; }].concat(EquipmentStore.getAllTemplates().filter(e => e.gr === 3).map(({ id, name }) => ({ id, name })));

		return (
			<Dialog
				id="item-editor"
				title={'Gegenstand ' + (create ? 'erstellen' : 'bearbeiten')}
				node={node}
				buttons={[
					{
						autoWidth: true,
						disabled: name === '' || gr === 0,
						label: 'Speichern',
						onClick: create ? this.addItem : this.saveItem,
					},
				]}>
				<div className="main">
					<div className="row">
						<TextField
							className="number"
							label="Menge"
							value={amount}
							onChange={this.changeAmount}
							/>
						<TextField
							className="name"
							label="Name"
							value={name}
							onChange={this.changeName}
							autoFocus={create}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="price"
							label="Preis in S"
							value={price}
							onChange={this.changePrice}
							disabled={locked}
							/>
						<TextField
							className="weight"
							label="Gewicht in St"
							value={weight}
							onChange={this.changeWeight}
							disabled={locked}
							/>
						<TextField
							className="where"
							label="Wo getragen"
							value={where}
							onChange={this.changeWhere}
							/>
					</div>
					<div className="row">
						<Dropdown
							className="gr"
							label="Art"
							hint="Wähle den Typ des Gegenstands aus"
							value={gr}
							options={GROUPS_SELECTION}
							onChange={this.changeGroup}
							disabled={locked}
							/>
					</div>
					{gr > 4 && <div className="row">
						<Checkbox
							className="improvised-weapon"
							label="Improvisierte Waffe"
							checked={typeof improvisedWeaponGroup === 'number'}
							onClick={this.changeImprovisedWeapon}
							disabled={locked}
							/>
						<Dropdown
							className="gr imp-gr"
							hint="Waffentyp"
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
							label="Vorlage"
							hint="Keine"
							value={template}
							options={TEMPLATES}
							onChange={this.changeTemplate}
							disabled={locked}
							/>
						<IconButton
							icon="&#xE876;"
							onClick={this.applyTemplate}
							disabled={template === 'ITEMTPL_0' || locked}
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
								disabled={template === 'ITEMTPL_0'}
								/>
						)}
					</div>
				</div>
				{ gr === 1 || improvisedWeaponGroup === 1 ? ( <div className="melee">
					<Hr />
					<div className="row">
						<Dropdown
							className="combattechnique"
							label="Kampftechnik"
							hint="Keine"
							value={combatTechnique}
							options={CombatTechniquesStore.getAll().filter(e => e.gr === 1).map(({ id, name }) => ({ id, name }))}
							onChange={this.changeCombatTechnique}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="damage-bonus"
							label="Schadensb."
							value={damageBonus}
							onChange={this.changeDamageBonus}
							disabled={locked}
							/>
						<div className="container">
							<Label text="Schaden" disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.changeDamageDiceNumber}
								disabled={locked}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint="W"
								value={damageDiceSides}
								options={[{id: 2, name: 'W2'}, {id: 3, name: 'W3'}, {id: 6, name: 'W6'}]}
								onChange={this.changeDamageDiceSides}
								disabled={locked}
								/>
							<TextField
								className="damage-flat"
								value={damageFlat}
								onChange={this.changeDamageFlat}
								disabled={locked}
								/>
						</div>
						<TextField
							className="stabilitymod"
							label="BF-Mod."
							value={stabilityMod}
							onChange={this.changeStabilityMod}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<Dropdown
							className="reach"
							label="Reichweite"
							hint="Auswählen"
							value={reach}
							options={[{id: 1, name: 'Kurz'}, {id: 2, name: 'Mittel'}, {id: 3, name: 'Lang'}]}
							onChange={this.changeReach}
							disabled={locked}
							/>
						<div className="container">
							<Label text="AT/PA-Mod" disabled={locked} />
							<TextField
								className="at"
								value={at}
								onChange={this.changeAT}
								disabled={locked}
								/>
							<TextField
								className="pa"
								value={pa}
								onChange={this.changePA}
								disabled={locked || combatTechnique === 'CT_6'}
								/>
						</div>
						{ combatTechnique === 'CT_10' ? (
							<TextField
								className="stp"
								label="Strukturp."
								value={stp}
								onChange={this.changeStp}
								disabled={locked}
								/>
						) : (
							<TextField
								className="length"
								label="Länge in Hf."
								value={length}
								onChange={this.changeLength}
								disabled={locked}
								/>
						) }
					</div>
					<div className="row">
						<Checkbox
							className="parrying-weapon"
							label="Parierwaffe"
							checked={isParryingWeapon}
							onClick={this.changeParryingWeapon}
							disabled={locked}
							/>
						<Checkbox
							className="twohanded-weapon"
							label="Zweihandwaffe"
							checked={isTwoHandedWeapon}
							onClick={this.changeTwoHandedWeapon}
							disabled={locked}
							/>
					</div>
				</div> ) : null }
				{ gr === 2 || improvisedWeaponGroup === 2 ? ( <div className="ranged">
					<Hr />
					<div className="row">
						<Dropdown
							className="combattechnique"
							label="Kampftechnik"
							hint="Keine"
							value={combatTechnique}
							options={CombatTechniquesStore.getAll().filter(e => e.gr === 2).map(({ id, name }) => ({ id, name }))}
							onChange={this.changeCombatTechnique}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="reloadtime"
							label="Ladezeiten"
							value={reloadTime}
							onChange={this.changeReloadTime}
							disabled={locked}
							/>
						<div className="container">
							<Label text="Schaden" disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.changeDamageDiceNumber}
								disabled={locked}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint="W"
								value={damageDiceSides}
								options={[{id: 3, name: 'W3'}, {id: 6, name: 'W6'}, {id: 20, name: 'W20'}]}
								onChange={this.changeDamageDiceSides}
								disabled={locked}
								/>
							<TextField
								className="damage-flat"
								value={damageFlat}
								onChange={this.changeDamageFlat}
								disabled={locked}
								/>
						</div>
						<TextField
							className="stabilitymod"
							label="BF-Mod."
							value={stabilityMod}
							onChange={this.changeStabilityMod}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<div className="container">
							<TextField
								className="range1"
								label="Nah"
								value={range1}
								onChange={this.changeRange1}
								disabled={locked}
								/>
							<TextField
								className="range2"
								label="Mittel"
								value={range2}
								onChange={this.changeRange2}
								disabled={locked}
								/>
							<TextField
								className="range3"
								label="Weit"
								value={range3}
								onChange={this.changeRange3}
								disabled={locked}
								/>
						</div>
						<Dropdown
							className="ammunition"
							label="Munition"
							hint="Keine"
							value={ammunition}
							options={AMMUNITION}
							onChange={this.changeAmmunition}
							disabled={locked}
							/>
						<TextField
							className="length"
							label="Länge in Hf."
							value={length}
							onChange={this.changeLength}
							disabled={locked}
							/>
					</div>
				</div> ) : null }
				{ gr === 4 ? ( <div className="armor">
					<Hr />
					<div className="row">
						<div className="container">
							<TextField
								className="pro"
								label="RS"
								value={pro}
								onChange={this.changePRO}
								disabled={locked}
								/>
							<TextField
								className="enc"
								label="BE"
								value={enc}
								onChange={this.changeENC}
								disabled={locked}
								/>
						</div>
						<div className="container armor-add">
							<TextField
								className="mov"
								label="GS"
								value={addMOVPenalty}
								onChange={this.changeENC}
								disabled={locked}
								/>
							<TextField
								className="ini"
								label="INI"
								value={enc}
								onChange={this.changeENC}
								disabled={locked}
								/>
							<TextField
								className="stabilitymod"
								label="ST-Mod."
								value={stabilityMod}
								onChange={this.changeStabilityMod}
								disabled={locked}
								/>
						</div>
					</div>
				</div> ) : null }
			</Dialog>
		);
	}
}
