import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { ArmorZonesEditorInstance, ArmorZonesInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface ArmorZonesEditorProps {
	create?: boolean;
	item?: ArmorZonesInstance;
	node?: HTMLDivElement;
	locale: UIMessages;
	items: ItemInstance[];
	templates: ItemInstance[];
	addToList(data: ArmorZonesEditorInstance): void;
	set(id: string, data: ArmorZonesEditorInstance): void;
}

export class ArmorZonesEditor extends React.Component<ArmorZonesEditorProps, ArmorZonesEditorInstance> {
	state: ArmorZonesEditorInstance = { name: '', ...this.props.item };

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as ArmorZonesEditorInstance);
	changeHead = (id?: string) => this.setState({ head: id } as ArmorZonesEditorInstance);
	changeHeadLoss = (id?: number) => this.setState({ headLoss: id } as ArmorZonesEditorInstance);
	changeLeftArm = (id?: string) => this.setState({ leftArm: id } as ArmorZonesEditorInstance);
	changeLeftArmLoss = (id?: number) => this.setState({ leftArmLoss: id } as ArmorZonesEditorInstance);
	changeLeftLeg = (id?: string) => this.setState({ leftLeg: id } as ArmorZonesEditorInstance);
	changeLeftLegLoss = (id?: number) => this.setState({ leftLegLoss: id } as ArmorZonesEditorInstance);
	changeTorso = (id?: string) => this.setState({ torso: id } as ArmorZonesEditorInstance);
	changeTorsoLoss = (id?: number) => this.setState({ torsoLoss: id } as ArmorZonesEditorInstance);
	changeRightArm = (id?: string) => this.setState({ rightArm: id } as ArmorZonesEditorInstance);
	changeRightArmLoss = (id?: number) => this.setState({ rightArmLoss: id } as ArmorZonesEditorInstance);
	changeRightLeg = (id?: string) => this.setState({ rightLeg: id } as ArmorZonesEditorInstance);
	changeRightLegLoss = (id?: number) => this.setState({ rightLegLoss: id } as ArmorZonesEditorInstance);

	addItem = () => {
		this.props.addToList(this.state);
	}
	saveItem = () => {
		const { id } = this.state;
		if (typeof id === 'string') {
			this.props.set(id, this.state as ArmorZonesInstance);
		}
	}

	render() {
		const { create, node, items, locale, templates } = this.props;
		const { name, head, headLoss, leftArm, leftArmLoss, leftLeg, leftLegLoss, torso, torsoLoss, rightArm, rightArmLoss, rightLeg, rightLegLoss } = this.state;

		const combinedArmorList = sortObjects([
			...templates.filter(e => e.gr === 4),
			...items.filter(e => e.gr === 4 && !e.isTemplateLocked)
		], locale.id);
		const armorList = [{name: _translate(locale, 'options.none')}, ...combinedArmorList];
		const tiers = [{name: '0'}, {id: 1, name: 'I'}, {id: 2, name: 'II'}, {id: 3, name: 'III'}, {id: 4, name: 'IV'}];

		return (
			<Dialog
				id="armor-zones-editor"
				title={create ? _translate(locale, 'zonearmoreditor.titlecreate') : _translate(locale, 'zonearmoreditor.titleedit')}
				node={node}
				buttons={[
					{
						autoWidth: true,
						disabled: name === '',
						label: _translate(locale, 'actions.save'),
						onClick: create ? this.addItem : this.saveItem,
					},
				]}>
				<div className="main">
					<div className="row">
						<TextField className="name" label={_translate(locale, 'zonearmoreditor.options.name')} value={name} onChange={this.changeName} autoFocus={create} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.head')} value={head} options={armorList} onChange={this.changeHead} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={headLoss} options={tiers} onChange={this.changeHeadLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.torso')} value={torso} options={armorList} onChange={this.changeTorso} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={torsoLoss} options={tiers} onChange={this.changeTorsoLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.leftarm')} value={leftArm} options={armorList} onChange={this.changeLeftArm} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={leftArmLoss} options={tiers} onChange={this.changeLeftArmLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.rightarm')} value={rightArm} options={armorList} onChange={this.changeRightArm} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={rightArmLoss} options={tiers} onChange={this.changeRightArmLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.leftleg')} value={leftLeg} options={armorList} onChange={this.changeLeftLeg} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={leftLegLoss} options={tiers} onChange={this.changeLeftLegLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label={_translate(locale, 'zonearmoreditor.options.rightleg')} value={rightLeg} options={armorList} onChange={this.changeRightLeg} />
						<Dropdown className="loss" label={_translate(locale, 'zonearmoreditor.options.loss')} value={rightLegLoss} options={tiers} onChange={this.changeRightLegLoss} />
					</div>
				</div>
			</Dialog>
		);
	}
}
