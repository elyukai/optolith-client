import { List } from "../../Data/List";
import { Maybe } from "../../Data/Maybe";
import { OrderedMap } from "../../Data/OrderedMap";
import { Record, StringKeyObject } from "../../Data/Record";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { Categories } from "../Constants/Categories";
import { Advantage } from "../Models/Wiki/Advantage";
import { Attribute } from "../Models/Wiki/Attribute";
import { Blessing } from "../Models/Wiki/Blessing";
import { Book } from "../Models/Wiki/Book";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Profession } from "../Models/Wiki/Profession";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race } from "../Models/Wiki/Race";
import { RaceVariant } from "../Models/Wiki/RaceVariant";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { RawAdvantage, RawAdvantageLocale, RawAttribute, RawAttributeLocale, RawBlessing, RawBlessingLocale, RawCantrip, RawCantripLocale, RawCombatTechnique, RawCombatTechniqueLocale, RawCulture, RawCultureLocale, RawDisadvantage, RawDisadvantageLocale, RawItemLocale, RawLiturgy, RawLiturgyLocale, RawProfession, RawProfessionLocale, RawProfessionVariant, RawProfessionVariantLocale, RawRace, RawRaceLocale, RawRaceVariant, RawRaceVariantLocale, RawSkill, RawSkillLocale, RawSpecialAbility, RawSpecialAbilityLocale, RawSpell, RawSpellLocale } from "../Utils/Raw/RawData";

type Action = ReceiveInitialDataAction

type Data = Book
          | ExperienceLevel
          | Race
          | RaceVariant
          | Culture
          | Profession
          | ProfessionVariant
          | Attribute
          | Advantage
          | Disadvantage
          | SpecialAbility
          | Skill
          | CombatTechnique
          | Spell
          | Cantrip
          | LiturgicalChant
          | Blessing
          | ItemTemplate

type RawData = RawAdvantage
             | RawAttribute
             | RawBlessing
             | RawCantrip
             | RawCombatTechnique
             | RawCulture
             | RawDisadvantage
             | RawLiturgy
             | RawProfession
             | RawProfessionVariant
             | RawRace
             | RawRaceVariant
             | RawSpecialAbility
             | RawSpell
             | RawSkill

type RawLocales = RawAdvantageLocale
                | RawAttributeLocale
                | RawBlessingLocale
                | RawCantripLocale
                | RawCombatTechniqueLocale
                | RawDisadvantageLocale
                | RawLiturgyLocale
                | RawProfessionLocale
                | RawProfessionVariantLocale
                | RawRaceLocale
                | RawRaceVariantLocale
                | RawCultureLocale
                | RawSpecialAbilityLocale
                | RawSpellLocale
                | RawSkillLocale
                | RawItemLocale

export const wikiReducer =
  (action: Action) =>
  (state: WikiModelRecord = WikiModel.default): WikiModelRecord => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const { config, defaultLocale, locales, tables } = action.payload

        const localeId = config && config.locale || defaultLocale

        const rawLocale = locales[localeId]

        const { books, ui } = rawLocale

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
          items,
        } = tables

        const iterate = <R extends RawData, T extends Data, L extends RawLocales>(
          source: { [id: string]: R },
          initFn: (raw: R, locale: StringKeyObject<L>) => Maybe<Record<T>>,
          locale: StringKeyObject<L>
        ): OrderedMap<string, Record<T>> =>
          Object.entries (source).reduce (
            (map, [id, obj]) => {
              const result = initFn (obj, locale)

              if (Maybe.isJust (result)) {
                return map.insert (id) (Maybe.fromJust (result))
              }

              return map
            },
            OrderedMap.empty<string, Record<T>> ()
          )

        const initialState: Record<Wiki.WikiAll> = Record.of<Wiki.WikiAll> ({
          books: OrderedMap.of (
            Object.entries (books)
              .map<[string, Record<Raw.RawBook>]> (
                ([key, value]) => [key, Record.of<Raw.RawBook> (value)]
              )
          ),
          experienceLevels: iterate (
            el,
            InitWikiUtils.initExperienceLevel,
            rawLocale.el
          ),
          races: iterate (
            races,
            InitWikiUtils.initRace,
            rawLocale.races
          ),
          raceVariants: iterate (
            racevariants,
            InitWikiUtils.initRaceVariant,
            rawLocale.racevariants
          ),
          cultures: iterate (
            cultures,
            InitWikiUtils.initCulture,
            rawLocale.cultures
          ),
          professions: iterate (
            professions,
            InitWikiUtils.initProfession,
            rawLocale.professions
          )
            .alter (
              () => InitWikiUtils.initProfession (
                {
                  ap: 0,
                  apOfActivatables: 0,
                  chants: [],
                  combattech: [],
                  id: "P_0",
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
                  src: [],
                },
                {
                  P_0: {
                    id: "P_0",
                    name: ui["professions.ownprofession"],
                    req: [],
                    src: [],
                  },
                }
              )
            ) ("P_0"),
          professionVariants: iterate (
            professionvariants,
            InitWikiUtils.initProfessionVariant,
            rawLocale.professionvariants
          ),
          attributes: iterate (
            attributes,
            InitWikiUtils.initAttribute,
            rawLocale.attributes
          ),
          advantages: iterate (
            advantages,
            InitWikiUtils.initAdvantage,
            rawLocale.advantages
          ),
          disadvantages: iterate (
            disadvantages,
            InitWikiUtils.initDisadvantage,
            rawLocale.disadvantages
          ),
          specialAbilities: iterate (
            specialabilities,
            InitWikiUtils.initSpecialAbility,
            rawLocale.specialabilities
          ),
          skills: iterate (
            talents,
            InitWikiUtils.initSkill,
            rawLocale.talents
          ),
          combatTechniques: iterate (
            combattech,
            InitWikiUtils.initCombatTechnique,
            rawLocale.combattech
          ),
          spells: iterate (
            spells,
            InitWikiUtils.initSpell,
            rawLocale.spells
          ),
          cantrips: iterate (
            cantrips,
            InitWikiUtils.initCantrip,
            rawLocale.cantrips
          ),
          liturgicalChants: iterate (
            liturgies,
            InitWikiUtils.initLiturgicalChant,
            rawLocale.liturgies
          ),
          blessings: iterate (
            blessings,
            InitWikiUtils.initBlessing,
            rawLocale.blessings
          ),
          itemTemplates: iterate (
            items,
            InitWikiUtils.initItemTemplate,
            rawLocale.items
          ),
        })

        const getSelectionCategories = (source: List<Record<Wiki.SelectionObject>>) =>
          source
            .foldl<List<Wiki.SkillishEntry>> (
              arr => e => {
                const key = getWikiStateKeyByCategory (e.get ("id") as Categories)

                if (key) {
                  return arr.mappend (initialState.get (key).elems () as List<Wiki.SkillishEntry>)
                }

                return arr
              }
            ) (List.of ())
            .map (
              r => Record.of<Wiki.SelectionObject> ({
                id: r.get ("id"),
                name: r.get ("name"),
                cost: r.get ("ic"),
              })
            )

        const knowledgeSkills = initialState.get ("skills")
          .foldl<(List<Record<Wiki.SelectionObject>>)> (
            acc => skill => {
              if (skill.get ("gr") === 4) {
                return acc.append (
                  Record.of<Wiki.SelectionObject> ({
                    id: skill.get ("id"),
                    name: skill.get ("name"),
                    cost: skill.get ("ic"),
                  })
                )
              }

              return acc
            }
          ) (List.of ())

        return initialState
          .modify<"advantages"> (
            slice => slice.map (
              obj => {
                if (["ADV_4", "ADV_16", "ADV_17", "ADV_47"].includes (obj.get ("id"))) {
                  return obj.modify<"select"> (getSelectionCategories) ("select")
                }

                return obj
              }
            )
          ) ("advantages")
          .modify<"disadvantages"> (
            slice => slice.map (
              obj => {
                if (obj.get ("id") === "DISADV_48") {
                  return obj.modify<"select"> (getSelectionCategories) ("select")
                }

                return obj
              }
            )
          ) ("disadvantages")
          .modify<"specialAbilities"> (
            slice => slice.map (
              obj => {
                if (["SA_231", "SA_250", "SA_258", "SA_562", "SA_569"].includes (obj.get ("id"))) {
                  return obj.modify<"select"> (getSelectionCategories) ("select")
                }
                else if (["SA_472", "SA_473", "SA_531", "SA_533"].includes (obj.get ("id"))) {
                  return obj.insert ("select") (knowledgeSkills)
                }
                else if (obj.get ("id") === "SA_60") {
                  return obj.modify<"select"> (
                    Maybe.mapMaybe<Record<Wiki.SelectionObject>, Record<Wiki.SelectionObject>> (
                      e => initialState.get ("combatTechniques")
                        .lookup (e.get ("name"))
                        .fmap (combatTechnique => e.insert ("name") (combatTechnique.get ("name")))
                    )
                  ) ("select")
                }
                else if (obj.get ("id") === "SA_9") {
                  return obj.insert ("select") (
                    initialState.get ("skills").elems ()
                      .map (
                        skill => {
                          const { id, name, ic, applications, applicationsInput } = skill.toObject ()

                          return Record.of<Wiki.SelectionObject> ({
                            id,
                            name,
                            cost: ic,
                            applications,
                            applicationsInput,
                          })
                        }
                      )
                  )
                }

                return obj
              }
            )
          ) ("specialAbilities")
      }

      default:
        return state
    }
  }
