import * as React from 'react';
import { PetEditorInstance } from '../../App/Models/Hero/heroTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { AvatarChange } from '../../components/AvatarChange';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { Maybe, Record } from '../../utils/dataUtils';

export interface PetEditorProps {
  petInEditor: Maybe<Record<PetEditorInstance>>;
  locale: UIMessagesObject;
  isEditPetAvatarOpen: boolean;
  isInCreation: Maybe<boolean>;

  closePetEditor (): void;
  addPet (): void;
  savePet (): void;
  openEditPetAvatar (): void;
  closeEditPetAvatar (): void;

  setAvatar (path: string): void;
  setName (name: string): void;
  setSize (size: string): void;
  setType (type: string): void;
  setSpentAp (spentAp: string): void;
  setTotalAp (totalAp: string): void;
  setCourage (courage: string): void;
  setSagacity (sagacity: string): void;
  setIntuition (intuition: string): void;
  setCharisma (charisma: string): void;
  setDexterity (dexterity: string): void;
  setAgility (agility: string): void;
  setConstitution (constitution: string): void;
  setStrength (strength: string): void;
  setLp (lp: string): void;
  setAe (ae: string): void;
  setSpi (spi: string): void;
  setTou (tou: string): void;
  setPro (pro: string): void;
  setIni (ini: string): void;
  setMov (mov: string): void;
  setAttack (attack: string): void;
  setAt (at: string): void;
  setPa (pa: string): void;
  setDp (dp: string): void;
  setReach (reach: string): void;
  setActions (actions: string): void;
  setSkills (skills: string): void;
  setAbilities (abilities: string): void;
  setNotes (notes: string): void;
}

export function PetEditor (props: PetEditorProps) {
  const { petInEditor: maybePetInEditor, locale, isInCreation } = props;

  if (Maybe.isJust (maybePetInEditor)) {
    const pet = Maybe.fromJust (maybePetInEditor);

    return (
      <Slidein isOpened close={props.closePetEditor}>
        <div className="pet-edit">
          <div className="left">
            <AvatarWrapper src={pet .lookup ('avatar')} onClick={props.openEditPetAvatar} />
          </div>
          <div className="right">
            <div className="row">
              <TextField
                label={translate (locale, 'pet.name')}
                value={pet .get ('name')}
                onChangeString={props.setName}
                />
              <TextField
                label={translate (locale, 'pet.sizecategory')}
                value={pet .get ('size')}
                onChangeString={props.setSize}
                />
              <TextField
                label={translate (locale, 'pet.type')}
                value={pet .get ('type')}
                onChangeString={props.setType}
                />
              <TextField
                label={translate (locale, 'pet.apspent')}
                value={pet .get ('spentAp')}
                onChangeString={props.setSpentAp}
                />
              <TextField
                label={translate (locale, 'pet.totalap')}
                value={pet .get ('totalAp')}
                onChangeString={props.setTotalAp}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (locale, 'pet.cou')}
                value={pet .get ('cou')}
                onChangeString={props.setCourage}
                />
              <TextField
                label={translate (locale, 'pet.sgc')}
                value={pet .get ('sgc')}
                onChangeString={props.setSagacity}
                />
              <TextField
                label={translate (locale, 'pet.int')}
                value={pet .get ('int')}
                onChangeString={props.setIntuition}
                />
              <TextField
                label={translate (locale, 'pet.cha')}
                value={pet .get ('cha')}
                onChangeString={props.setCharisma}
                />
              <TextField
                label={translate (locale, 'pet.dex')}
                value={pet .get ('dex')}
                onChangeString={props.setDexterity}
                />
              <TextField
                label={translate (locale, 'pet.agi')}
                value={pet .get ('agi')}
                onChangeString={props.setAgility}
                />
              <TextField
                label={translate (locale, 'pet.con')}
                value={pet .get ('con')}
                onChangeString={props.setConstitution}
                />
              <TextField
                label={translate (locale, 'pet.str')}
                value={pet .get ('str')}
                onChangeString={props.setStrength}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (locale, 'pet.lp')}
                value={pet .get ('lp')}
                onChangeString={props.setLp}
                />
              <TextField
                label={translate (locale, 'pet.ae')}
                value={pet .get ('ae')}
                onChangeString={props.setAe}
                />
              <TextField
                label={translate (locale, 'pet.spi')}
                value={pet .get ('spi')}
                onChangeString={props.setSpi}
                />
              <TextField
                label={translate (locale, 'pet.tou')}
                value={pet .get ('tou')}
                onChangeString={props.setTou}
                />
              <TextField
                label={translate (locale, 'pet.pro')}
                value={pet .get ('pro')}
                onChangeString={props.setPro}
                />
              <TextField
                label={translate (locale, 'pet.ini')}
                value={pet .get ('ini')}
                onChangeString={props.setIni}
                />
              <TextField
                label={translate (locale, 'pet.mov')}
                value={pet .get ('mov')}
                onChangeString={props.setMov}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (locale, 'pet.attack')}
                value={pet .get ('attack')}
                onChangeString={props.setAttack}
                />
              <TextField
                label={translate (locale, 'pet.at')}
                value={pet .get ('at')}
                onChangeString={props.setAt}
                />
              <TextField
                label={translate (locale, 'pet.pa')}
                value={pet .get ('pa')}
                onChangeString={props.setPa}
                />
              <TextField
                label={translate (locale, 'pet.dp')}
                value={pet .get ('dp')}
                onChangeString={props.setDp}
                />
              <TextField
                label={translate (locale, 'pet.reach')}
                value={pet .get ('reach')}
                onChangeString={props.setReach}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (locale, 'pet.actions')}
                value={pet .get ('actions')}
                onChangeString={props.setActions}
                />
              <TextField
                label={translate (locale, 'pet.skills')}
                value={pet .get ('talents')}
                onChangeString={props.setSkills}
                />
              <TextField
                label={translate (locale, 'pet.specialabilities')}
                value={pet .get ('skills')}
                onChangeString={props.setAbilities}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (locale, 'pet.notes')}
                value={pet .get ('notes')}
                onChangeString={props.setNotes}
                />
            </div>
            {Maybe.elem (true) (isInCreation)
              ? (
                <BorderButton
                  label={translate (locale, 'actions.addtolist')}
                  onClick={props.addPet}
                  />
              )
              : (
                <BorderButton
                  label={translate (locale, 'actions.save')}
                  onClick={props.savePet}
                  />
              )}
          </div>
        </div>
        <AvatarChange
          locale={locale}
          setPath={props.setAvatar}
          close={props.closeEditPetAvatar}
          isOpened={props.isEditPetAvatarOpen}
          />
      </Slidein>
    );
  }

  return null;
}
