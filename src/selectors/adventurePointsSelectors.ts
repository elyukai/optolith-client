import * as R from 'ramda';
import { isNumber } from 'util';
import { ActiveViewObject, HeroDependent } from '../types/data';
import { getAdventurePointsSpentDifference, getDisAdvantagesSubtypeMax } from '../utils/adventurePointsUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedSet, Record } from '../utils/dataUtils';
import { getAPRange } from '../utils/improvementCostUtils';
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from './activatableSelectors';
import { getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from './rcpSelectors';
import { getAdvantages, getAttributes, getBlessings, getCantrips, getCombatTechniques, getCurrentHeroPresent, getDisadvantages, getEnergies, getLiturgicalChants, getPhase, getSkills, getSpecialAbilities, getSpells, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from './stateSelectors';

export const getAdventurePointsSpentForAttributes = createMaybeSelector (
  getAttributes,
  Maybe.maybe<HeroDependent['attributes'], number> (0) (
    list => list.foldl<number> (sum => e => sum + getAPRange (5) (8) (e.get ('value'))) (0)
  )
);

export const getAdventurePointsSpentForSkills = createMaybeSelector (
  getSkills,
  getWikiSkills,
  (maybeList, wikiList) => Maybe.maybe<HeroDependent['skills'], number> (0) (
    list => list.foldl<number> (
      sum => e => Maybe.fromMaybe (sum) (
        wikiList.lookup (e.get ('id'))
          .fmap (
            skill => sum + getAPRange (skill.get ('ic')) (0) (e.get ('value'))
          )
      )
    ) (0)
  ) (maybeList)
);

export const getAdventurePointsSpentForCombatTechniques = createMaybeSelector (
  getCombatTechniques,
  getWikiCombatTechniques,
  (maybeList, wikiList) => Maybe.maybe<HeroDependent['combatTechniques'], number> (0) (
    list => list.foldl<number> (
      sum => e => Maybe.fromMaybe (sum) (
        wikiList.lookup (e.get ('id'))
          .fmap (
            combatTechnique => sum + getAPRange (combatTechnique.get ('ic')) (6) (e.get ('value'))
          )
      )
    ) (0)
  ) (maybeList)
);

export const getAdventurePointsSpentForSpells = createMaybeSelector (
  getSpells,
  getWikiSpells,
  (maybeList, wikiList) => Maybe.maybe<HeroDependent['spells'], number> (0) (
    list => list.foldl<number> (
      sum => e => e.get ('active')
        ? Maybe.fromMaybe (sum) (
            wikiList.lookup (e.get ('id'))
              .fmap (
                spell => sum + getAPRange (spell.get ('ic')) (0) (e.get ('value'))
              )
          )
        : sum
      ) (0)
  ) (maybeList)
);

export const getAdventurePointsSpentForLiturgicalChants = createMaybeSelector (
  getLiturgicalChants,
  getWikiLiturgicalChants,
  (maybeList, wikiList) => Maybe.maybe<HeroDependent['liturgicalChants'], number> (0) (
    list => list.foldl<number> (
      sum => e => e.get ('active')
        ? Maybe.fromMaybe (sum) (
            wikiList.lookup (e.get ('id'))
              .fmap (
                chant => sum + getAPRange (chant.get ('ic')) (0) (e.get ('value'))
              )
          )
        : sum
    ) (0)
  ) (maybeList)
);

export const getAdventurePointsSpentForCantrips = createMaybeSelector (
  getCantrips,
  R.pipe (
    Maybe.fmap (OrderedSet.size),
    Maybe.fromMaybe (0)
  )
);

export const getAdventurePointsSpentForBlessings = createMaybeSelector (
  getBlessings,
  R.pipe (
    Maybe.fmap (OrderedSet.size),
    Maybe.fromMaybe (0)
  )
);

export const getAdventurePointsSpentForAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const baseAP = list.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            list as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForMagicalAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const filteredList = list.filter (e => e.get ('wikiEntry').get ('gr') === 2);

          const baseAP = filteredList.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            filteredList as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForBlessedAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const filteredList = list.filter (e => e.get ('wikiEntry').get ('gr') === 3);

          const baseAP = filteredList.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            filteredList as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const baseAP = list.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            list as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForMagicalDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const filteredList = list.filter (e => e.get ('wikiEntry').get ('gr') === 2);

          const baseAP = filteredList.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            filteredList as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForBlessedDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const filteredList = list.filter (e => e.get ('wikiEntry').get ('gr') === 3);

          const baseAP = filteredList.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            filteredList as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector (
  getCurrentHeroPresent,
  Maybe.fmap (getDisAdvantagesSubtypeMax (true))
);

export const getAdventurePointsSpentForSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilities,
  getWiki,
  (maybeList, maybeState, wiki) => Maybe.fromMaybe (0) (
    maybeState.bind (
      state => maybeList.fmap (
        list => {
          const baseAP = list.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ) (0);

          const diffAP = getAdventurePointsSpentDifference (
            list as List<Record<ActiveViewObject>>,
            state,
            wiki
          );

          return baseAP + diffAP;
        }
      )
    )
  )
);

export const getAdventurePointsSpentForEnergies = createMaybeSelector (
  getEnergies,
  R.pipe (
    Maybe.fmap (
      energies => {
        const addedArcaneEnergyCost = getAPRange (4) (0) (energies.get ('addedArcaneEnergyPoints'));
        const addedKarmaPointsCost = getAPRange (4) (0) (energies.get ('addedKarmaPoints'));
        const addedLifePointsCost = getAPRange (4) (0) (energies.get ('addedLifePoints'));

        const boughtBackArcaneEnergyCost = energies
          .get ('permanentArcaneEnergyPoints')
          .get ('redeemed') * 2;

        const boughtBackKarmaPointsCost = energies
          .get ('permanentKarmaPoints')
          .get ('redeemed') * 2;

        return List.of (
          addedArcaneEnergyCost,
          addedKarmaPointsCost,
          addedLifePointsCost,
          boughtBackArcaneEnergyCost,
          boughtBackKarmaPointsCost
        )
          .sum ();
      }
    ),
    Maybe.fromMaybe (0)
  )
);

export const getAdventurePointsSpentForRace = createMaybeSelector (
  getCurrentRace,
  R.pipe (
    Maybe.fmap (race => race.get ('ap')),
    Maybe.fromMaybe (0)
  )
);

export const getAdventurePointsSpentForProfession = createMaybeSelector (
  getCurrentProfession,
  getCurrentProfessionVariant,
  getPhase,
  (maybeProfession, maybeProfessionVariant, maybePhase) => maybePhase
    .bind (Maybe.ensure (R.equals (1)))
    .then (
      maybeProfession.fmap (
        profession => profession.get ('ap') + Maybe.fromMaybe (0) (
          maybeProfessionVariant.fmap (
            professionVariant => professionVariant.get ('ap')
          )
        )
      )
    )
);

export const getAdventurePointsSpentPart = createMaybeSelector (
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  (...cost: number[]) => List.fromArray (cost).sum ()
);

export const getAdventurePointsSpent = createMaybeSelector (
  getAdventurePointsSpentPart,
  getAdventurePointsSpentForProfession,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  (part, professionCost, ...cost: number[]) =>
    List.fromArray (cost).sum () + part + Maybe.fromMaybe (0) (professionCost)
);

export const getAvailableAdventurePoints = createMaybeSelector (
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  (total, spent) => total.fmap (R.add (-spent))
);

export interface DisAdvAdventurePoints extends Array<number> {
  /**
   * Spent AP for Advantages/Disadvantages in total.
   */
  0: number;
  /**
   * Spent AP for magical Advantages/Disadvantages.
   */
  1: number;
  /**
   * Spent AP for blessed Advantages/Disadvantages.
   */
  2: number;
}

export interface AdventurePointsObjectPart {
  spentOnAttributes: number;
  spentOnSkills: number;
  spentOnCombatTechniques: number;
  spentOnSpells: number;
  spentOnLiturgicalChants: number;
  spentOnCantrips: number;
  spentOnBlessings: number;
  spentOnSpecialAbilities: number;
  spentOnEnergies: number;
  spentOnRace: number;
  spentOnProfession: number | undefined;
}

export interface AdventurePointsObjectPart2 {
  total: number;
  spent: number;
  available: number;
  adv: DisAdvAdventurePoints;
  disadv: DisAdvAdventurePoints;
  spentOnAdvantages: number;
  spentOnMagicalAdvantages: number;
  spentOnBlessedAdvantages: number;
  spentOnDisadvantages: number;
  spentOnMagicalDisadvantages: number;
  spentOnBlessedDisadvantages: number;
}

export type AdventurePointsObject = AdventurePointsObjectPart & AdventurePointsObjectPart2;

export const getAdventurePointsObjectPart = createMaybeSelector (
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  getAdventurePointsSpentForProfession,
  (
    spentOnAttributes,
    spentOnSkills,
    spentOnCombatTechniques,
    spentOnSpells,
    spentOnLiturgicalChants,
    spentOnCantrips,
    spentOnBlessings,
    spentOnSpecialAbilities,
    spentOnEnergies,
    spentOnRace,
    spentOnProfession
  ) => Record.ofMaybe<AdventurePointsObjectPart> ({
    spentOnAttributes,
    spentOnSkills,
    spentOnCombatTechniques,
    spentOnSpells,
    spentOnLiturgicalChants,
    spentOnCantrips,
    spentOnBlessings,
    spentOnSpecialAbilities,
    spentOnEnergies,
    spentOnRace,
    spentOnProfession,
  })
);

export const getAdventurePointsObject = createMaybeSelector (
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  getAvailableAdventurePoints,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForBlessedAdvantages,
  getAdventurePointsSpentForMagicalAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForBlessedDisadvantages,
  getAdventurePointsSpentForMagicalDisadvantages,
  getAdventurePointsObjectPart,
  (
    total,
    spent,
    available,
    advantages,
    blessedAdvantages,
    magicalAdvantages,
    disadvantages,
    blessedDisadvantages,
    magicalDisadvantages,
    part
  ): Record<AdventurePointsObject> => part.merge (
    Record.of<AdventurePointsObjectPart2> ({
      total: Maybe.fromMaybe (0) (total),
      spent,
      available: Maybe.fromMaybe (0) (available),
      adv: [advantages, magicalAdvantages, blessedAdvantages],
      disadv: [disadvantages, magicalDisadvantages, blessedDisadvantages],
      spentOnAdvantages: advantages,
      spentOnMagicalAdvantages: magicalAdvantages,
      spentOnBlessedAdvantages: blessedAdvantages,
      spentOnDisadvantages: disadvantages,
      spentOnMagicalDisadvantages: magicalDisadvantages,
      spentOnBlessedDisadvantages: blessedDisadvantages,
    })
  ) as Record<AdventurePointsObject>
);
