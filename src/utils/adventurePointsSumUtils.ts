import R from 'ramda';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getAdventurePointsSpentDifference } from '../utils/adventurePointsUtils';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record } from '../utils/dataUtils';
import { getAPRange } from '../utils/improvementCostUtils';
import { getAllActiveByCategory } from './activatableActiveUtils';

const getAPForAttribute = R.pipe (
  Record.get<Data.AttributeDependent, 'value'> ('value'),
  getAPRange (5) (8)
);

const getAPSpentForAttributes =
  OrderedMap.foldl<Record<Data.AttributeDependent>, number> (
    sum => R.pipe (getAPForAttribute, R.add (sum))
  ) (0);

const getAPForSkill = (skill: Record<Wiki.Skill>) => R.pipe (
  Record.get<Data.SkillDependent, 'value'> ('value'),
  getAPRange (skill.get ('ic')) (0)
);

const getAPSpentForSkills =
  (skills: Wiki.WikiAll['skills']) => OrderedMap.foldl<Record<Data.SkillDependent>, number> (
    sum => e => Maybe.fromMaybe (sum)
                                (Maybe.ap (skills.lookup (e.get ('id')).fmap (getAPForSkill))
                                          (Maybe.return (e)))
  ) (0);

const getAPForCombatTechnique = (skill: Record<Wiki.CombatTechnique>) => R.pipe (
  Record.get<Data.SkillDependent, 'value'> ('value'),
  getAPRange (skill.get ('ic')) (6)
);

const getAPSpentForCombatTechniques =
  (combatTechniques: Wiki.WikiAll['combatTechniques']) =>
    OrderedMap.foldl<Record<Data.SkillDependent>, number> (
      sum => e => Maybe.fromMaybe (sum)
                                  (Maybe.ap (combatTechniques.lookup (e.get ('id'))
                                    .fmap (getAPForCombatTechnique))
                                            (Maybe.return (e)))
    ) (0);

const getAPForSpellOrChant = (skill: Record<Wiki.Spell> | Record<Wiki.LiturgicalChant>) => R.pipe (
  Record.get<Data.ActivatableSkillDependent, 'value'> ('value'),
  getAPRange (skill.get ('ic')) (0)
);

const getAPSpentForSpells =
  (spells: Wiki.WikiAll['spells']) =>
    OrderedMap.foldl<Record<Data.ActivatableSkillDependent>, number> (
      sum => e => Maybe.fromMaybe (sum)
                                  (Maybe.ap (spells.lookup (e.get ('id'))
                                    .fmap (getAPForSpellOrChant))
                                            (Maybe.return (e)))
    ) (0);

const getAPSpentForLiturgicalChants =
  (liturgicalChants: Wiki.WikiAll['liturgicalChants']) =>
    OrderedMap.foldl<Record<Data.ActivatableSkillDependent>, number> (
      sum => e => Maybe.fromMaybe (sum)
                                  (Maybe.ap (liturgicalChants.lookup (e.get ('id'))
                                    .fmap (getAPForSpellOrChant))
                                            (Maybe.return (e)))
    ) (0);

const getAPSpentForCantrips: (cantrips: OrderedSet<string>) => number = OrderedSet.size;
const getAPSpentForBlessings: (cantrips: OrderedSet<string>) => number = OrderedSet.size;

const getAPSpentForAdvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateAdvantages: Data.HeroDependent['advantages']) =>
    R.pipe (
      Maybe.fmap (
        (active: List<Record<Data.ActiveViewObject<Wiki.Advantage>>>) => R.pipe (
          active.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ),
          R.add (
            getAdventurePointsSpentDifference (
              active as List<Record<Data.ActiveViewObject>>,
              stateAdvantages,
              wiki
            )
          )
        ) (0)
      ),
      Maybe.fromMaybe (0)
    );

const getAPSpentForMagicalAdvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateAdvantages: Data.HeroDependent['advantages']) =>
    R.pipe (
      Maybe.fmap (
        List.filter<Record<Data.ActiveViewObject<Wiki.Advantage>>> (
          e => e.get ('wikiEntry').get ('gr') === 2
        )
      ),
      getAPSpentForAdvantages (wiki) (stateAdvantages)
    );

const getAPSpentForBlessedAdvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateAdvantages: Data.HeroDependent['advantages']) =>
    R.pipe (
      Maybe.fmap (
        List.filter<Record<Data.ActiveViewObject<Wiki.Advantage>>> (
          e => e.get ('wikiEntry').get ('gr') === 3
        )
      ),
      getAPSpentForAdvantages (wiki) (stateAdvantages)
    );

const getAPSpentForDisadvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateDisadvantages: Data.HeroDependent['disadvantages']) =>
    R.pipe (
      Maybe.fmap (
        (active: List<Record<Data.ActiveViewObject<Wiki.Disadvantage>>>) => R.pipe (
          active.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ),
          R.add (
            getAdventurePointsSpentDifference (
              active as List<Record<Data.ActiveViewObject>>,
              stateDisadvantages,
              wiki
            )
          )
        ) (0)
      ),
      Maybe.fromMaybe (0)
    );

const getAPSpentForMagicalDisadvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateDisadvantages: Data.HeroDependent['disadvantages']) =>
    R.pipe (
      Maybe.fmap (
        List.filter<Record<Data.ActiveViewObject<Wiki.Disadvantage>>> (
          e => e.get ('wikiEntry').get ('gr') === 2
        )
      ),
      getAPSpentForDisadvantages (wiki) (stateDisadvantages)
    );

const getAPSpentForBlessedDisadvantages = (wiki: Record<Wiki.WikiAll>) =>
  (stateDisadvantages: Data.HeroDependent['disadvantages']) =>
    R.pipe (
      Maybe.fmap (
        List.filter<Record<Data.ActiveViewObject<Wiki.Disadvantage>>> (
          e => e.get ('wikiEntry').get ('gr') === 3
        )
      ),
      getAPSpentForDisadvantages (wiki) (stateDisadvantages)
    );

const getAPSpentForSpecialAbilities = (wiki: Record<Wiki.WikiAll>) =>
  (stateSpecialAbilities: Data.HeroDependent['advantages']) =>
    R.pipe (
      Maybe.fmap (
        (active: List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>) => R.pipe (
          active.foldl<number> (
            sum => obj => sum + Maybe.fromMaybe (0) (
              Maybe.ensure (isNumber) (obj.get ('wikiEntry').get ('cost'))
            )
          ),
          R.add (
            getAdventurePointsSpentDifference (
              active as List<Record<Data.ActiveViewObject>>,
              stateSpecialAbilities,
              wiki
            )
          )
        ) (0)
      ),
      Maybe.fromMaybe (0)
    );

const getAPSpentForEnergies = (energies: Record<Data.Energies>) => {
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
};

export const getAPSpentForRace = (wiki: Record<Wiki.WikiAll>) => R.pipe (
  Maybe.bind_ (wiki.get ('races').lookup),
  Maybe.fmap (race => race.get ('ap')),
  Maybe.fromMaybe (0)
);

/**
 * Pass wiki, profession id, optional profession variant id and the current
 * phase.
 */
export const getAPSpentForProfession = (wiki: Record<Wiki.WikiAll>) =>
  (professionId: Maybe<string>) =>
    (professionVariantId: Maybe<string>) => R.pipe (
      Maybe.ensure (R.equals (1)),
      Maybe.then_ (professionId),
      Maybe.bind_ (wiki.get ('professions').lookup),
      Maybe.fmap (Record.get<Wiki.Profession, 'ap'> ('ap')),
      Maybe.fmap (
        R.add (Maybe.fromMaybe (0)
                              (R.pipe (
                                Maybe.bind_ (wiki.get ('professionVariants').lookup),
                                Maybe.fmap (Record.get<Wiki.ProfessionVariant, 'ap'> ('ap'))
                              ) (professionVariantId)))
      )
    );

interface APObjectPart {
  total: number;
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
  spentOnProfession?: number;
  spentOnAdvantages: number;
  spentOnMagicalAdvantages: number;
  spentOnBlessedAdvantages: number;
  spentOnDisadvantages: number;
  spentOnMagicalDisadvantages: number;
  spentOnBlessedDisadvantages: number;
}

export const getAPObjectAreas = (wiki: Record<Wiki.WikiAll>) =>
  (locale: Record<Data.UIMessages>) =>
    (hero: Data.Hero) =>
      Record.ofMaybe<APObjectPart> ({
        total: hero.get ('adventurePoints').get ('total'),
        spentOnAttributes: getAPSpentForAttributes (hero.get ('attributes')),
        spentOnSkills: getAPSpentForSkills (wiki.get ('skills'))
                                           (hero.get ('skills')),
        spentOnCombatTechniques: getAPSpentForCombatTechniques (wiki.get ('combatTechniques'))
                                                               (hero.get ('combatTechniques')),
        spentOnSpells: getAPSpentForSpells (wiki.get ('spells'))
                                           (hero.get ('spells')),
        spentOnLiturgicalChants: getAPSpentForLiturgicalChants (wiki.get ('liturgicalChants'))
                                                               (hero.get ('liturgicalChants')),
        spentOnCantrips: getAPSpentForCantrips (hero.get ('cantrips')),
        spentOnBlessings: getAPSpentForBlessings (hero.get ('blessings')),
        spentOnEnergies: getAPSpentForEnergies (hero.get ('energies')),
        spentOnRace: getAPSpentForRace (wiki) (hero.lookup ('race')),
        spentOnProfession: getAPSpentForProfession (wiki)
                                                   (hero.lookup ('profession'))
                                                   (hero.lookup ('professionVariant'))
                                                   (hero.get ('phase')),
        spentOnSpecialAbilities:
          getAPSpentForSpecialAbilities (wiki)
                                        (hero.get ('specialAbilities'))
                                        (getAllActiveByCategory (Categories.SPECIAL_ABILITIES)
                                                                (false)
                                                                (Just (hero))
                                                                (locale)
                                                                (wiki)),
        spentOnAdvantages:
          getAPSpentForAdvantages (wiki)
                                  (hero.get ('advantages'))
                                  (getAllActiveByCategory (Categories.ADVANTAGES)
                                                          (false)
                                                          (Just (hero))
                                                          (locale)
                                                          (wiki)),
        spentOnMagicalAdvantages:
          getAPSpentForMagicalAdvantages (wiki)
                                         (hero.get ('advantages'))
                                         (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                 (false)
                                                                 (Just (hero))
                                                                 (locale)
                                                                 (wiki)),
        spentOnBlessedAdvantages:
          getAPSpentForBlessedAdvantages (wiki)
                                         (hero.get ('advantages'))
                                         (getAllActiveByCategory (Categories.ADVANTAGES)
                                                                 (false)
                                                                 (Just (hero))
                                                                 (locale)
                                                                 (wiki)),
        spentOnDisadvantages:
          getAPSpentForDisadvantages (wiki)
                                     (hero.get ('disadvantages'))
                                     (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                             (false)
                                                             (Just (hero))
                                                             (locale)
                                                             (wiki)),
        spentOnMagicalDisadvantages:
          getAPSpentForMagicalDisadvantages (wiki)
                                            (hero.get ('disadvantages'))
                                            (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                    (false)
                                                                    (Just (hero))
                                                                    (locale)
                                                                    (wiki)),
        spentOnBlessedDisadvantages:
          getAPSpentForBlessedDisadvantages (wiki)
                                            (hero.get ('disadvantages'))
                                            (getAllActiveByCategory (Categories.DISADVANTAGES)
                                                                    (false)
                                                                    (Just (hero))
                                                                    (locale)
                                                                    (wiki)),
      });

const getAPSpent = (ap: Record<APObjectPart>) =>
  List.of (
    ap.get ('spentOnAttributes'),
    ap.get ('spentOnSkills'),
    ap.get ('spentOnCombatTechniques'),
    ap.get ('spentOnSpells'),
    ap.get ('spentOnLiturgicalChants'),
    ap.get ('spentOnCantrips'),
    ap.get ('spentOnBlessings'),
    ap.get ('spentOnSpecialAbilities'),
    ap.get ('spentOnEnergies'),
    ap.get ('spentOnRace'),
    ap.lookupWithDefault (0) ('spentOnProfession'),
    ap.get ('spentOnAdvantages'),
    ap.get ('spentOnMagicalAdvantages'),
    ap.get ('spentOnBlessedAdvantages'),
    ap.get ('spentOnDisadvantages'),
    ap.get ('spentOnMagicalDisadvantages'),
    ap.get ('spentOnBlessedDisadvantages'),
  )
    .sum ();

const getAPAvailable = (ap: Record<APObjectPart>) => (spent: number) => ap.get ('total') - spent;

interface APObject extends APObjectPart {
  spent: number;
  available: number;
}

export const getAPObject = (wiki: Record<Wiki.WikiAll>) =>
  (locale: Record<Data.UIMessages>) =>
    (hero: Data.Hero): Record<APObject> => {
      const areas = getAPObjectAreas (wiki) (locale) (hero);

      const spent = getAPSpent (areas);

      const available = getAPAvailable (areas) (spent);

      return areas.merge (
        Record.of ({
          spent,
          available
        })
      )
    };
