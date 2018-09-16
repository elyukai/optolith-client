import * as React from 'react';
import { Avatar } from '../../components/Avatar';
import { LabelBox } from '../../components/LabelBox';
import { Plain } from '../../components/Plain';
import { ProfileState } from '../../reducers/profile';
import { Culture, ExperienceLevel, Profession, ProfessionVariant, Race } from '../../types/wiki';
import { translate, UIMessages } from '../../utils/I18n';

export interface MainSheetPersonalDataProps {
  ap: {
    spent: number;
    total: number;
  };
  culture: Culture | undefined;
  el: ExperienceLevel;
  eyecolorTags: string[];
  haircolorTags: string[];
  locale: UIMessages;
  profession: Profession | undefined;
  professionVariant?: ProfessionVariant;
  profile: ProfileState;
  race: Race | undefined;
  socialstatusTags: string[];
}

export function MainSheetPersonalData(props: MainSheetPersonalDataProps) {
  const { ap, culture, el, eyecolorTags, haircolorTags, locale, profession, professionVariant, profile: { name, family, placeofbirth, dateofbirth, age, sex, size, weight, haircolor, eyecolor, title, socialstatus, characteristics, otherinfo, avatar, professionName: ownProfessionName }, race, socialstatusTags } = props;

  const raceName = race && race.name;
  const cultureName = culture && culture.name;
  const professionName = (() => {
    if (profession && profession.id === 'P_0') {
      return ownProfessionName;
    }
    let { name, subname } = profession || { name: '', subname: undefined };
    if (typeof name === 'object' && sex) {
      name = name[sex];
    }
    if (typeof subname === 'object' && sex) {
      subname = subname[sex];
    }
    let { name: vname } = professionVariant || { name: '' };
    if (typeof vname === 'object' && sex) {
      vname = vname[sex];
    }
    return name + (subname ? ` (${subname})` : professionVariant ? ` (${vname})` : '');
  })();

  const haircolorName = haircolor && haircolorTags[haircolor - 1];
  const eyecolorName = eyecolor && eyecolorTags[eyecolor - 1];
  const socialstatusName = socialstatus && socialstatusTags[socialstatus - 1];

  return (
    <div className="upper">
      <div className="info">
        <Plain className="name" label={translate(locale, 'charactersheet.main.heroname')} value={name} />
        <Plain className="family" label={translate(locale, 'charactersheet.main.family')} value={family} />
        <Plain className="placeofbirth" label={translate(locale, 'charactersheet.main.placeofbirth')} value={placeofbirth} />
        <Plain className="dateofbirth" label={translate(locale, 'charactersheet.main.dateofbirth')} value={dateofbirth} />
        <Plain className="age" label={translate(locale, 'charactersheet.main.age')} value={age} />
        <Plain className="sex" label={translate(locale, 'charactersheet.main.sex')} value={sex} />
        <Plain className="race" label={translate(locale, 'charactersheet.main.race')} value={raceName} />
        <Plain className="size" label={translate(locale, 'charactersheet.main.size')} value={size} />
        <Plain className="weight" label={translate(locale, 'charactersheet.main.weight')} value={weight} />
        <Plain className="haircolor" label={translate(locale, 'charactersheet.main.haircolor')} value={haircolorName} />
        <Plain className="eyecolor" label={translate(locale, 'charactersheet.main.eyecolor')} value={eyecolorName} />
        <Plain className="culture" label={translate(locale, 'charactersheet.main.culture')} value={cultureName} />
        <Plain className="socialstatus" label={translate(locale, 'charactersheet.main.socialstatus')} value={socialstatusName} />
        <Plain className="profession" label={translate(locale, 'charactersheet.main.profession')} value={professionName} />
        <Plain className="title" label={translate(locale, 'charactersheet.main.herotitle')} value={title} />
        <Plain className="characteristics" label={translate(locale, 'charactersheet.main.characteristics')} value={characteristics} />
        <Plain className="otherinfo" label={translate(locale, 'charactersheet.main.otherinfo')} value={otherinfo} multi />
      </div>
      <div className="ap-portrait">
        <LabelBox className="el" label={translate(locale, 'charactersheet.main.experiencelevel')} value={el.name} />
        <LabelBox className="ap-total" label={translate(locale, 'charactersheet.main.totalap')} value={ap.total} />
        <LabelBox className="portrait" label={translate(locale, 'charactersheet.main.avatar')}>
          <Avatar src={avatar} img />
        </LabelBox>
        <LabelBox className="ap-available" label={translate(locale, 'charactersheet.main.apcollected')} value={ap.total - ap.spent} />
        <LabelBox className="ap-used" label={translate(locale, 'charactersheet.main.apspent')} value={ap.spent} />
      </div>
    </div>
  );
}
