import { equals } from "../../../Data/Eq";
import { cnst, ident, join } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { set } from "../../../Data/Lens";
import { filter, List, sum } from "../../../Data/List";
import { bindF, ensure, maybe, Maybe, thenF } from "../../../Data/Maybe";
import { foldr, lookupF } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { Energies } from "../../Models/Hero/Energies";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { PermanentEnergyLossAndBoughtBack } from "../../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories, AdventurePointsCategoriesL } from "../../Models/View/AdventurePointsCategories";
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
import { add, multiply } from "../mathUtils";
import { pipe, pipe_ } from "../pipe";
import { getAdventurePointsSpentDifference } from "./adventurePointsUtils";
import { getAPRange } from "./improvementCostUtils";

// Attributes

const getAPForAttribute = pipe (AttributeDependent.A_.value, getAPRange (5) (8))

export const getAPSpentForAttributes = foldr (pipe (getAPForAttribute, add)) (0)

// Skills

const getAPForSkill =
  (x: Record<Skill>) =>
    pipe (SkillDependent.A_.value, getAPRange (Skill.A_.ic (x)) (0))

type skillsFold = (x: Record<SkillDependent>) => (s: number) => number

export const getAPSpentForSkills =
  (xmap: WikiModel["skills"]) =>
    foldr (join (pipe (
                        SkillDependent.A_.id,
                        lookupF (xmap),
                        maybe<skillsFold> (cnst (ident))
                                          (x => pipe (getAPForSkill (x), add)))))
          (0)

// Combat Techniques

const getAPForCombatTechnique =
  (x: Record<CombatTechnique>) =>
    pipe (SkillDependent.A_.value, getAPRange (CombatTechnique.A_.ic (x)) (6))

export const getAPSpentForCombatTechniques =
  (xmap: WikiModel["combatTechniques"]) =>
    foldr (join (pipe (
                        SkillDependent.A_.id,
                        lookupF (xmap),
                        maybe<skillsFold> (cnst (ident))
                                          (x => pipe (getAPForCombatTechnique (x), add)))))
          (0)

// Spells / Liturgical Chants

const getAPForSpellOrChant =
  (x: Record<Spell> | Record<LiturgicalChant>) =>
    pipe (ActivatableSkillDependent.A_.value, getAPRange (Spell.A.ic (x)) (0))

type actSkillsFold = (x: Record<ActivatableSkillDependent>) => (s: number) => number

export const getAPSpentForSpells =
  (xmap: WikiModel["spells"]) =>
    foldr (join (pipe (
                        ActivatableSkillDependent.A_.id,
                        lookupF (xmap),
                        maybe<actSkillsFold> (cnst (ident))
                                             (x => pipe (getAPForSpellOrChant (x), add)))))
          (0)

export const getAPSpentForLiturgicalChants =
  (xmap: WikiModel["liturgicalChants"]) =>
    foldr (join (pipe (
                        ActivatableSkillDependent.A_.id,
                        lookupF (xmap),
                        maybe<actSkillsFold> (cnst (ident))
                                             (x => pipe (getAPForSpellOrChant (x), add)))))
          (0)

// Cantrips / Blessings

export const getAPSpentForCantrips = OrderedSet.size
export const getAPSpentForBlessings = OrderedSet.size

// Advantages / Disadvantages / Special Abilities

type ActiveAdvantage = Record<ActiveActivatable<Advantage>>
type ActiveDisadvantage = Record<ActiveActivatable<Disadvantage>>
type ActiveSpecialAbility = Record<ActiveActivatable<SpecialAbility>>

export const getAPSpentForAdvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
  (active: List<ActiveAdvantage>) =>
    pipe_ (
      active,
      List.foldr (pipe (ActiveActivatable.A_.finalCost, add)) (0),
      add (getAdventurePointsSpentDifference (wiki)
                                             (xmap)
                                             (active))
    )

export const getAPSpentForMagicalAdvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
    pipe (
      filter<ActiveAdvantage> (pipe (
                                ActiveActivatable.A_.wikiEntry,
                                Advantage.A.gr,
                                equals (2))) as ident<List<ActiveAdvantage>>,
      getAPSpentForAdvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedAdvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["advantages"]) =>
    pipe (
      filter<ActiveAdvantage> (pipe (
                                ActiveActivatable.A_.wikiEntry,
                                Advantage.A.gr,
                                equals (3))) as ident<List<ActiveAdvantage>>,
      getAPSpentForAdvantages (wiki) (xmap)
    )

export const getAPSpentForDisadvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
  (active: List<ActiveDisadvantage>) =>
    pipe_ (
      active,
      List.foldr (pipe (ActiveActivatable.A_.finalCost, add)) (0),
      add (getAdventurePointsSpentDifference (wiki)
                                             (xmap)
                                             (active))
    )

export const getAPSpentForMagicalDisadvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A_.wikiEntry,
                                   Disadvantage.A.gr,
                                   equals (2))) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForBlessedDisadvantages =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["disadvantages"]) =>
    pipe (
      filter<ActiveDisadvantage> (pipe (
                                   ActiveActivatable.A_.wikiEntry,
                                   Disadvantage.A.gr,
                                   equals (3))) as ident<List<ActiveDisadvantage>>,
      getAPSpentForDisadvantages (wiki) (xmap)
    )

export const getAPSpentForSpecialAbilities =
  (wiki: WikiModelRecord) =>
  (xmap: HeroModel["specialAbilities"]) =>
  (active: List<ActiveSpecialAbility>) =>
    pipe_ (
      active,
      List.foldr (pipe (ActiveActivatable.A_.finalCost, add)) (0),
      add (getAdventurePointsSpentDifference (wiki)
                                             (xmap)
                                             (active))
    )

export const getAPSpentForEnergies =
  (energies: Record<Energies>) => {
    const addedArcaneEnergyCost =
      pipe_ (energies, Energies.A_.addedArcaneEnergyPoints, getAPRange (4) (0))

    const addedKarmaPointsCost =
      pipe_ (energies, Energies.A_.addedKarmaPoints, getAPRange (4) (0))

    const addedLifePointsCost =
      pipe_ (energies, Energies.A_.addedLifePoints, getAPRange (4) (0))

    const boughtBackArcaneEnergyCost =
      pipe_ (
        energies,
        Energies.A_.permanentArcaneEnergyPoints,
        PermanentEnergyLossAndBoughtBack.A_.redeemed,
        multiply (2)
      )

    const boughtBackKarmaPointsCost =
      pipe_ (
        energies,
        Energies.A_.permanentKarmaPoints,
        PermanentEnergyLossAndBoughtBack.A_.redeemed,
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
      bindF (lookupF (WikiModel.A_.races (wiki))),
      maybe (0) (Race.A_.ap)
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
      bindF (lookupF (WikiModel.A_.professions (wiki))),
      fmap (pipe (
        Profession.A_.ap,
        add (pipe_ (
          mprofVarId,
          bindF (lookupF (WikiModel.A_.professionVariants (wiki))),
          fmap (ProfessionVariant.A_.ap),
          Maybe.sum
        ))
      ))
    )

export const getAPObjectAreas =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
    AdventurePointsCategories ({
      total: HeroModel.A_.adventurePointsTotal (hero),
      spent: 0,
      available: 0,
      spentOnAttributes: getAPSpentForAttributes (HeroModel.A_.attributes (hero)),
      spentOnSkills: getAPSpentForSkills (WikiModel.A_.skills (wiki))
                                         (HeroModel.A_.skills (hero)),
      spentOnCombatTechniques: getAPSpentForCombatTechniques (WikiModel.A_.combatTechniques (wiki))
                                                             (HeroModel.A_.combatTechniques (hero)),
      spentOnSpells: getAPSpentForSpells (WikiModel.A_.spells (wiki))
                                         (HeroModel.A_.spells (hero)),
      spentOnLiturgicalChants: getAPSpentForLiturgicalChants (WikiModel.A_.liturgicalChants (wiki))
                                                             (HeroModel.A_.liturgicalChants (hero)),
      spentOnCantrips: getAPSpentForCantrips (HeroModel.A_.cantrips (hero)),
      spentOnBlessings: getAPSpentForBlessings (HeroModel.A_.blessings (hero)),
      spentOnEnergies: getAPSpentForEnergies (HeroModel.A_.energies (hero)),
      spentOnRace: getAPSpentForRace (wiki) (HeroModel.A_.race (hero)),
      spentOnProfession: getAPSpentForProfession (wiki)
                                                 (HeroModel.A_.profession (hero))
                                                 (HeroModel.A_.professionVariant (hero))
                                                 (HeroModel.A_.phase (hero)),
      spentOnSpecialAbilities:
        getAPSpentForSpecialAbilities (wiki)
                                      (HeroModel.A_.specialAbilities (hero))
                                      (getAllActiveByCategory (Categories.SPECIAL_ABILITIES)
                                                              (false)
                                                              (l10n)
                                                              (wiki)
                                                              (hero)),
      spentOnAdvantages:
        getAPSpentForAdvantages (wiki)
                                (HeroModel.A_.advantages (hero))
                                (getAllActiveByCategory (Categories.ADVANTAGES)
                                                        (false)
                                                        (l10n)
                                                        (wiki)
                                                        (hero)),
      spentOnMagicalAdvantages:
        getAPSpentForMagicalAdvantages (wiki)
                                        (HeroModel.A_.advantages (hero))
                                        (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                (false)
                                                                (l10n)
                                                                (wiki)
                                                                (hero)),
      spentOnBlessedAdvantages:
        getAPSpentForBlessedAdvantages (wiki)
                                        (HeroModel.A_.advantages (hero))
                                        (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                (false)
                                                                (l10n)
                                                                (wiki)
                                                                (hero)),
      spentOnDisadvantages:
        getAPSpentForDisadvantages (wiki)
                                    (HeroModel.A_.disadvantages (hero))
                                    (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                            (false)
                                                            (l10n)
                                                            (wiki)
                                                            (hero)),
      spentOnMagicalDisadvantages:
        getAPSpentForMagicalDisadvantages (wiki)
                                          (HeroModel.A_.disadvantages (hero))
                                          (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                  (false)
                                                                  (l10n)
                                                                  (wiki)
                                                                  (hero)),
      spentOnBlessedDisadvantages:
        getAPSpentForBlessedDisadvantages (wiki)
                                          (HeroModel.A_.disadvantages (hero))
                                          (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                  (false)
                                                                  (l10n)
                                                                  (wiki)
                                                                  (hero)),
    })

const getAPSpent = (ap: Record<AdventurePointsCategories>) =>
  sum (List (
    AdventurePointsCategories.A_.spentOnAttributes (ap),
    AdventurePointsCategories.A_.spentOnSkills (ap),
    AdventurePointsCategories.A_.spentOnCombatTechniques (ap),
    AdventurePointsCategories.A_.spentOnSpells (ap),
    AdventurePointsCategories.A_.spentOnLiturgicalChants (ap),
    AdventurePointsCategories.A_.spentOnCantrips (ap),
    AdventurePointsCategories.A_.spentOnBlessings (ap),
    AdventurePointsCategories.A_.spentOnSpecialAbilities (ap),
    AdventurePointsCategories.A_.spentOnEnergies (ap),
    AdventurePointsCategories.A_.spentOnRace (ap),
    Maybe.sum (AdventurePointsCategories.A_.spentOnProfession (ap)),
    AdventurePointsCategories.A_.spentOnAdvantages (ap),
    AdventurePointsCategories.A_.spentOnMagicalAdvantages (ap),
    AdventurePointsCategories.A_.spentOnBlessedAdvantages (ap),
    AdventurePointsCategories.A_.spentOnDisadvantages (ap),
    AdventurePointsCategories.A_.spentOnMagicalDisadvantages (ap),
    AdventurePointsCategories.A_.spentOnBlessedDisadvantages (ap)
  ))

const getAPAvailable =
  (ap: Record<AdventurePointsCategories>) =>
  (spent: number) =>
    AdventurePointsCategories.A_.total (ap) - spent

export const getAPObject =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord): Record<AdventurePointsCategories> => {
    const areas = getAPObjectAreas (l10n) (wiki) (hero)

    const spent = getAPSpent (areas)

    const available = getAPAvailable (areas) (spent)

    return pipe_ (
      areas,
      set (AdventurePointsCategoriesL.spent) (spent),
      set (AdventurePointsCategoriesL.available) (available)
    )
  }
