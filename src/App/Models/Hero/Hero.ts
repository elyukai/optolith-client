import * as IntMap from "../../../Data/IntMap"
import * as IntSet from "../../../Data/IntSet"
import * as List from "../../../Data/List"
import * as StrSet from "../../../Data/StrSet"
import * as ReHero from "../Hero.gen"
import { StaticData } from "../Wiki/WikiModel"

export type Hero = ReHero.Hero

/**
 * Creates a new `Hero` object based on the input the user gives when creating
 * a new hero.
 */
export const getInitialHeroObject =
  (staticData: StaticData) =>
  (id: number) =>
  (name: string) =>
  (sex: ReHero.Sex) =>
  (experienceLevel: number) =>
  (totalAp: number) =>
  (enableAllRuleBooks: boolean) =>
  (enabledRuleBooks: StrSet.StrSet): Hero =>
    ({
      id,
      locale: staticData.messages.id,
      dateCreated: new Date (),
      dateModified: new Date (),
      phase: "Outline",
      name,
      adventurePointsTotal: totalAp,
      isCulturalPackageActive: false,
      sex,
      experienceLevel,
      personalData: { },
      advantages: IntMap.empty,
      disadvantages: IntMap.empty,
      specialAbilities: IntMap.empty,
      attributes: IntMap.empty,
      attributeAdjustmentSelected: 0,
      energies: {
        addedArcaneEnergyPoints: 0,
        addedKarmaPoints: 0,
        addedLifePoints: 0,
        permanentArcaneEnergyPoints: {
          lost: 0,
          boughtBack: 0,
        },
        permanentKarmaPoints: {
          lost: 0,
          boughtBack: 0,
        },
        permanentLifePoints: {
          lost: 0,
        },
      },
      skills: IntMap.empty,
      combatTechniques: IntMap.empty,
      spells: IntMap.empty,
      cantrips: IntSet.empty,
      liturgicalChants: IntMap.empty,
      blessings: IntSet.empty,
      items: IntMap.empty,
      hitZoneArmors: IntMap.empty,
      purse: {
        ducats: 0,
        silverthalers: 0,
        halers: 0,
        kreutzers: 0,
      },
      rules: {
        activeFocusRules: IntMap.empty,
        activeOptionalRules: IntMap.empty,
        activePublications: enabledRuleBooks,
        areAllPublicationsActive: enableAllRuleBooks,
      },
      pets: IntMap.empty,
      combatStyleDependencies: List.empty,
      magicalStyleDependencies: List.empty,
      blessedStyleDependencies: List.empty,
      skillStyleDependencies: List.empty,
      socialStatusDependencies: List.empty,
      transferredUnfamiliarSpells: List.empty,
    })
