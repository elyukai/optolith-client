import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import { Dialog } from '../../components/Dialog';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { ArmorZonesEditorInstance, ArmorZonesInstance, InputTextEvent } from '../../types/data.d';
import { sort } from '../../utils/ListUtils';

export interface ArmorZonesEditorProps {
	create?: boolean;
	item?: ArmorZonesInstance;
	node?: HTMLDivElement;
}

export class ArmorZonesEditor extends React.Component<ArmorZonesEditorProps, ArmorZonesEditorInstance> {
	state = { name: '', ...this.props.item };

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
		EquipmentActions.addArmorZonesToList(this.state);
	}
	saveItem = () => {
		EquipmentActions.setArmorZones(this.state.id, this.state);
	}

	render() {
		const { create, node } = this.props;
		const { name, head, headLoss, leftArm, leftArmLoss, leftLeg, leftLegLoss, torso, torsoLoss, rightArm, rightArmLoss, rightLeg, rightLegLoss } = this.state;

		const templates = EquipmentStore.getAllTemplates().filter(e => e.gr === 4);
		const custom = EquipmentStore.getAll().filter(e => e.gr === 4 && !e.isTemplateLocked);

		const combinedArmorList = sort([...templates, ...custom]);
		const armorList = [{name: 'Keine'}, ...combinedArmorList];
		const tiers = [{name: '0'}, {id: 1, name: 'I'}, {id: 2, name: 'II'}, {id: 3, name: 'III'}, {id: 4, name: 'IV'}];

		return (
			<Dialog
				id="armor-zones-editor"
				title={'Zonenrüstung ' + (create ? 'erstellen' : 'bearbeiten')}
				node={node}
				buttons={[
					{
						autoWidth: true,
						disabled: name === '',
						label: 'Speichern',
						onClick: create ? this.addItem : this.saveItem,
					},
				]}>
				<div className="main">
					<div className="row">
						<TextField className="name" label="Name" value={name} onChange={this.changeName} autoFocus={create} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Kopf" value={head} options={armorList} onChange={this.changeHead} />
						<Dropdown className="loss" label="Verschleiß" value={headLoss} options={tiers} onChange={this.changeHeadLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Linker Arm" value={leftArm} options={armorList} onChange={this.changeLeftArm} />
						<Dropdown className="loss" label="Verschleiß" value={leftArmLoss} options={tiers} onChange={this.changeLeftArmLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Rechter Arm" value={rightArm} options={armorList} onChange={this.changeRightArm} />
						<Dropdown className="loss" label="Verschleiß" value={rightArmLoss} options={tiers} onChange={this.changeRightArmLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Torso" value={torso} options={armorList} onChange={this.changeTorso} />
						<Dropdown className="loss" label="Verschleiß" value={torsoLoss} options={tiers} onChange={this.changeTorsoLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Linkes Bein" value={leftLeg} options={armorList} onChange={this.changeLeftLeg} />
						<Dropdown className="loss" label="Verschleiß" value={leftLegLoss} options={tiers} onChange={this.changeLeftLegLoss} />
					</div>
					<div className="row">
						<Dropdown className="armor" label="Rechtes Bein" value={rightLeg} options={armorList} onChange={this.changeRightLeg} />
						<Dropdown className="loss" label="Verschleiß" value={rightLegLoss} options={tiers} onChange={this.changeRightLegLoss} />
					</div>
				</div>
			</Dialog>
		);
	}
}
