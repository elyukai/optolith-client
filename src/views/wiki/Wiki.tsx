import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { UIMessagesObject } from '../../types/ui';
import { Advantage, Blessing, Cantrip, CombatTechnique, Culture, Disadvantage, Entry, ItemTemplate, LiturgicalChant, Profession, Race, Skill, SpecialAbility, Spell } from '../../types/wiki';
import { Just, List, Maybe, Nothing, Record } from '../../utils/dataUtils';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { WikiList } from './WikiList';

export interface WikiOwnProps {
  locale: UIMessagesObject;
}

interface Lists {
  races: List<Record<Race>>;
  cultures: List<Record<Culture>>;
  professions: List<Record<Profession>>;
  advantages: List<Record<Advantage>>;
  disadvantages: List<Record<Disadvantage>>;
  skills: List<Record<Skill>>;
  combatTechniques: List<Record<CombatTechnique>>;
  specialAbilities: List<Record<SpecialAbility>>;
  spells: List<Record<Spell>>;
  cantrips: List<Record<Cantrip>>;
  liturgicalChants: List<Record<LiturgicalChant>>;
  blessings: List<Record<Blessing>>;
  itemTemplates: List<Record<ItemTemplate>>;
}

export interface WikiStateProps extends Lists {
  filterText: string;
  category: Maybe<string>;
  professionsGroup: Maybe<number>;
  skillsGroup: Maybe<number>;
  combatTechniquesGroup: Maybe<number>;
  specialAbilitiesGroup: Maybe<number>;
  spellsGroup: Maybe<number>;
  liturgicalChantsGroup: Maybe<number>;
  itemTemplatesGroup: Maybe<number>;
  specialAbilityGroups: List<Record<{ id: number; name: string }>>;
}

export interface WikiDispatchProps {
  setCategory1 (category: Maybe<string>): void;
  setCategory2 (category: Maybe<string>): void;
  setFilter (filterText: string): void;
  setProfessionsGroup (group: Maybe<number>): void;
  setSkillsGroup (group: Maybe<number>): void;
  setCombatTechniquesGroup (group: Maybe<number>): void;
  setSpecialAbilitiesGroup (group: Maybe<number>): void;
  setSpellsGroup (group: Maybe<number>): void;
  setLiturgicalChantsGroup (group: Maybe<number>): void;
  setItemTemplatesGroup (group: Maybe<number>): void;
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export interface WikiState {
  infoId?: string;
}

export class Wiki extends React.Component<WikiProps, WikiState> {
  state: WikiState = {};

  showInfo = (id: string) => this.setState (() => ({ infoId: id }));

  render () {
    const {
      category: maybeCategory,
      filterText,
      locale,
      setCategory1,
      setCategory2,
      setFilter,
      professionsGroup,
      skillsGroup,
      combatTechniquesGroup,
      specialAbilitiesGroup,
      spellsGroup,
      liturgicalChantsGroup,
      itemTemplatesGroup,
      setProfessionsGroup,
      setSkillsGroup,
      setCombatTechniquesGroup,
      setSpecialAbilitiesGroup,
      setSpellsGroup,
      setLiturgicalChantsGroup,
      setItemTemplatesGroup,
      specialAbilityGroups,
      ...other
    } = this.props;

    const { infoId } = this.state;


    const maybeList: Maybe<List<Entry>> =
      maybeCategory.fmap (category => other[category as keyof Lists]);

    return (
      <Page id="wiki">
        <Options>
          <TextField
            hint={translate (locale, 'options.filtertext')}
            onChange={e => setFilter (e.target.value)}
            value={filterText}
            />
          <Dropdown
            value={maybeCategory}
            onChange={setCategory1}
            hint={translate (locale, 'wiki.chooseacategory')}
            options={List.of (
              { id: Just ('races'), name: translate (locale, 'races') },
              { id: Just ('cultures'), name: translate (locale, 'cultures') },
              { id: Just ('professions'), name: translate (locale, 'professions') },
              { id: Just ('advantages'), name: translate (locale, 'advantages') },
              { id: Just ('disadvantages'), name: translate (locale, 'disadvantages') },
              { id: Just ('skills'), name: translate (locale, 'skills') },
              { id: Just ('combatTechniques'), name: translate (locale, 'combattechniques') },
              { id: Just ('specialAbilities'), name: translate (locale, 'specialabilities') },
              { id: Just ('spells'), name: translate (locale, 'spells') },
              { id: Just ('cantrips'), name: translate (locale, 'cantrips') },
              { id: Just ('liturgicalChants'), name: translate (locale, 'liturgicalChants') },
              { id: Just ('blessings'), name: translate (locale, 'blessings') },
              { id: Just ('itemTemplates'), name: translate (locale, 'items') }
            )}
            />
          {Maybe.elem ('professions') (maybeCategory) && (
            <Dropdown
              value={professionsGroup}
              onChange={setProfessionsGroup}
              options={List.of (
                {
                  id: Nothing (),
                  name: translate (locale, 'professions.options.allprofessiongroups'),
                },
                {
                  id: Just (1),
                  name: translate (locale, 'professions.options.mundaneprofessions'),
                },
                {
                  id: Just (2),
                  name: translate (locale, 'professions.options.magicalprofessions'),
                },
                {
                  id: Just (3),
                  name: translate (locale, 'professions.options.blessedprofessions'),
                }
              )}
              fullWidth
              />
          )}
          {Maybe.elem ('skills') (maybeCategory) && (
            <Dropdown
              value={skillsGroup}
              onChange={setSkillsGroup}
              options={
                sortObjects (
                  translate (locale, 'skills.view.groups')
                    .imap (index => name => Record.of ({
                      id: Just (index + 1),
                      name,
                    })),
                  locale.get ('id')
                )
                  .map<{ id: Maybe<number>; name: string }> (Record.toObject)
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allskillgroups'),
                  })
              }
              fullWidth
              />
          )}
          {Maybe.elem ('combatTechniques') (maybeCategory) && (
            <Dropdown
              value={combatTechniquesGroup}
              onChange={setCombatTechniquesGroup}
              options={
                sortObjects (
                  translate (locale, 'combattechniques.view.groups')
                    .imap (index => name => Record.of ({
                      id: Just (index + 1),
                      name,
                    })),
                  locale.get ('id')
                )
                  .map<{ id: Maybe<number>; name: string }> (Record.toObject)
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allcombattechniquegroups'),
                  })
              }
              fullWidth
              />
          )}
          {Maybe.elem ('specialAbilities') (maybeCategory) && (
            <Dropdown
              value={specialAbilitiesGroup}
              onChange={setSpecialAbilitiesGroup}
              options={
                specialAbilityGroups
                  .map<{ id: Maybe<number>; name: string }> (
                    obj => ({
                      ...obj.toObject (),
                      id: Just (obj.get ('id')),
                    })
                  )
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allspecialabilitygroups'),
                  })
              }
              fullWidth
              />
          )}
          {Maybe.elem ('spells') (maybeCategory) && (
            <Dropdown
              value={spellsGroup}
              onChange={setSpellsGroup}
              options={
                sortObjects (
                  translate (locale, 'spells.view.groups')
                    .imap (index => name => Record.of ({
                      id: Just (index + 1),
                      name,
                    })),
                  locale.get ('id')
                )
                  .map<{ id: Maybe<number>; name: string }> (Record.toObject)
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allspellgroups'),
                  })
              }
              fullWidth
              />
          )}
          {Maybe.elem ('liturgicalChants') (maybeCategory) && (
              <Dropdown
              value={liturgicalChantsGroup}
              onChange={setLiturgicalChantsGroup}
              options={
                sortObjects (
                  translate (locale, 'liturgies.view.groups')
                    .imap (index => name => Record.of ({
                      id: Just (index + 1),
                      name,
                    })),
                  locale.get ('id')
                )
                  .map<{ id: Maybe<number>; name: string }> (Record.toObject)
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allliturgicalchantgroups'),
                  })
              }
              fullWidth
              />
          )}
          {Maybe.elem ('itemTemplates') (maybeCategory) && (
              <Dropdown
              value={itemTemplatesGroup}
              onChange={setItemTemplatesGroup}
              options={
                sortObjects (
                  translate (locale, 'equipment.view.groups')
                    .imap (index => name => Record.of ({
                      id: Just (index + 1),
                      name,
                    })),
                  locale.get ('id')
                )
                  .map<{ id: Maybe<number>; name: string }> (Record.toObject)
                  .cons ({
                    id: Nothing (),
                    name: translate (locale, 'allitemtemplategroups'),
                  })
              }
              fullWidth
              />
          )}
        </Options>
        <MainContent>
          <Scroll>
            {
              Maybe.fromMaybe
                (<ListPlaceholder wikiInitial locale={locale} type="wiki" />)
                (maybeList.fmap (
                  list => list.null ()
                    ? <ListPlaceholder noResults locale={locale} type="wiki" />
                    : <WikiList list={list} showInfo={this.showInfo} currentInfoId={infoId} />
                ))
            }
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    );
  }
}
