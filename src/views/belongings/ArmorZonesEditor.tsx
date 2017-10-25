import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { ArmorZonesEditorInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface ArmorZonesEditorProps {
	armorZonesEditor: ArmorZonesEditorInstance;
	create?: boolean;
	isOpened: boolean;
	locale: UIMessages;
	items: ItemInstance[];
	templates: ItemInstance[];
	addToList(): void;
	closeEditor(): void;
	saveItem(): void;
	setName(value: string): void;
	setHead(id: string | undefined): void;
	setHeadLoss(id: number | undefined): void;
	setLeftArm(id: string | undefined): void;
	setLeftArmLoss(id: number | undefined): void;
	setLeftLeg(id: string | undefined): void;
	setLeftLegLoss(id: number | undefined): void;
	setTorso(id: string | undefined): void;
	setTorsoLoss(id: number | undefined): void;
	setRightArm(id: string | undefined): void;
	setRightArmLoss(id: number | undefined): void;
	setRightLeg(id: string | undefined): void;
	setRightLegLoss(id: number | undefined): void;
}

export class ArmorZonesEditor extends React.Component<ArmorZonesEditorProps> {
	changeName = (event: InputTextEvent) => this.props.setName(event.target.value);
	changeHead = (id?: string) => this.props.setHead(id);
	changeHeadLoss = (id?: number) => this.props.setHeadLoss(id);
	changeLeftArm = (id?: string) => this.props.setLeftArm(id);
	changeLeftArmLoss = (id?: number) => this.props.setLeftArmLoss(id);
	changeLeftLeg = (id?: string) => this.props.setLeftLeg(id);
	changeLeftLegLoss = (id?: number) => this.props.setLeftLegLoss(id);
	changeTorso = (id?: string) => this.props.setTorso(id);
	changeTorsoLoss = (id?: number) => this.props.setTorsoLoss(id);
	changeRightArm = (id?: string) => this.props.setRightArm(id);
	changeRightArmLoss = (id?: number) => this.props.setRightArmLoss(id);
	changeRightLeg = (id?: string) => this.props.setRightLeg(id);
	changeRightLegLoss = (id?: number) => this.props.setRightLegLoss(id);

	render() {
		const { armorZonesEditor, closeEditor, create, isOpened, items, locale, templates } = this.props;
		const { name, head, headLoss, leftArm, leftArmLoss, leftLeg, leftLegLoss, torso, torsoLoss, rightArm, rightArmLoss, rightLeg, rightLegLoss } = armorZonesEditor;

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
				isOpened={isOpened}
				close={closeEditor}
				buttons={[
					{
						autoWidth: true,
						disabled: name === '',
						label: _translate(locale, 'actions.save'),
						onClick: create ? this.props.addToList : this.props.saveItem,
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
