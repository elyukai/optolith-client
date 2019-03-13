import * as R from 'ramda';
import * as React from 'react';
import { InputTextEvent, PersonalData } from '../../App/Models/Hero/heroTypeHelpers';
import { Culture, Race, RaceVariant } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate } from '../../App/Utils/I18n';
import { isEmptyOr, isFloat, isNaturalNumber } from '../../App/Utils/RegexUtils';
import { isNumber } from '../../App/Utils/typeCheckUtils';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { IconButton } from '../../components/IconButton';
import { InputButtonGroup } from '../../components/InputButtonGroup';
import { TextField } from '../../components/TextField';
import { UIMessagesObject } from '../../types/ui';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { sortObjects } from '../../utils/FilterSortUtils';

export interface OverviewPersonalDataOwnProps {
  culture: Maybe<Record<Culture>>;
  eyecolorTags: List<string>;
  haircolorTags: List<string>;
  locale: UIMessagesObject;
  profile: Record<PersonalData>;
  race: Maybe<Record<Race>>;
  raceVariant: Maybe<Record<RaceVariant>>;
  socialstatusTags: List<string>;
  isAlbino: Maybe<boolean>;
}

export interface OverviewPersonalDataDispatchProps {
  changeFamily (event: InputTextEvent): void;
  changePlaceOfBirth (event: InputTextEvent): void;
  changeDateOfBirth (event: InputTextEvent): void;
  changeAge (event: InputTextEvent): void;
  changeHaircolor (result: Maybe<number>): void;
  changeEyecolor (result: Maybe<number>): void;
  changeSize (event: InputTextEvent): void;
  changeWeight (event: InputTextEvent): void;
  changeTitle (event: InputTextEvent): void;
  changeSocialStatus (result: Maybe<number>): void;
  changeCharacteristics (event: InputTextEvent): void;
  changeOtherInfo (event: InputTextEvent): void;
  changeCultureAreaKnowledge (event: InputTextEvent): void;
  rerollHair (): void;
  rerollEyes (): void;
  rerollSize (): void;
  rerollWeight (): void;
}

export type OverviewPersonalDataProps =
  OverviewPersonalDataDispatchProps
  & OverviewPersonalDataOwnProps;

interface HairColorAndEyeColorOptions {
  hairOptions: List<Record<DropdownOption>>;
  eyeOptions: List<Record<DropdownOption>>;
}

const getHairColorAndEyeColorOptions = (locale: UIMessagesObject) =>
  (maybeRace: Maybe<Record<Race>>) =>
    (maybeRaceVariant: Maybe<Record<RaceVariant>>) =>
      (hairColorTags: List<string>) =>
        (eyeColorTags: List<string>) =>
          (isAlbino: Maybe<boolean>): HairColorAndEyeColorOptions => {
            if (Maybe.elem (true) (isAlbino)) {
              return {
                hairOptions: Maybe.catMaybes (
                  List.of (
                    hairColorTags .subscript (23) .fmap (
                      name => Record.of<DropdownOption> ({ id: 24, name })
                    )
                  )
                ),
                eyeOptions: sortObjects (
                  Maybe.catMaybes (
                    List.of (
                      eyeColorTags .subscript (18) .fmap (
                        name => Record.of<DropdownOption> ({ id: 19, name })
                      ),
                      eyeColorTags .subscript (19) .fmap (
                        name => Record.of<DropdownOption> ({ id: 20, name })
                      )
                    )
                  ),
                  locale.get ('id')
                ),
              };
            }

            if (Maybe.isJust (maybeRace)) {
              const race = Maybe.fromJust (maybeRace);
              const raceHairColors = race.lookup ('hairColors');
              const raceEyeColors = race.lookup ('eyeColors');

              const raceVariantHairColors =
                maybeRaceVariant .bind (raceVariant => raceVariant.lookup ('hairColors'));

              const raceVariantEyeColors =
                maybeRaceVariant .bind (raceVariant => raceVariant.lookup ('eyeColors'));

              return {
                hairOptions: sortObjects (
                  Maybe.imapMaybe
                    (index => (name: string) =>
                      Maybe.ensure<Record<DropdownOption>>
                        (entry => Maybe.elem
                          (true)
                          (Maybe.liftM2<number, List<number>, boolean>
                            (List.elem)
                            (entry .lookup ('id') .bind (Maybe.ensure (isNumber)))
                            (raceHairColors .alt (raceVariantHairColors))))
                        (Record.of<DropdownOption> ({ id: index + 1, name })))
                    (hairColorTags),
                  locale.get ('id')
                ),
                eyeOptions: sortObjects (
                  Maybe.imapMaybe
                    (index => (name: string) =>
                      Maybe.ensure<Record<DropdownOption>>
                        (entry => Maybe.elem
                          (true)
                          (Maybe.liftM2<number, List<number>, boolean>
                            (List.elem)
                            (entry .lookup ('id') .bind (Maybe.ensure (isNumber)))
                            (raceEyeColors .alt (raceVariantEyeColors))))
                        (Record.of<DropdownOption> ({ id: index + 1, name })))
                    (eyeColorTags),
                  locale.get ('id')
                ),
              };
            }

            return {
              hairOptions: List.empty (),
              eyeOptions: List.empty (),
            };
          };

export function OverviewPersonalData (props: OverviewPersonalDataProps) {
  const {
    culture: maybeCulture,
    eyecolorTags,
    haircolorTags,
    locale,
    profile,
    race,
    raceVariant,
    socialstatusTags,
    isAlbino,
  } = props;

  const hairAndEyeColorOptions = getHairColorAndEyeColorOptions (locale)
                                                                (race)
                                                                (raceVariant)
                                                                (haircolorTags)
                                                                (eyecolorTags)
                                                                (isAlbino);

  const socialOptions = Maybe.fromMaybe
    (List.empty<Record<DropdownOption>> ())
    (maybeCulture .fmap (
      culture => Maybe.imapMaybe
        (index => (name: string) =>
          Maybe.ensure<Record<DropdownOption>>
            (R.pipe (
              Record.lookup<DropdownOption, 'id'> ('id'),
              Maybe.bind_ (Maybe.ensure (isNumber)),
              Maybe.fmap (List.elem_ (culture .get ('socialStatus'))),
              Maybe.elem (true)
            ))
            (Record.of<DropdownOption> ({ id: index + 1, name })))
        (socialstatusTags)
    ));

  const age = profile.lookup ('age');
  const size = profile.lookup ('size');
  const weight = profile.lookup ('weight');

  return (
    <div className="personal-data">
      <div>
        <TextField
          label={translate (locale, 'personaldata.family')}
          value={Maybe.fromMaybe ('') (profile.lookup ('family'))}
          onChange={props.changeFamily}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.placeofbirth')}
          value={Maybe.fromMaybe ('') (profile.lookup ('placeOfBirth'))}
          onChange={props.changePlaceOfBirth}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.dateofbirth')}
          value={Maybe.fromMaybe ('') (profile.lookup ('dateOfBirth'))}
          onChange={props.changeDateOfBirth}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.age')}
          value={Maybe.fromMaybe ('') (age)}
          onChange={props.changeAge}
          valid={!Maybe.isJust (age) || Maybe.elem (true) (age .fmap (isEmptyOr (isNaturalNumber)))}
          />
      </div>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (locale, 'personaldata.haircolor')}
          value={profile.lookup ('hairColor')}
          onChange={props.changeHaircolor}
          options={hairAndEyeColorOptions.hairOptions}
          disabled={isAlbino}
          />
        <IconButton icon="&#xE913;" onClick={props.rerollHair} disabled={isAlbino} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (locale, 'personaldata.eyecolor')}
          value={profile.lookup ('eyeColor')}
          onChange={props.changeEyecolor}
          options={hairAndEyeColorOptions.eyeOptions}
          />
        <IconButton icon="&#xE913;" onClick={props.rerollEyes} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={translate (locale, 'personaldata.size')}
          value={Maybe.fromMaybe ('') (profile.lookup ('size'))}
          onChange={props.changeSize}
          valid={!Maybe.isJust (size) || Maybe.elem (true) (size .fmap (isEmptyOr (isFloat)))}
          />
        <IconButton icon="&#xE913;" onClick={props.rerollSize} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={translate (locale, 'personaldata.weight')}
          value={Maybe.fromMaybe ('') (profile.lookup ('weight'))}
          onChange={props.changeWeight}
          valid={
            !Maybe.isJust (weight)
            || Maybe.elem (true) (weight .fmap (isEmptyOr (isNaturalNumber)))
          }
          />
        <IconButton icon="&#xE913;" onClick={props.rerollWeight} />
      </InputButtonGroup>
      <div>
        <TextField
          label={translate (locale, 'personaldata.title')}
          value={profile.lookup ('title')}
          onChange={props.changeTitle}
          />
      </div>
      <div>
        <Dropdown
          label={translate (locale, 'personaldata.socialstatus')}
          value={profile.lookup ('socialStatus')}
          onChange={props.changeSocialStatus}
          options={socialOptions}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.characteristics')}
          value={profile.lookup ('characteristics')}
          onChange={props.changeCharacteristics}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.otherinfo')}
          value={profile.lookup ('otherInfo')}
          onChange={props.changeOtherInfo}
          />
      </div>
      <div>
        <TextField
          label={translate (locale, 'personaldata.cultureareaknowledge')}
          value={profile.lookup ('cultureAreaKnowledge')}
          onChange={props.changeCultureAreaKnowledge}
          />
      </div>
    </div>
  );
}
