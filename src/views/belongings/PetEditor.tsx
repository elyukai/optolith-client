import * as React from 'react';
import { AvatarChange } from '../../components/AvatarChange';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { InputTextEvent, PetEditorInstance } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';

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
	setCharism(event: InputTextEvent): void;
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
	setReach(id: number): void;
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
		const { data, hideSlidein, setActions, setAe, setAgility, setAt, setAttack, setCharism, setConstitution, setCourage, setDexterity, setDp, setIni, setIntuition, setLp, setMov, setName, setPa, setPro, setReach, setSagacity, setSize, setSkills, setSpentAp, setSpi, setStrength, setTalents, setTotalAp, setTou, setType, setNotes } = this.props;

		return (
			<Slidein isOpen={!!data} close={hideSlidein}>
				{data && <div className="pet-edit">
					<div className="left">
						<AvatarWrapper src={data.avatar} onClick={this.showAvatarChange} />
					</div>
					<div className="right">
						<div className="row">
							<TextField label="Name" value={data.name} onChange={setName} />
							<TextField label="Größe" value={data.size} onChange={setSize} />
							<TextField label="Typ" value={data.type} onChange={setType} />
							<TextField label="Ausg. AP" value={data.spentAp} onChange={setSpentAp} />
							<TextField label="Gesamt-AP" value={data.totalAp} onChange={setTotalAp} />
						</div>
						<div className="row">
							<TextField label="MU" value={data.cou} onChange={setCourage} />
							<TextField label="KL" value={data.sgc} onChange={setSagacity} />
							<TextField label="IN" value={data.int} onChange={setIntuition} />
							<TextField label="CH" value={data.cha} onChange={setCharism} />
							<TextField label="FF" value={data.dex} onChange={setDexterity} />
							<TextField label="GE" value={data.agi} onChange={setAgility} />
							<TextField label="KO" value={data.con} onChange={setConstitution} />
							<TextField label="KK" value={data.str} onChange={setStrength} />
						</div>
						<div className="row">
							<TextField label="LeP" value={data.lp} onChange={setLp} />
							<TextField label="AsP" value={data.ae} onChange={setAe} />
							<TextField label="SK" value={data.spi} onChange={setSpi} />
							<TextField label="ZK" value={data.tou} onChange={setTou} />
							<TextField label="RS" value={data.pro} onChange={setPro} />
							<TextField label="INI" value={data.ini} onChange={setIni} />
							<TextField label="GS" value={data.mov} onChange={setMov} />
						</div>
						<div className="row">
							<TextField label="Angriff" value={data.attack} onChange={setAttack} />
							<TextField label="AT" value={data.at} onChange={setAt} />
							<TextField label="PA" value={data.pa} onChange={setPa} />
							<TextField label="TP" value={data.dp} onChange={setDp} />
							<Dropdown label="RW" options={[{id: 1, name: 'Kurz'}, {id: 2, name: 'Mittel'}, {id: 3, name: 'Lang'}]} value={data.reach} onChange={setReach} />
						</div>
						<div className="row">
							<TextField label="Aktionen" value={data.actions} onChange={setActions} />
							<TextField label="Talente" value={data.talents} onChange={setTalents} />
							<TextField label="Fertigkeiten" value={data.skills} onChange={setSkills} />
						</div>
						<div className="row">
							<TextField label="Notizen" value={data.notes} onChange={setNotes} />
						</div>
						<BorderButton
							label="Speichern"
							onClick={this.saveEdit}
							/>
					</div>
				</div>}
			</Slidein>
		);
	}
}
