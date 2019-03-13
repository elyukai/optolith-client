import * as React from 'react';
import { AttributeCombined, SkillCombined } from '../../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { List, Maybe, OrderedMap, OrderedSet, Record } from '../../../utils/dataUtils';
import { iterateGroupHeaders } from './SkillsSheetSkillsGroups';
import { iterateList } from './SkillsSheetSkillsIterate';

export interface SkillsSheetSkillsProps {
  attributes: List<Record<AttributeCombined>>;
  checkAttributeValueVisibility: boolean;
  locale: UIMessagesObject;
  skills: List<Record<SkillCombined>>;
}

const EmptyRow = () => (
  <tr>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
  </tr>
);

export function SkillsSheetSkills (props: SkillsSheetSkillsProps) {
  const { attributes, checkAttributeValueVisibility, locale, skills } = props;

  const emptySkillsByGroup =
    OrderedMap.fromSet<number, List<Record<SkillCombined>>> (List.empty)
                                                            (OrderedSet.of ([1, 2, 3, 4, 5]));

  const skillsByGroup = skills
    .foldl<OrderedMap<number, List<Record<SkillCombined>>>>
      (map => skill => map.adjust (List.cons_<Record<SkillCombined>> (skill)) (skill.get ('gr')))
      (emptySkillsByGroup);

  const groupHeaders = iterateGroupHeaders (attributes) (checkAttributeValueVisibility) (locale);

  return (
    <TextBox label={translate (locale, 'charactersheet.gamestats.skills.title')}>
      <div className="upper">
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (locale, 'charactersheet.gamestats.skills.headers.skill')}
              </th>
              <th className="check">
                {translate (locale, 'charactersheet.gamestats.skills.headers.check')}
              </th>
              <th className="enc">
                {translate (locale, 'charactersheet.gamestats.skills.headers.enc')}
              </th>
              <th className="ic">
                {translate (locale, 'charactersheet.gamestats.skills.headers.ic')}
              </th>
              <th className="sr">
                {translate (locale, 'charactersheet.gamestats.skills.headers.sr')}
              </th>
              <th className="routine">
                {translate (locale, 'charactersheet.gamestats.skills.headers.r')}
              </th>
              <th className="comment">
                {translate (locale, 'charactersheet.gamestats.skills.headers.notes')}
              </th>
            </tr>
          </thead>
          <tbody>
            {Maybe.fromMaybe (<></>) (groupHeaders .subscript (0))}
            {iterateList (locale)
                         (checkAttributeValueVisibility)
                         (attributes)
                         (skillsByGroup .findWithDefault (List.empty ()) (0))}
            <EmptyRow />
            {Maybe.fromMaybe (<></>) (groupHeaders .subscript (1))}
            {iterateList (locale)
                         (checkAttributeValueVisibility)
                         (attributes)
                         (skillsByGroup .findWithDefault (List.empty ()) (1))}
            <EmptyRow />
            {Maybe.fromMaybe (<></>) (groupHeaders .subscript (2))}
            {iterateList (locale)
                         (checkAttributeValueVisibility)
                         (attributes)
                         (skillsByGroup .findWithDefault (List.empty ()) (2))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (locale, 'charactersheet.gamestats.skills.headers.skill')}
              </th>
              <th className="check">
                {translate (locale, 'charactersheet.gamestats.skills.headers.check')}
              </th>
              <th className="enc">
                {translate (locale, 'charactersheet.gamestats.skills.headers.enc')}
              </th>
              <th className="ic">
                {translate (locale, 'charactersheet.gamestats.skills.headers.ic')}
              </th>
              <th className="sr">
                {translate (locale, 'charactersheet.gamestats.skills.headers.sr')}
              </th>
              <th className="routine">
                {translate (locale, 'charactersheet.gamestats.skills.headers.r')}
              </th>
              <th className="comment">
                {translate (locale, 'charactersheet.gamestats.skills.headers.notes')}
              </th>
            </tr>
          </thead>
          <tbody>
            {Maybe.fromMaybe (<></>) (groupHeaders .subscript (3))}
            {iterateList (locale)
                         (checkAttributeValueVisibility)
                         (attributes)
                         (skillsByGroup .findWithDefault (List.empty ()) (3))}
            <EmptyRow />
            {Maybe.fromMaybe (<></>) (groupHeaders .subscript (4))}
            {iterateList (locale)
                         (checkAttributeValueVisibility)
                         (attributes)
                         (skillsByGroup .findWithDefault (List.empty ()) (4))}
          </tbody>
        </table>
      </div>
    </TextBox>
  );
}
