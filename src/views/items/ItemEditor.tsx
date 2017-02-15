import * as InventoryActions from '../../actions/InventoryActions';
import * as React from 'react';
import alert from '../../utils/alert';
import Checkbox from '../../components/Checkbox';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import Hr from '../../components/Hr';
import IconButton from '../../components/IconButton';
import InventoryStore from '../../stores/InventoryStore';
import { containsNaN, convertToEdit, convertToSave } from '../../utils/ItemUtils';
import Label from '../../components/Label';
import TextField from '../../components/TextField';

interface Props {
	create?: boolean;
	item?: ItemInstance;
	node?: HTMLDivElement;
}

interface State extends ItemEditorInstance {}

const FIELDS = {
	price: 'Preis',
	weight: 'Gewicht',
	amount: 'Anzahl',
	damageDiceNumber: 'Anzahl Schadenswürfel',
	damageFlat: 'Zusätzlicher Schaden',
	damageBonus: 'Schadensschwelle',
	at: 'AT',
	pa: 'PA',
	length: 'Länge',
	stp: 'Strukturpunkte',
	range: 'Reichweite',
	reloadTime: 'Ladezeit',
	pro: 'RS',
	enc: 'BE'
};

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

const GROUPS_SELECTION = GROUPS.map((e,i) => ({ id: i + 1, name: e }));
// const GROUPS_SELECTION = GROUPS.map((e,i) => [ e, i + 1 ]).sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);

export default class ItemEditor extends React.Component<Props, State> {
	state: State;

	constructor(props: Props) {
		super(props);
		let tempState = this.props.item;
		if (tempState) {
			if (tempState.isTemplateLocked) {
				const { id } = tempState;
				tempState = { ...InventoryStore.getTemplate(this.state.template), id };
			}
			this.state = convertToEdit(tempState);
		}
		else {
			this.state = {
				id: '',
				name: '',
				price: '',
				weight: '',
				amount: '',
				where: '',
				gr: 0,
				template: 'ITEMTPL_0',
				isTemplateLocked: false,
				combatTechnique: 'CT_0',
				damageDiceNumber: '',
				damageDiceSides: 0,
				damageFlat: '',
				damageBonus: '',
				at: '',
				pa: '',
				reach: 0,
				length: '',
				stp: '',
				range: ['', '', ''],
				reloadTime: '',
				ammunition: null,
				pro: '',
				enc: '',
				addPenalties: false
			};
		}
	}

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as State);
	changePrice = (event: InputTextEvent) => this.setState({ price: event.target.value } as State);
	changeWeight = (event: InputTextEvent) => this.setState({ weight: event.target.value } as State);
	changeAmount = (event: InputTextEvent) => this.setState({ amount: event.target.value } as State);
	changeWhere = (event: InputTextEvent) => this.setState({ where: event.target.value } as State);
	changeGroup = (id: number) => this.setState({ gr: id } as State);
	changeTemplate = (id: string) => this.setState({ template: id } as State);
	changeCombatTechnique = (id: string) => this.setState({ combatTechnique: id } as State);
	changeDamageDiceNumber = (event: InputTextEvent) => this.setState({ damageDiceNumber: event.target.value } as State);
	changeDamageDiceSides = (id: number) => this.setState({ damageDiceSides: id } as State);
	changeDamageFlat = (event: InputTextEvent) => this.setState({ damageFlat: event.target.value } as State);
	changeDamageBonus = (event: InputTextEvent) => this.setState({ damageBonus: event.target.value } as State);
	changeAT = (event: InputTextEvent) => this.setState({ at: event.target.value } as State);
	changePA = (event: InputTextEvent) => this.setState({ pa: event.target.value } as State);
	changeReach = (id: number) => this.setState({ reach: id } as State);
	changeLength = (event: InputTextEvent) => this.setState({ length: event.target.value } as State);
	changeStp = (event: InputTextEvent) => this.setState({ stp: event.target.value } as State);
	changeRange = (event: InputTextEvent, index: 1 | 2 | 3) => {
		const range = this.state.range;
		range[index] = event.target.value;
		this.setState({ range } as State)
	};
	changeRange1 = (event: InputTextEvent) => this.changeRange(event, 1);
	changeRange2 = (event: InputTextEvent) => this.changeRange(event, 2);
	changeRange3 = (event: InputTextEvent) => this.changeRange(event, 3);
	changeReloadTime = (event: InputTextEvent) => this.setState({ reloadTime: event.target.value } as State);
	changeAmmunition = (id: string) => this.setState({ ammunition: id } as State);
	changePRO = (event: InputTextEvent) => this.setState({ pro: event.target.value } as State);
	changeENC = (event: InputTextEvent) => this.setState({ enc: event.target.value } as State);
	changeAddPenalties = () => this.setState((prevState) => ({ addPenalties: !prevState.addPenalties } as State));

	applyTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			const template = { ...InventoryStore.getTemplate(this.state.template), id: this.state.id, isTemplateLocked: false };
			this.setState(convertToEdit(template));
		}
	};
	lockTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			const template = { ...InventoryStore.getTemplate(this.state.template), id: this.state.id };
			this.setState(convertToEdit(template));
		}
	};
	unlockTemplate = () => this.setState({ isTemplateLocked: false } as State);

	addItem = () => {
		const itemToAdd = convertToSave(this.state);
		const nanKeys = containsNaN(itemToAdd);
		if (nanKeys) {
			alert('Eingabefehler', `Bitte überprüfe folgende Felder: ${nanKeys.map((e: keyof typeof FIELDS) => FIELDS[e])}`)
		}
		else {
			InventoryActions.addToList(itemToAdd);
		}
	}
	saveItem = () => {
		const itemToAdd = convertToSave(this.state);
		const nanKeys = containsNaN(itemToAdd);
		if (nanKeys) {
			alert('Eingabefehler', `Bitte überprüfe folgende Felder: ${nanKeys.map((e: keyof typeof FIELDS) => FIELDS[e])}`)
		}
		else {
			InventoryActions.set(this.state.id, itemToAdd);
		}
	}

	render() {
		const { create, node } = this.props;
		const { addPenalties, ammunition, amount, at, combatTechnique, damageBonus, damageDiceNumber, damageDiceSides, damageFlat, enc, gr, isTemplateLocked: locked, length, name, pa, price, pro, range: [ range1, range2, range3 ], reach, reloadTime, stp, template, weight, where } = this.state;

		const TEMPLATES = [{id: 'ITEMTPL_0', name: 'Keine Vorlage'}].concat(InventoryStore.getAllTemplates().map(({ id, name }) => ({ id, name })).sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		const AMMUNITION = [{id: null, name: 'Keine'} as { id: string | null; name: string; }].concat(InventoryStore.getAllTemplates().filter(e => e.gr === 3).map(({ id, name }) => ({ id, name })));

		return (
			<Dialog
				id="item-editor"
				title={'Gegenstand ' + (create ? 'erstellen' : 'bearbeiten')}
				node={node}
				buttons={[
					{
						label: 'Speichern',
						onClick: create ? this.addItem : this.saveItem,
						autoWidth: true,
						disabled: name === '' || gr === 0
					}
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
				{ gr === 1 ? ( <div className="melee">
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
								options={[{id:3,name:'W3'},{id:6,name:'W6'},{id:20,name:'W20'}]}
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
					</div>
					<div className="row">
						<Dropdown
							className="reach"
							label="Reichweite"
							hint="Auswählen"
							value={reach}
							options={[{id:1,name:'Kurz'},{id:2,name:'Mittel'},{id:3,name:'Lang'}]}
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
				</div> ) : null }
				{ gr === 2 ? ( <div className="ranged">
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
								options={[{id:3,name:'W3'},{id:6,name:'W6'},{id:20,name:'W20'}]}
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
				{ gr === 3 ? ( <div className="armor">
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
						<Checkbox
							className="addpenalties"
							label="Zusätzliche Abzüge"
							checked={addPenalties}
							onClick={this.changeAddPenalties}
							disabled={locked}
							/>
					</div>
				</div> ) : null }
			</Dialog>
		);
	}
}
