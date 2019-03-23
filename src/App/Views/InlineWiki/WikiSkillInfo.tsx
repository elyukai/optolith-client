import * as React from 'react';
import { Advantage, Attribute, Book, Skill, SpecialAbility } from '../../App/Models/Wiki/wikiTypeHelpers';
import { UIMessages } from '../../types/data.d';
import { WikiApplications } from './elements/WikiApplications';
import { WikiBotch } from './elements/WikiBotch';
import { WikiCriticalSuccess } from './elements/WikiCriticalSuccess';
import { WikiEncumbrance } from './elements/WikiEncumbrance';
import { WikiFailedCheck } from './elements/WikiFailedCheck';
import { WikiImprovementCost } from './elements/WikiImprovementCost';
import { WikiQuality } from './elements/WikiQuality';
import { WikiSkillCheck } from './elements/WikiSkillCheck';
import { WikiSource } from './elements/WikiSource';
import { WikiTools } from './elements/WikiTools';
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