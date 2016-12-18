import Checkbox from '../../components/Checkbox';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import Label from '../../components/Label';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

export default class ItemEditor extends Component {

	static propTypes = { 
		create: PropTypes.bool,
		item: PropTypes.object,
		node: PropTypes.any
	};

	state = {
		name: '',
		price: '',
		weight: '',
		amount: '1',
		where: '',
		gr: 5,
		tpl: 'ITEMTPL_0',

		ct: 'CT_0', // Combat Technique
		dpdn: '', // Number of dices
		dpds: null, // Amount of sides per dice
		dpf: '', // Flat damage
		dpb: '', // Damage bonus with primary attribute
		at: '', // AT mod
		pa: '', // PA mod
		re: 0,
		length: '',
		stp: '',
		rb1: '', // Range brackets
		rb2: '', // Range brackets
		rb3: '', // Range brackets
		rt: '', // Reload time
		am: null, // Ammunition type
		pro: '', // Protection
		enc: '',
		addp: false // Add. penalties
	};

	onEvent = (prop, e) => this.setState({ [prop]: e.target.value });
	onSwitch = prop => this.setState({ [prop]: !this.state[prop] });
	onValue = (prop, value) => this.setState({ [prop]: value });
	
	render() {

		const { create, node } = this.props;
		const { addp, am, amount, at, ct, dpb, dpdn, dpds, dpf, enc, gr, length, name, pa, price, pro, rb1, rb2, rb3, re, rt, stp, tpl, weight, where } = this.state;

		return (
			<Dialog
				id="item-editor"
				title={'Gegenstand ' + (create ? 'erstellen' : 'bearbeiten')}
				node={node}
				buttons={[
					{
						label: 'Speichern',
						onClick: null
					}
				]}>
				<div className="main">
					<TextField
						className="name"
						label="Name"
						value={name}
						onChange={this.onEvent.bind(null, 'name')}
						/>
					<div className="container">
						<TextField
							className="price"
							label="Preis in S"
							value={price}
							onChange={this.onEvent.bind(null, 'price')}
							/>
						<TextField
							className="weight"
							label="Gewicht in St"
							value={weight}
							onChange={this.onEvent.bind(null, 'weight')}
							/>
						<TextField
							className="amount"
							label="Menge"
							value={amount}
							onChange={this.onEvent.bind(null, 'amount')}
							/>
						<TextField
							className="where"
							label="Wo getragen"
							value={where}
							onChange={this.onEvent.bind(null, 'where')}
							/>
					</div>
					<Dropdown
						className="gr"
						label="Art"
						value={gr}
						options={[
							['Allgemein',5],
							['Nahkampfwaffe',1],
							['Fernkampfwaffe',2],
							['Rüstung',3],
							['Munition',4]
						]}
						onChange={this.onValue.bind(null, 'gr')}
						/>
					<Dropdown
						className="tpl"
						label="Vorlage"
						hint="Keine"
						value={tpl}
						options={[]}
						onChange={this.onValue.bind(null, 'tpl')}
						/>
				</div>
				{
					gr === 1 ? (
						<div className="melee">
							<Dropdown
								className="ct"
								label="Kampftechnik"
								hint="Keine"
								value={ct}
								options={CombatTechniquesStore.getAll().filter(e => e.gr === 1).map(e => [e.name, e.id])}
								onChange={this.onValue.bind(null, 'ct')}
								/>
							<TextField
								className="dpb"
								label="Schadensb."
								value={dpb}
								onChange={this.onEvent.bind(null, 'dpb')}
								/>
							<div className="container">
								<Label text="Schaden" />
								<TextField
									className="dpdn"
									value={dpdn}
									onChange={this.onEvent.bind(null, 'dpdn')}
									/>
								<Dropdown
									className="dpds"
									hint="W"
									value={dpds}
									options={[['W3',3],['W6',6],['W20',20]]}
									onChange={this.onValue.bind(null, 'dpds')}
									/>
								<TextField
									className="dpf"
									value={dpf}
									onChange={this.onEvent.bind(null, 'dpf')}
									/>
							</div>
							<div className="container">
								<Label text="AT/PA-Mod" />
								<TextField
									className="at"
									value={at}
									onChange={this.onEvent.bind(null, 'at')}
									/>
								<TextField
									className="pa"
									value={pa}
									onChange={this.onEvent.bind(null, 'pa')}
									/>
							</div>
							<Dropdown
								className="re"
								label="Reichweite"
								hint="Auswählen"
								value={re}
								options={[['Kurz',1],['Mittel',2],['Lang',3]]}
								onChange={this.onValue.bind(null, 're')}
								/>
							{
								ct === 'CT_10' ? (
									<TextField
										className="stp"
										label="Strukturp."
										value={stp}
										onChange={this.onEvent.bind(null, 'length')}
										/>
								) : (
									<TextField
										className="length"
										label="Länge in Hf."
										value={length}
										onChange={this.onEvent.bind(null, 'length')}
										/>
								)
							}
						</div>
					) : null
				}
				{
					gr === 2 ? (
						<div className="ranged">
							<Dropdown
								className="ct"
								label="Kampftechnik"
								hint="Keine"
								value={ct}
								options={CombatTechniquesStore.getAll().filter(e => e.gr === 2).map(e => [e.name, e.id])}
								onChange={this.onValue.bind(null, 'ct')}
								/>
							<TextField
								className="rt"
								label="Ladezeiten"
								value={rt}
								onChange={this.onEvent.bind(null, 'rt')}
								/>
							<div className="container">
								<Label text="Schaden" />
								<TextField
									className="dpdn"
									value={dpdn}
									onChange={this.onEvent.bind(null, 'dpdn')}
									/>
								<Dropdown
									className="dpds"
									value={dpds}
									options={[['W3',3],['W6',6],['W20',20]]}
									onChange={this.onValue.bind(null, 'dpds')}
									/>
								<TextField
									className="dpf"
									value={dpf}
									onChange={this.onEvent.bind(null, 'dpf')}
									/>
							</div>
							<div className="container">
								<TextField
									className="rb1"
									label="Nah"
									value={rb1}
									onChange={this.onValue.bind(null, 'rb1')}
									/>
								<TextField
									className="rb2"
									label="Mittel"
									value={rb2}
									onChange={this.onValue.bind(null, 'rb2')}
									/>
								<TextField
									className="rb3"
									label="Weit"
									value={rb3}
									onChange={this.onValue.bind(null, 'rb3')}
									/>
							</div>
							<Dropdown
								className="am"
								label="Munition"
								hint="Keine"
								value={am}
								options={[
									['Keine',null]
								]}
								onChange={this.onValue.bind(null, 'am')}
								/>
							<TextField
								className="length"
								label="Länge in Hf."
								value={length}
								onChange={this.onEvent.bind(null, 'length')}
								/>
						</div>
					) : null
				}
				{
					gr === 3 ? (
						<div className="armor">
							<div className="container">
								<TextField
									className="pro"
									label="RS"
									value={pro}
									onChange={this.onEvent.bind(null, 'pro')}
									/>
								<TextField
									className="enc"
									label="BE"
									value={enc}
									onChange={this.onEvent.bind(null, 'enc')}
									/>
							</div>
							<Checkbox
								className="addp"
								label="Zusätzliche Abzüge"
								checked={addp}
								onClick={this.onSwitch.bind(null, 'addp')}
								/>
						</div>
					) : null
				}
			</Dialog>
		);
	}
}
