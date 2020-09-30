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

type skillSpecializationOption = OneOrMany.t(int);

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
  second: option(combatTechniqueSecondOption),
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
  gr: option(int),
  /**
   * The AP value the user can spend.
   */
  value: int,
};

type options = {
  skillSpecialization: option(skillSpecializationOption),
  languageScript: option(languageAndScriptOption),
  combatTechnique: option(combatTechniqueOption),
  cantrip: option(cantripOption),
  curse: option(curseOption),
  terrainKnowledge: option(terrainKnowledgeOption),
  skill: option(skillOption),
  guildMageUnfamiliarSpell: bool,
};

type variantOptions = {
  skillSpecialization: option(variantSkillSpecializationOption),
  languageScript: option(variantLanguageAndScriptOption),
  combatTechnique: option(variantCombatTechniqueOption),
  cantrip: option(cantripOption),
  curse: option(curseOption),
  terrainKnowledge: option(terrainKnowledgeOption),
  skill: option(skillOption),
  guildMageUnfamiliarSpell: bool,
};

type variant = {
  id: int,
  name,
  cost: int,
  prerequisites: Prerequisite.tProfession,
  options: variantOptions,
  specialAbilities: list(Prerequisite.activatable),
  combatTechniques: Ley_IntMap.t(int),
  skills: Ley_IntMap.t(int),
  spells: Ley_IntMap.t(OneOrMany.t(int)),
  liturgicalChants: Ley_IntMap.t(OneOrMany.t(int)),
  blessings: list(int),
  precedingText: option(string),
  fullText: option(string),
  concludingText: option(string),
  errata: list(Erratum.t),
};

type t = {
  id: int,
  name,
  subname: option(name),
  cost: int,
  prerequisites: Prerequisite.tProfession,
  prerequisitesStart: option(string),
  options,
  specialAbilities: list(Prerequisite.activatable),
  combatTechniques: Ley_IntMap.t(int),
  skills: Ley_IntMap.t(int),
  spells: Ley_IntMap.t(OneOrMany.t(int)),
  liturgicalChants: Ley_IntMap.t(OneOrMany.t(int)),
  blessings: list(int),
  suggestedAdvantages: list(int),
  suggestedAdvantagesText: option(string),
  suggestedDisadvantages: list(int),
  suggestedDisadvantagesText: option(string),
  unsuitableAdvantages: list(int),
  unsuitableAdvantagesText: option(string),
  unsuitableDisadvantages: list(int),
  unsuitableDisadvantagesText: option(string),
  variants: Ley_IntMap.t(variant),
  isVariantRequired: bool,
  gr: int,
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
  sgr: int,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
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
    activatablePrerequisites: option(list(Prerequisite.activatable)),
    precedingText: option(string),
    fullText: option(string),
    concludingText: option(string),
    errata: list(Erratum.t),
  };

  let variantL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", name),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Prerequisite.Decode.activatable),
         ),
    precedingText: json |> optionalField("precedingText", string),
    fullText: json |> optionalField("fullText", string),
    concludingText: json |> optionalField("concludingText", string),
    errata: json |> field("errata", Erratum.decodeList),
  };

  let variantOverride = (decoder, json) =>
    oneOf(
      [
        json => json |> const(false) |> (_ => Remove),
        json => json |> decoder |> (x => Override(x)),
      ],
      json,
    );

  let skillSpecializationOption = Prerequisite.Decode.oneOrManyInt;

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
    sexDependency: option(Prerequisite.sex),
    raceDependency: option(Prerequisite.race),
    cultureDependency: option(Prerequisite.culture),
    activatablePrerequisites: option(list(Prerequisite.activatable)),
    increasablePrerequisites: option(list(Prerequisite.increasable)),
    skillSpecializationSelectOptions:
      option(variantSkillSpecializationOption),
    languageScriptSelectOptions: option(variantLanguageAndScriptOption),
    combatTechniqueSelectOptions: option(variantCombatTechniqueOption),
    cantripSelectOptions: option(cantripOption),
    curseSelectOptions: option(curseOption),
    terrainKnowledgeSelectOptions: option(terrainKnowledgeOption),
    skillSelectOptions: option(skillOption),
    specialAbilities: option(list(Prerequisite.activatable)),
    combatTechniques: option(list((int, int))),
    skills: option(list((int, int))),
    spells: option(list((int, OneOrMany.t(int)))),
    liturgicalChants: option(list((int, OneOrMany.t(int)))),
    blessings: option(list(int)),
  };

  let variantUniv = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    sexDependency:
      json |> optionalField("sexDependency", Prerequisite.Decode.sex),
    raceDependency:
      json |> optionalField("raceDependency", Prerequisite.Decode.race),
    cultureDependency:
      json |> optionalField("cultureDependency", Prerequisite.Decode.culture),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Prerequisite.Decode.activatable),
         ),
    increasablePrerequisites:
      json
      |> optionalField(
           "increasablePrerequisites",
           list(Prerequisite.Decode.increasable),
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
           list(Prerequisite.Decode.activatable),
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
               json |> field("value", Prerequisite.Decode.oneOrManyInt),
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
               json |> field("value", Prerequisite.Decode.oneOrManyInt),
             )
           ),
         ),
    blessings: json |> optionalField("blessings", list(int)),
  };

  let variant = (univ: variantUniv, l10n: variantL10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      cost: univ.cost,
      prerequisites: {
        sex: univ.sexDependency,
        race: univ.raceDependency,
        culture: univ.cultureDependency,
        activatable:
          univ.activatablePrerequisites |> Ley_Option.fromOption([]),
        increasable:
          univ.increasablePrerequisites |> Ley_Option.fromOption([]),
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
          Ley_Option.option(
            false,
            Ley_List.Foldable.any((x: Prerequisite.activatable) =>
              Id.Activatable.(
                x.id
                == (
                     SpecialAbility,
                     Id.SpecialAbility.toInt(TraditionGuildMages),
                   )
              )
              && x.active
            ),
            univ.activatablePrerequisites,
          ),
      },
      specialAbilities: univ.specialAbilities |> Ley_Option.fromOption([]),
      combatTechniques:
        univ.combatTechniques
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      skills:
        univ.skills
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      spells:
        univ.spells
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      liturgicalChants:
        univ.liturgicalChants
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      blessings: univ.blessings |> Ley_Option.fromOption([]),
      precedingText: l10n.precedingText,
      fullText: l10n.fullText,
      concludingText: l10n.concludingText,
      errata: l10n.errata,
    },
  );

  type tL10n = {
    id: int,
    name,
    subname: option(name),
    activatablePrerequisites: option(list(Prerequisite.activatable)),
    prerequisitesStart: option(string),
    suggestedAdvantages: option(string),
    suggestedDisadvantages: option(string),
    unsuitableAdvantages: option(string),
    unsuitableDisadvantages: option(string),
    variants: option(list(variantL10n)),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", name),
    subname: json |> optionalField("subname", name),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Prerequisite.Decode.activatable),
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
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    cost: int,
    sexDependency: option(Prerequisite.sex),
    raceDependency: option(Prerequisite.race),
    cultureDependency: option(Prerequisite.culture),
    activatablePrerequisites: option(list(Prerequisite.activatable)),
    increasablePrerequisites: option(list(Prerequisite.increasable)),
    skillSpecializationSelectOptions: option(skillSpecializationOption),
    languageScriptSelectOptions: option(languageAndScriptOption),
    combatTechniqueSelectOptions: option(combatTechniqueOption),
    cantripSelectOptions: option(cantripOption),
    curseSelectOptions: option(curseOption),
    terrainKnowledgeSelectOptions: option(terrainKnowledgeOption),
    skillSelectOptions: option(skillOption),
    specialAbilities: option(list(Prerequisite.activatable)),
    combatTechniques: option(list((int, int))),
    skills: option(list((int, int))),
    spells: option(list((int, OneOrMany.t(int)))),
    liturgicalChants: option(list((int, OneOrMany.t(int)))),
    blessings: option(list(int)),
    suggestedAdvantages: option(list(int)),
    suggestedDisadvantages: option(list(int)),
    unsuitableAdvantages: option(list(int)),
    unsuitableDisadvantages: option(list(int)),
    variants: option(list(variantUniv)),
    isVariantRequired: bool,
    gr: int,
    sgr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    sexDependency:
      json |> optionalField("sexDependency", Prerequisite.Decode.sex),
    raceDependency:
      json |> optionalField("raceDependency", Prerequisite.Decode.race),
    cultureDependency:
      json |> optionalField("cultureDependency", Prerequisite.Decode.culture),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Prerequisite.Decode.activatable),
         ),
    increasablePrerequisites:
      json
      |> optionalField(
           "increasablePrerequisites",
           list(Prerequisite.Decode.increasable),
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
           list(Prerequisite.Decode.activatable),
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
               json |> field("value", Prerequisite.Decode.oneOrManyInt),
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
               json |> field("value", Prerequisite.Decode.oneOrManyInt),
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

  let t = (univ: tUniv, l10n: tL10n) => (
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
        activatable:
          univ.activatablePrerequisites |> Ley_Option.fromOption([]),
        increasable:
          univ.increasablePrerequisites |> Ley_Option.fromOption([]),
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
          Ley_Option.option(
            false,
            Ley_List.Foldable.any((x: Prerequisite.activatable) =>
              Id.Activatable.(
                x.id
                == (
                     SpecialAbility,
                     Id.SpecialAbility.toInt(TraditionGuildMages),
                   )
              )
              && x.active
            ),
            univ.activatablePrerequisites,
          ),
      },
      specialAbilities: univ.specialAbilities |> Ley_Option.fromOption([]),
      combatTechniques:
        univ.combatTechniques
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      skills:
        univ.skills
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      spells:
        univ.spells
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      liturgicalChants:
        univ.liturgicalChants
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      blessings: univ.blessings |> Ley_Option.fromOption([]),
      suggestedAdvantages:
        univ.suggestedAdvantages |> Ley_Option.fromOption([]),
      suggestedAdvantagesText: l10n.suggestedAdvantages,
      suggestedDisadvantages:
        univ.suggestedDisadvantages |> Ley_Option.fromOption([]),
      suggestedDisadvantagesText: l10n.suggestedDisadvantages,
      unsuitableAdvantages:
        univ.unsuitableAdvantages |> Ley_Option.fromOption([]),
      unsuitableAdvantagesText: l10n.unsuitableAdvantages,
      unsuitableDisadvantages:
        univ.unsuitableDisadvantages |> Ley_Option.fromOption([]),
      unsuitableDisadvantagesText: l10n.unsuitableDisadvantages,
      variants:
        Yaml_Zip.zipBy(
          Ley_Int.show,
          variant,
          x => x.id,
          x => x.id,
          univ.variants |> Ley_Option.fromOption([]),
          l10n.variants |> Ley_Option.fromOption([]),
        )
        |> Ley_IntMap.fromList,
      isVariantRequired: univ.isVariantRequired,
      gr: univ.gr,
      sgr: univ.sgr,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Ley_Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.professionsUniv |> list(tUniv),
      yamlData.professionsL10n |> list(tL10n),
    )
    |> Ley_IntMap.fromList;
};
