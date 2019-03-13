import * as React from 'react';
import { Categories } from '../../App/Constants/Categories';
import { ActivatableInstance, SecondaryAttribute, UIMessagesObject } from '../../App/Models/Hero/heroTypeHelpers';
import { Profession } from '../../App/Models/View/viewTypeHelpers';
import { Advantage, Attribute, Blessing, Book, Cantrip, CombatTechnique, Culture, ItemTemplate, LiturgicalChant, ProfessionVariant, Race, RaceVariant, Skill, SpecialAbility, Spell } from '../../App/Models/Wiki/wikiTypeHelpers';
import { WikiState } from '../../App/Reducers/wikiReducer';
import { isItemTemplateFromMixed } from '../../App/Utils/WikiUtils';
import { Aside } from '../../components/Aside';
import { Maybe } from '../../utils/dataUtils';
import { WikiActivatableInfo } from './WikiActivatableInfo';
import { WikiBlessingInfo } from './WikiBlessingInfo';
import { WikiCantripInfo } from './WikiCantripInfo';
import { WikiCombatTechniqueInfo } from './WikiCombatTechniqueInfo';
import { WikiCultureInfo } from './WikiCultureInfo';
import { WikiEquipmentInfo } from './WikiEquipmentInfo';
import { WikiInfoEmpty } from './WikiInfoEmpty';
import { WikiLiturgicalChantInfo } from './WikiLiturgicalChantInfo';
import { WikiProfessionInfo } from './WikiProfessionInfo';
import { WikiRaceInfo } from './WikiRaceInfo';
import { WikiSkillInfo } from './WikiSkillInfo';
import { WikiSpellInfo } from './WikiSpellInfo';

type Instance =
  ActivatableInstance
  | Blessing
  | Cantrip
  | CombatTechnique
  | Culture
  | ItemTemplate
  | LiturgicalChant
  | Profession
  | Race
  | Skill
  | Spell;

export interface WikiInfoContentOwnProps {
  currentId: Maybe<string>;
  locale: UIMessagesObject;
  noWrapper?: boolean;
}

export interface WikiInfoContentStateProps {
  attributes: Map<string, Attribute>;
  advantages: Map<string, Advantage>;
  books: Map<string, Book>;
  blessings: Map<string, Blessing>;
  cantrips: Map<string, Cantrip>;
  combatTechniques: Map<string, CombatTechnique>;
  cultures: Map<string, Culture>;
  derivedCharacteristics: Map<string, SecondaryAttribute>;
  dependent: DependentInstancesState;
  languages: SpecialAbility;
  liturgicalChantExtensions: SpecialAbility | undefined;
  liturgicalChants: Map<string, LiturgicalChant>;
  list: Instance[];
  professionVariants: Map<string, ProfessionVariant>;
  raceVariants: Map<string, RaceVariant>;
  races: Map<string, Race>;
  scripts: SpecialAbility;
  sex: 'm' | 'f' | undefined;
  skills: Map<string, Skill>;
  spellExtensions: SpecialAbility | undefined;
  spells: Map<string, Spell>;
  specialAbilities: Map<string, SpecialAbility>;
  templates: Map<string, ItemTemplate>;
  wiki: WikiState;
}

export interface WikiInfoContentDispatchProps { }

export type WikiInfoContentProps =
  WikiInfoContentStateProps
  & WikiInfoContentDispatchProps
  & WikiInfoContentOwnProps;

export function WikiInfoContent (props: WikiInfoContentProps) {
  const { currentId, list, noWrapper } = props;

  const currentObject = typeof currentId === 'string' && list.find (e => currentId === e.id);

  let currentElement: JSX.Element | null | undefined;

  if (typeof currentObject === 'object') {
    if (isItemTemplateFromMixed (currentObject)) {
      currentElement = <WikiEquipmentInfo {...props} currentObject={currentObject} />;
    }
    else {
      switch (currentObject.category) {
        case Categories.ADVANTAGES:
        case Categories.DISADVANTAGES:
        case Categories.SPECIAL_ABILITIES:
          currentElement = <WikiActivatableInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.BLESSINGS:
          currentElement = <WikiBlessingInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.CANTRIPS:
          currentElement = <WikiCantripInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.COMBAT_TECHNIQUES:
          currentElement = <WikiCombatTechniqueInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.CULTURES:
          currentElement = <WikiCultureInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.LITURGIES:
          currentElement = <WikiLiturgicalChantInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.PROFESSIONS:
          currentElement = <WikiProfessionInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.RACES:
          currentElement = <WikiRaceInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.SPELLS:
          currentElement = <WikiSpellInfo {...props} currentObject={currentObject} />;
          break;
        case Categories.TALENTS:
          currentElement = <WikiSkillInfo {...props} currentObject={currentObject} />;
          break;
      }
    }
  }

  return noWrapper ? (currentElement || <WikiInfoEmpty />) : (
    <Aside>
      {currentElement || <WikiInfoEmpty />}
    </Aside>
  );
}
