import * as R from 'ramda';
import * as React from 'react';
import { Skill, VariantSpecializationSelection } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { Just, List, Maybe, OrderedMap, Record, Tuple } from '../../Utilities/dataUtils';

export interface SelectionsSkillSpecializationProps {
  active: Tuple<Maybe<number>, string>;
  activeId: Maybe<string>;
  options: VariantSpecializationSelection;
  locale: UIMessagesObject;
  skills: OrderedMap<string, Record<Skill>>;
  change (value: string | number): void;
  changeId (id: string): void;
}

export function SelectionsSkillSpecialization (props: SelectionsSkillSpecializationProps) {
  const { active, activeId, change, changeId, locale, options, skills } = props;

  const sid = options .get ('sid');

  const maybeSkillsList =
    Maybe.ensure<string | List<string>, List<string>> ((e): e is List<string> => e instanceof List)
                                                      (sid)
      .fmap (Maybe.mapMaybe (OrderedMap.lookup_ (skills)));

  const activeSkillId = typeof sid === 'string' ? Just (sid) : activeId;
  const maybeActiveSkill = activeSkillId .bind (OrderedMap.lookup_ (skills));

  const maybeApplicationList =
    maybeActiveSkill .bind (Record.lookup<Skill, 'applications'> ('applications'));

  const maybeApplicationInput =
    maybeActiveSkill .bind (Record.lookup<Skill, 'applicationsInput'> ('applicationsInput'));

  const name =
    maybeSkillsList .fmap (
      R.pipe (
        List.map (e => e .get ('name')),
        List.intercalate (
          ` ${translate (locale, 'rcpselections.labels.applicationforskillspecialization')} `
        )
      )
    )
      .alt (maybeActiveSkill .fmap (Record.get<Skill, 'name'> ('name')));

  const selectSkillElement =
    maybeSkillsList
      .fmap (
        skillsList => (
          <div>
            <Dropdown
              className="talents"
              value={activeId}
              onChangeJust={changeId}
              options={skillsList as unknown as List<Record<DropdownOption>>}
              />
          </div>
        )
      );

  const selectionElement =
    Maybe.mapReplace<JSX.Element, Record<Skill>>
      (
        <div>
          {
            Maybe.maybeToReactNode (
              maybeApplicationList
                .fmap (
                  applicationList => (
                    <Dropdown
                      className="tiers"
                      value={Maybe.fromMaybe (0) (Tuple.fst (active))}
                      onChangeJust={change}
                      options={applicationList as List<Record<DropdownOption>>}
                      disabled={Tuple.snd (active) .length > 0}
                      />
                  )
                )
            )
          }
          {
            Maybe.maybeToReactNode (
              maybeApplicationInput
                .fmap (
                  applicationInput => (
                    <TextField
                      hint={applicationInput}
                      value={Tuple.snd (active)}
                      onChangeString={change}
                      />
                  )
                )
            )
          }
        </div>
      )
      (maybeActiveSkill);

  return (
    <div className="spec">
      <h4>
        {translate (locale, 'rcpselections.labels.applicationforskillspecialization')}
        {' ('}
        {Maybe.fromMaybe ('') (name)}
        {')'}
      </h4>
      {Maybe.maybeToReactNode (selectSkillElement)}
      {Maybe.maybeToReactNode (selectionElement)}
    </div>
  );
}
