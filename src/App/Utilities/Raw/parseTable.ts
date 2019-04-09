import xlsx from "xlsx";
import { bind, bindF, Either, fromRight_, isLeft, Left, mapM, maybeToEither } from "../../../Data/Either";
import { fmap } from "../../../Data/Functor";
import { Lens_, over, set } from "../../../Data/Lens";
import { consF, empty, foldr, List, map } from "../../../Data/List";
import { catMaybes, fromMaybe, Just, Maybe } from "../../../Data/Maybe";
import { adjust, fromList, lookupF, mapMEither, OrderedMap } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { fst, Pair, snd } from "../../../Data/Pair";
import { makeLenses, Record } from "../../../Data/Record";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { pipe } from "../pipe";
import { CsvColumnDelimiter, csvToList } from "./csvToList";
import { toAdvantage } from "./Entries/toAdvantage";
import { toAdvantageSelectOption } from "./Entries/toAdvantageSelectOption";
import { toAttribute } from "./Entries/toAttribute";
import { toBlessing } from "./Entries/toBlessing";
import { toBook } from "./Entries/toBook";
import { toCantrip } from "./Entries/toCantrip";
import { toCombatTechnique } from "./Entries/toCombatTechnique";
import { toCulture } from "./Entries/toCulture";
import { toDisadvantage } from "./Entries/toDisadvantage";
import { toDisadvantageSelectOption } from "./Entries/toDisadvantageSelectOption";
import { toExperienceLevel } from "./Entries/toExperienceLevel";
import { toItemTemplate } from "./Entries/toItemTemplate";
import { toL10n } from "./Entries/toL10n";
import { toLiturgicalChant } from "./Entries/toLiturgicalChant";
import { toLiturgicalChantExtension } from "./Entries/toLiturgicalChantExtension";
import { toProfession } from "./Entries/toProfession";
import { toProfessionVariant } from "./Entries/toProfessionVariant";
import { toRace } from "./Entries/toRace";
import { toRaceVariant } from "./Entries/toRaceVariant";
import { toSkill } from "./Entries/toSkill";
import { toSpecialAbility } from "./Entries/toSpecialAbility";
import { toSpecialAbilitySelectOption } from "./Entries/toSpecialAbilitySelectOption";
import { toSpell } from "./Entries/toSpell";
import { toSpellExtension } from "./Entries/toSpellExtension";
import { mapMNamed } from "./validateValueUtils";

export const workbookToMap =
  (wb: xlsx.WorkBook) =>
    OrderedMap.fromSet ((name: string) =>
                         xlsx.utils.sheet_to_csv (
                           wb .Sheets [name],
                           { FS: CsvColumnDelimiter, RS: "\n" }
                         ))
                       (OrderedSet.fromArray (wb.SheetNames))

const { id } = Book.AL

const listToMap =
  pipe (map ((x: Record<{ id: string }>) => Pair (id (x), x)), fromList) as
    <A extends { id: string }> (x0: List<Record<A>>) => OrderedMap<string, Record<A>>

type Convert<A> =
  (l10n: List<OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>) => Either<string, Maybe<A>>

type LookupSheet = (x0: string) => Either<string, List<OrderedMap<string, string>>>

const bindM2MapM =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A>
  (f: Convert<A>) =>
  (sheet_name: string) =>
    (bindF ((l10n: List<OrderedMap<string, string>>) =>
             fmap<List<Maybe<A>>, List<A>> (catMaybes)
                  (bindF (mapM (f (l10n)))
                         (lookup_univ (sheet_name))))
           (lookup_l10n (sheet_name)))

const bindM2MapMToMap =
  (lookup_l10n: LookupSheet) =>
  (lookup_univ: LookupSheet) =>
  <A extends { id: string }>
  (f: Convert<Record<A>>) =>
  (sheet_name: string) =>
    fmap<List<Record<A>>, OrderedMap<string, Record<A>>>
      (listToMap)
      (bindM2MapM (lookup_l10n) (lookup_univ) (f) (sheet_name))

const { select } = makeLenses (SpecialAbility)

const matchSelectOptionsToBaseRecords =
  foldr ((p: Pair<string, Record<SelectOption>>) =>
          adjust (over (select as unknown as Lens_<Activatable, Maybe<List<Record<SelectOption>>>>)
                       (pipe (
                         fromMaybe<List<Record<SelectOption>>> (empty),
                         consF (snd (p)),
                         Just
                       )))
                 (fst (p))) as
    <A extends Activatable>
    (initial: OrderedMap<string, A>) =>
    (xs: List<Pair<string, Record<SelectOption>>>) => OrderedMap<string, A>

const matchExtensionsToBaseRecord =
  (extensions: List<Record<SelectOption>>) =>
    adjust (set (select) (Just (extensions)))

export const parseTables =
  (locale: string): Either<string, Pair<L10nRecord, WikiModelRecord>> => {
    try {
      const univ_wb = xlsx.readFile (`app/Database/univ.xlsx`)
      const l10n_wb = xlsx.readFile (`app/Database/${locale}/l10n.xlsx`)

      const euniv_map = mapMEither (csvToList) (workbookToMap (univ_wb))
      const el10n_map = mapMEither (csvToList) (workbookToMap (l10n_wb))

      if (isLeft (euniv_map)) {
        return euniv_map
      }

      if (isLeft (el10n_map)) {
        return el10n_map
      }

      const lookup_univ =
        pipe (lookupF (fromRight_ (euniv_map)), maybeToEither ("Sheet not found."))

      const lookup_l10n =
        pipe (lookupF (fromRight_ (el10n_map)), maybeToEither ("Sheet not found."))

      const lookupBindM2MapM = bindM2MapM (lookup_l10n) (lookup_univ)

      const lookupBindM2MapMToMap = bindM2MapMToMap (lookup_l10n) (lookup_univ)

      return mapMNamed
        ({
          l10n: bind<string, List<OrderedMap<string, string>>, L10nRecord> (lookup_l10n ("UI"))
                                                                           (toL10n (locale)),

          books:
            fmap<List<Record<Book>>, OrderedMap<string, Record<Book>>>
              (listToMap)
              (bindF (mapM (toBook)) (lookup_l10n ("BOOKS"))),

          experienceLevels: lookupBindM2MapMToMap (toExperienceLevel) ("EXPERIENCE_LEVELS"),

          races: lookupBindM2MapMToMap (toRace) ("RACES"),

          raceVariants: lookupBindM2MapMToMap (toRaceVariant) ("RACE_VARIANTS"),

          cultures: lookupBindM2MapMToMap (toCulture) ("CULTURES"),

          professions: lookupBindM2MapMToMap (toProfession) ("PROFESSIONS"),

          professionVariants: lookupBindM2MapMToMap (toProfessionVariant) ("PROFESSION_VARIANTS"),

          attributes: lookupBindM2MapMToMap (toAttribute) ("ATTRIBUTES"),

          advantages: lookupBindM2MapMToMap (toAdvantage) ("ADVANTAGES"),

          advantageSelectOptions:
            lookupBindM2MapM (toAdvantageSelectOption) ("AdvantagesSelections"),

          disadvantages: lookupBindM2MapMToMap (toDisadvantage) ("DISADVANTAGES"),

          disadvantageSelectOptions:
            lookupBindM2MapM (toDisadvantageSelectOption) ("DisadvantagesSelections"),

          skills: lookupBindM2MapMToMap (toSkill) ("SKILLS"),

          combatTechniques: lookupBindM2MapMToMap (toCombatTechnique) ("COMBAT_TECHNIQUES"),

          spells: lookupBindM2MapMToMap (toSpell) ("SPELLS"),

          spellExtensions: lookupBindM2MapM (toSpellExtension) ("SpellX"),

          cantrips: lookupBindM2MapMToMap (toCantrip) ("CANTRIPS"),

          liturgicalChants: lookupBindM2MapMToMap (toLiturgicalChant) ("CHANTS"),

          liturgicalChantExtensions: lookupBindM2MapM (toLiturgicalChantExtension) ("ChantX"),

          blessings: lookupBindM2MapMToMap (toBlessing) ("BLESSINGS"),

          specialAbilities: lookupBindM2MapMToMap (toSpecialAbility) ("SPECIAL_ABILITIES"),

          specialAbilitySelectOptions:
            lookupBindM2MapM (toSpecialAbilitySelectOption) ("SpecialAbilitiesSelections"),

          itemTemplates: lookupBindM2MapMToMap (toItemTemplate) ("EQUIPMENT"),
        })
        (rs => {
          return Pair (
            rs.l10n,
            WikiModel ({
              books: rs.books,
              experienceLevels: rs.experienceLevels,
              races: rs.races,
              raceVariants: rs.raceVariants,
              cultures: rs.cultures,
              professions: rs.professions,
              professionVariants: rs.professionVariants,
              attributes: rs.attributes,
              advantages:
                matchSelectOptionsToBaseRecords (rs.advantages)
                                                (rs.advantageSelectOptions),
              disadvantages:
                matchSelectOptionsToBaseRecords (rs.disadvantages)
                                                (rs.disadvantageSelectOptions),
              specialAbilities:
                pipe (
                       matchSelectOptionsToBaseRecords (rs.specialAbilities),
                       matchExtensionsToBaseRecord (rs.spellExtensions) ("SA_484"),
                       matchExtensionsToBaseRecord (rs.liturgicalChantExtensions) ("SA_663")
                     )
                     (rs.specialAbilitySelectOptions),
              skills: rs.skills,
              combatTechniques: rs.combatTechniques,
              spells: rs.spells,
              cantrips: rs.cantrips,
              liturgicalChants: rs.liturgicalChants,
              blessings: rs.blessings,
              itemTemplates: rs.itemTemplates,
            })
          )
        })
    }
    catch (e) {
      return Left ("Data table file not found.")
    }
  }
