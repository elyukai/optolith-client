import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as PetActions from '../actions/PetActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/appReducer';
import { getIsEditPetAvatarOpen, getIsInPetCreation, getPetEditorInstance, getPets } from '../selectors/stateSelectors';
import { Pets, PetsDispatchProps, PetsOwnProps, PetsStateProps } from '../views/pets/Pets';

const mapStateToProps = (state: AppState): PetsStateProps => ({
  pets: getPets (state),
  isEditPetAvatarOpen: getIsEditPetAvatarOpen (state),
  petInEditor: getPetEditorInstance (state),
  isInCreation: getIsInPetCreation (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): PetsDispatchProps => ({
  addPet (): void {
    dispatch (PetActions.addPet);
  },
  createPet (): void {
    dispatch (PetActions.createPet ());
  },
  editPet (id: string): void {
    dispatch (PetActions.editPet (id));
  },
  closePetEditor () {
    dispatch (PetActions.closePetEditor ());
  },
  deletePet (id: string) {
    dispatch (PetActions.removePet (id));
  },
  savePet () {
    dispatch (PetActions.savePet ());
  },
  setAvatar (path: string) {
    dispatch (PetActions.setPetAvatar (path))
  },
  setName (name: string) {
    dispatch (PetActions.setPetName (name))
  },
  setSize (size: string) {
    dispatch (PetActions.setPetSize (size))
  },
  setType (type: string) {
    dispatch (PetActions.setPetType (type))
  },
  setSpentAp (spentAp: string) {
    dispatch (PetActions.setPetSpentAp (spentAp))
  },
  setTotalAp (totalAp: string) {
    dispatch (PetActions.setPetTotalAp (totalAp))
  },
  setCourage (courage: string) {
    dispatch (PetActions.setPetCourage (courage))
  },
  setSagacity (sagacity: string) {
    dispatch (PetActions.setPetSagacity (sagacity))
  },
  setIntuition (intuition: string) {
    dispatch (PetActions.setPetIntuition (intuition))
  },
  setCharisma (charisma: string) {
    dispatch (PetActions.setPetCharisma (charisma))
  },
  setDexterity (dexterity: string) {
    dispatch (PetActions.setPetDexterity (dexterity))
  },
  setAgility (agility: string) {
    dispatch (PetActions.setPetAgility (agility))
  },
  setConstitution (constitution: string) {
    dispatch (PetActions.setPetConstitution (constitution))
  },
  setStrength (strength: string) {
    dispatch (PetActions.setPetStrength (strength))
  },
  setLp (lp: string) {
    dispatch (PetActions.setPetLp (lp))
  },
  setAe (ae: string) {
    dispatch (PetActions.setPetAe (ae))
  },
  setSpi (spi: string) {
    dispatch (PetActions.setPetSpi (spi))
  },
  setTou (tou: string) {
    dispatch (PetActions.setPetTou (tou))
  },
  setPro (pro: string) {
    dispatch (PetActions.setPetPro (pro))
  },
  setIni (ini: string) {
    dispatch (PetActions.setPetIni (ini))
  },
  setMov (mov: string) {
    dispatch (PetActions.setPetMov (mov))
  },
  setAttack (attack: string) {
    dispatch (PetActions.setPetAttack (attack))
  },
  setAt (at: string) {
    dispatch (PetActions.setPetAt (at))
  },
  setPa (pa: string) {
    dispatch (PetActions.setPetPa (pa))
  },
  setDp (dp: string) {
    dispatch (PetActions.setPetDp (dp))
  },
  setReach (reach: string) {
    dispatch (PetActions.setPetReach (reach))
  },
  setActions (actions: string) {
    dispatch (PetActions.setPetActions (actions))
  },
  setSkills (skills: string) {
    dispatch (PetActions.setPetSkills (skills))
  },
  setAbilities (abilities: string) {
    dispatch (PetActions.setPetAbilities (abilities))
  },
  setNotes (notes: string) {
    dispatch (PetActions.setPetNotes (notes))
  },
  openEditPetAvatar () {
    dispatch (SubwindowsActions.openEditPetAvatar ());
  },
  closeEditPetAvatar () {
    dispatch (SubwindowsActions.closeEditPetAvatar ());
  },
});

export const connectPets = connect<PetsStateProps, PetsDispatchProps, PetsOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
);

export const PetsContainer = connectPets (Pets);
