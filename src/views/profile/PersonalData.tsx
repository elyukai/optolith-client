import * as React from 'react';
import { ActiveViewObject, PersonalData as PersonalDataInterface } from '../../App/Models/Hero/heroTypeHelpers';
import { Advantage, Culture, Disadvantage, ExperienceLevel, Profession, ProfessionVariant, Race, RaceVariant } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate } from '../../App/Utils/I18n';
import { ActivatableTextList } from '../../components/ActivatableTextList';
import { AvatarChange } from '../../components/AvatarChange';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { EditText } from '../../components/EditText';
import { IconButton } from '../../components/IconButton';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { VerticalList } from '../../components/VerticalList';
import { UIMessagesObject } from '../../types/ui';
import { Just, List, Maybe, Record } from '../../utils/dataUtils';
import { OverviewAddAP } from './OverviewAddAP';
import { OverviewPersonalData, OverviewPersonalDataDispatchProps } from './OverviewPersonalData';

export interface PersonalDataOwnProps {
  locale: UIMessagesObject;
}

export interface PersonalDataStateProps {
  apLeft: Maybe<number>;
  apTotal: Maybe<number>;
  advantages: Maybe<List<Record<ActiveViewObject<Advantage>>>>;
  avatar: Maybe<string>;
  culture: Maybe<Record<Culture>>;
  currentEl: Maybe<Record<ExperienceLevel>>;
  disadvantages: Maybe<List<Record<ActiveViewObject<Disadvantage>>>>;
  name: Maybe<string>;
  phase: Maybe<number>;
  profession: Maybe<Record<Profession>>;
  professionName: Maybe<string>;
  fullProfessionName: Maybe<string>;
  professionVariant: Maybe<Record<ProfessionVariant>>;
  profile: Maybe<Record<PersonalDataInterface>>;
  race: Maybe<Record<Race>>;
  raceVariant: Maybe<Record<RaceVariant>>;
  sex: Maybe<'m' | 'f'>;
  isRemovingEnabled: boolean;
  isEditingHeroAfterCreationPhaseEnabled: boolean;
  isAddAdventurePointsOpen: boolean;
  isEditCharacterAvatarOpen: boolean;
  isAlbino: Maybe<boolean>;
}

export interface PersonalDataDispatchProps extends OverviewPersonalDataDispatchProps {
  setAvatar (path: string): void;
  setHeroName (name: string): void;
  setCustomProfessionName (name: string): void;
  endCharacterCreation (): void;
  addAdventurePoints (ap: number): void;
  openAddAdventurePoints (): void;
  closeAddAdventurePoints (): void;
  openEditCharacterAvatar (): void;
  closeEditCharacterAvatar (): void;
}

export type PersonalDataProps =
  PersonalDataStateProps
  & PersonalDataDispatchProps
  & PersonalDataOwnProps;

export interface PersonalDataState {
  editName: boolean;
  editProfessionName: boolean;
  isAvatarChangeOpened: boolean;
  isAddAPOpened: boolean;
}

export class PersonalData extends React.Component<PersonalDataProps, PersonalDataState> {
  state = {
    editName: false,
    editProfessionName: false,
    isAvatarChangeOpened: false,
    isAddAPOpened: false,
  };

  openAvatarChange = () => this.setState (() => ({ isAvatarChangeOpened: true }));
  closeAvatarChange = () => this.setState (() => ({ isAvatarChangeOpened: false }));
  openAddAP = () => this.setState (() => ({ isAddAPOpened: true }));
  closeAddAP = () => this.setState (() => ({ isAddAPOpened: false }));

  changeName = (name: string) => {
    this.props.setHeroName (name);
    this.setState ({ editName: false });
  }

  changeProfessionName = (name: string) => {
    this.props.setCustomProfessionName (name);
    this.setState ({ editProfessionName: false });
  }

  editName = () => this.setState ({ editName: true });
  editNameCancel = () => this.setState ({ editName: false });
  editProfessionName = () => this.setState ({ editProfessionName: true });
  editProfessionNameCancel = () => this.setState ({ editProfessionName: false });

  render () {
    const {
      advantages: maybeAdvantages,
      avatar,
      apLeft,
      apTotal,
      culture,
      currentEl,
      disadvantages: maybeDisadvantages,
      endCharacterCreation,
      locale,
      name,
      phase,
      profession,
      professionName,
      fullProfessionName,
      professionVariant,
      profile: maybeProfile,
      race,
      raceVariant,
      sex: maybeSex,
      isEditingHeroAfterCreationPhaseEnabled,
      isAddAdventurePointsOpen,
      isEditCharacterAvatarOpen,
      openAddAdventurePoints,
      openEditCharacterAvatar,
      closeAddAdventurePoints,
      closeEditCharacterAvatar,
      setAvatar,
      ...other
    } = this.props;

    const {
      editName,
      editProfessionName,
    } = this.state;

    const isOwnProfession =
      Maybe.elem ('P_0') (profession.fmap (Record.get<Profession, 'id'> ('id')));

    const isProfessionUndefined = Maybe.isNothing (profession);

    const nameElement = editName ? (
      <EditText
        className="change-name"
        cancel={this.editNameCancel}
        submit={this.changeName}
        text={Maybe.fromMaybe ('') (name)}
        autoFocus
        />
    ) : (
      <h1 className="confirm-edit">
        {Maybe.fromMaybe ('') (name)}
        <IconButton icon="&#xE90c;" onClick={this.editName} />
      </h1>
    );

    const professionNameElement = phase.gt (Just (1)) && isOwnProfession && (editProfessionName ? (
      <EditText
        cancel={this.editProfessionNameCancel}
        submit={this.changeProfessionName}
        text={Maybe.fromMaybe ('') (professionName)}
        />
    ) : (
      <BorderButton
        className="edit-profession-name-btn"
        label={translate (locale, 'profileoverview.view.editprofessionname')}
        onClick={this.editProfessionName}
        />
    ));

    return Maybe.fromMaybe
      (<></>)
      (maybeProfile.fmap (
        profile => (
          <Page id="personal-data">
            <Scroll className="text">
              <div className="title-wrapper">
                <AvatarWrapper src={avatar} onClick={openEditCharacterAvatar} />
                <div className="text-wrapper">
                  {nameElement}
                  {
                    !isProfessionUndefined && (
                      <VerticalList className="rcp">
                        {
                          Maybe.fromMaybe
                            (<></>)
                            (maybeSex.fmap (
                              sex => (
                                <span>
                                  {
                                    translate (
                                      locale,
                                      sex === 'm'
                                        ? 'profileoverview.view.male'
                                        : 'profileoverview.view.female'
                                    )
                                  }
                                </span>
                              )
                            ))
                        }
                        <span className="race">
                          {Maybe.fromMaybe ('') (race.fmap (Record.get<Race, 'name'> ('name')))}
                          {Maybe.fromMaybe
                            ('')
                            (raceVariant
                              .fmap (Record.get<RaceVariant, 'name'> ('name'))
                              .fmap (raceVariantName => ` (${raceVariantName})`))}
                        </span>
                        <span className="culture">
                          {Maybe.fromMaybe
                            ('')
                            (culture.fmap (Record.get<Culture, 'name'> ('name')))}
                        </span>
                        <span className="profession">
                          {Maybe.fromMaybe ('') (fullProfessionName)}
                        </span>
                      </VerticalList>
                    )
                  }
                  <VerticalList className="el">
                    <span>
                      {Maybe.fromMaybe
                        ('')
                        (currentEl.fmap (Record.get<ExperienceLevel, 'name'> ('name')))}
                    </span>
                    <span>
                      {Maybe.fromMaybe (0) (apTotal)} AP
                    </span>
                  </VerticalList>
                </div>
              </div>
              <div className="main-profile-actions">
                {
                  Maybe.elem (3) (phase) && (
                    <BorderButton
                      className="add-ap"
                      label={translate (locale, 'profileoverview.actions.addadventurepoints')}
                      onClick={openAddAdventurePoints}
                      />
                  )
                }
                {professionNameElement}
              </div>
              {
                !isProfessionUndefined && (
                  <>
                    <h3>{translate (locale, 'profileoverview.view.personaldata')}</h3>
                    <OverviewPersonalData
                      {...other}
                      profile={profile}
                      culture={culture}
                      eyecolorTags={translate (locale, 'eyecolors')}
                      haircolorTags={translate (locale, 'haircolors')}
                      race={race}
                      raceVariant={raceVariant}
                      socialstatusTags={translate (locale, 'socialstatus')}
                      locale={locale}
                      />
                  </>
                )
              }
              {
                Maybe.elem (2) (phase) && (
                  <div>
                    <BorderButton
                      className="end-char-creation"
                      label={translate (locale, 'profileoverview.actions.endherocreation')}
                      onClick={endCharacterCreation}
                      primary
                      disabled={
                        apLeft.lt (Just (0))
                        || apLeft.gt (Just (10)) && !isEditingHeroAfterCreationPhaseEnabled
                      }
                      />
                  </div>
                )
              }
              {
                Maybe.elem (3) (phase) && (
                  <div>
                    <h3>{translate (locale, 'profileoverview.view.advantages')}</h3>
                    {
                      Maybe.fromMaybe
                        (<></>)
                        (maybeAdvantages .fmap (
                          advantages => (
                            <ActivatableTextList
                              list={advantages as List<Record<ActiveViewObject>>}
                              locale={locale}
                              />
                          )
                        ))
                    }
                    <h3>{translate (locale, 'profileoverview.view.disadvantages')}</h3>
                    {
                      Maybe.fromMaybe
                        (<></>)
                        (maybeDisadvantages .fmap (
                          disadvantages => (
                            <ActivatableTextList
                              list={disadvantages as List<Record<ActiveViewObject>>}
                              locale={locale}
                              />
                          )
                        ))
                    }
                  </div>
                )
              }
            </Scroll>
            <OverviewAddAP
              {...this.props}
              close={closeAddAdventurePoints}
              isOpened={isAddAdventurePointsOpen}
              />
            <AvatarChange
              {...this.props}
              setPath={setAvatar}
              close={closeEditCharacterAvatar}
              isOpened={isEditCharacterAvatarOpen}
              />
          </Page>
        )
      ));
  }
}
