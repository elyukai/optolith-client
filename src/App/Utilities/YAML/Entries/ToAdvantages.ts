/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, fromRight_, isLeft, Right, second } from "../../../../Data/Either"
import { flip, ident } from "../../../../Data/Function"
import { foldr, fromArray, notNull } from "../../../../Data/List"
import { ensure, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Advantage } from "../../../Models/Wiki/Advantage"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { Spell } from "../../../Models/Wiki/Spell"
import { pipe, pipe_ } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { AdvantageL10n } from "../Schema/Advantages/Advantages.l10n"
import { AdvantageUniv } from "../Schema/Advantages/Advantages.univ"
import { PrerequisiteIndexReplacement } from "../Schema/SpecialAbilities/SpecialAbilities.l10n"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown } from "./ToMarkdown"
import { toLevelPrerequisites } from "./ToPrerequisites"
import { mergeSOs, resolveSOCats } from "./ToSelectOptions"
import { toSourceRefs } from "./ToSourceRefs"


type PrerequisitesIndex = OrderedMap<number, false | string>


const getPrerequisitesIndex : (univ : AdvantageUniv)
                            => (l10n : AdvantageL10n)
                            => PrerequisitesIndex
                            = univ => l10n => pipe_ (
                                OrderedMap.empty as OrderedMap<number, false | string>,
                                univ.prerequisitesIndex === undefined
                                ? ident
                                : flip (foldr ((k : number) => insert (k) <false | string> (false)))
                                       (fromArray (univ.prerequisitesIndex)),
                                l10n.prerequisitesIndex === undefined
                                ? ident
                                : flip (foldr ((x : PrerequisiteIndexReplacement) =>
                                                 insert (x.index) <false | string> (x.replacement)))
                                       (fromArray (l10n.prerequisitesIndex))
                              )


const toAdv : (blessings : OrderedMap<string, Record<Blessing>>)
            => (cantrips : OrderedMap<string, Record<Cantrip>>)
            => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
            => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
            => (skills : OrderedMap<string, Record<Skill>>)
            => (spells : OrderedMap<string, Record<Spell>>)
            => YamlPairConverterE<AdvantageUniv, AdvantageL10n, string, Advantage>
            = blessings =>
              cantrips =>
              combatTechniques =>
              liturgicalChants =>
              skills =>
              spells =>
              ([ univ, l10n ]) => {
                const eselectOptions = pipe_ (
                                         univ.selectOptionCategories,
                                         resolveSOCats (blessings)
                                                       (cantrips)
                                                       (combatTechniques)
                                                       (liturgicalChants)
                                                       (skills)
                                                       (spells),
                                         mergeSOs (l10n.selectOptions)
                                                  (univ.selectOptions),
                                         second (ensure (notNull))
                                       )

                if (isLeft (eselectOptions)) {
                  return eselectOptions
                }

                const selectOptions = fromRight_ (eselectOptions)

                const prerequisitesIndex = getPrerequisitesIndex (univ) (l10n)

                return Right<[string, Record<Advantage>]> ([
                  univ.id,
                  Advantage ({
                    id: univ.id,
                    name: l10n.name,
                    range: Maybe (l10n.range),
                    actions: Nothing,
                    cost: typeof univ.cost === "object"
                          ? Just (fromArray (univ.cost))
                          : Maybe (univ.cost),
                    input: Maybe (l10n.input),
                    max: Maybe (univ.max),
                    prerequisites: toLevelPrerequisites (univ),
                    prerequisitesText: Maybe (l10n.prerequisites),
                    prerequisitesTextIndex: prerequisitesIndex,
                    prerequisitesTextStart: Maybe (l10n.prerequisitesStart),
                    prerequisitesTextEnd: Maybe (l10n.prerequisitesEnd),
                    tiers: Maybe (univ.levels),
                    select: selectOptions,
                    gr: univ.gr,
                    rules: toMarkdown (l10n.rules),
                    apValue: Maybe (l10n.apValue),
                    apValueAppend: Maybe (l10n.apValueAppend),
                    src: toSourceRefs (l10n.src),
                    errata: toErrata (l10n.errata),
                    category: Nothing,
                  }),
                ])
              }


export const toAdvantages : (blessings : OrderedMap<string, Record<Blessing>>)
                          => (cantrips : OrderedMap<string, Record<Cantrip>>)
                          => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
                          => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
                          => (skills : OrderedMap<string, Record<Skill>>)
                          => (spells : OrderedMap<string, Record<Spell>>)
                          => YamlFileConverter<string, Record<Advantage>>
                          = blessings =>
                            cantrips =>
                            combatTechniques =>
                            liturgicalChants =>
                            skills =>
                            spells => pipe (
                              (yaml_mp : YamlNameMap) => zipBy ("id")
                                                               (yaml_mp.AdvantagesUniv)
                                                               (yaml_mp.AdvantagesL10n),
                              bindF (pipe (
                                mapM (toAdv (blessings)
                                            (cantrips)
                                            (combatTechniques)
                                            (liturgicalChants)
                                            (skills)
                                            (spells)),
                                bindF (toMapIntegrity),
                              )),
                              second (fromMap)
                            )
