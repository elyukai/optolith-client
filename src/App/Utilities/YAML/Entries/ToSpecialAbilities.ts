/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, fromRight_, isLeft, Right, second } from "../../../../Data/Either"
import { flip, ident } from "../../../../Data/Function"
import { foldr, fromArray, notNull } from "../../../../Data/List"
import { ensure, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { elems, fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { SpecialAbilityId } from "../../../Constants/Ids"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { SpecialAbility, SpecialAbilityCombatTechniques } from "../../../Models/Wiki/SpecialAbility"
import { Spell } from "../../../Models/Wiki/Spell"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { pipe, pipe_ } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { PrerequisiteIndexReplacement, SpecialAbilityL10n } from "../Schema/SpecialAbilities/SpecialAbilities.l10n"
import { SpecialAbilityUniv } from "../Schema/SpecialAbilities/SpecialAbilities.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdownM } from "./ToMarkdown"
import { toLevelPrerequisites } from "./ToPrerequisites"
import { mergeSOs, resolveSOCats } from "./ToSelectOptions"
import { toSourceRefs } from "./ToSourceRefs"


type PrerequisitesIndex = OrderedMap<number, false | string>


const getPrerequisitesIndex : (univ : SpecialAbilityUniv)
                            => (l10n : SpecialAbilityL10n)
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


const toSA : (blessings : OrderedMap<string, Record<Blessing>>)
           => (cantrips : OrderedMap<string, Record<Cantrip>>)
           => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
           => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
           => (skills : OrderedMap<string, Record<Skill>>)
           => (spells : OrderedMap<string, Record<Spell>>)
           => (spell_enhancements : OrderedMap<number, Record<SelectOption>>)
           => (lc_enhancements : OrderedMap<number, Record<SelectOption>>)
           => YamlPairConverterE<SpecialAbilityUniv, SpecialAbilityL10n, string, SpecialAbility>
           = blessings =>
             cantrips =>
             combatTechniques =>
             liturgicalChants =>
             skills =>
             spells =>
             spell_enhancements =>
             lc_enhancements =>
             ([ univ, l10n ]) => {
               const eselectOptions = univ.id === SpecialAbilityId.SpellEnhancement
                                      ? Right (ensure (notNull) (elems (spell_enhancements)))
                                      : univ.id === SpecialAbilityId.ChantEnhancement
                                      ? Right (ensure (notNull) (elems (lc_enhancements)))
                                      : pipe_ (
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

               return Right<[string, Record<SpecialAbility>]> ([
                 univ.id,
                 SpecialAbility ({
                   id: univ.id,
                   name: l10n.name,
                   nameInWiki: Maybe (l10n.nameInWiki),
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
                   extended: typeof univ.extended === "object"
                             ? Just (fromArray (univ.extended))
                             : Nothing,
                   subgr: Maybe (univ.subgr),
                   combatTechniques: typeof univ.combatTechniques === "object"
                                     ? Just (SpecialAbilityCombatTechniques ({
                                               explicitIds: fromArray (univ.combatTechniques),
                                               group: Nothing,
                                               customText: Maybe (l10n.combatTechniques),
                                             }))
                                     : typeof univ.combatTechniques === "string"
                                     ? Just (SpecialAbilityCombatTechniques ({
                                               explicitIds: Nothing,
                                               group: univ.combatTechniques,
                                               customText: Maybe (l10n.combatTechniques),
                                             }))
                                     : typeof l10n.combatTechniques === "string"
                                     ? Just (SpecialAbilityCombatTechniques ({
                                               explicitIds: Nothing,
                                               group: Nothing,
                                               customText: Maybe (l10n.combatTechniques),
                                             }))
                                     : Nothing,
                   rules: toMarkdownM (Maybe (l10n.rules)),
                   effect: toMarkdownM (Maybe (l10n.effect)),
                   volume: Maybe (l10n.volume),
                   penalty: Maybe (l10n.penalty),
                   aeCost: Maybe (l10n.aeCost),
                   protectiveCircle: Maybe (l10n.protectiveCircle),
                   wardingCircle: Maybe (l10n.wardingCircle),
                   bindingCost: Maybe (l10n.bindingCost),
                   property: Maybe (univ.property),
                   aspect: Maybe (univ.aspect),
                   apValue: Maybe (l10n.apValue),
                   apValueAppend: Maybe (l10n.apValueAppend),
                   brew: Maybe (univ.brew),
                   src: toSourceRefs (l10n.src),
                   errata: toErrata (l10n.errata),
                   category: Nothing,
                 }),
               ])
             }


export const toSpecialAbilities : (blessings : OrderedMap<string, Record<Blessing>>)
                                => (cantrips : OrderedMap<string, Record<Cantrip>>)
                                => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
                                => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
                                => (skills : OrderedMap<string, Record<Skill>>)
                                => (spells : OrderedMap<string, Record<Spell>>)
                                => (spell_enhancements : OrderedMap<number, Record<SelectOption>>)
                                => (lc_enhancements : OrderedMap<number, Record<SelectOption>>)
                                => YamlFileConverter<string, Record<SpecialAbility>>
                                = blessings =>
                                  cantrips =>
                                  combatTechniques =>
                                  liturgicalChants =>
                                  skills =>
                                  spells =>
                                  spell_enhancements =>
                                  lc_enhancements => pipe (
                                    (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                     (yaml_mp.SpecialAbilitiesUniv)
                                                                     (yaml_mp.SpecialAbilitiesL10n),
                                    bindF (pipe (
                                      mapM (toSA (blessings)
                                                 (cantrips)
                                                 (combatTechniques)
                                                 (liturgicalChants)
                                                 (skills)
                                                 (spells)
                                                 (spell_enhancements)
                                                 (lc_enhancements)),
                                      bindF (toMapIntegrity),
                                    )),
                                    second (fromMap)
                                  )
