import { equals } from "../../../Data/Eq"
import { cnst, ident, join } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { elem, filter, List, sum } from "../../../Data/List"
import { bindF, ensure, maybe, Maybe, thenF } from "../../../Data/Maybe"
import { add, multiply } from "../../../Data/Num"
import { foldr, lookupF } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { bimap, first, fst, Pair, second, snd } from "../../../Data/Tuple"
import { curryN3 } from "../../../Data/Tuple/Curry"
import { Category } from "../../Constants/Categories"
import { icFromJs } from "../../Constants/Groups"
import { AdvantageIdsNoMaxInfl } from "../../Constants/Ids"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { Energies } from "../../Models/Hero/Energies"
import { Hero, HeroModelRecord } from "../../Models/Hero/Hero"
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { Advantage } from "../../Models/Wiki/Advantage"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Profession } from "../../Models/Wiki/Profession"
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant"
import { Race } from "../../Models/Wiki/Race"
import { Skill } from "../../Models/Wiki/Skill"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { getAllActiveByCategory } from "../Activatable/activatableActiveUtils"
import { getAPForActivatation, getAPForRange } from "../IC.gen"
import { pipe, pipe_ } from "../pipe"
import { getAdventurePointsSpentDifference } from "./adventurePointsUtils"

const SDA = StaticData.A
const HA = HeroModel.A

// Attributes

const getAPForAttribute = pipe (AttributeDependent.A.value, curryN3 (getAPForRange) ("E") (8))

export const getAPSpentForAttributes = foldr (pipe (getAPForAttribute, add)) (0)

// Skills

const getAPForSkill =
  (x: Record<Skill>) =>
    pipe (SkillDependent.A.value, curryN3 (getAPForRange) (icFromJs (Skill.A.ic (x))) (0))

type skillsFold = (x: Record<SkillDependent>) => (s: number) => number

export const getAPSpentForSkills =
  (xmap: StaticData["skills"]) =>
    foldr (join (pipe (
                        SkillDependent.A.id,
                        lookupF (xmap),
                        maybe<skillsFold> (cnst (ident))
                                          (x => pipe (getAPForSkill (x), add))
                      )))
          (0)

// Combat Techniques

const getAPForCombatTechnique =
  (x: Record<CombatTechnique>) =>
    pipe (SkillDependent.A.value, curryN3 (getAPForRange) (icFromJs (CombatTechnique.A.ic (x))) (6))

export const getAPSpentForCombatTechniques =
  (xmap: StaticData["combatTechniques"]) =>
    foldr (join (pipe (
                        SkillDependent.A.id,
                        lookupF (xmap),
                        maybe<skillsFold> (cnst (ident))
                                          (x => pipe (getAPForCombatTechnique (x), add))
                      )))
          (0)

// Spells / Liturgical Chants

const getAPForSpellOrChant =
  (x: Record<Spell> | Record<LiturgicalChant>) =>
  (asd: Record<ActivatableSkillDependent>) =>
    ActivatableSkillDependent.A.active (asd)
      ? pipe_ (
          asd,
          ActivatableSkillDependent.A.value,
          curryN3 (getAPForRange) (icFromJs (Spell.AL.ic (x))) (0),
          add (getAPForActivatation (icFromJs (Spell.AL.ic (x))))
        )
      : 0

type actSkillsFold = (x: Record<ActivatableSkillDependent>) => (s: number) => number

export const getAPSpentForSpells =
  (xmap: StaticData["spells"]) =>
    foldr (join (pipe (
                        ActivatableSkillDependent.A.id,
                        lookupF (xmap),
                        maybe<actSkillsFold> (cnst (ident))
                                             (x => pipe (getAPForSpellOrChant (x), add))
                      )))
          (0)

export const getAPSpentForLiturgicalChants =
  (xmap: StaticData["liturgicalChants"]) =>
    foldr (join (pipe (
                        ActivatableSkillDependent.A.id,
                        lookupF (xmap),
                        maybe<actSkillsFold> (cnst (ident))
                                             (x => pipe (getAPForSpellOrChant (x), add))
                      )))
          (0)

// Cantrips / Blessings

export const getAPSpentForCantrips = OrderedSet.size
export const getAPSpentForBlessings = OrderedSet.size

// Advantages / Disadvantages / Special Abilities

type ActiveAdvantage = Record<ActiveActivatable<Advantage>>
type ActiveDisadvantage = Record<ActiveActivatable<Disadvantage>>
type ActiveSpecialAbility = Record<ActiveActivatable<SpecialAbility>>

const AAA_ = ActiveActivatableA_

/**
 * The return value is a triple:
 *
 * - The second value is the simple AP cost sum that needs to be subtracted from
 *   the amount of total AP. Automatic advantage costs are exluded here.
 * - The first value is like the first, but it is the value that needs to be
 *   compared with the AP max for advantages. Some entries do not count towards
 *   this max. But automatic advantages are relevant here.
 */
export const getAPSpentForAdvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["advantages"]) =>
  (active: List<ActiveAdvantage>) =>
    pipe_ (
      active,
      List.foldr ((e: Record<ActiveActivatable<Advantage>>): ident<Pair<number, number>> =>
                   AAA_.isAutomatic (e)
                   ? first (add (AAA_.finalCost (e)))
                   : elem (AAA_.id (e)) (AdvantageIdsNoMaxInfl)
                   ? second (add (AAA_.finalCost (e)))
                   : bimap (add (AAA_.finalCost (e)))
                           (add (AAA_.finalCost (e))))
                 (Pair (0, 0)),
      join <ident<number>, ident<Pair<number, number>>>
           (bimap)
           (add (getAdventurePointsSpentDifference (wiki) (xmap) (active)))
    )

export const getAPSpentForMagicalAdvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["advantages"]) =>
    pipe (
      filter<ActiveAdvantage> (pipe (
                                ActiveActivatable.A.wikiEntry,
                                Advantage.AL.gr,
                                equals (2)
                              )) as ident<List<ActiveAdvantage>>,
      getAPSpentForAdvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedAdvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["advantages"]) =>
    pipe (
      filter<ActiveAdvantage> (pipe (
                                ActiveActivatable.A.wikiEntry,
                                Advantage.AL.gr,
                                equals (3)
                              )) as ident<List<ActiveAdvantage>>,
      getAPSpentForAdvantages (wiki) (xmap)
    )

/**
 * Returns (AP spent on disadvantages, actual AP lost)
 */
export const getAPSpentForDisadvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["disadvantages"]) =>
  (active: List<ActiveDisadvantage>): Pair<number, number> =>
    pipe_ (
      active,
      List.foldr ((e: Record<ActiveActivatable<Disadvantage>>): ident<Pair<number, number>> =>
                   AAA_.isAutomatic (e)
                   ? first (add (AAA_.finalCost (e)))
                   : bimap (add (AAA_.finalCost (e)))
                           (add (AAA_.finalCost (e))))
                 (Pair (0, 0)),
      join <ident<number>, ident<Pair<number, number>>>
           (bimap)
           (add (getAdventurePointsSpentDifference (wiki) (xmap) (active)))
    )

export const getAPSpentForMagicalDisadvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A.wikiEntry,
                                   Disadvantage.AL.gr,
                                   equals (2)
                                 )) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedDisadvantages =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A.wikiEntry,
                                   Disadvantage.AL.gr,
                                   equals (3)
                                 )) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForSpecialAbilities =
  (wiki: StaticDataRecord) =>
  (xmap: Hero["specialAbilities"]) =>
  (active: List<ActiveSpecialAbility>) =>
    pipe_ (
      active,
      List.foldr<Record<ActiveActivatable<SpecialAbility>>, number>
        (pipe (ActiveActivatableA_.finalCost, add))
        (0),
      add (getAdventurePointsSpentDifference (wiki)
                                             (xmap)
                                             (active))
    )

export const getAPSpentForEnergies =
  (energies: Record<Energies>) => {
    const addedArcaneEnergyCost =
      pipe_ (energies, Energies.A.addedArcaneEnergyPoints, curryN3 (getAPForRange) ("D") (0))

    const addedKarmaPointsCost =
      pipe_ (energies, Energies.A.addedKarmaPoints, curryN3 (getAPForRange) ("D") (0))

    const addedLifePointsCost =
      pipe_ (energies, Energies.A.addedLifePoints, curryN3 (getAPForRange) ("D") (0))

    const boughtBackArcaneEnergyCost =
      pipe_ (
        energies,
        Energies.A.permanentArcaneEnergyPoints,
        PermanentEnergyLossAndBoughtBack.A.redeemed,
        multiply (2)
      )

    const boughtBackKarmaPointsCost =
      pipe_ (
        energies,
        Energies.A.permanentKarmaPoints,
        PermanentEnergyLossAndBoughtBack.A.redeemed,
        multiply (2)
      )

    return sum (List (
      addedArcaneEnergyCost,
      addedKarmaPointsCost,
      addedLifePointsCost,
      boughtBackArcaneEnergyCost,
      boughtBackKarmaPointsCost
    ))
  }

export const getAPSpentForRace =
  (wiki: StaticDataRecord) =>
    pipe (
      bindF (lookupF (SDA.races (wiki))),
      maybe (0) (Race.A.ap)
    )

/**
 * Pass wiki, profession id, optional profession variant id and the current
 * phase.
 */
export const getAPSpentForProfession =
  (wiki: StaticDataRecord) =>
  (mprofId: Maybe<string>) =>
  (mprofVarId: Maybe<string>) =>
    pipe (
      ensure (equals (1)),
      thenF (mprofId),
      bindF (lookupF (SDA.professions (wiki))),
      fmap (pipe (
        Profession.A.ap,
        Maybe.sum,
        add (pipe_ (
          mprofVarId,
          bindF (lookupF (SDA.professionVariants (wiki))),
          fmap (ProfessionVariant.A.ap),
          Maybe.sum
        ))
      ))
    )

export const getAPObject =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (automatic_advantages: List<string>) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) => {
    const total = HA.adventurePointsTotal (hero)

    const spentOnAttributes = getAPSpentForAttributes (HA.attributes (hero))

    const spentOnSkills = getAPSpentForSkills (SDA.skills (staticData))
                                              (HA.skills (hero))

    const spentOnCombatTechniques =
      getAPSpentForCombatTechniques (SDA.combatTechniques (staticData))
                                    (HA.combatTechniques (hero))

    const spentOnSpells = getAPSpentForSpells (SDA.spells (staticData))
                                              (HA.spells (hero))

    const spentOnLiturgicalChants =
      getAPSpentForLiturgicalChants (SDA.liturgicalChants (staticData))
                                    (HA.liturgicalChants (hero))

    const spentOnCantrips = getAPSpentForCantrips (HA.cantrips (hero))

    const spentOnBlessings = getAPSpentForBlessings (HA.blessings (hero))

    const spentOnEnergies = getAPSpentForEnergies (HA.energies (hero))

    const spentOnRace = getAPSpentForRace (staticData) (HA.race (hero))

    const spentOnProfession = getAPSpentForProfession (staticData)
                                                      (HA.profession (hero))
                                                      (HA.professionVariant (hero))
                                                      (HA.phase (hero))

    const spentOnSpecialAbilities =
      getAPSpentForSpecialAbilities (staticData)
                                    (HA.specialAbilities (hero))
                                    (getAllActiveByCategory (Category.SPECIAL_ABILITIES)
                                                            (false)
                                                            (automatic_advantages)
                                                            (matching_script_and_lang_related)
                                                            (staticData)
                                                            (hero))

    const spentOnAdvantages =
        getAPSpentForAdvantages (staticData)
                                (HA.advantages (hero))
                                (getAllActiveByCategory (Category.ADVANTAGES)
                                                        (false)
                                                        (automatic_advantages)
                                                        (matching_script_and_lang_related)
                                                        (staticData)
                                                        (hero))

    const spentOnMagicalAdvantages =
        getAPSpentForMagicalAdvantages (staticData)
                                       (HA.advantages (hero))
                                       (getAllActiveByCategory (Category.ADVANTAGES)
                                                               (false)
                                                               (automatic_advantages)
                                                               (matching_script_and_lang_related)
                                                               (staticData)
                                                               (hero))

    const spentOnBlessedAdvantages =
        getAPSpentForBlessedAdvantages (staticData)
                                        (HA.advantages (hero))
                                        (getAllActiveByCategory (Category.ADVANTAGES)
                                                                (false)
                                                                (automatic_advantages)
                                                                (matching_script_and_lang_related)
                                                                (staticData)
                                                                (hero))

    const spentOnDisadvantages =
        getAPSpentForDisadvantages (staticData)
                                    (HA.disadvantages (hero))
                                    (getAllActiveByCategory (Category.DISADVANTAGES)
                                                            (false)
                                                            (automatic_advantages)
                                                            (matching_script_and_lang_related)
                                                            (staticData)
                                                            (hero))

    const spentOnMagicalDisadvantages =
        getAPSpentForMagicalDisadvantages (staticData)
                                          (HA.disadvantages (hero))
                                          (getAllActiveByCategory (Category.DISADVANTAGES)
                                                                  (false)
                                                                  (automatic_advantages)
                                                                  (matching_script_and_lang_related)
                                                                  (staticData)
                                                                  (hero))

    const spentOnBlessedDisadvantages =
        getAPSpentForBlessedDisadvantages (staticData)
                                          (HA.disadvantages (hero))
                                          (getAllActiveByCategory (Category.DISADVANTAGES)
                                                                  (false)
                                                                  (automatic_advantages)
                                                                  (matching_script_and_lang_related)
                                                                  (staticData)
                                                                  (hero))

    const spent =
      spentOnAttributes
      + spentOnSkills
      + spentOnCombatTechniques
      + spentOnSpells
      + spentOnLiturgicalChants
      + spentOnCantrips
      + spentOnBlessings
      + spentOnEnergies
      + spentOnRace
      + Maybe.sum (spentOnProfession)
      + spentOnSpecialAbilities
      + snd (spentOnAdvantages)
      + snd (spentOnMagicalAdvantages)
      + snd (spentOnBlessedAdvantages)
      + snd (spentOnDisadvantages)
      + snd (spentOnMagicalDisadvantages)
      + snd (spentOnBlessedDisadvantages)

    return AdventurePointsCategories ({
      total,
      spent,
      available: total - spent,
      spentOnAttributes,
      spentOnSkills,
      spentOnCombatTechniques,
      spentOnSpells,
      spentOnLiturgicalChants,
      spentOnCantrips,
      spentOnBlessings,
      spentOnEnergies,
      spentOnRace,
      spentOnProfession,
      spentOnSpecialAbilities,
      spentOnAdvantages: fst (spentOnAdvantages),
      spentOnMagicalAdvantages: fst (spentOnMagicalAdvantages),
      spentOnBlessedAdvantages: fst (spentOnBlessedAdvantages),
      spentOnDisadvantages: fst (spentOnDisadvantages),
      spentOnMagicalDisadvantages: fst (spentOnMagicalDisadvantages),
      spentOnBlessedDisadvantages: fst (spentOnBlessedDisadvantages),
    })
  }
