import * as path from "path";
import { bind, Either, first, fromRight_, isLeft, Left, maybeToEither } from "../../../Data/Either";
import { equals } from "../../../Data/Eq";
import { flip, ident, on, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { Lens_, over, set } from "../../../Data/Lens";
import { all, append, consF, elemF, findIndex, foldr, List, map, modifyAt, notElemF, notNull } from "../../../Data/List";
import { alt, ensure, fromMaybe, joinMaybeList, Just, mapMaybe, Maybe, maybe, maybe_, Nothing } from "../../../Data/Maybe";
import { lt } from "../../../Data/Num";
import { adjust, elems, foldrWithKey, insert, insertWith, lookupF, mapMEitherWithKey, OrderedMap } from "../../../Data/OrderedMap";
import { member, Record } from "../../../Data/Record";
import { fst, Pair, snd } from "../../../Data/Tuple";
import { curryN, uncurryN } from "../../../Data/Tuple/Curry";
import { trace, traceShowId } from "../../../Debug/Trace";
import { ReduxAction } from "../../Actions/Actions";
import { Category } from "../../Constants/Categories";
import { ProfessionId, SpecialAbilityId } from "../../Constants/Ids";
import { Advantage, AdvantageL } from "../../Models/Wiki/Advantage";
import { DisadvantageL } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { getCustomProfession } from "../../Models/Wiki/Profession";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility, SpecialAbilityL } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelL, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, Skillish } from "../../Models/Wiki/wikiTypeHelpers";
import { app_path } from "../../Selectors/envSelectors";
import { pipe, pipe_ } from "../pipe";
import { getWikiSliceGetterByCategory } from "../WikiUtils";
import { csvToList } from "./XLSX/CSVtoList";
import { AutomatedCategory } from "./XLSX/Entries/Sub/toOptionalCategoryList";
import { toAdvantage } from "./XLSX/Entries/toAdvantage";
import { toAdvantageSelectOption } from "./XLSX/Entries/toAdvantageSelectOption";
import { toAttribute } from "./XLSX/Entries/toAttribute";
import { toBlessing } from "./XLSX/Entries/toBlessing";
import { toBook } from "./XLSX/Entries/toBook";
import { toCantrip } from "./XLSX/Entries/toCantrip";
import { toCombatTechnique } from "./XLSX/Entries/toCombatTechnique";
import { toCulture } from "./XLSX/Entries/toCulture";
import { toDisadvantage } from "./XLSX/Entries/toDisadvantage";
import { toDisadvantageSelectOption } from "./XLSX/Entries/toDisadvantageSelectOption";
import { toExperienceLevel } from "./XLSX/Entries/toExperienceLevel";
import { toItemTemplate } from "./XLSX/Entries/toItemTemplate";
import { toL10n } from "./XLSX/Entries/toL10n";
import { toLiturgicalChant } from "./XLSX/Entries/toLiturgicalChant";
import { toLiturgicalChantExtension } from "./XLSX/Entries/toLiturgicalChantExtension";
import { toMagicalTradition } from "./XLSX/Entries/toMagicalTradition";
import { toProfession } from "./XLSX/Entries/toProfession";
import { toProfessionVariant } from "./XLSX/Entries/toProfessionVariant";
import { toRace } from "./XLSX/Entries/toRace";
import { toRaceVariant } from "./XLSX/Entries/toRaceVariant";
import { toSkill } from "./XLSX/Entries/toSkill";
import { toSpecialAbility } from "./XLSX/Entries/toSpecialAbility";
import { toSpecialAbilitySelectOption } from "./XLSX/Entries/toSpecialAbilitySelectOption";
import { toSpell } from "./XLSX/Entries/toSpell";
import { toSpellExtension } from "./XLSX/Entries/toSpellExtension";
import { bothOptRowsByIdAndMainIdToList, l10nRowsToMap, univRowsMatchL10nToList, univRowsMatchL10nToMap, univRowsToMap } from "./XLSX/SheetToRecords";
import { mapMNamed } from "./XLSX/Validators/Generic";
import { readXLSX } from "./XLSX/XLSXtoCSV";

const AAL = Advantage.AL
const AL = AdvantageL
const DL = DisadvantageL
const SAL = SpecialAbilityL
const SOA = SelectOption.A

const univ_path = path.join (app_path, "app", "Database", "univ.xlsx")

const wrapCsvErr =
  (file: string) =>
  (sheet: string) =>
  (err: string) =>
    `${file}.xlsx, Sheet "${sheet}": ${err}`

const wrapUnivCsvErr = wrapCsvErr ("univ")
const wrapL10nCsvErr = (locale: string) => wrapCsvErr (`${locale}/l10n`)

export type TableParseRes = Pair<L10nRecord, WikiModelRecord>

export const parseTables =
  (locale: string): ReduxAction<Promise<Either<string, TableParseRes>>> =>
  async dispatch => {
    trace ("Parsing tables...")

    const l10n_path = path.join (app_path, "app", "Database", locale, "l10n.xlsx")

    const univ = await readXLSX (univ_path)
    const l10n = await readXLSX (l10n_path)

    try {
      return await dispatch (parseWorkbooks (locale) (univ) (l10n))
    }
    catch (e) {
      return Left (e .message)
    }
  }

const parseWorkbooks =
  (locale: string) =>
  (univ_wb: OrderedMap<string, string>) =>
  (l10n_wb: OrderedMap<string, string>):
  ReduxAction<Promise<Either<string, Pair<L10nRecord, WikiModelRecord>>>> =>
  async dispatch => {
    const euniv_map =
      mapMEitherWithKey ((k: string) => pipe (csvToList, first (wrapUnivCsvErr (k))))
                        (univ_wb)

    const el10n_map =
      mapMEitherWithKey ((k: string) => pipe (csvToList, first (wrapL10nCsvErr (locale) (k))))
                        (l10n_wb)

    if (isLeft (euniv_map)) {
      return euniv_map
    }

    if (isLeft (el10n_map)) {
      return el10n_map
    }

    const lookup_univ =
      (sheet: string) =>
        pipe_ (
          sheet,
          lookupF (fromRight_ (euniv_map)),
          maybeToEither (`univ.xlsx: "${sheet}" sheet not found.`)
        )

    const lookup_l10n =
      (sheet: string) =>
        pipe_ (
          sheet,
          lookupF (fromRight_ (el10n_map)),
          maybeToEither (`l10n.xlsx: "${sheet}" sheet not found.`)
        )

    const l10n = bind (lookup_l10n ("UI")) <L10nRecord> (toL10n (locale))

    const books = dispatch (l10nRowsToMap (lookup_l10n) (toBook) ("BOOKS") (2))

    console.log ("Books parsed")

    const magicalTraditions = dispatch (univRowsToMap (lookup_univ)
                                                      (toMagicalTradition)
                                                      ("MagicalTraditions")
                                                      (3))

    console.log ("Magical traditions parsed")

    // const blessedTraditions = dispatch (univRowsToMap (lookup_univ)
    //                                                   (toMagicalTradition)
    //                                                   ("BlessedTraditions")
    //                                                   (4))

    const experienceLevels = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                              (lookup_univ)
                                                              (toExperienceLevel)
                                                              ("EXPERIENCE_LEVELS")
                                                              (5))

    console.log ("Experience levels parsed")

    const races = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                   (lookup_univ)
                                                   (toRace)
                                                   ("RACES")
                                                   (6))

    console.log ("Races parsed")

    const raceVariants = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                          (lookup_univ)
                                                          (toRaceVariant)
                                                          ("RACE_VARIANTS")
                                                          (7))

    console.log ("Race variants parsed")

    const cultures = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                      (lookup_univ)
                                                      (toCulture)
                                                      ("CULTURES")
                                                      (8))

    console.log ("Cultures parsed")

    const professions = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                         (lookup_univ)
                                                         (toProfession)
                                                         ("PROFESSIONS")
                                                         (9))

    console.log ("Professions parsed")

    const professionVariants = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                                (lookup_univ)
                                                                (toProfessionVariant)
                                                                ("PROFESSION_VARIANTS")
                                                                (10))

    console.log ("Profession variants parsed")

    const attributes = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                        (lookup_univ)
                                                        (toAttribute)
                                                        ("ATTRIBUTES")
                                                        (11))

    console.log ("Attributes parsed")

    const advantages = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                        (lookup_univ)
                                                        (toAdvantage)
                                                        ("ADVANTAGES")
                                                        (12))

    console.log ("Advantages parsed")

    const advantageSelectOptions =
      dispatch (bothOptRowsByIdAndMainIdToList (false)
                                               (lookup_l10n)
                                               (lookup_univ)
                                               (toAdvantageSelectOption)
                                               ("AdvantagesSelections")
                                               (13))

    console.log ("Advantage select options parsed")

    const disadvantages = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                           (lookup_univ)
                                                           (toDisadvantage)
                                                           ("DISADVANTAGES")
                                                           (14))

    console.log ("Disadvantages parsed")

    const disadvantageSelectOptions =
      dispatch (bothOptRowsByIdAndMainIdToList (true)
                                               (lookup_l10n)
                                               (lookup_univ)
                                               (toDisadvantageSelectOption)
                                               ("DisadvantagesSelections")
                                               (15))

    console.log ("Disadvantage select options parsed")

    traceShowId (disadvantageSelectOptions)

    const skills = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                    (lookup_univ)
                                                    (toSkill)
                                                    ("SKILLS")
                                                    (16))

    console.log ("Skills parsed")

    const combatTechniques = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                              (lookup_univ)
                                                              (toCombatTechnique)
                                                              ("COMBAT_TECHNIQUES")
                                                              (17))

    console.log ("Combat techniques parsed")

    const spells = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                    (lookup_univ)
                                                    (toSpell)
                                                    ("SPELLS")
                                                    (18))

    console.log ("SPells parsed")

    const spellExtensions = dispatch (univRowsMatchL10nToList (lookup_l10n)
                                                              (lookup_univ)
                                                              (toSpellExtension)
                                                              ("SpellX")
                                                              (19))

    console.log ("Spell extensions parsed")

    const cantrips = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                      (lookup_univ)
                                                      (toCantrip)
                                                      ("CANTRIPS")
                                                      (20))

    console.log ("Cantrips parsed")

    const liturgicalChants = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                              (lookup_univ)
                                                              (toLiturgicalChant)
                                                              ("CHANTS")
                                                              (21))

    console.log ("Liturgical chants parsed")

    const liturgicalChantExtensions = dispatch (univRowsMatchL10nToList (lookup_l10n)
                                                                        (lookup_univ)
                                                                        (toLiturgicalChantExtension)
                                                                        ("ChantX")
                                                                        (22))

    console.log ("Liturgical chant extensions parsed")

    const blessings = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                       (lookup_univ)
                                                       (toBlessing)
                                                       ("BLESSINGS")
                                                       (23))

    console.log ("Blessings parsed")

    const specialAbilities = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                              (lookup_univ)
                                                              (toSpecialAbility)
                                                              ("SPECIAL_ABILITIES")
                                                              (24))

    console.log ("Special abilities parsed")

    const specialAbilitySelectOptions =
      dispatch (bothOptRowsByIdAndMainIdToList (false)
                                               (lookup_l10n)
                                               (lookup_univ)
                                               (toSpecialAbilitySelectOption)
                                               ("SpecialAbilitiesSelections")
                                               (25))

    console.log ("Special ability select options parsed")

    const itemTemplates = dispatch (univRowsMatchL10nToMap (lookup_l10n)
                                                           (lookup_univ)
                                                           (toItemTemplate)
                                                           ("EQUIPMENT")
                                                           (26))

    console.log ("Item templates parsed")

    return mapMNamed
      ({
        l10n,
        books,
        magicalTraditions,
        experienceLevels,
        races,
        raceVariants,
        cultures,
        professions,
        professionVariants,
        attributes,
        advantages,
        advantageSelectOptions,
        disadvantages,
        disadvantageSelectOptions,
        skills,
        combatTechniques,
        spells,
        spellExtensions,
        cantrips,
        liturgicalChants,
        liturgicalChantExtensions,
        blessings,
        specialAbilities,
        specialAbilitySelectOptions,
        itemTemplates,
      })
      (rs =>
        trace ("Tables parsed")
              (Pair (
                rs.l10n,
                pipe_ (
                  WikiModel ({
                    books: rs.books,
                    experienceLevels: rs.experienceLevels,
                    races: rs.races,
                    raceVariants: rs.raceVariants,
                    cultures: rs.cultures,
                    professions: rs.professions,
                    professionVariants: rs.professionVariants,
                    attributes: rs.attributes,
                    advantages: rs.advantages,
                    disadvantages: rs.disadvantages,
                    specialAbilities: rs.specialAbilities,
                    skills: rs.skills,
                    combatTechniques: rs.combatTechniques,
                    spells: rs.spells,
                    cantrips: rs.cantrips,
                    liturgicalChants: rs.liturgicalChants,
                    blessings: rs.blessings,
                    itemTemplates: rs.itemTemplates,
                    magicalTraditions: rs.magicalTraditions,
                  }),
                  over (WikiModelL.professions)
                      (insert<string> (ProfessionId.CustomProfession)
                                      (getCustomProfession (rs.l10n))),
                  w => over (WikiModelL.advantages)
                            (pipe (
                              OrderedMap.map (over (AL.select)
                                                   (fmap (mapCatToSelectOptions (w)))),
                              matchSelectOptionsToBaseRecords (rs.advantageSelectOptions)
                            ))
                            (w),
                  w => over (WikiModelL.disadvantages)
                            (pipe (
                              OrderedMap.map (over (DL.select)
                                                   (fmap (mapCatToSelectOptions (w)))),
                              matchSelectOptionsToBaseRecords (rs.disadvantageSelectOptions)
                            ))
                            (w),
                  w => {
                    const skills_with_apps =
                      map ((x: Record<Skill>) => SelectOption ({
                                                  id: Skill.A.id (x),
                                                  name: Skill.A.name (x),
                                                  cost: Just (Skill.A.ic (x)),
                                                  applications: Just (Skill.A.applications (x)),
                                                  applicationInput: Skill.A.applicationsInput (x),
                                                  src: Skill.A.src (x),
                                                  errata: Nothing,
                                                }))
                          (elems (WikiModel.A.skills (w)))

                    return over (WikiModelL.specialAbilities)
                                (pipe (
                                  OrderedMap.map (x => {
                                    switch (SpecialAbility.A.id (x)) {
                                      case SpecialAbilityId.SkillSpecialization: {
                                        return set (SAL.select)
                                                   (Just (skills_with_apps))
                                                   (x)
                                      }

                                      case SpecialAbilityId.TraditionGuildMages: {
                                        return over (SAL.select)
                                                    (fmap (mapCatToSelectOptionsPred
                                                            (noGuildMageSkill)
                                                            (w)))
                                                    (x)
                                      }

                                      default:
                                        return over (SAL.select)
                                                    (fmap (mapCatToSelectOptions (w)))
                                                    (x)
                                    }
                                  }),
                                  matchSelectOptionsToBaseRecords (rs.specialAbilitySelectOptions),
                                  matchExtensionsToBaseRecord (rs.spellExtensions)
                                                              (SpecialAbilityId.SpellExtensions),
                                  matchExtensionsToBaseRecord (rs.liturgicalChantExtensions)
                                                              (SpecialAbilityId.ChantExtensions)
                                ))
                                (w)
                  }
                )
              )))
  }

const mergeSelectOptions: (old_entry: Activatable) =>
                          (custom_sel: Record<SelectOption>) =>
                          (sel_from_wiki_entry: Record<SelectOption>) => Record<SelectOption> =
  old_entry => custom_sel => sel_from_wiki_entry =>
    SelectOption ({
      id: SOA.id (sel_from_wiki_entry),
      name: SOA.name (sel_from_wiki_entry),
      cost: alt (SOA.cost (sel_from_wiki_entry)) (SOA.cost (custom_sel)),
      src: fromMaybe (AAL.src (old_entry)) (ensure (notNull) (SOA.src (custom_sel))),
      errata: SOA.errata (custom_sel),
      prerequisites: SOA.prerequisites (custom_sel),
      description: alt (SOA.description (sel_from_wiki_entry))
                       (SOA.description (custom_sel)),
      isSecret: alt (SOA.isSecret (sel_from_wiki_entry))
                    (SOA.isSecret (custom_sel)),
      languages: alt (SOA.languages (sel_from_wiki_entry))
                     (SOA.languages (custom_sel)),
      continent: alt (SOA.continent (sel_from_wiki_entry))
                     (SOA.continent (custom_sel)),
      isExtinct: alt (SOA.isExtinct (sel_from_wiki_entry))
                     (SOA.isExtinct (custom_sel)),
      specializations: alt (SOA.specializations (sel_from_wiki_entry))
                           (SOA.specializations (custom_sel)),
      specializationInput: alt (SOA.specializationInput (sel_from_wiki_entry))
                               (SOA.specializationInput (custom_sel)),
      gr: alt (SOA.gr (sel_from_wiki_entry))
              (SOA.gr (custom_sel)),
      level: alt (SOA.level (sel_from_wiki_entry))
                 (SOA.level (custom_sel)),
      target: alt (SOA.target (sel_from_wiki_entry))
                  (SOA.target (custom_sel)),
      applications: alt (SOA.applications (sel_from_wiki_entry))
                        (SOA.applications (custom_sel)),
      applicationInput: alt (SOA.applicationInput (sel_from_wiki_entry))
                            (SOA.applicationInput (custom_sel)),
    })

const addSelectOptionToList: (old_entry: Activatable) =>
                             (new_sel: Record<SelectOption>) => ident<List<Record<SelectOption>>> =
  entry => sel => sels => maybe_ (() => consF (sel))
                                 ((i: number) => modifyAt (i) (mergeSelectOptions (entry) (sel)))
                                 (findIndex (pipe (SOA.id, equals (SOA.id (sel)))) (sels))
                                 (sels)

const matchSelectOptionsToBaseRecords =
  flip (foldr ((p: Pair<string, Record<SelectOption>>) =>
                 adjust ((x: Activatable) =>
                          over (SAL.select as Lens_<Activatable, Maybe<List<Record<SelectOption>>>>)
                               (pipe (
                                 fromMaybe<List<Record<SelectOption>>> (List ()),
                                 addSelectOptionToList (x) (snd (p)),
                                 Just
                               ))
                               (x))
                        (fst (p)))) as
    (xs: List<Pair<string, Record<SelectOption>>>) =>
    <A extends Activatable>
    (initial: OrderedMap<string, A>) => OrderedMap<string, A>

const matchExtensionsToBaseRecord: (extensions: List<Record<SelectOption>>) =>
                                   (key: string) =>
                                   (mp: OrderedMap<string, Record<SpecialAbility>>) =>
                                   OrderedMap<string, Record<SpecialAbility>> =
  (extensions: List<Record<SelectOption>>) =>
    adjust (set (SAL.select) (Just (extensions)))

type CategoryGroups = Maybe<List<number>>
type CategoryMap = OrderedMap<AutomatedCategory, CategoryGroups>

const mapCatToSelectOptions =
  (wiki: WikiModelRecord) =>
    pipe (
      selectOptionsToCategories,
      foldrWithKey ((cat: AutomatedCategory) => (mgrs: CategoryGroups) =>
                     pipe_ (
                       wiki,
                       getWikiSliceGetterByCategory (cat) as
                         (w: WikiModelRecord) => OrderedMap<string, Skillish>,
                       maybe (addAllForCategory (cat))
                             (addGroupsOfCategory)
                             (mgrs)
                     ))
                   (List ())
    )


const selectOptionsToCategories =
  foldr ((x: Record<SelectOption>) =>
          maybe <ident<CategoryMap>>
                (insert (SOA.id (x) as AutomatedCategory)
                        <CategoryGroups> (Nothing))
                ((gr: number) => insertWith <CategoryGroups>
                                            (curryN (pipe (
                                              uncurryN (on (append as append<number>)
                                                           (joinMaybeList)),
                                              ensure (notNull)
                                            )))
                                            (SOA.id (x) as AutomatedCategory)
                                            (Just (List (gr))))
                (SOA.gr (x)))
        (OrderedMap.empty)

const addGroupsOfCategory: (grs: List<number>) =>
                           (mp: OrderedMap<string, Skillish>) => ident<List<Record<SelectOption>>> =
  grs => pipe (
    elems,
    mapMaybe (pipe (
      ensure<Skillish> (pipe (Skill.AL.gr, elemF (grs))),
      fmap (skillishToSelectOption)
    )),
    append
  )

const addAllForCategory: (category: AutomatedCategory) =>
                         (mp: OrderedMap<string, Skillish>) => ident<List<Record<SelectOption>>> =
  cat => pipe (
    elems,
    cat === Category.SPELLS
      ? mapMaybe (pipe (
          ensure<Skillish> (pipe (Skill.AL.gr, lt (3))),
          fmap (skillishToSelectOption)
        ))
      : map (skillishToSelectOption),
    append
  )

const skillishToSelectOption =
  (r: Skillish) =>
    SelectOption ({
      id: Skill.AL.id (r),
      name: Skill.AL.name (r),
      cost: member ("ic") (r) ? Just (Skill.AL.ic (r)) : Nothing,
      src: Skill.AL.src (r),
      errata: Nothing,
    })

const mapCatToSelectOptionsPred =
  (pred: (x: Skillish) => boolean) =>
  (wiki: WikiModelRecord) =>
    foldr (pipe (
              SelectOption.A.id as (x: Record<SelectOption>) => Category,
              getWikiSliceGetterByCategory as
                (c: Category) =>
                  (x: Record<WikiModel>) => OrderedMap<string, Skillish>,
              thrush (wiki),
              elems,
              mapMaybe (pipe (
                ensure (pred),
                fmap (r => SelectOption ({
                  id: Skill.AL.id (r),
                  name: Skill.AL.name (r),
                  cost: member ("ic") (r) ? Just (Skill.AL.ic (r)) : Nothing,
                  src: Skill.AL.src (r),
                  errata: Nothing,
                }))
              )),
              append
            ))
            (List ())

const noGuildMageSkill = (x: Skillish) => Spell.is (x)
                                          && all (notElemF (List (1, 2)))
                                                 (Spell.A.tradition (x))
                                          && elemF (List (1, 2)) (Spell.A.gr (x))
