import * as React from 'react';
import * as PetActions from '../../actions/PetActions';
import { BorderButton } from '../../components/BorderButton';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { PetsStore } from '../../stores/PetsStore';
import { InputTextEvent, PetEditorInstance, PetInstance } from '../../types/data.d';
import { convertToEdit, convertToSave, getNewInstance } from '../../utils/PetUtils';
import { PetEditor } from './PetEditor';
import { PetsListItem } from './PetsListItem';

export interface PetsState {
	editorInstance?: PetEditorInstance;
	pets: PetInstance[];
}

export class Pets extends React.Component<undefined, PetsState> {
	state: PetsState = {
		pets: PetsStore.getAll()
	};

	componentDidMount() {
		PetsStore.addChangeListener(this.updatePetsStore);
	}

	componentWillUnmount() {
		PetsStore.removeChangeListener(this.updatePetsStore);
	}

	setEditorField = (data: PetEditorInstance) => {
		this.setState({ editorInstance: { ...this.state.editorInstance, ...data }} as PetsState);
	}

	setAvatar = (path: string) => this.setEditorField({ avatar: path } as PetEditorInstance);
	setName = (event: InputTextEvent) => this.setEditorField({ name: event.target.value } as PetEditorInstance);
	setSize = (event: InputTextEvent) => this.setEditorField({ size: event.target.value } as PetEditorInstance);
	setType = (event: InputTextEvent) => this.setEditorField({ type: event.target.value } as PetEditorInstance);
	setSpentAp = (event: InputTextEvent) => this.setEditorField({ spentAp: event.target.value } as PetEditorInstance);
	setTotalAp = (event: InputTextEvent) => this.setEditorField({ totalAp: event.target.value } as PetEditorInstance);
	setCourage = (event: InputTextEvent) => this.setEditorField({ cou: event.target.value } as PetEditorInstance);
	setSagacity = (event: InputTextEvent) => this.setEditorField({ sgc: event.target.value } as PetEditorInstance);
	setIntuition = (event: InputTextEvent) => this.setEditorField({ int: event.target.value } as PetEditorInstance);
	setCharism = (event: InputTextEvent) => this.setEditorField({ cha: event.target.value } as PetEditorInstance);
	setDexterity = (event: InputTextEvent) => this.setEditorField({ dex: event.target.value } as PetEditorInstance);
	setAgility = (event: InputTextEvent) => this.setEditorField({ agi: event.target.value } as PetEditorInstance);
	setConstitution = (event: InputTextEvent) => this.setEditorField({ con: event.target.value } as PetEditorInstance);
	setStrength = (event: InputTextEvent) => this.setEditorField({ str: event.target.value } as PetEditorInstance);
	setLp = (event: InputTextEvent) => this.setEditorField({ lp: event.target.value } as PetEditorInstance);
	setAe = (event: InputTextEvent) => this.setEditorField({ ae: event.target.value } as PetEditorInstance);
	setSpi = (event: InputTextEvent) => this.setEditorField({ spi: event.target.value } as PetEditorInstance);
	setTou = (event: InputTextEvent) => this.setEditorField({ tou: event.target.value } as PetEditorInstance);
	setPro = (event: InputTextEvent) => this.setEditorField({ pro: event.target.value } as PetEditorInstance);
	setIni = (event: InputTextEvent) => this.setEditorField({ ini: event.target.value } as PetEditorInstance);
	setMov = (event: InputTextEvent) => this.setEditorField({ mov: event.target.value } as PetEditorInstance);
	setAttack = (event: InputTextEvent) => this.setEditorField({ attack: event.target.value } as PetEditorInstance);
	setAt = (event: InputTextEvent) => this.setEditorField({ at: event.target.value } as PetEditorInstance);
	setPa = (event: InputTextEvent) => this.setEditorField({ pa: event.target.value } as PetEditorInstance);
	setDp = (event: InputTextEvent) => this.setEditorField({ dp: event.target.value } as PetEditorInstance);
	setReach = (id: number) => this.setEditorField({ reach: id } as PetEditorInstance);
	setActions = (event: InputTextEvent) => this.setEditorField({ actions: event.target.value } as PetEditorInstance);
	setTalents = (event: InputTextEvent) => this.setEditorField({ talents: event.target.value } as PetEditorInstance);
	setSkills = (event: InputTextEvent) => this.setEditorField({ skills: event.target.value } as PetEditorInstance);
	setNotes = (event: InputTextEvent) => this.setEditorField({ notes: event.target.value } as PetEditorInstance);

	addPet = () => this.setState({ editorInstance: getNewInstance() } as PetsState);
	editPet = (id: string) => this.setState({ editorInstance: convertToEdit(PetsStore.get(id)) } as PetsState);
	savePet = () => {
		const instance = this.state.editorInstance;
		if (instance) {
			if (typeof instance.id !== 'string') {
				PetActions.addToList(convertToSave(instance));
			}
			else {
				PetActions.set(instance.id, convertToSave(instance));
			}
		}
	}
	deletePet = (id: string) => {
			PetActions.removeFromList(id);
	}
	hideAddSlidein = () => this.setState({ editorInstance: undefined } as PetsState);

	render() {
		const { pets, editorInstance } = this.state;

		return (
			<Page id="pets">
				<PetEditor
					data={editorInstance}
					hideSlidein={this.hideAddSlidein}
					setAvatar={this.setAvatar}
					setName={this.setName}
					setSize={this.setSize}
					setType={this.setType}
					setSpentAp={this.setSpentAp}
					setTotalAp={this.setTotalAp}
					setCourage={this.setCourage}
					setSagacity={this.setSagacity}
					setIntuition={this.setIntuition}
					setCharism={this.setCharism}
					setDexterity={this.setDexterity}
					setAgility={this.setAgility}
					setConstitution={this.setConstitution}
					setStrength={this.setStrength}
					setLp={this.setLp}
					setAe={this.setAe}
					setSpi={this.setSpi}
					setTou={this.setTou}
					setPro={this.setPro}
					setIni={this.setIni}
					setMov={this.setMov}
					setAttack={this.setAttack}
					setAt={this.setAt}
					setPa={this.setPa}
					setDp={this.setDp}
					setReach={this.setReach}
					setActions={this.setActions}
					setTalents={this.setTalents}
					setSkills={this.setSkills}
					setNotes={this.setNotes}
					save={this.savePet}
					/>
				<Options>
					{pets.length === 0 && <BorderButton
						label="Hinzufügen"
						onClick={this.addPet}
						/>}
				</Options>
				<Scroll>
					<List>
						{pets.map(e => (
							<PetsListItem
								{...e}
								key={e.id}
								editPet={this.editPet}
								deletePet={this.deletePet}
								/>
						))}
					</List>
				</Scroll>
			</Page>
		);
	}

	private updatePetsStore = () => {
		this.setState({
			pets: PetsStore.getAll(),
		} as PetsState);
	}
}
