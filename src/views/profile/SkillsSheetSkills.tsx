import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { TalentInstance } from '../../types/data';
import { Attribute, UIMessages } from '../../types/view';
import { translate } from '../../utils/I18n';
import { iterateGroupHeaders } from './SkillsSheetSkillsGroups';
import { iterateList } from './SkillsSheetSkillsIterate';

export interface SkillsSheetSkillsProps {
  attributes: Attribute[];
  checkAttributeValueVisibility: boolean;
  locale: UIMessages;
  talents: TalentInstance[];
}

export function SkillsSheetSkills(props: SkillsSheetSkillsProps) {
  const { attributes, checkAttributeValueVisibility, locale, talents } = props;

  const talentsByGroup: TalentInstance[][] = [[], [], [], [], []];
  talents.forEach(obj => talentsByGroup[obj.gr - 1].push(obj));

  const groupHeaders = iterateGroupHeaders(attributes, checkAttributeValueVisibility, locale);

  return (
    <TextBox label={translate(locale, 'charactersheet.gamestats.skills.title')}>
      <div className="upper">
        <table>
          <thead>
            <tr>
              <th className="name">{translate(locale, 'charactersheet.gamestats.skills.headers.skill')}</th>
              <th className="check">{translate(locale, 'charactersheet.gamestats.skills.headers.check')}</th>
              <th className="enc">{translate(locale, 'charactersheet.gamestats.skills.headers.enc')}</th>
              <th className="ic">{translate(locale, 'charactersheet.gamestats.skills.headers.ic')}</th>
              <th className="sr">{translate(locale, 'charactersheet.gamestats.skills.headers.sr')}</th>
              <th className="routine">{translate(locale, 'charactersheet.gamestats.skills.headers.r')}</th>
              <th className="comment">{translate(locale, 'charactersheet.gamestats.skills.headers.notes')}</th>
            </tr>
          </thead>
          <tbody>
            {groupHeaders[0]}
            {iterateList(talentsByGroup[0], attributes, checkAttributeValueVisibility, locale)}
            <tr><td/><td/><td/><td/><td/><td/><td/></tr>
            {groupHeaders[1]}
            {iterateList(talentsByGroup[1], attributes, checkAttributeValueVisibility, locale)}
            <tr><td/><td/><td/><td/><td/><td/><td/></tr>
            {groupHeaders[2]}
            {iterateList(talentsByGroup[2], attributes, checkAttributeValueVisibility, locale)}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="name">{translate(locale, 'charactersheet.gamestats.skills.headers.skill')}</th>
              <th className="check">{translate(locale, 'charactersheet.gamestats.skills.headers.check')}</th>
              <th className="enc">{translate(locale, 'charactersheet.gamestats.skills.headers.enc')}</th>
              <th className="ic">{translate(locale, 'charactersheet.gamestats.skills.headers.ic')}</th>
              <th className="sr">{translate(locale, 'charactersheet.gamestats.skills.headers.sr')}</th>
              <th className="routine">{translate(locale, 'charactersheet.gamestats.skills.headers.r')}</th>
              <th className="comment">{translate(locale, 'charactersheet.gamestats.skills.headers.notes')}</th>
            </tr>
          </thead>
          <tbody>
            {groupHeaders[3]}
            {iterateList(talentsByGroup[3], attributes, checkAttributeValueVisibility, locale)}
            <tr><td/><td/><td/><td/><td/><td/><td/></tr>
            {groupHeaders[4]}
            {iterateList(talentsByGroup[4], attributes, checkAttributeValueVisibility, locale)}
          </tbody>
        </table>
      </div>
    </TextBox>
  );
}
