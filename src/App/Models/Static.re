open GenericHelpers;

module SourceRef = {
  [@genType "SourceRef"]
  type t = {
    id: string,
    page: (int, int),
  };
};

module Erratum = {
  [@genType "Erratum"]
  type t = {
    date: Js.Date.t,
    description: string,
  };
};

module Prerequisites = {
  module Sex = {
    [@genType "Sex"]
    type sex =
      | Male
      | Female;

    [@genType "SexPrerequisite"]
    type t = sex;
  };

  module Race = {
    type raceId = oneOrMany(int);

    [@genType "RacePrerequisite"]
    type t = {
      id: raceId,
      active: bool,
    };
  };

  module Culture = {
    type cultureId = oneOrMany(int);

    [@genType "CulturePrerequisite"]
    type t = cultureId;
  };

  module SocialStatus = {
    [@genType "SocialPrerequisite"]
    type t = int;
  };

  module Pact = {
    [@genType "PactPrerequisite"]
    type t = {
      category: int,
      domain: Maybe.t(oneOrMany(int)),
      level: Maybe.t(int),
    };
  };

  module PrimaryAttribute = {
    type primaryAttributeType =
      | Magical
      | Blessed;

    [@genType "PrimaryAttributePrerequisite"]
    type t = {
      value: int,
      scope: primaryAttributeType,
    };
  };

  module Activatable = {
    type id =
      | Advantage(int)
      | Disadvantage(int)
      | SpecialAbility(int);

    [@genType "ActivatablePrerequisite"]
    type t = {
      id,
      active: bool,
      sid: Maybe.t(Ids.selectOptionId),
      sid2: Maybe.t(Ids.selectOptionId),
      tier: Maybe.t(int),
    };
  };

  module ActivatableSkill = {
    type id =
      | Spell(int)
      | LiturgicalChant(int);

    [@genType "ActivatableSkillPrerequisite"]
    type t = {
      id,
      active: bool,
    };
  };

  module ActivatableMultiEntry = {
    [@genType "ActivatableMultiEntryPrerequisite"]
    type t = {
      id: list(Activatable.id),
      active: bool,
      sid: Maybe.t(Ids.selectOptionId),
      sid2: Maybe.t(Ids.selectOptionId),
      tier: Maybe.t(int),
    };
  };

  module ActivatableMultiSelect = {
    [@genType "ActivatableMultiSelectPrerequisite"]
    type t = {
      id: Activatable.id,
      active: bool,
      sid: list(Ids.selectOptionId),
      sid2: Maybe.t(Ids.selectOptionId),
      tier: Maybe.t(int),
    };
  };

  module Increasable = {
    type id =
      | Attribute(int)
      | Skill(int)
      | CombatTechnique(int)
      | Spell(int)
      | LiturgicalChant(int);

    [@genType "IncreasablePrerequisite"]
    type t = {
      id,
      value: int,
    };
  };

  module IncreasableMultiEntry = {
    [@genType "IncreasableMultiEntryPrerequisite"]
    type t = {
      id: list(Increasable.id),
      value: int,
    };
  };

  type tProfession = {
    sex: Maybe.t(Sex.t),
    race: Maybe.t(Race.t),
    culture: Maybe.t(Culture.t),
    activatable: list(Activatable.t),
    increasable: list(Increasable.t),
  };

  [@genType "Prerequisites"]
  type t = {
    sex: Maybe.t(Sex.t),
    race: Maybe.t(Race.t),
    culture: Maybe.t(Culture.t),
    pact: Maybe.t(Pact.t),
    social: Maybe.t(SocialStatus.t),
    primaryAttribute: Maybe.t(PrimaryAttribute.t),
    activatable: list(Activatable.t),
    activatableMultiEntry: list(ActivatableMultiEntry.t),
    activatableMultiSelect: list(ActivatableMultiSelect.t),
    increasable: list(Increasable.t),
    increasableMultiEntry: list(IncreasableMultiEntry.t),
  };

  type tWithLevel = {
    sex: Maybe.t(Sex.t),
    race: Maybe.t(Race.t),
    culture: Maybe.t(Culture.t),
    pact: Maybe.t(Pact.t),
    social: Maybe.t(SocialStatus.t),
    primaryAttribute: Maybe.t(PrimaryAttribute.t),
    activatable: list(Activatable.t),
    activatableMultiEntry: list(ActivatableMultiEntry.t),
    activatableMultiSelect: list(ActivatableMultiSelect.t),
    increasable: list(Increasable.t),
    increasableMultiEntry: list(IncreasableMultiEntry.t),
    levels: IntMap.t(t),
  };

  type tWithLevelDisAdv = {
    commonSuggestedByRCP: bool,
    sex: Maybe.t(Sex.t),
    race: Maybe.t(Race.t),
    culture: Maybe.t(Culture.t),
    pact: Maybe.t(Pact.t),
    social: Maybe.t(SocialStatus.t),
    primaryAttribute: Maybe.t(PrimaryAttribute.t),
    activatable: list(Activatable.t),
    activatableMultiEntry: list(ActivatableMultiEntry.t),
    activatableMultiSelect: list(ActivatableMultiSelect.t),
    increasable: list(Increasable.t),
    increasableMultiEntry: list(IncreasableMultiEntry.t),
    levels: IntMap.t(t),
  };

  [@genType "OverridePrerequisite"]
  type overridePrerequisite =
    | Hide
    | ReplaceWith(string);

  type tIndex = {
    sex: Maybe.t(overridePrerequisite),
    race: Maybe.t(overridePrerequisite),
    culture: Maybe.t(overridePrerequisite),
    pact: Maybe.t(overridePrerequisite),
    social: Maybe.t(overridePrerequisite),
    primaryAttribute: Maybe.t(overridePrerequisite),
    activatable: IntMap.t(overridePrerequisite),
    activatableMultiEntry: IntMap.t(overridePrerequisite),
    activatableMultiSelect: IntMap.t(overridePrerequisite),
    increasable: IntMap.t(overridePrerequisite),
    increasableMultiEntry: IntMap.t(overridePrerequisite),
  };

  type tIndexWithLevel = {
    sex: Maybe.t(overridePrerequisite),
    race: Maybe.t(overridePrerequisite),
    culture: Maybe.t(overridePrerequisite),
    pact: Maybe.t(overridePrerequisite),
    social: Maybe.t(overridePrerequisite),
    primaryAttribute: Maybe.t(overridePrerequisite),
    activatable: IntMap.t(overridePrerequisite),
    activatableMultiEntry: IntMap.t(overridePrerequisite),
    activatableMultiSelect: IntMap.t(overridePrerequisite),
    increasable: IntMap.t(overridePrerequisite),
    increasableMultiEntry: IntMap.t(overridePrerequisite),
    levels: IntMap.t(tIndex),
  };
};

module Skill = {
  module Application = {
    type t = {
      id: int,
      name: string,
      prerequisite: Maybe.t(Prerequisites.Activatable.t),
    };
  };

  module Use = {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisites.Activatable.t,
    };
  };

  type encumbrance =
    | True
    | False
    | Maybe;

  type t = {
    id: int,
    name: string,
    check: list(int),
    encumbrance,
    encumbranceDescription: Maybe.t(string),
    gr: int,
    ic: IC.t,
    applications: list(Application.t),
    applicationsInput: Maybe.t(string),
    uses: list(Use.t),
    tools: Maybe.t(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module SelectOption = {
  type t = {
    id: Ids.selectOptionId,
    name: string,
    cost: Maybe.t(int),
    prerequisites: Maybe.t(unit),
    description: Maybe.t(string),
    isSecret: Maybe.t(bool),
    languages: Maybe.t(list(int)),
    continent: Maybe.t(int),
    isExtinct: Maybe.t(bool),
    specializations: Maybe.t(list(string)),
    specializationInput: Maybe.t(string),
    gr: Maybe.t(int),
    level: Maybe.t(int),
    target: Maybe.t(string),
    applications: Maybe.t(list(Skill.Application.t)),
    applicationInput: Maybe.t(string),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Advantage = {
  type cost =
    | Flat(int)
    | PerLevel(list(int));

  type t = {
    id: int,
    name: string,
    cost,
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    input: Maybe.t(string),
    max: Maybe.t(int),
    levels: Maybe.t(int),
    select: Maybe.t(list(SelectOption.t)),
    rules: string,
    range: Maybe.t(string),
    actions: Maybe.t(string),
    prerequisites: Prerequisites.tWithLevelDisAdv,
    prerequisitesText: Maybe.t(string),
    prerequisitesTextIndex: Maybe.t(Prerequisites.tIndexWithLevel),
    prerequisitesTextStart: Maybe.t(string),
    prerequisitesTextEnd: Maybe.t(string),
    apValue: Maybe.t(string),
    apValueAppend: Maybe.t(string),
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module AnimistForce = {
  // TODO: AnimistForce
};

module Attribute = {
  type t = {
    id: int,
    name: string,
    short: string,
  };
};

module BlessedTradition = {
  type t = {
    id: int,
    numId: int,
    name: string,
    primary: int,
    aspects: Maybe.t((int, int)),
  };
};

module Blessing = {
  // TODO: Blessing
};

module Cantrip = {
  // TODO: Cantrip
};

module CombatTechnique = {
  type t = {
    id: int,
    name: string,
    ic: IC.t,
    primary: list(int),
    special: Maybe.t(string),
    hasNoParry: bool,
    bpr: int,
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Condition = {
  type t = {
    id: int,
    name: string,
    description: Maybe.t(string),
    levelColumnDescription: Maybe.t(string),
    levelDescriptions: (string, string, string, string),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Culture = {
  type commonProfessionId =
    | Profession(int)
    | ProfessionGroup(int);

  type commonProfessions =
    | All
    | OneOf(list(commonProfessionId))
    | ExceptFor(list(commonProfessionId));

  module IncreaseSkill = {
    type t = {
      id: int,
      value: int,
    };
  };

  type t = {
    id: int,
    name: string,
    culturalPackageAdventurePoints: int,
    languages: list(int),
    scripts: list(int),
    socialStatus: list(int),
    areaKnowledge: string,
    areaKnowledgeShort: string,
    commonProfessions: (
      commonProfessions,
      commonProfessions,
      commonProfessions,
    ),
    commonMundaneProfessions: Maybe.t(string),
    commonMagicProfessions: Maybe.t(string),
    commonBlessedProfessions: Maybe.t(string),
    commonAdvantages: list(int),
    commonAdvantagesText: Maybe.t(string),
    commonDisadvantages: list(int),
    commonDisadvantagesText: Maybe.t(string),
    uncommonAdvantages: list(int),
    uncommonAdvantagesText: Maybe.t(string),
    uncommonDisadvantages: list(int),
    uncommonDisadvantagesText: Maybe.t(string),
    commonSkills: list(int),
    uncommonSkills: list(int),
    commonNames: string,
    culturalPackageSkills: list(IncreaseSkill.t),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Curse = {
  // TODO: Curse
};

module DerivedCharacteristic = {
  type t = {
    id: string,
    name: string,
    short: string,
    calc: string,
    calcHalfPrimary: Maybe.t(string),
    calcNoPrimary: Maybe.t(string),
  };
};

module Disadvantage = {
  type t = {
    id: int,
    name: string,
    cost: Advantage.cost,
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    input: Maybe.t(string),
    max: Maybe.t(int),
    levels: Maybe.t(int),
    select: Maybe.t(list(SelectOption.t)),
    rules: string,
    range: Maybe.t(string),
    actions: Maybe.t(string),
    prerequisites: Prerequisites.tWithLevelDisAdv,
    prerequisitesText: Maybe.t(string),
    prerequisitesTextIndex: Maybe.t(Prerequisites.tIndexWithLevel),
    prerequisitesTextStart: Maybe.t(string),
    prerequisitesTextEnd: Maybe.t(string),
    apValue: Maybe.t(string),
    apValueAppend: Maybe.t(string),
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module DominationRitual = {
  // TODO: DominationRitual
};

module ElvenMagicalSong = {
  // TODO: ElvenMagicalSong
};

module EquipmentPackage = {
  type t = {
    id: int,
    name: string,
    items: StrMap.t(int),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module ExperienceLevel = {
  type t = {
    id: int,
    name: string,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
  };
};

module FocusRule = {
  type t = {
    id: int,
    name: string,
    level: int,
    subject: int,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module GeodeRitual = {
  // TODO: GeodeRitual
};

module Item = {
  // TODO: Item
};

module LiturgicalChant = {
  // TODO: LiturgicalChant
};

module MagicalDance = {
  // TODO: MagicalDance
};

module MagicalMelody = {
  // TODO: MagicalMelody
};

module MagicalTradition = {
  type t = {
    id: int,
    numId: Maybe.t(int),
    name: string,
    primary: Maybe.t(int),
    aeMod: Maybe.t(float),
    canLearnCantrips: bool,
    canLearnSpells: bool,
    canLearnRituals: bool,
    allowMultipleTraditions: bool,
    isDisAdvAPMaxHalved: bool,
    areDisAdvRequiredApplyToMagActionsOrApps: bool,
  };
};

module Messages = {
  // TODO: Messages
};

module OptionalRule = {
  type t = {
    id: int,
    name: string,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module PactCategory = {
  type t = {
    id: int,
    name: string,
    types: IntMap.t(string),
    domains: IntMap.t(string),
  };
};

module Patron = {
  module Category = {
    [@genType "PatronCategory"]
    type t = {
      /**
     * The patron category's ID.
     */
      id: int,
      /**
     * The name of the patron category.
     */
      name: string,
      /**
     * The list of cultures where patrons from this category can be the primary
     * patron.
     */
      primaryPatronCultures: array(int),
    };
  };

  [@genType "Patron"]
  type t = {
    /**
   * The patron's ID.
   */
    id: int,
    /**
   * The name of the patron.
   */
    name: string,
    /**
   * The category of the patron.
   */
    category: int,
    /**
   * The patron-specific skills.
   */
    skills: (int, int, int),
    /**
   * If defined, the patron is limited to the listed cultures.
   */
    limitedToCultures: array(int),
    /**
   * If `true`, the patron is limited to every culture *except* the listed
   * cultures in `limitedToCultures`. Does not have an effect if
   * `limitedToCultures` is not defined.
   */
    isLimitedToCulturesReverse: Maybe.t(bool),
  };
};

module Profession = {
  module NameBySex = {
    type t = {
      m: string,
      f: string,
    };
  };

  module IncreaseSkillList = {
    type t = {
      id: list(int),
      value: int,
    };
  };

  module Options = {
    type variantOverride('a) =
      | Remove
      | Overwrite('a);

    module CantripSelection = {
      type t = {
        amount: int,
        sid: list(int),
      };
    };

    module CombatTechniqueSelection = {
      type second = {
        amount: int,
        value: int,
      };

      type t = {
        amount: int,
        value: int,
        second: Maybe.t(second),
        sid: list(int),
      };

      type tForVariant = variantOverride(t);
    };

    module CurseSelection = {
      type t = int;
    };

    module LanguageScriptSelection = {
      type t = int;

      type tForVariant = variantOverride(t);
    };

    module SkillSpecializationSelection = {
      type t = GenericHelpers.oneOrMany(int);

      type tForVariant = variantOverride(t);
    };

    module SkillSelection = {
      type t = {
        /**
     * If specified, only choose from skills of the specified group.
     */
        gr: Maybe.t(int),
        /**
     * The AP value the user can spend.
     */
        value: int,
      };
    };

    module TerrainKnowledgeSelection = {
      type t = list(int);
    };

    type t = {
      cantrips: Maybe.t(CantripSelection.t),
      combatTechniques: Maybe.t(CombatTechniqueSelection.t),
      curses: Maybe.t(CurseSelection.t),
      languagesScripts: Maybe.t(LanguageScriptSelection.t),
      skillSpecialization: Maybe.t(SkillSpecializationSelection.t),
      skills: Maybe.t(SkillSelection.t),
      terrainKnowledge: Maybe.t(TerrainKnowledgeSelection.t),
      guildMageUnfamiliarSpell: bool,
    };

    type tForVariant = {
      cantrips: Maybe.t(CantripSelection.t),
      combatTechniques: Maybe.t(CombatTechniqueSelection.tForVariant),
      curses: Maybe.t(CurseSelection.t),
      languagesScripts: Maybe.t(LanguageScriptSelection.tForVariant),
      skillSpecialization: Maybe.t(SkillSpecializationSelection.tForVariant),
      skills: Maybe.t(SkillSelection.t),
      terrainKnowledge: Maybe.t(TerrainKnowledgeSelection.t),
      guildMageUnfamiliarSpell: bool,
    };
  };

  type name =
    | Const(string)
    | BySex(NameBySex.t);

  type skillIncrease =
    | Flat(Culture.IncreaseSkill.t)
    | Selection(IncreaseSkillList.t);

  module Variant = {
    type t = {
      id: int,
      name,
      ap: int,
      prerequisites: Prerequisites.tProfession,
      selections: Options.tForVariant,
      specialAbilities: list(Prerequisites.Activatable.t),
      combatTechniques: list(Culture.IncreaseSkill.t),
      skills: list(Culture.IncreaseSkill.t),
      spells: list(skillIncrease),
      liturgicalChants: list(skillIncrease),
      blessings: list(int),
      precedingText: Maybe.t(string),
      fullText: Maybe.t(string),
      concludingText: Maybe.t(string),
      errata: list(Erratum.t),
    };
  };

  type t = {
    id: int,
    name,
    subname: Maybe.t(name),
    ap: Maybe.t(int),
    prerequisites: Prerequisites.tProfession,
    prerequisitesStart: Maybe.t(string),
    prerequisitesEnd: Maybe.t(string),
    selections: Options.t,
    specialAbilities: list(Prerequisites.Activatable.t),
    combatTechniques: list(Culture.IncreaseSkill.t),
    skills: list(Culture.IncreaseSkill.t),
    spells: list(skillIncrease),
    liturgicalChants: list(skillIncrease),
    blessings: list(int),
    suggestedAdvantages: list(int),
    suggestedAdvantagesText: Maybe.t(string),
    suggestedDisadvantages: list(int),
    suggestedDisadvantagesText: Maybe.t(string),
    unsuitableAdvantages: list(int),
    unsuitableAdvantagesText: Maybe.t(string),
    unsuitableDisadvantages: list(int),
    unsuitableDisadvantagesText: Maybe.t(string),
    isVariantRequired: bool,
    variants: list(Variant.t),
    gr: int,
    /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
    subgr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Publication = {
  type t = {
    id: string,
    name: string,
    short: string,
    isCore: bool,
    isAdultContent: bool,
  };
};

module Race = {
  module Die = {
    type t = {
      amount: int,
      sides: int,
    };
  };

  module Variant = {
    type t = {
      id: int,
      name: string,
      commonCultures: list(int),
      commonAdvantages: list(int),
      commonAdvantagesText: Maybe.t(string),
      commonDisadvantages: list(int),
      commonDisadvantagesText: Maybe.t(string),
      uncommonAdvantages: list(int),
      uncommonAdvantagesText: Maybe.t(string),
      uncommonDisadvantages: list(int),
      uncommonDisadvantagesText: Maybe.t(string),
      hairColors: list(int),
      eyeColors: list(int),
      sizeBase: int,
      sizeRandom: list(Die.t),
    };
  };

  type t = {
    id: int,
    name: string,
    ap: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: IntMap.t(int),
    attributeAdjustmentsSelection: (int, list(int)),
    attributeAdjustmentsText: string,
    commonCultures: list(int),
    automaticAdvantages: list(int),
    automaticAdvantagesText: Maybe.t(string),
    stronglyRecommendedAdvantages: list(int),
    stronglyRecommendedAdvantagesText: Maybe.t(string),
    stronglyRecommendedDisadvantages: list(int),
    stronglyRecommendedDisadvantagesText: Maybe.t(string),
    commonAdvantages: list(int),
    commonAdvantagesText: Maybe.t(string),
    commonDisadvantages: list(int),
    commonDisadvantagesText: Maybe.t(string),
    uncommonAdvantages: list(int),
    uncommonAdvantagesText: Maybe.t(string),
    uncommonDisadvantages: list(int),
    uncommonDisadvantagesText: Maybe.t(string),
    hairColors: Maybe.t(list(int)),
    eyeColors: Maybe.t(list(int)),
    sizeBase: Maybe.t(int),
    sizeRandom: Maybe.t(list(Die.t)),
    weightBase: int,
    weightRandom: list(Die.t),
    variants: list(Variant.t),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module RogueSpell = {
  // TODO: RogueSpell
};

module SkillGroup = {
  type t = {
    id: int,
    name: string,
    fullName: string,
  };
};

module SpecialAbility = {
  // TODO: SpecialAbility
};

module Spell = {
  // TODO: Spell
};

module State = {
  type t = {
    id: int,
    name: string,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module ZibiljaRitual = {
  // TODO: ZibiljaRitual
};

type t = {
  // advantages: StrMap.t(Advantage.t),
  // animistForces: StrMap.t(AnimistForce.t),
  arcaneBardTraditions: IntMap.t(string),
  arcaneDancerTraditions: IntMap.t(string),
  armorTypes: IntMap.t(string),
  aspects: IntMap.t(string),
  attributes: StrMap.t(Attribute.t),
  // blessedTraditions: StrMap.t(BlessedTradition.t),
  // blessings: StrMap.t(Blessing.t),
  brews: IntMap.t(string),
  // cantrips: StrMap.t(Cantrip.t),
  combatSpecialAbilityGroups: IntMap.t(string),
  combatTechniqueGroups: IntMap.t(string),
  // combatTechniques: StrMap.t(CombatTechnique.t),
  // conditions: StrMap.t(Condition.t),
  // cultures: StrMap.t(Culture.t),
  // curses: StrMap.t(Curse.t),
  // derivedCharacteristics: StrMap.t(DerivedCharacteristic),
  // disadvantages: StrMap.t(Disadvantage.t),
  // dominationRituals: StrMap.t(DominationRitual.t),
  // elvenMagicalSongs: StrMap.t(ElvenMagicalSong.t),
  // itemTemplates: StrMap.t(ItemTemplate.t),
  equipmentGroups: IntMap.t(string),
  // equipmentPackages: StrMap.t(EquipmentPackage.t),
  // experienceLevels: StrMap.t(ExperienceLevel.t),
  eyeColors: IntMap.t(string),
  // focusRules: StrMap.t(FocusRule.t),
  // geodeRituals: StrMap.t(GeodeRitual.t),
  hairColors: IntMap.t(string),
  liturgicalChantEnhancements: IntMap.t(SelectOption.t),
  liturgicalChantGroups: IntMap.t(string),
  // liturgicalChants: StrMap.t(LiturgicalChant.t),
  // magicalDances: StrMap.t(MagicalDance.t),
  // magicalMelodies: StrMap.t(MagicalMelody.t),
  // magicalTraditions: StrMap.t(MagicalTradition.t),
  optionalRules: StrMap.t(OptionalRule.t),
  // pacts: IntMap.t(PactCategory.t),
  // professions: StrMap.t(Profession.t),
  // professionVariants: StrMap.t(ProfessionVariant.t),
  properties: IntMap.t(string),
  publications: StrMap.t(Publication.t),
  // races: StrMap.t(Race),
  // raceVariants: StrMap.t(RaceVariant.t),
  // reaches: IntMap.t(string),
  // rogueSpells: StrMap.t(RogueSpell.t),
  // skillGroups: IntMap.t(SkillGroup.t),
  skills: StrMap.t(Skill.t),
  socialStatuses: IntMap.t(string),
  // specialAbilities: StrMap.t(SpecialAbility.t),
  specialAbilityGroups: IntMap.t(string),
  spellEnhancements: IntMap.t(SelectOption.t),
  spellGroups: IntMap.t(string),
  // spells: StrMap.t(Spell.t),
  // states: StrMap.t(State.t),
  subjects: IntMap.t(string),
  tribes: IntMap.t(string),
  // ui: L10n,
  // zibiljaRituals: StrMap.t(ZibiljaRitual.t),
};
