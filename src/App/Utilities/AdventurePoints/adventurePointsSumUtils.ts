import { equals } from "../../../Data/Eq";
import { cnst, ident, join } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { elem, filter, List, sum } from "../../../Data/List";
import { bindF, ensure, maybe, Maybe, thenF } from "../../../Data/Maybe";
import { add, multiply } from "../../../Data/Num";
import { foldr, lookupF } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { bimap, first, fst, Pair, second, snd, Tuple } from "../../../Data/Tuple";
import { Categories } from "../../Constants/Categories";
import { AdvantageIdsNoMaxInfl } from "../../Constants/Ids";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { Energies } from "../../Models/Hero/Energies";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { PermanentEnergyLossAndBoughtBack } from "../../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { Advantage } from "../../Models/Wiki/Advantage";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { Profession } from "../../Models/Wiki/Profession";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getAllActiveByCategory } from "../Activatable/activatableActiveUtils";
import { pipe, pipe_ } from "../pipe";
import { getAdventurePointsSpentDifference } from "./adventurePointsUtils";
import { getAPRange } from "./improvementCostUtils";

// Attributes

const getAPForAttribute = pipe (AttributeDependent.A.value, getAPRange (5) (8))

export const getAPSpentForAttributes = foldr (pipe (getAPForAttribute, add)) (0)

// Skills

const getAPForSkill =
  (x: Record<Skill>) =>
    pipe (SkillDependent.A.value, getAPRange (Skill.A.ic (x)) (0))

type skillsFold = (x: Record<SkillDependent>) => (s: number) => number

export const getAPSpentForSkills =
  (xmap: WikiModel["skills"]) =>
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
    pipe (SkillDependent.A.value, getAPRange (CombatTechnique.A.ic (x)) (6))

export const getAPSpentForCombatTechniques =
  (xmap: WikiModel["combatTechniques"]) =>
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
          getAPRange (Spell.AL.ic (x)) (0),
          add (Spell.AL.ic (x))
        )
      : 0

type actSkillsFold = (x: Record<ActivatableSkillDependent>) => (s: number) => number

export const getAPSpentForSpells =
  (xmap: WikiModel["spells"]) =>
    foldr (join (pipe (
                        ActivatableSkillDependent.A.id,
                        lookupF (xmap),
                        maybe<actSkillsFold> (cnst (ident))
                                             (x => pipe (getAPForSpellOrChant (x), add))
                      )))
          (0)

export const getAPSpentForLiturgicalChants =
  (xmap: WikiModel["liturgicalChants"]) =>
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
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
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
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
    pipe (
      filter<ActiveAdvantage> (pipe (
                                ActiveActivatable.A.wikiEntry,
                                Advantage.AL.gr,
                                equals (2)
                              )) as ident<List<ActiveAdvantage>>,
      getAPSpentForAdvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedAdvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
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
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
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
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A.wikiEntry,
                                   Disadvantage.AL.gr,
                                   equals (2)
                                 )) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedDisadvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A.wikiEntry,
                                   Disadvantage.AL.gr,
                                   equals (3)
                                 )) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForSpecialAbilities =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["specialAbilities"]) =>
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
      pipe_ (energies, Energies.A.addedArcaneEnergyPoints, getAPRange (4) (0))

    const addedKarmaPointsCost =
      pipe_ (energies, Energies.A.addedKarmaPoints, getAPRange (4) (0))

    const addedLifePointsCost =
      pipe_ (energies, Energies.A.addedLifePoints, getAPRange (4) (0))

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
  (wiki: WikiModelRecord) =>
    pipe (
      bindF (lookupF (WikiModel.A.races (wiki))),
      maybe (0) (Race.A.ap)
    )

/**
 * Pass wiki, profession id, optional profession variant id and the current
 * phase.
 */
export const getAPSpentForProfession =
  (wiki: WikiModelRecord) =>
  (mprofId: Maybe<string>) =>
  (mprofVarId: Maybe<string>) =>
    pipe (
      ensure (equals (1)),
      thenF (mprofId),
      bindF (lookupF (WikiModel.A.professions (wiki))),
      fmap (pipe (
        Profession.A.ap,
        Maybe.sum,
        add (pipe_ (
          mprofVarId,
          bindF (lookupF (WikiModel.A.professionVariants (wiki))),
          fmap (ProfessionVariant.A.ap),
          Maybe.sum
        ))
      ))
    )

export const getAPObject =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (automatic_advantages: List<string>) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) => {
    const total = HeroModel.A.adventurePointsTotal (hero)

    const spentOnAttributes = getAPSpentForAttributes (HeroModel.A.attributes (hero))

    const spentOnSkills = getAPSpentForSkills (WikiModel.A.skills (wiki))
                                              (HeroModel.A.skills (hero))

    const spentOnCombatTechniques =
      getAPSpentForCombatTechniques (WikiModel.A.combatTechniques (wiki))
                                    (HeroModel.A.combatTechniques (hero))

    const spentOnSpells = getAPSpentForSpells (WikiModel.A.spells (wiki))
                                              (HeroModel.A.spells (hero))

    const spentOnLiturgicalChants =
      getAPSpentForLiturgicalChants (WikiModel.A.liturgicalChants (wiki))
                                    (HeroModel.A.liturgicalChants (hero))

    const spentOnCantrips = getAPSpentForCantrips (HeroModel.A.cantrips (hero))

    const spentOnBlessings = getAPSpentForBlessings (HeroModel.A.blessings (hero))

    const spentOnEnergies = getAPSpentForEnergies (HeroModel.A.energies (hero))

    const spentOnRace = getAPSpentForRace (wiki) (HeroModel.A.race (hero))

    const spentOnProfession = getAPSpentForProfession (wiki)
                                                      (HeroModel.A.profession (hero))
                                                      (HeroModel.A.professionVariant (hero))
                                                      (HeroModel.A.phase (hero))
    const spentOnSpecialAbilities =
      getAPSpentForSpecialAbilities (wiki)
                                    (HeroModel.A.specialAbilities (hero))
                                    (getAllActiveByCategory (Categories.SPECIAL_ABILITIES)
                                                            (false)
                                                            (automatic_advantages)
                                                            (matching_script_and_lang_related)
                                                            (l10n)
                                                            (wiki)
                                                            (hero))
    const spentOnAdvantages =
        getAPSpentForAdvantages (wiki)
                                (HeroModel.A.advantages (hero))
                                (getAllActiveByCategory (Categories.ADVANTAGES)
                                                        (false)
                                                        (automatic_advantages)
                                                        (matching_script_and_lang_related)
                                                        (l10n)
                                                        (wiki)
                                                        (hero))
    const spentOnMagicalAdvantages =
        getAPSpentForMagicalAdvantages (wiki)
                                        (HeroModel.A.advantages (hero))
                                        (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                (false)
                                                                (automatic_advantages)
                                                                (matching_script_and_lang_related)
                                                                (l10n)
                                                                (wiki)
                                                                (hero))
    const spentOnBlessedAdvantages =
        getAPSpentForBlessedAdvantages (wiki)
                                        (HeroModel.A.advantages (hero))
                                        (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                (false)
                                                                (automatic_advantages)
                                                                (matching_script_and_lang_related)
                                                                (l10n)
                                                                (wiki)
                                                                (hero))
    const spentOnDisadvantages =
        getAPSpentForDisadvantages (wiki)
                                    (HeroModel.A.disadvantages (hero))
                                    (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                            (false)
                                                            (automatic_advantages)
                                                            (matching_script_and_lang_related)
                                                            (l10n)
                                                            (wiki)
                                                            (hero))
    const spentOnMagicalDisadvantages =
        getAPSpentForMagicalDisadvantages (wiki)
                                          (HeroModel.A.disadvantages (hero))
                                          (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                  (false)
                                                                  (automatic_advantages)
                                                                  (matching_script_and_lang_related)
                                                                  (l10n)
                                                                  (wiki)
                                                                  (hero))
    const spentOnBlessedDisadvantages =
        getAPSpentForBlessedDisadvantages (wiki)
                                          (HeroModel.A.disadvantages (hero))
                                          (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                  (false)
                                                                  (automatic_advantages)
                                                                  (matching_script_and_lang_related)
                                                                  (l10n)
                                                                  (wiki)
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
