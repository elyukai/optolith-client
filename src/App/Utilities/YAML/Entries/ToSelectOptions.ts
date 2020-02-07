/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ident } from "../../../../Data/Function"
import { concatMap, consF, fromArray, List } from "../../../../Data/List"
import { Just } from "../../../../Data/Maybe"
import { foldr, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { Spell } from "../../../Models/Wiki/Spell"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { pipe, pipe_ } from "../../pipe"
import { SelectOptionCategoryUniv } from "../Schema/SpecialAbilities/SpecialAbilities.univ"


const blessingToSelectOption : (attr : Record<Blessing>) => Record<SelectOption>
                             = x => SelectOption ({
                                      id: Blessing.A.id (x),
                                      name: Blessing.A.name (x),
                                      src: Blessing.A.src (x),
                                      errata: Blessing.A.errata (x),
                                    })


const resolveBlessings : (blessings : OrderedMap<string, Record<Blessing>>)
                       => List<Record<SelectOption>>
                       = foldr (pipe (blessingToSelectOption, consF)) (List ())


const cantripToSelectOption : (cantrip : Record<Cantrip>) => Record<SelectOption>
                            = x => SelectOption ({
                                     id: Cantrip.A.id (x),
                                     name: Cantrip.A.name (x),
                                     src: Cantrip.A.src (x),
                                     errata: Cantrip.A.errata (x),
                                   })


const resolveCantrips : (cantrips : OrderedMap<string, Record<Cantrip>>)
                      => List<Record<SelectOption>>
                      = foldr (pipe (cantripToSelectOption, consF)) (List ())


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
                              => List<Record<SelectOption>>
                              = gr => gr === undefined
                                      ? foldr (pipe (ctToSelectOption, consF))
                                              (List ())
                                      : foldr ((x : Record<CombatTechnique>) =>
                                                gr.includes (CombatTechnique.A.gr (x))
                                                ? pipe_ (x, ctToSelectOption, consF)
                                                : ident as ident<List<Record<SelectOption>>>)
                                              (List ())


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
                              => List<Record<SelectOption>>
                              = gr => gr === undefined
                                      ? foldr (pipe (lcToSelectOption, consF))
                                              (List ())
                                      : foldr ((x : Record<LiturgicalChant>) =>
                                                gr.includes (LiturgicalChant.A.gr (x))
                                                ? pipe_ (x, lcToSelectOption, consF)
                                                : ident as ident<List<Record<SelectOption>>>)
                                              (List ())


const skillToSelectOption : (skill : Record<Skill>) => Record<SelectOption>
                          = x => SelectOption ({
                                   id: Skill.A.id (x),
                                   name: Skill.A.name (x),
                                   cost: Just (Skill.A.ic (x)),
                                   src: Skill.A.src (x),
                                   errata: Skill.A.errata (x),
                                 })


const resolveSkills : (gr : number[] | undefined)
                    => (skills : OrderedMap<string, Record<Skill>>)
                    => List<Record<SelectOption>>
                    = gr => gr === undefined
                            ? foldr (pipe (skillToSelectOption, consF))
                                    (List ())
                            : foldr ((x : Record<Skill>) =>
                                      gr.includes (Skill.A.gr (x))
                                      ? pipe_ (x, skillToSelectOption, consF)
                                      : ident as ident<List<Record<SelectOption>>>)
                                    (List ())


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
                    => List<Record<SelectOption>>
                    = gr => gr === undefined
                            ? foldr (pipe (spellToSelectOption, consF))
                                    (List ())
                            : foldr ((x : Record<Spell>) =>
                                      gr.includes (Spell.A.gr (x))
                                      ? pipe_ (x, spellToSelectOption, consF)
                                      : ident as ident<List<Record<SelectOption>>>)
                                    (List ())


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
                           => (categories : SelectOptionCategoryUniv[])
                           => List<Record<SelectOption>>
                           = bs => cas => cts => lcs => sks => sps =>
                               pipe (
                                 fromArray,
                                 concatMap (cat => cat.category === "BLESSINGS"
                                                   ? resolveBlessings (bs)
                                                   : cat.category === "CANTRIPS"
                                                   ? resolveCantrips (cas)
                                                   : cat.category === "COMBAT_TECHNIQUES"
                                                   ? resolveCombatTechniques (cat.group)
                                                                             (cts)
                                                   : cat.category === "LITURGICAL_CHANTS"
                                                   ? resolveLiturgicalChants (cat.group)
                                                                             (lcs)
                                                   : cat.category === "SKILLS"
                                                   ? resolveSkills (cat.group) (sks)
                                                   : resolveSpells (cat.group) (sps))
                               )
