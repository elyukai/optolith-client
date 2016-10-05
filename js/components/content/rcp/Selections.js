import AttributeStore from '../../../stores/AttributeStore';
import BorderButton from '../../layout/BorderButton';
import Checkbox from '../../layout/Checkbox';
import CultureStore from '../../../stores/rcp/CultureStore';
import Dropdown from '../../layout/Dropdown';
import ListStore from '../../../stores/ListStore';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import ProfessionActions from '../../../actions/ProfessionActions';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import Scroll from '../../layout/Scroll';
import SelectionsCantrips from './SelectionsCantrips';
import SelectionsCt from './SelectionsCt';
import SelectionsCurses from './SelectionsCurses';
import SelectionsLangLitc from './SelectionsLangLitc';
import SelectionsTalentSpec from './SelectionsTalentSpec';
import Slidein from '../../layout/Slidein';
import SpecialAbilitiesStore from '../../../stores/SpecialAbilitiesStore';
import TalentsStore from '../../../stores/TalentsStore';
import TextField from '../../layout/TextField';
import classNames from 'classnames';

class Selections extends Component {

	static propTypes = {
		close: PropTypes.func,
		isOpen: PropTypes.bool
	};

	state = {
		attrSel: 'ATTR_0',
		useCulturePackage: true,
		lang: 0,
		buyLiteracy: false,
		litc: 0,
		cantrips: new Set(),
		combattech: new Set(),
		curses: new Map(),
		langLitc: new Map(),
		spec: [null, '']
	};

	constructor(props) {
		super(props);
	}

	changeAttrSel = option => this.setState({ attrSel: option });
	changeCulturePackage = () => this.setState({ useCulturePackage: !this.state.useCulturePackage });
	changeLang = option => this.setState({ lang: option });
	changeLiteracy = () => this.setState({ buyLiteracy: !this.state.buyLiteracy });
	changeLitc = option => this.setState({ litc: option });

	changeCantrip = id => {
		var cantrips = this.state.cantrips;
		if (!cantrips.delete(id))
			cantrips.add(id);
		this.setState({ cantrips });
	};
	changeCombattech = id => {
		var combattech = this.state.combattech;
		if (!combattech.delete(id))
			combattech.add(id);
		this.setState({ combattech });
	};
	changeCurse = (id, option) => {
		var curses = this.state.curses;
		switch (option) {
			case 'add':
				curses.set(id, curses.get(id) + 1);
				break;
			case 'remove':
				curses.set(id, curses.get(id) - 1);
				break;
			default:
				if (!curses.delete(id))
					curses.set(id, 0);
		}
		this.setState({ curses });
	};
	changeLangLitc = (id, ap) => {
		var langLitc = this.state.langLitc;
		if (langLitc.has(id)) {
			if (langLitc.get(id) !== ap)
				langLitc.set(id, ap);
			else
				langLitc.delete(id);
		} else
			langLitc.set(id, ap);
		this.setState({ langLitc });
	};
	changeSpec = (i, value) => {
		var spec = this.state.spec;
		switch (i) {
			case 0:
				spec[i] = value;
				break;
			case 1:
				spec[i] = value.target.value;
				break;
		}
		this.setState({ spec });
	};

	assignRCPEntries = selMap => {
		ProfessionActions.assignRCPEntries(Object.assign({}, this.state, {
			map: selMap,
			spec: this.state.spec[1] !== '' ? this.state.spec[1] : this.state.spec[0]
		}));
	};

	render() {

		const { close } = this.props;
		const { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = this.state;

		const selectLang = CultureStore.getCurrent().lang.length > 1;
		const selectLitc = CultureStore.getCurrent().literacy.length > 1;

		const professionSel = new Map();

		ProfessionStore.getCurrent().sel.forEach(e => {
			let [ id, ...other ] = e;
			professionSel.set(id, other);
		});

		if (ProfessionVariantStore.getCurrentID() !== null) {
			ProfessionVariantStore.getCurrent().sel.forEach(e => {
				let [ id, ...other ] = e;
				if (other.length === 1 && other[0] === false)
					professionSel.delete(id);
				else
					professionSel.set(id, other);
			});
		}

		var langLitcElement = null;
		var langLitcApLeft = 0;
		
		if (professionSel.has('lang_lit')) {
			let active = langLitc;
			let params = professionSel.get('lang_lit');
			let apTotal = params[0];

			let SA_28 = SpecialAbilitiesStore.get('SA_28');
			let SA_30 = SpecialAbilitiesStore.get('SA_30');

			let list = [];

			SA_28.sel.forEach(e => {
				let sid = e[1];
				let ap = SA_28.sel[sid - 1][2];
				let name = SA_28.sel[sid - 1][0];
				let disabled = buyLiteracy && ((!selectLitc && sid === CultureStore.getCurrent().literacy[0]) || (selectLitc && sid === litc));
				list.push({ id: `LITC_${sid}`, name, ap, disabled });
			});

			SA_30.sel.forEach(e => {
				let sid = e[1];
				let name = SA_30.sel[sid - 1][0];
				let disabled = (!selectLang && sid === CultureStore.getCurrent().lang[0]) || (selectLang && sid === lang);
				list.push({ id: `LANG_${sid}`, name, disabled });
			});

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			langLitcApLeft = apTotal - Array.from(active.values()).reduce((a,b) => a + b, 0);

			langLitcElement = <SelectionsLangLitc list={list} active={active} apTotal={apTotal} apLeft={langLitcApLeft} change={this.changeLangLitc} />;
		}

		var cursesElement = null;
		var cursesApLeft = 0;

		if (professionSel.has('curses')) {
			let active = curses;
			let params = professionSel.get('curses');
			let apTotal = params[0];

			let list = ListStore.getAllByCategoryGroup('spells', 3);

			list.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

			cursesApLeft = apTotal - (active.size + Array.from(active.values()).reduce((a,b) => a + b, 0)) * 2;

			cursesElement = <SelectionsCurses list={list} active={active} apTotal={apTotal} apLeft={cursesApLeft} change={this.changeCurse} />;
		}

		var ctElement = null;

		if (professionSel.has('ct')) {
			let active = combattech;
			let params = professionSel.get('ct');
			let num = params[0];
			let amount = params[1];
			let options = new Set(params[2]);

			let list = ListStore.getAllByCategory('combattech').filter(e => options.has(e.id));

			ctElement = <SelectionsCt list={list} active={active} num={num} amount={amount} change={this.changeCombattech} />;
		}

		var cantripsElement = null;

		if (professionSel.has('cantrips')) {
			let active = cantrips;
			let params = professionSel.get('cantrips');
			let num = params[0];
			let options = new Set(params[1].map(e => 'SPELL_' + e));

			let list = ListStore.getAllByCategory('spells').filter(e => options.has(e.id));

			cantripsElement = <SelectionsCantrips list={list} active={active} num={num} change={this.changeCantrip} />;
		}

		var specElement = null;

		if (professionSel.has('spec')) {
			let active = spec;
			let params = professionSel.get('spec');
			let id = params[0];

			let talent = ListStore.get(id);
			let name = talent.name;
			let list = talent.spec || [];
			list = list.map((e, i) => [e, i]);
			let input = talent.spec_input;

			specElement = <SelectionsTalentSpec list={list} active={active} name={name} input={input} change={this.changeSpec} />;
		}

		return (
			<Slidein isOpen close={close}>
				<Scroll>
					<h3>Spezies</h3>
					<Dropdown
						hint="Eigenschaftsmodifikation auswählen"
						value={attrSel}
						onChange={this.changeAttrSel}
						options={RaceStore.getCurrent().attr_sel[1].map(e => {
							let attr = AttributeStore.get(e);
							let value = RaceStore.getCurrent().attr_sel[0];
							return [`${attr.name} ${value > 0 ? '+' : ''}${value}`, e];
						})} />
					<h3>Kultur</h3>
					<Checkbox checked={useCulturePackage} onClick={this.changeCulturePackage}>
						Kulturpaket kaufen ({CultureStore.getCurrent().ap} AP)
					</Checkbox>
					{
						selectLang ? (
							<Dropdown
								hint="Muttersprache auswählen"
								value={lang}
								onChange={this.changeLang}
								options={CultureStore.getCurrent().lang.map(e => {
									let lang = SpecialAbilitiesStore.get('SA_30').sel[e - 1];
									return [lang[0], e];
								})}
								disabled={langLitc.size > 0} />
						) : null
					}
					<Checkbox checked={buyLiteracy} onClick={this.changeLiteracy} disabled={langLitc.size > 0}>
						Schrift kaufen{
							!selectLitc ? ` (${SpecialAbilitiesStore.get('SA_28').sel[CultureStore.getCurrent().literacy[0] - 1][0]}, ${SpecialAbilitiesStore.get('SA_28').sel[CultureStore.getCurrent().literacy[0] - 1][2]} AP)` : ''
						}
					</Checkbox>
					{
						selectLitc ? (
							<Dropdown
								hint="Schrift auswählen"
								value={litc}
								onChange={this.changeLitc}
								options={CultureStore.getCurrent().literacy.map(e => {
									let lit = SpecialAbilitiesStore.get('SA_28').sel[e - 1];
									return [`${lit[0]} (${lit[2]} AP)`, e];
								})}
								disabled={!buyLiteracy || langLitc.size > 0} />
						) : null
					}
					<h3>Profession</h3>
					{specElement}
					{langLitcElement}
					{ctElement}
					{cursesElement}
					{cantripsElement}
					<BorderButton
						label="Fertigstellen"
						primary
						disabled={
							attrSel === 'ATTR_0' ||
							(selectLang && lang === 0) ||
							(buyLiteracy && selectLitc && litc === 0) ||
							(professionSel.has('spec') && (spec[1] === '' && spec[0] === null)) ||
							(professionSel.has('lang_lit') && langLitcApLeft !== 0) ||
							(professionSel.has('curses') && cursesApLeft !== 0) ||
							(professionSel.has('ct') && combattech.size !== professionSel.get('ct')[0]) ||
							(professionSel.has('cantrips') && cantrips.size !== professionSel.get('cantrips')[0])
						}
						onClick={this.assignRCPEntries.bind(null, professionSel)}
						/>
				</Scroll>
			</Slidein>
		);
	}
}

export default Selections;
