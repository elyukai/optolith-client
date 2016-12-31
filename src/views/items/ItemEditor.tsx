import { ItemEditorInstance } from '../../utils/data/Item';
import Checkbox from '../../components/Checkbox';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import Hr from '../../components/Hr';
import IconButton from '../../components/IconButton';
import InventoryActions from '../../actions/InventoryActions';
import InventoryStore from '../../stores/InventoryStore';
import Label from '../../components/Label';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

interface Props {
	create?: boolean;
	item: ItemEditorInstance;
	node: HTMLDivElement;
}

interface State extends ItemEditorInstance {}

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

const GROUPS_SELECTION = GROUPS.map((e,i) => [ e, i + 1 ]);
// const GROUPS_SELECTION = GROUPS.map((e,i) => [ e, i + 1 ]).sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);

export default class ItemEditor extends Component<Props, State> {

	static propTypes = { 
		create: PropTypes.bool,
		item: PropTypes.object,
		node: PropTypes.any
	};

	state = this.props.item || {
		id: '',
		name: '',
		price: '',
		weight: '',
		number: '',
		where: '',
		gr: 0,
		template: 'ITEMTPL_0',
		isTemplateLocked: false,
		combattechnique: 'CT_0',
		damageDiceNumber: '',
		damageDiceSides: null,
		damageFlat: '',
		damageBonus: '',
		at: '',
		pa: '',
		reach: '',
		length: '',
		stp: '',
		range1: '',
		range2: '',
		range3: '',
		reloadtime: '',
		ammunition: null,
		pro: '',
		enc: '',
		addpenalties: false
	};

	onEvent = (prop, e) => this.setState({ [prop]: e.target.value } as State);
	onSwitch = (prop: string) => this.setState({ [prop]: !this.state[prop] });
	onValue = (prop, value) => this.setState({ [prop]: value } as State);

	applyTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			let template = { ...InventoryStore.getTemplate(this.state.template), id: this.state.id, isTemplateLocked: false };
			template.range1 = template.range[0];
			template.range2 = template.range[1];
			template.range3 = template.range[2];
			delete template.range;
			this.setState(template);
		}
	};
	lockTemplate = () => {
		if (this.state.template !== 'ITEMTPL_0') {
			let template = { ...InventoryStore.getTemplate(this.state.template), id: this.state.id };
			template.range1 = template.range[0];
			template.range2 = template.range[1];
			template.range3 = template.range[2];
			delete template.range;
			this.setState(template);
		}
	};
	unlockTemplate = () => this.setState({ isTemplateLocked: false } as State);

	addItem = () => InventoryActions.addToList(this.state);
	saveItem = () => InventoryActions.saveItem(this.state);
	
	render() {

		const { create, node } = this.props;
		const { addpenalties, ammunition, number, at, combattechnique, damageBonus, damageDiceNumber, damageDiceSides, damageFlat, enc, gr, isTemplateLocked: locked, length, name, pa, price, pro, range1, range2, range3, reach, reloadtime, stp, template, weight, where } = this.state;

		const TEMPLATES = [['Keine Vorlage', 'ITEMTPL_0']].concat(InventoryStore.getAllTemplates().map(e => [e.name, e.id]).sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
		const AMMUNITION = [['Keine', null]].concat(InventoryStore.getAllTemplates().filter(e => e.gr === 3).map(e => [e.name, e.id]));

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
							value={number}
							onChange={this.onEvent.bind(null, 'number')}
							/>
						<TextField
							className="name"
							label="Name"
							value={name}
							onChange={this.onEvent.bind(null, 'name')}
							autoFocus={create}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="price"
							label="Preis in S"
							value={price}
							onChange={this.onEvent.bind(null, 'price')}
							disabled={locked}
							/>
						<TextField
							className="weight"
							label="Gewicht in St"
							value={weight}
							onChange={this.onEvent.bind(null, 'weight')}
							disabled={locked}
							/>
						<TextField
							className="where"
							label="Wo getragen"
							value={where}
							onChange={this.onEvent.bind(null, 'where')}
							/>
					</div>
					<div className="row">
						<Dropdown
							className="gr"
							label="Art"
							hint="Wähle den Typ des Gegenstands aus"
							value={gr}
							options={GROUPS_SELECTION as [string, number][]}
							onChange={this.onValue.bind(null, 'gr')}
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
							options={TEMPLATES as [string, string][]}
							onChange={this.onValue.bind(null, 'template')}
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
							value={combattechnique}
							options={CombatTechniquesStore.getAll().filter(e => e.gr === 1).map(e => [e.name, e.id]) as [string, string][]}
							onChange={this.onValue.bind(null, 'ct')}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="damage-bonus"
							label="Schadensb."
							value={damageBonus}
							onChange={this.onEvent.bind(null, 'db')}
							disabled={locked}
							/>
						<div className="container">
							<Label text="Schaden" disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.onEvent.bind(null, 'ddn')}
								disabled={locked}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint="W"
								value={damageDiceSides}
								options={[['W3',3],['W6',6],['W20',20]]}
								onChange={this.onValue.bind(null, 'dds')}
								disabled={locked}
								/>
							<TextField
								className="damage-flat"
								value={damageFlat}
								onChange={this.onEvent.bind(null, 'df')}
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
							options={[['Kurz',1],['Mittel',2],['Lang',3]]}
							onChange={this.onValue.bind(null, 're')}
							disabled={locked}
							/>
						<div className="container">
							<Label text="AT/PA-Mod" disabled={locked} />
							<TextField
								className="at"
								value={at}
								onChange={this.onEvent.bind(null, 'at')}
								disabled={locked}
								/>
							<TextField
								className="pa"
								value={pa}
								onChange={this.onEvent.bind(null, 'pa')}
								disabled={locked || combattechnique === 'CT_6'}
								/>
						</div>
						{ combattechnique === 'CT_10' ? (
							<TextField
								className="stp"
								label="Strukturp."
								value={stp}
								onChange={this.onEvent.bind(null, 'length')}
								disabled={locked}
								/>
						) : (
							<TextField
								className="length"
								label="Länge in Hf."
								value={length}
								onChange={this.onEvent.bind(null, 'length')}
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
							value={combattechnique}
							options={CombatTechniquesStore.getAll().filter(e => e.gr === 2).map(e => [e.name, e.id]) as [string, string][]}
							onChange={this.onValue.bind(null, 'ct')}
							disabled={locked}
							/>
					</div>
					<div className="row">
						<TextField
							className="reloadtime"
							label="Ladezeiten"
							value={reloadtime}
							onChange={this.onEvent.bind(null, 'rt')}
							disabled={locked}
							/>
						<div className="container">
							<Label text="Schaden" disabled={locked} />
							<TextField
								className="damage-dice-number"
								value={damageDiceNumber}
								onChange={this.onEvent.bind(null, 'ddn')}
								disabled={locked}
								/>
							<Dropdown
								className="damage-dice-sides"
								hint="W"
								value={damageDiceSides}
								options={[['W3',3],['W6',6],['W20',20]]}
								onChange={this.onValue.bind(null, 'dds')}
								disabled={locked}
								/>
							<TextField
								className="damage-flat"
								value={damageFlat}
								onChange={this.onEvent.bind(null, 'df')}
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
								onChange={this.onValue.bind(null, 'rb1')}
								disabled={locked}
								/>
							<TextField
								className="range2"
								label="Mittel"
								value={range2}
								onChange={this.onValue.bind(null, 'rb2')}
								disabled={locked}
								/>
							<TextField
								className="range3"
								label="Weit"
								value={range3}
								onChange={this.onValue.bind(null, 'rb3')}
								disabled={locked}
								/>
						</div>
						<Dropdown
							className="ammunition"
							label="Munition"
							hint="Keine"
							value={ammunition}
							options={AMMUNITION as [string, string][]}
							onChange={this.onValue.bind(null, 'ammunition')}
							disabled={locked}
							/>
						<TextField
							className="length"
							label="Länge in Hf."
							value={length}
							onChange={this.onEvent.bind(null, 'length')}
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
								onChange={this.onEvent.bind(null, 'pro')}
								disabled={locked}
								/>
							<TextField
								className="enc"
								label="BE"
								value={enc}
								onChange={this.onEvent.bind(null, 'enc')}
								disabled={locked}
								/>
						</div>
						<Checkbox
							className="addpenalties"
							label="Zusätzliche Abzüge"
							checked={addpenalties}
							onClick={this.onSwitch.bind(null, 'addpenalties')}
							disabled={locked}
							/>
					</div>
				</div> ) : null }
			</Dialog>
		);
	}
}
