import { ReceiveInitialDataAction } from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Categories } from '../constants/Categories';
import * as Raw from '../types/rawdata';
import * as Wiki from '../types/wiki';
import { Just, List, Maybe, OrderedMap, Record, StringKeyObject } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import * as InitWikiUtils from '../utils/InitWikiUtils';
import { getWikiStateKeyByCategory } from '../utils/WikiUtils';

type Action = ReceiveInitialDataAction;

type Data =
  Wiki.Book |
  Wiki.ExperienceLevel |
  Wiki.Race |
  Wiki.RaceVariant |
  Wiki.Culture |
  Wiki.Profession |
  Wiki.ProfessionVariant |
  Wiki.Attribute |
  Wiki.Advantage |
  Wiki.Disadvantage |
  Wiki.SpecialAbility |
  Wiki.Skill |
  Wiki.CombatTechnique |
  Wiki.Spell |
  Wiki.Cantrip |
  Wiki.LiturgicalChant |
  Wiki.Blessing |
  Wiki.ItemTemplate;

type RawData =
  Raw.RawAdvantage |
  Raw.RawAttribute |
  Raw.RawBlessing |
  Raw.RawCantrip |
  Raw.RawCombatTechnique |
  Raw.RawCulture |
  Raw.RawDisadvantage |
  Raw.RawLiturgy |
  Raw.RawProfession |
  Raw.RawProfessionVariant |
  Raw.RawRace |
  Raw.RawRaceVariant |
  Raw.RawSpecialAbility |
  Raw.RawSpell |
  Raw.RawSkill;

type RawLocales =
  Raw.RawAdvantageLocale |
  Raw.RawAttributeLocale |
  Raw.RawBlessingLocale |
  Raw.RawCantripLocale |
  Raw.RawCombatTechniqueLocale |
  Raw.RawDisadvantageLocale |
  Raw.RawLiturgyLocale |
  Raw.RawProfessionLocale |
  Raw.RawProfessionVariantLocale |
  Raw.RawRaceLocale |
  Raw.RawRaceVariantLocale |
  Raw.RawCultureLocale |
  Raw.RawSpecialAbilityLocale |
  Raw.RawSpellLocale |
  Raw.RawSkillLocale |
  Raw.RawItemLocale;

export function wikiReducer(
  state: Record<Wiki.WikiAll> = Record.of<Wiki.WikiAll>({
    books: OrderedMap.empty(),
    experienceLevels: OrderedMap.empty(),
    races: OrderedMap.empty(),
    raceVariants: OrderedMap.empty(),
    cultures: OrderedMap.empty(),
    professions: OrderedMap.empty(),
    professionVariants: OrderedMap.empty(),
    attributes: OrderedMap.empty(),
    advantages: OrderedMap.empty(),
    disadvantages: OrderedMap.empty(),
    specialAbilities: OrderedMap.empty(),
    skills: OrderedMap.empty(),
    combatTechniques: OrderedMap.empty(),
    spells: OrderedMap.empty(),
    cantrips: OrderedMap.empty(),
    liturgicalChants: OrderedMap.empty(),
    blessings: OrderedMap.empty(),
    itemTemplates: OrderedMap.empty(),
  }),
  action: Action
): Record<Wiki.WikiAll> {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const { config, defaultLocale, locales, tables } = action.payload;

      const localeId = config && config.locale || defaultLocale;

      const rawLocale = locales[localeId];

      const { books, ui } = rawLocale;

      const {
        attributes,
        advantages,
        blessings,
        cantrips,
        cultures,
        disadvantages,
        el,
        talents,
        combattech,
        professions,
        professionvariants,
        races,
        racevariants,
        spells,
        liturgies,
        specialabilities,
        items
      } = tables;

      const iterate = <R extends RawData, T extends Data, L extends RawLocales>(
        source: { [id: string]: R },
        initFn: (raw: R, locale: StringKeyObject<L>) => Maybe<Record<T>>,
        locale: StringKeyObject<L>
      ): OrderedMap<string, Record<T>> =>
        Object.entries(source).reduce(
          (map, [id, obj]) => {
            const result = initFn(obj, locale);

            if (Maybe.isJust(result)) {
              return map.insert(id, Maybe.fromJust(result));
            }

            return map;
          },
          OrderedMap.empty<string, Record<T>>()
        );

      const initialState: Record<Wiki.WikiAll> = Record.of<Wiki.WikiAll>({
        books: OrderedMap.of(
          Object.entries(books)
            .map<[string, Record<Raw.RawBook>]>(
              ([key, value]) => [key, Record.of<Raw.RawBook>(value)]
            )
        ),
        experienceLevels: iterate(
          el,
          InitWikiUtils.initExperienceLevel,
          rawLocale.el
        ),
        races: iterate(
          races,
          InitWikiUtils.initRace,
          rawLocale.races
        ),
        raceVariants: iterate(
          racevariants,
          InitWikiUtils.initRaceVariant,
          rawLocale.racevariants
        ),
        cultures: iterate(
          cultures,
          InitWikiUtils.initCulture,
          rawLocale.cultures
        ),
        professions: iterate(
          professions,
          InitWikiUtils.initProfession,
          rawLocale.professions
        )
          .alter(
            () => InitWikiUtils.initProfession(
              {
                ap: 0,
                apOfActivatables: 0,
                chants: [],
                combattech: [],
                id: 'P_0',
                pre_req: [],
                req: [],
                sa: [],
                sel: [],
                blessings: [],
                spells: [],
                talents: [],
                typ_adv: [],
                typ_dadv: [],
                untyp_adv: [],
                untyp_dadv: [],
                vars: [],
                gr: 0,
                sgr: 0,
                src: []
              },
              {
                P_0: {
                  id: 'P_0',
                  name: translate(Record.of(ui), 'professions.ownprofession'),
                  req: [],
                  src: []
                }
              }
            ),
            'P_0'
          ),
        professionVariants: iterate(
          professionvariants,
          InitWikiUtils.initProfessionVariant,
          rawLocale.professionvariants
        ),
        attributes: iterate(
          attributes,
          InitWikiUtils.initAttribute,
          rawLocale.attributes
        ),
        advantages: iterate(
          advantages,
          InitWikiUtils.initAdvantage,
          rawLocale.advantages
        ),
        disadvantages: iterate(
          disadvantages,
          InitWikiUtils.initDisadvantage,
          rawLocale.disadvantages
        ),
        specialAbilities: iterate(
          specialabilities,
          InitWikiUtils.initSpecialAbility,
          rawLocale.specialabilities
        ),
        skills: iterate(
          talents,
          InitWikiUtils.initSkill,
          rawLocale.talents
        ),
        combatTechniques: iterate(
          combattech,
          InitWikiUtils.initCombatTechnique,
          rawLocale.combattech
        ),
        spells: iterate(
          spells,
          InitWikiUtils.initSpell,
          rawLocale.spells
        ),
        cantrips: iterate(
          cantrips,
          InitWikiUtils.initCantrip,
          rawLocale.cantrips
        ),
        liturgicalChants: iterate(
          liturgies,
          InitWikiUtils.initLiturgicalChant,
          rawLocale.liturgies
        ),
        blessings: iterate(
          blessings,
          InitWikiUtils.initBlessing,
          rawLocale.blessings
        ),
        itemTemplates: iterate(
          items,
          InitWikiUtils.initItemTemplate,
          rawLocale.items
        ),
      });

      const getSelectionCategories = (source: List<Record<Wiki.SelectionObject>>) =>
        source
          .foldl<List<Wiki.SkillishEntry>>(
            arr => e => {
              const key = getWikiStateKeyByCategory(e.get('id') as Categories);

              if (key) {
                return arr.concat(initialState.get(key).elems() as List<Wiki.SkillishEntry>);
              }

              return arr;
            },
            List.of()
          )
          .map(
            r => Record.of<Wiki.SelectionObject>({
              id: r.get('id'),
              name: r.get('name'),
              cost: r.get('ic')
            })
          );

      const knowledgeSkills = initialState.get('skills')
        .foldl<(List<Record<Wiki.SelectionObject>>)>(
          acc => skill => {
            if (skill.get('gr') === 4) {
              return acc.append(
                Record.of<Wiki.SelectionObject>({
                  id: skill.get('id'),
                  name: skill.get('name'),
                  cost: skill.get('ic')
                })
              );
            }

            return acc;
          },
          List.of()
        );

      return initialState
        .modify(
          slice => slice.map(
            obj => {
              if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47'].includes(obj.get('id'))) {
                return obj.modify(getSelectionCategories, 'select');
              }

              return obj;
            }
          ),
          'advantages'
        )
        .modify(
          slice => slice.map(
            obj => {
              if (obj.get('id') === 'DISADV_48') {
                return obj.modify(getSelectionCategories, 'select');
              }

              return obj;
            }
          ),
          'disadvantages'
        )
        .modify(
          slice => slice.map(
            obj => {
              if (['SA_231', 'SA_250', 'SA_258', 'SA_562', 'SA_569'].includes(obj.get('id'))) {
                return obj.modify(getSelectionCategories, 'select');
              }
              else if (['SA_472', 'SA_473', 'SA_531', 'SA_533'].includes(obj.get('id'))) {
                return obj.insert('select', knowledgeSkills);
              }
              else if (obj.get('id') === 'SA_60') {
                return obj.modify(
                  Maybe.mapMaybe<Record<Wiki.SelectionObject>, Record<Wiki.SelectionObject>>(
                    e => initialState.get('combatTechniques')
                      .lookup(e.get('name'))
                      .map(combatTechnique => e.insert('name', combatTechnique.get('name')))
                  ),
                  'select'
                );
              }
              else if (obj.get('id') === 'SA_9') {
                return obj.insert(
                  'select',
                  initialState.get('skills').elems()
                    .map(
                      skill => {
                        const { id, name, ic, applications, applicationsInput } = skill.toObject();

                        return Record.of<Wiki.SelectionObject>({
                          id,
                          name,
                          cost: ic,
                          applications,
                          applicationsInput,
                        });
                      }
                    )
                );
              }

              return obj;
            }
          ),
          'specialAbilities'
        );
    }

    default:
      return state;
  }
}
