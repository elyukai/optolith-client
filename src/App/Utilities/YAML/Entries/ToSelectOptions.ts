/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SpecialAbilitySelectOptionL10n } from "../../../../../app/Database/Schema/SpecialAbilities/SpecialAbilities.l10n"
import { SelectOptionCategoryUniv, SpecialAbilitySelectOptionUniv } from "../../../../../app/Database/Schema/SpecialAbilities/SpecialAbilities.univ"
import { Either, Left, Right } from "../../../../Data/Either"
import { flip, ident } from "../../../../Data/Function"
import { fromArray, List, notNull } from "../../../../Data/List"
import { ensure, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { foldr, insert, OrderedMap, toMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { Spell } from "../../../Models/Wiki/Spell"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { pipe, pipe_ } from "../../pipe"
import { toErrata } from "./ToErrata"
import { toPrerequisites } from "./ToPrerequisites"
import { toSourceRefs } from "./ToSourceRefs"


type InsertMap = ident<OrderedMap<string, Record<SelectOption>>>


const blessingToSelectOption : (attr : Record<Blessing>) => Record<SelectOption>
                             = x => SelectOption ({
                                      id: Blessing.A.id (x),
                                      name: Blessing.A.name (x),
                                      src: Blessing.A.src (x),
                                      errata: Blessing.A.errata (x),
                                    })


const resolveBlessings : (blessings : OrderedMap<string, Record<Blessing>>)
                       => InsertMap
                       = flip (foldr (x => pipe_ (
                                             x,
                                             blessingToSelectOption,
                                             insert (Blessing.A.id (x))
                                           )))


const cantripToSelectOption : (cantrip : Record<Cantrip>) => Record<SelectOption>
                            = x => SelectOption ({
                                     id: Cantrip.A.id (x),
                                     name: Cantrip.A.name (x),
                                     src: Cantrip.A.src (x),
                                     errata: Cantrip.A.errata (x),
                                   })


const resolveCantrips : (cantrips : OrderedMap<string, Record<Cantrip>>)
                      => InsertMap
                      = flip (foldr (x => pipe_ (
                                            x,
                                            cantripToSelectOption,
                                            insert (Cantrip.A.id (x))
                                          )))


const ctToSelectOption : (combatTechnique : Record<CombatTechnique>) => Record<SelectOption>
                       = x => SelectOption ({
                                id: CombatTechnique.A.id (x),
                                name: CombatTechnique.A.name (x),
                                cost: Just (CombatTechnique.A.ic (x)),
                                src: CombatTechnique.A.src (x),
                                errata: CombatTechnique.A.errata (x),
                              })


const resolveCombatTechniques : (gr : number[] | undefined)
                              => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
                              => InsertMap
                              = gr => gr === undefined
                                      ? flip (foldr ((x : Record<CombatTechnique>) =>
                                                      pipe_ (
                                                        x,
                                                        ctToSelectOption,
                                                        insert (CombatTechnique.A.id (x))
                                                      )))
                                      : flip (foldr ((x : Record<CombatTechnique>) =>
                                                      gr.includes (CombatTechnique.A.gr (x))
                                                      ? pipe_ (
                                                          x,
                                                          ctToSelectOption,
                                                          insert (CombatTechnique.A.id (x))
                                                        )
                                                      : ident as InsertMap))


const lcToSelectOption : (liturgicalChant : Record<LiturgicalChant>) => Record<SelectOption>
                       = x => SelectOption ({
                                id: LiturgicalChant.A.id (x),
                                name: LiturgicalChant.A.name (x),
                                cost: Just (LiturgicalChant.A.ic (x)),
                                src: LiturgicalChant.A.src (x),
                                errata: LiturgicalChant.A.errata (x),
                              })


const resolveLiturgicalChants : (gr : number[] | undefined)
                              => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
                              => InsertMap
                              = gr => gr === undefined
                                      ? flip (foldr ((x : Record<LiturgicalChant>) =>
                                                      pipe_ (
                                                        x,
                                                        lcToSelectOption,
                                                        insert (LiturgicalChant.A.id (x))
                                                      )))
                                      : flip (foldr ((x : Record<LiturgicalChant>) =>
                                                      gr.includes (LiturgicalChant.A.gr (x))
                                                      ? pipe_ (
                                                          x,
                                                          lcToSelectOption,
                                                          insert (LiturgicalChant.A.id (x))
                                                        )
                                                      : ident as InsertMap))


const skillToSelectOption : (skill : Record<Skill>) => Record<SelectOption>
                          = x => SelectOption ({
                                   id: Skill.A.id (x),
                                   name: Skill.A.name (x),
                                   cost: Just (Skill.A.ic (x)),
                                   applications: Just (Skill.A.applications (x)),
                                   applicationInput: Skill.A.applicationsInput (x),
                                   src: Skill.A.src (x),
                                   errata: Skill.A.errata (x),
                                 })


const resolveSkills : (gr : number[] | undefined)
                    => (skills : OrderedMap<string, Record<Skill>>)
                    => InsertMap
                    = gr => gr === undefined
                            ? flip (foldr ((x : Record<Skill>) =>
                                            pipe_ (
                                              x,
                                              skillToSelectOption,
                                              insert (Skill.A.id (x))
                                            )))
                            : flip (foldr ((x : Record<Skill>) =>
                                            gr.includes (Skill.A.gr (x))
                                            ? pipe_ (
                                                x,
                                                skillToSelectOption,
                                                insert (Skill.A.id (x))
                                              )
                                            : ident as InsertMap))


const spellToSelectOption : (spell : Record<Spell>) => Record<SelectOption>
                          = x => SelectOption ({
                                   id: Spell.A.id (x),
                                   name: Spell.A.name (x),
                                   cost: Just (Spell.A.ic (x)),
                                   src: Spell.A.src (x),
                                   errata: Spell.A.errata (x),
                                 })


const resolveSpells : (gr : number[] | undefined)
                    => (spells : OrderedMap<string, Record<Spell>>)
                    => InsertMap
                    = gr => gr === undefined
                            ? flip (foldr ((x : Record<Spell>) =>
                                            pipe_ (
                                              x,
                                              spellToSelectOption,
                                              insert (Spell.A.id (x))
                                            )))
                            : flip (foldr ((x : Record<Spell>) =>
                                            gr.includes (Spell.A.gr (x))
                                            ? pipe_ (
                                                x,
                                                spellToSelectOption,
                                                insert (Spell.A.id (x))
                                              )
                                            : ident as InsertMap))


/**
 * Takes an array of select option categories and resolves them into a list of
 * select options.
 */
export const resolveSOCats : (blessings : OrderedMap<string, Record<Blessing>>)
                           => (cantrips : OrderedMap<string, Record<Cantrip>>)
                           => (combatTechniques : OrderedMap<string, Record<CombatTechnique>>)
                           => (liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>)
                           => (skills : OrderedMap<string, Record<Skill>>)
                           => (spells : OrderedMap<string, Record<Spell>>)
                           => (categories : SelectOptionCategoryUniv[] | undefined)
                           => OrderedMap<string, Record<SelectOption>>
                           = bs => cas => cts => lcs => sks => sps =>
                               pipe (
                                 xs => xs === undefined ? [] : xs,
                                 fromArray,
                                 List.foldr ((cat : SelectOptionCategoryUniv) =>
                                              cat.category === "BLESSINGS"
                                              ? resolveBlessings (bs)
                                              : cat.category === "CANTRIPS"
                                              ? resolveCantrips (cas)
                                              : cat.category === "COMBAT_TECHNIQUES"
                                              ? resolveCombatTechniques (cat.groups) (cts)
                                              : cat.category === "LITURGICAL_CHANTS"
                                              ? resolveLiturgicalChants (cat.groups) (lcs)
                                              : cat.category === "SKILLS"
                                              ? resolveSkills (cat.groups) (sks)
                                              : resolveSpells (cat.groups) (sps))
                                            (OrderedMap.empty),
                               )


const l10nSelectOptionToRecord : (l10n : SpecialAbilitySelectOptionL10n) => Record<SelectOption>
                               = l10n => SelectOption ({
                                           id: l10n.id,
                                           name: l10n.name,
                                           description: Maybe (l10n.description),
                                           specializations: l10n.specializations === undefined
                                                            ? Nothing
                                                            : Just (
                                                                fromArray (l10n.specializations)
                                                              ),
                                           specializationInput: Maybe (l10n.specializationInput),
                                           src: toSourceRefs (l10n.src),
                                           errata: toErrata (l10n.errata),
                                         })


const mergeUnivIntoL10n : (univ : SpecialAbilitySelectOptionUniv) => ident<Record<SelectOption>>
                        = univ => l10n => SelectOption ({
                                            id: SelectOption.A.id (l10n),
                                            name: SelectOption.A.name (l10n),
                                            description: SelectOption.A.description (l10n),
                                            specializations: SelectOption.A.specializations (l10n),
                                            specializationInput:
                                              SelectOption.A.specializationInput (l10n),
                                            continent: Maybe (univ.continent),
                                            cost: Maybe (univ.cost),
                                            isExtinct: Maybe (univ.isExtinct),
                                            isSecret: Maybe (univ.isSecret),
                                            languages: typeof univ.languages === "object"
                                                       ? Just (fromArray (univ.languages))
                                                       : Nothing,
                                            prerequisites: ensure (notNull)
                                                                  (toPrerequisites (univ)),
                                            level: Maybe (univ.animalLevel),
                                            gr: Maybe (univ.animalGr),
                                            src: SelectOption.A.src (l10n),
                                            errata: SelectOption.A.errata (l10n),
                                          })


export const mergeSOs : (sosL10n : SpecialAbilitySelectOptionL10n[] | undefined)
                      => (sosUniv : SpecialAbilitySelectOptionUniv[] | undefined)
                      => (soCatMap : OrderedMap<string, Record<SelectOption>>)
                      => Either<Error[], List<Record<SelectOption>>>
                      = sosL10n => sosUniv => soCatMap => {
                          const mp : Map<string | number, Record<SelectOption>>
                                   = new Map (toMap (soCatMap))

                          const errs : Error[] = []

                          if (sosL10n !== undefined) {
                            for (const so of sosL10n) {
                              if (mp.has (so.id)) {
                                errs.push (new Error (`mergeSOs: Key ${so.id} already in use`))
                              }
                              else {
                                mp.set (so.id, l10nSelectOptionToRecord (so))
                              }
                            }
                          }

                          if (sosUniv !== undefined) {
                            for (const so of sosUniv) {
                              const v = mp.get (so.id)

                              if (v !== undefined) {
                                mp.set (so.id, mergeUnivIntoL10n (so) (v))
                              }
                            }
                          }

                          if (errs.length > 0) {
                            return Left (errs)
                          }

                          return Right (List (...mp.values ()))
                        }
