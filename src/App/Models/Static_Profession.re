type nameBySex = {
  m: string,
  f: string,
};

type name =
  | Const(string)
  | BySex(nameBySex);

type variantOverride('a) =
  | Remove
  | Override('a);

type skillSpecializationOption = GenericHelpers.oneOrMany(int);

type variantSkillSpecializationOption =
  variantOverride(skillSpecializationOption);

type languageAndScriptOption = int;

type variantLanguageAndScriptOption =
  variantOverride(languageAndScriptOption);

type combatTechniqueSecondOption = {
  amount: int,
  value: int,
};

type combatTechniqueOption = {
  amount: int,
  value: int,
  second: Maybe.t(combatTechniqueSecondOption),
  sid: list(int),
};

type variantCombatTechniqueOption = variantOverride(combatTechniqueOption);

type cantripOption = {
  amount: int,
  sid: list(int),
};

type curseOption = int;

type terrainKnowledgeOption = list(int);

type skillOption = {
  /**
   * If specified, only choose from skills of the specified group.
   */
  gr: Maybe.t(int),
  /**
   * The AP value the user can spend.
   */
  value: int,
};

type options = {
  skillSpecialization: Maybe.t(skillSpecializationOption),
  languageScript: Maybe.t(languageAndScriptOption),
  combatTechnique: Maybe.t(combatTechniqueOption),
  cantrip: Maybe.t(cantripOption),
  curse: Maybe.t(curseOption),
  terrainKnowledge: Maybe.t(terrainKnowledgeOption),
  skill: Maybe.t(skillOption),
  guildMageUnfamiliarSpell: bool,
};

type variantOptions = {
  skillSpecialization: Maybe.t(variantSkillSpecializationOption),
  languageScript: Maybe.t(variantLanguageAndScriptOption),
  combatTechnique: Maybe.t(variantCombatTechniqueOption),
  cantrip: Maybe.t(cantripOption),
  curse: Maybe.t(curseOption),
  terrainKnowledge: Maybe.t(terrainKnowledgeOption),
  skill: Maybe.t(skillOption),
  guildMageUnfamiliarSpell: bool,
};

type variant = {
  id: int,
  name,
  cost: int,
  prerequisites: Static_Prerequisites.tProfession,
  options: variantOptions,
  specialAbilities: list(Static_Prerequisites.activatable),
  combatTechniques: IntMap.t(int),
  skills: IntMap.t(int),
  spells: IntMap.t(GenericHelpers.oneOrMany(int)),
  liturgicalChants: IntMap.t(GenericHelpers.oneOrMany(int)),
  blessings: list(int),
  precedingText: Maybe.t(string),
  fullText: Maybe.t(string),
  concludingText: Maybe.t(string),
  errata: list(Static_Erratum.t),
};

type t = {
  id: int,
  name,
  subname: Maybe.t(name),
  cost: int,
  prerequisites: Static_Prerequisites.tProfession,
  prerequisitesStart: Maybe.t(string),
  options,
  specialAbilities: list(Static_Prerequisites.activatable),
  combatTechniques: IntMap.t(int),
  skills: IntMap.t(int),
  spells: IntMap.t(GenericHelpers.oneOrMany(int)),
  liturgicalChants: IntMap.t(GenericHelpers.oneOrMany(int)),
  blessings: list(int),
  suggestedAdvantages: list(int),
  suggestedAdvantagesText: Maybe.t(string),
  suggestedDisadvantages: list(int),
  suggestedDisadvantagesText: Maybe.t(string),
  unsuitableAdvantages: list(int),
  unsuitableAdvantagesText: Maybe.t(string),
  unsuitableDisadvantages: list(int),
  unsuitableDisadvantagesText: Maybe.t(string),
  variants: IntMap.t(variant),
  isVariantRequired: bool,
  gr: int,
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
  sgr: int,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  let nameBySex = json => {
    m: json |> field("m", string),
    f: json |> field("f", string),
  };

  let name =
    oneOf([
      json => json |> nameBySex |> (x => BySex(x)),
      json => json |> string |> (x => Const(x)),
    ]);

  type variantL10n = {
    id: int,
    name,
    activatablePrerequisites:
      Maybe.t(list(Static_Prerequisites.activatable)),
    precedingText: Maybe.t(string),
    fullText: Maybe.t(string),
    concludingText: Maybe.t(string),
    errata: list(Static_Erratum.t),
  };

  let variantL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", name),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Static_Prerequisites.Decode.activatable),
         ),
    precedingText: json |> optionalField("precedingText", string),
    fullText: json |> optionalField("fullText", string),
    concludingText: json |> optionalField("concludingText", string),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let variantOverride = (decoder, json) =>
    oneOf(
      [
        json => json |> const(false) |> (_ => Remove),
        json => json |> decoder |> (x => Override(x)),
      ],
      json,
    );

  let skillSpecializationOption = Static_Prerequisites.Decode.oneOrManyInt;

  let variantSkillSpecializationOption =
    variantOverride(skillSpecializationOption);

  let languageAndScriptOption = int;

  let variantLanguageAndScriptOption =
    variantOverride(languageAndScriptOption);

  let combatTechniqueSecondOption = json => {
    amount: json |> field("amount", int),
    value: json |> field("value", int),
  };

  let combatTechniqueOption = json => {
    amount: json |> field("amount", int),
    value: json |> field("value", int),
    second: json |> optionalField("second", combatTechniqueSecondOption),
    sid: json |> field("sid", list(int)),
  };

  let variantCombatTechniqueOption = variantOverride(combatTechniqueOption);

  let cantripOption = json => {
    amount: json |> field("amount", int),
    sid: json |> field("sid", list(int)),
  };

  let curseOption = int;

  let terrainKnowledgeOption = list(int);

  let skillOption = json => {
    gr: json |> optionalField("gr", int),
    value: json |> field("value", int),
  };

  type variantUniv = {
    id: int,
    cost: int,
    sexDependency: Maybe.t(Static_Prerequisites.sex),
    raceDependency: Maybe.t(Static_Prerequisites.race),
    cultureDependency: Maybe.t(Static_Prerequisites.culture),
    activatablePrerequisites:
      Maybe.t(list(Static_Prerequisites.activatable)),
    increasablePrerequisites:
      Maybe.t(list(Static_Prerequisites.increasable)),
    skillSpecializationSelectOptions:
      Maybe.t(variantSkillSpecializationOption),
    languageScriptSelectOptions: Maybe.t(variantLanguageAndScriptOption),
    combatTechniqueSelectOptions: Maybe.t(variantCombatTechniqueOption),
    cantripSelectOptions: Maybe.t(cantripOption),
    curseSelectOptions: Maybe.t(curseOption),
    terrainKnowledgeSelectOptions: Maybe.t(terrainKnowledgeOption),
    skillSelectOptions: Maybe.t(skillOption),
    specialAbilities: Maybe.t(list(Static_Prerequisites.activatable)),
    combatTechniques: Maybe.t(list((int, int))),
    skills: Maybe.t(list((int, int))),
    spells: Maybe.t(list((int, GenericHelpers.oneOrMany(int)))),
    liturgicalChants: Maybe.t(list((int, GenericHelpers.oneOrMany(int)))),
    blessings: Maybe.t(list(int)),
  };

  let variantUniv = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    sexDependency:
      json |> optionalField("sexDependency", Static_Prerequisites.Decode.sex),
    raceDependency:
      json
      |> optionalField("raceDependency", Static_Prerequisites.Decode.race),
    cultureDependency:
      json
      |> optionalField(
           "cultureDependency",
           Static_Prerequisites.Decode.culture,
         ),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Static_Prerequisites.Decode.activatable),
         ),
    increasablePrerequisites:
      json
      |> optionalField(
           "increasablePrerequisites",
           list(Static_Prerequisites.Decode.increasable),
         ),
    skillSpecializationSelectOptions:
      json
      |> optionalField(
           "skillSpecializationSelectOptions",
           variantSkillSpecializationOption,
         ),
    languageScriptSelectOptions:
      json
      |> optionalField(
           "languageScriptSelectOptions",
           variantLanguageAndScriptOption,
         ),
    combatTechniqueSelectOptions:
      json
      |> optionalField(
           "combatTechniqueSelectOptions",
           variantCombatTechniqueOption,
         ),
    cantripSelectOptions:
      json |> optionalField("cantripSelectOptions", cantripOption),
    curseSelectOptions:
      json |> optionalField("curseSelectOptions", curseOption),
    terrainKnowledgeSelectOptions:
      json
      |> optionalField(
           "terrainKnowledgeSelectOptions",
           terrainKnowledgeOption,
         ),
    skillSelectOptions:
      json |> optionalField("skillSelectOptions", skillOption),
    specialAbilities:
      json
      |> optionalField(
           "specialAbilities",
           list(Static_Prerequisites.Decode.activatable),
         ),
    combatTechniques:
      json
      |> optionalField(
           "combatTechniques",
           list(json =>
             (json |> field("id", int), json |> field("value", int))
           ),
         ),
    skills:
      json
      |> optionalField(
           "skills",
           list(json =>
             (json |> field("id", int), json |> field("value", int))
           ),
         ),
    spells:
      json
      |> optionalField(
           "spells",
           list(json =>
             (
               json |> field("id", int),
               json
               |> field("value", Static_Prerequisites.Decode.oneOrManyInt),
             )
           ),
         ),
    liturgicalChants:
      json
      |> optionalField(
           "liturgicalChants",
           list(json =>
             (
               json |> field("id", int),
               json
               |> field("value", Static_Prerequisites.Decode.oneOrManyInt),
             )
           ),
         ),
    blessings: json |> optionalField("blessings", list(int)),
  };

  let variant = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      cost: univ.cost,
      prerequisites: {
        sex: univ.sexDependency,
        race: univ.raceDependency,
        culture: univ.cultureDependency,
        activatable: univ.activatablePrerequisites |> Maybe.fromMaybe([]),
        increasable: univ.increasablePrerequisites |> Maybe.fromMaybe([]),
      },
      options: {
        skillSpecialization: univ.skillSpecializationSelectOptions,
        languageScript: univ.languageScriptSelectOptions,
        combatTechnique: univ.combatTechniqueSelectOptions,
        cantrip: univ.cantripSelectOptions,
        curse: univ.curseSelectOptions,
        terrainKnowledge: univ.terrainKnowledgeSelectOptions,
        skill: univ.skillSelectOptions,
        guildMageUnfamiliarSpell:
          Maybe.maybe(
            false,
            ListH.Foldable.any((x: Static_Prerequisites.activatable) =>
              x.id
              == `SpecialAbility(Ids.SpecialAbilityId.traditionGuildMages)
              && x.active
            ),
            univ.activatablePrerequisites,
          ),
      },
      specialAbilities: univ.specialAbilities |> Maybe.fromMaybe([]),
      combatTechniques:
        univ.combatTechniques |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      skills: univ.skills |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      spells: univ.spells |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      liturgicalChants:
        univ.liturgicalChants |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      blessings: univ.blessings |> Maybe.fromMaybe([]),
      precedingText: l10n.precedingText,
      fullText: l10n.fullText,
      concludingText: l10n.concludingText,
      errata: l10n.errata,
    },
  );

  type tL10n = {
    id: int,
    name,
    subname: Maybe.t(name),
    activatablePrerequisites:
      Maybe.t(list(Static_Prerequisites.activatable)),
    prerequisitesStart: Maybe.t(string),
    suggestedAdvantages: Maybe.t(string),
    suggestedDisadvantages: Maybe.t(string),
    unsuitableAdvantages: Maybe.t(string),
    unsuitableDisadvantages: Maybe.t(string),
    variants: Maybe.t(list(variantL10n)),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", name),
    subname: json |> optionalField("subname", name),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Static_Prerequisites.Decode.activatable),
         ),
    prerequisitesStart: json |> optionalField("prerequisitesStart", string),
    suggestedAdvantages: json |> optionalField("suggestedAdvantages", string),
    suggestedDisadvantages:
      json |> optionalField("suggestedDisadvantages", string),
    unsuitableAdvantages:
      json |> optionalField("unsuitableAdvantages", string),
    unsuitableDisadvantages:
      json |> optionalField("unsuitableDisadvantages", string),
    variants: json |> optionalField("variants", list(variantL10n)),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    cost: int,
    sexDependency: Maybe.t(Static_Prerequisites.sex),
    raceDependency: Maybe.t(Static_Prerequisites.race),
    cultureDependency: Maybe.t(Static_Prerequisites.culture),
    activatablePrerequisites:
      Maybe.t(list(Static_Prerequisites.activatable)),
    increasablePrerequisites:
      Maybe.t(list(Static_Prerequisites.increasable)),
    skillSpecializationSelectOptions: Maybe.t(skillSpecializationOption),
    languageScriptSelectOptions: Maybe.t(languageAndScriptOption),
    combatTechniqueSelectOptions: Maybe.t(combatTechniqueOption),
    cantripSelectOptions: Maybe.t(cantripOption),
    curseSelectOptions: Maybe.t(curseOption),
    terrainKnowledgeSelectOptions: Maybe.t(terrainKnowledgeOption),
    skillSelectOptions: Maybe.t(skillOption),
    specialAbilities: Maybe.t(list(Static_Prerequisites.activatable)),
    combatTechniques: Maybe.t(list((int, int))),
    skills: Maybe.t(list((int, int))),
    spells: Maybe.t(list((int, GenericHelpers.oneOrMany(int)))),
    liturgicalChants: Maybe.t(list((int, GenericHelpers.oneOrMany(int)))),
    blessings: Maybe.t(list(int)),
    suggestedAdvantages: Maybe.t(list(int)),
    suggestedDisadvantages: Maybe.t(list(int)),
    unsuitableAdvantages: Maybe.t(list(int)),
    unsuitableDisadvantages: Maybe.t(list(int)),
    variants: Maybe.t(list(variantUniv)),
    isVariantRequired: bool,
    gr: int,
    sgr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    sexDependency:
      json |> optionalField("sexDependency", Static_Prerequisites.Decode.sex),
    raceDependency:
      json
      |> optionalField("raceDependency", Static_Prerequisites.Decode.race),
    cultureDependency:
      json
      |> optionalField(
           "cultureDependency",
           Static_Prerequisites.Decode.culture,
         ),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Static_Prerequisites.Decode.activatable),
         ),
    increasablePrerequisites:
      json
      |> optionalField(
           "increasablePrerequisites",
           list(Static_Prerequisites.Decode.increasable),
         ),
    skillSpecializationSelectOptions:
      json
      |> optionalField(
           "skillSpecializationSelectOptions",
           skillSpecializationOption,
         ),
    languageScriptSelectOptions:
      json
      |> optionalField("languageScriptSelectOptions", languageAndScriptOption),
    combatTechniqueSelectOptions:
      json
      |> optionalField("combatTechniqueSelectOptions", combatTechniqueOption),
    cantripSelectOptions:
      json |> optionalField("cantripSelectOptions", cantripOption),
    curseSelectOptions:
      json |> optionalField("curseSelectOptions", curseOption),
    terrainKnowledgeSelectOptions:
      json
      |> optionalField(
           "terrainKnowledgeSelectOptions",
           terrainKnowledgeOption,
         ),
    skillSelectOptions:
      json |> optionalField("skillSelectOptions", skillOption),
    specialAbilities:
      json
      |> optionalField(
           "specialAbilities",
           list(Static_Prerequisites.Decode.activatable),
         ),
    combatTechniques:
      json
      |> optionalField(
           "combatTechniques",
           list(json =>
             (json |> field("id", int), json |> field("value", int))
           ),
         ),
    skills:
      json
      |> optionalField(
           "skills",
           list(json =>
             (json |> field("id", int), json |> field("value", int))
           ),
         ),
    spells:
      json
      |> optionalField(
           "spells",
           list(json =>
             (
               json |> field("id", int),
               json
               |> field("value", Static_Prerequisites.Decode.oneOrManyInt),
             )
           ),
         ),
    liturgicalChants:
      json
      |> optionalField(
           "liturgicalChants",
           list(json =>
             (
               json |> field("id", int),
               json
               |> field("value", Static_Prerequisites.Decode.oneOrManyInt),
             )
           ),
         ),
    blessings: json |> optionalField("blessings", list(int)),
    suggestedAdvantages:
      json |> optionalField("suggestedAdvantages", list(int)),
    suggestedDisadvantages:
      json |> optionalField("suggestedDisadvantages", list(int)),
    unsuitableAdvantages:
      json |> optionalField("unsuitableAdvantages", list(int)),
    unsuitableDisadvantages:
      json |> optionalField("unsuitableDisadvantages", list(int)),
    variants: json |> optionalField("variants", list(variantUniv)),
    isVariantRequired: json |> field("isVariantRequired", bool),
    gr: json |> field("gr", int),
    sgr: json |> field("sgr", int),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      subname: l10n.subname,
      cost: univ.cost,
      prerequisites: {
        sex: univ.sexDependency,
        race: univ.raceDependency,
        culture: univ.cultureDependency,
        activatable: univ.activatablePrerequisites |> Maybe.fromMaybe([]),
        increasable: univ.increasablePrerequisites |> Maybe.fromMaybe([]),
      },
      prerequisitesStart: l10n.prerequisitesStart,
      options: {
        skillSpecialization: univ.skillSpecializationSelectOptions,
        languageScript: univ.languageScriptSelectOptions,
        combatTechnique: univ.combatTechniqueSelectOptions,
        cantrip: univ.cantripSelectOptions,
        curse: univ.curseSelectOptions,
        terrainKnowledge: univ.terrainKnowledgeSelectOptions,
        skill: univ.skillSelectOptions,
        guildMageUnfamiliarSpell:
          Maybe.maybe(
            false,
            ListH.Foldable.any((x: Static_Prerequisites.activatable) =>
              x.id
              == `SpecialAbility(Ids.SpecialAbilityId.traditionGuildMages)
              && x.active
            ),
            univ.activatablePrerequisites,
          ),
      },
      specialAbilities: univ.specialAbilities |> Maybe.fromMaybe([]),
      combatTechniques:
        univ.combatTechniques |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      skills: univ.skills |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      spells: univ.spells |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      liturgicalChants:
        univ.liturgicalChants |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      blessings: univ.blessings |> Maybe.fromMaybe([]),
      suggestedAdvantages: univ.suggestedAdvantages |> Maybe.fromMaybe([]),
      suggestedAdvantagesText: l10n.suggestedAdvantages,
      suggestedDisadvantages:
        univ.suggestedDisadvantages |> Maybe.fromMaybe([]),
      suggestedDisadvantagesText: l10n.suggestedDisadvantages,
      unsuitableAdvantages: univ.unsuitableAdvantages |> Maybe.fromMaybe([]),
      unsuitableAdvantagesText: l10n.unsuitableAdvantages,
      unsuitableDisadvantages:
        univ.unsuitableDisadvantages |> Maybe.fromMaybe([]),
      unsuitableDisadvantagesText: l10n.unsuitableDisadvantages,
      variants:
        Yaml_Zip.zipBy(
          Int.show,
          variant,
          x => x.id,
          x => x.id,
          univ.variants |> Maybe.fromMaybe([]),
          l10n.variants |> Maybe.fromMaybe([]),
        )
        |> IntMap.fromList,
      isVariantRequired: univ.isVariantRequired,
      gr: univ.gr,
      sgr: univ.sgr,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.professionsUniv |> list(tUniv),
      yamlData.professionsL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
