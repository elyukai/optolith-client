import * as React from 'react';
import { Avatar } from '../../../components/Avatar';
import { LabelBox } from '../../../components/LabelBox';
import { Plain } from '../../../components/Plain';
import { AdventurePointsObject } from '../../../selectors/adventurePointsSelectors';
import { PersonalData, Sex } from '../../../types/data';
import { Just, List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { Culture, ExperienceLevel, Race } from '../../../utils/wikiData/wikiTypeHelpers';

export interface MainSheetPersonalDataProps {
  ap: Record<AdventurePointsObject>;
  avatar: Maybe<string>;
  culture: Maybe<Record<Culture>>;
  el: Maybe<Record<ExperienceLevel>>;
  eyeColorTags: List<string>;
  hairColorTags: List<string>;
  locale: UIMessagesObject;
  name: Maybe<string>;
  professionName: Maybe<string>;
  profile: Maybe<Record<PersonalData>>;
  race: Maybe<Record<Race>>;
  sex: Maybe<Sex>;
  socialstatusTags: List<string>;
}

export function MainSheetPersonalData (props: MainSheetPersonalDataProps) {
  const {
    ap,
    avatar,
    culture: maybeCulture,
    el: maybeExperienceLevel,
    eyeColorTags,
    hairColorTags,
    locale,
    name,
    professionName,
    profile: maybeProfile,
    race: maybeRace,
    sex,
    socialstatusTags,
  } = props;

  const raceName = maybeRace .fmap (race => race .get ('name'));
  const cultureName = maybeCulture .fmap (culture => culture .get ('name'));

  const haircolorName = maybeProfile
    .bind (profile => profile .lookup ('hairColor'))
    .bind (hairColor => hairColorTags .subscript (hairColor - 1));

  const eyecolorName = maybeProfile
    .bind (profile => profile .lookup ('eyeColor'))
    .bind (eyeColor => eyeColorTags .subscript (eyeColor - 1));

  const socialstatusName = maybeProfile
    .bind (profile => profile .lookup ('socialStatus'))
    .bind (socialStatus => socialstatusTags .subscript (socialStatus - 1));

  return (
    <div className="upper">
      <div className="info">
        <Plain
          className="name"
          label={translate (locale, 'charactersheet.main.heroname')}
          value={name}
          />
        <Plain
          className="family"
          label={translate (locale, 'charactersheet.main.family')}
          value={maybeProfile .bind (profile => profile .lookup ('family'))}
          />
        <Plain
          className="placeofbirth"
          label={translate (locale, 'charactersheet.main.placeofbirth')}
          value={maybeProfile .bind (profile => profile .lookup ('placeOfBirth'))}
          />
        <Plain
          className="dateofbirth"
          label={translate (locale, 'charactersheet.main.dateofbirth')}
          value={maybeProfile .bind (profile => profile .lookup ('dateOfBirth'))}
          />
        <Plain
          className="age"
          label={translate (locale, 'charactersheet.main.age')}
          value={maybeProfile .bind (profile => profile .lookup ('age'))}
          />
        <Plain
          className="sex"
          label={translate (locale, 'charactersheet.main.sex')}
          value={sex}
          />
        <Plain
          className="race"
          label={translate (locale, 'charactersheet.main.race')}
          value={raceName}
          />
        <Plain
          className="size"
          label={translate (locale, 'charactersheet.main.size')}
          value={maybeProfile .bind (profile => profile .lookup ('size'))}
          />
        <Plain
          className="weight"
          label={translate (locale, 'charactersheet.main.weight')}
          value={maybeProfile .bind (profile => profile .lookup ('weight'))}
          />
        <Plain
          className="haircolor"
          label={translate (locale, 'charactersheet.main.haircolor')}
          value={haircolorName}
          />
        <Plain
          className="eyecolor"
          label={translate (locale, 'charactersheet.main.eyecolor')}
          value={eyecolorName}
          />
        <Plain
          className="culture"
          label={translate (locale, 'charactersheet.main.culture')}
          value={cultureName}
          />
        <Plain
          className="socialstatus"
          label={translate (locale, 'charactersheet.main.socialstatus')}
          value={socialstatusName}
          />
        <Plain
          className="profession"
          label={translate (locale, 'charactersheet.main.profession')}
          value={professionName}
          />
        <Plain
          className="title"
          label={translate (locale, 'charactersheet.main.herotitle')}
          value={maybeProfile .bind (profile => profile .lookup ('title'))}
          />
        <Plain
          className="characteristics"
          label={translate (locale, 'charactersheet.main.characteristics')}
          value={maybeProfile .bind (profile => profile .lookup ('characteristics'))}
          />
        <Plain
          className="otherinfo"
          label={translate (locale, 'charactersheet.main.otherinfo')}
          value={maybeProfile .bind (profile => profile .lookup ('otherInfo'))}
          multi />
      </div>
      <div className="ap-portrait">
        <LabelBox
          className="el"
          label={translate (locale, 'charactersheet.main.experiencelevel')}
          value={maybeExperienceLevel .fmap (experienceLevel => experienceLevel .get ('name'))}
          />
        <LabelBox
          className="ap-total"
          label={translate (locale, 'charactersheet.main.totalap')}
          value={ap.lookup ('total')}
          />
        <LabelBox
          className="portrait"
          label={translate (locale, 'charactersheet.main.avatar')}
          >
          <Avatar src={avatar} img />
        </LabelBox>
        <LabelBox
          className="ap-available"
          label={translate (locale, 'charactersheet.main.apcollected')}
          value={Just (ap .get ('total') - ap .get ('spent'))}
          />
        <LabelBox
          className="ap-used"
          label={translate (locale, 'charactersheet.main.apspent')}
          value={ap.lookup ('spent')}
          />
      </div>
    </div>
  );
}
