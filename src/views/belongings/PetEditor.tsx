import * as React from 'react';
import { AvatarChange } from '../../components/AvatarChange';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { get } from '../../stores/ListStore';
import { AttributeInstance, InputTextEvent, PetEditorInstance } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { translate } from '../../utils/I18n';

export interface PetEditorProps {
	data?: PetEditorInstance;
	setAvatar(path: string): void;
	setName(event: InputTextEvent): void;
	setSize(event: InputTextEvent): void;
	setType(event: InputTextEvent): void;
	setSpentAp(event: InputTextEvent): void;
	setTotalAp(event: InputTextEvent): void;
	setCourage(event: InputTextEvent): void;
	setSagacity(event: InputTextEvent): void;
	setIntuition(event: InputTextEvent): void;
	setCharisma(event: InputTextEvent): void;
	setDexterity(event: InputTextEvent): void;
	setAgility(event: InputTextEvent): void;
	setConstitution(event: InputTextEvent): void;
	setStrength(event: InputTextEvent): void;
	setLp(event: InputTextEvent): void;
	setAe(event: InputTextEvent): void;
	setSpi(event: InputTextEvent): void;
	setTou(event: InputTextEvent): void;
	setPro(event: InputTextEvent): void;
	setIni(event: InputTextEvent): void;
	setMov(event: InputTextEvent): void;
	setAttack(event: InputTextEvent): void;
	setAt(event: InputTextEvent): void;
	setPa(event: InputTextEvent): void;
	setDp(event: InputTextEvent): void;
	setReach(event: InputTextEvent): void;
	setActions(event: InputTextEvent): void;
	setTalents(event: InputTextEvent): void;
	setSkills(event: InputTextEvent): void;
	setNotes(event: InputTextEvent): void;
	hideSlidein(): void;
	save(): void;
}

export class PetEditor extends React.Component<PetEditorProps, {}> {
	showAvatarChange = () => createOverlay(<AvatarChange setPath={this.props.setAvatar} />);
	saveEdit = () => {
		this.props.save();
		this.props.hideSlidein();
	}

	render() {
		const { data, hideSlidein, setActions, setAe, setAgility, setAt, setAttack, setCharisma, setConstitution, setCourage, setDexterity, setDp, setIni, setIntuition, setLp, setMov, setName, setPa, setPro, setReach, setSagacity, setSize, setSkills, setSpentAp, setSpi, setStrength, setTalents, setTotalAp, setTou, setType, setNotes } = this.props;

		return (
			<Slidein isOpen={!!data} close={hideSlidein}>
				{data && <div className="pet-edit">
					<div className="left">
						<AvatarWrapper src={data.avatar} onClick={this.showAvatarChange} />
					</div>
					<div className="right">
						<div className="row">
							<TextField label={translate('pet.name')} value={data.name} onChange={setName} />
							<TextField label={translate('pet.sizecategory')} value={data.size} onChange={setSize} />
							<TextField label={translate('pet.type')} value={data.type} onChange={setType} />
							<TextField label={translate('pet.apspent')} value={data.spentAp} onChange={setSpentAp} />
							<TextField label={translate('pet.totalap')} value={data.totalAp} onChange={setTotalAp} />
						</div>
						<div className="row">
							<TextField label={(get('COU') as AttributeInstance).short} value={data.cou} onChange={setCourage} />
							<TextField label={(get('SGC') as AttributeInstance).short} value={data.sgc} onChange={setSagacity} />
							<TextField label={(get('INT') as AttributeInstance).short} value={data.int} onChange={setIntuition} />
							<TextField label={(get('CHA') as AttributeInstance).short} value={data.cha} onChange={setCharisma} />
							<TextField label={(get('DEX') as AttributeInstance).short} value={data.dex} onChange={setDexterity} />
							<TextField label={(get('AGI') as AttributeInstance).short} value={data.agi} onChange={setAgility} />
							<TextField label={(get('CON') as AttributeInstance).short} value={data.con} onChange={setConstitution} />
							<TextField label={(get('STR') as AttributeInstance).short} value={data.str} onChange={setStrength} />
						</div>
						<div className="row">
							<TextField label={translate('pet.lp')} value={data.lp} onChange={setLp} />
							<TextField label={translate('pet.ae')} value={data.ae} onChange={setAe} />
							<TextField label={translate('pet.spi')} value={data.spi} onChange={setSpi} />
							<TextField label={translate('pet.tou')} value={data.tou} onChange={setTou} />
							<TextField label={translate('pet.pro')} value={data.pro} onChange={setPro} />
							<TextField label={translate('pet.ini')} value={data.ini} onChange={setIni} />
							<TextField label={translate('pet.mov')} value={data.mov} onChange={setMov} />
						</div>
						<div className="row">
							<TextField label={translate('pet.attack')} value={data.attack} onChange={setAttack} />
							<TextField label={translate('pet.at')} value={data.at} onChange={setAt} />
							<TextField label={translate('pet.pa')} value={data.pa} onChange={setPa} />
							<TextField label={translate('pet.dp')} value={data.dp} onChange={setDp} />
							<TextField label={translate('pet.reach')} value={data.reach} onChange={setReach} />
						</div>
						<div className="row">
							<TextField label={translate('pet.actions')} value={data.actions} onChange={setActions} />
							<TextField label={translate('pet.skills')} value={data.talents} onChange={setTalents} />
							<TextField label={translate('pet.specialabilities')} value={data.skills} onChange={setSkills} />
						</div>
						<div className="row">
							<TextField label={translate('pet.notes')} value={data.notes} onChange={setNotes} />
						</div>
						<BorderButton
							label={translate('actions.save')}
							onClick={this.saveEdit}
							/>
					</div>
				</div>}
			</Slidein>
		);
	}
}
