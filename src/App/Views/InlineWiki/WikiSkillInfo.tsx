import * as React from 'react';
import { Advantage, Attribute, Book, Skill, SpecialAbility } from '../../App/Models/Wiki/wikiTypeHelpers';
import { UIMessages } from '../../types/data.d';
import { WikiApplications } from './Elements/WikiApplications';
import { WikiBotch } from './Elements/WikiBotch';
import { WikiCriticalSuccess } from './Elements/WikiCriticalSuccess';
import { WikiEncumbrance } from './Elements/WikiEncumbrance';
import { WikiFailedCheck } from './Elements/WikiFailedCheck';
import { WikiImprovementCost } from './Elements/WikiImprovementCost';
import { WikiQuality } from './Elements/WikiQuality';
import { WikiSkillCheck } from './Elements/WikiSkillCheck';
import { WikiSource } from './Elements/WikiSource';
import { WikiTools } from './Elements/WikiTools';
import { WikiBoxTemplate } from './WikiBoxTemplate';

export interface WikiSkillInfoProps {
  attributes: Map<string, Attribute>;
  advantages: Map<string, Advantage>;
  specialAbilities: Map<string, SpecialAbility>;
  books: Map<string, Book>;
  currentObject: Skill;
  locale: UIMessages;
}

export function WikiSkillInfo(props: WikiSkillInfoProps) {
  const {
    currentObject,
    locale
  } = props;

  const {
    name
  } = currentObject;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="skill" title={name}>
        <WikiApplications {...props} showNewApplications />
        <WikiSkillCheck {...props} />
        <WikiApplications {...props} />
        <WikiEncumbrance {...props} />
        <WikiImprovementCost {...props} />
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="skill" title={name}>
      <WikiApplications {...props} showNewApplications />
      <WikiSkillCheck {...props} />
      <WikiApplications {...props} />
      <WikiEncumbrance {...props} />
      <WikiTools {...props} />
      <WikiQuality {...props} />
      <WikiFailedCheck {...props} />
      <WikiCriticalSuccess {...props} />
      <WikiBotch {...props} />
      <WikiImprovementCost {...props} />
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
