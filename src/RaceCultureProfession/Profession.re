module Dynamic = {
  type t =
    | Base(int)
    | WithVariant(int, int);
};

module Static = {
  module Options = {
    type variantOverride('a) =
      | Remove
      | Override('a);

    let decodeVariantOverride = (decoder, json) =>
      JsonStrict.(
        oneOf(
          [
            json => json |> const(false) |> (_ => Remove),
            json => json |> decoder |> (x => Override(x)),
          ],
          json,
        )
      );

    type skillSpecializationOption = OneOrMany.t(int);

    let decodeSkillSpecializationOption = Prerequisite.oneOrManyInt;

    type variantSkillSpecializationOption =
      variantOverride(skillSpecializationOption);

    let decodeVariantSkillSpecializationOption =
      decodeVariantOverride(decodeSkillSpecializationOption);

    type languageAndScriptOption = int;

    let decodeLanguageAndScriptOption = JsonStrict.int;

    type variantLanguageAndScriptOption =
      variantOverride(languageAndScriptOption);

    let decodeVariantLanguageAndScriptOption =
      decodeVariantOverride(decodeLanguageAndScriptOption);

    type combatTechniqueSecondOption = {
      amount: int,
      value: int,
    };

    let decodeCombatTechniqueSecondOption = json =>
      JsonStrict.{
        amount: json |> field("amount", int),
        value: json |> field("value", int),
      };

    type combatTechniqueOption = {
      amount: int,
      value: int,
      second: option(combatTechniqueSecondOption),
      sid: list(int),
    };

    let decodeCombatTechniqueOption = json =>
      JsonStrict.{
        amount: json |> field("amount", int),
        value: json |> field("value", int),
        second:
          json |> optionalField("second", decodeCombatTechniqueSecondOption),
        sid: json |> field("sid", list(int)),
      };

    type variantCombatTechniqueOption =
      variantOverride(combatTechniqueOption);

    let decodeVariantCombatTechniqueOption =
      decodeVariantOverride(decodeCombatTechniqueOption);

    type cantripOption = {
      amount: int,
      sid: list(int),
    };

    let decodeCantripOption = json =>
      JsonStrict.{
        amount: json |> field("amount", int),
        sid: json |> field("sid", list(int)),
      };

    type curseOption = int;

    let decodeCurseOption = JsonStrict.int;

    type terrainKnowledgeOption = list(int);

    let decodeTerrainKnowledgeOption = JsonStrict.(list(int));

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

    let decodeSkillOption = json =>
      JsonStrict.{
        gr: json |> optionalField("gr", int),
        value: json |> field("value", int),
      };
  };

  type name =
    | Const(string)
    | BySex({
        m: string,
        f: string,
      });

  let decodeName =
    JsonStrict.(
      oneOf([
        json => json |> string |> (x => Const(x)),
        json =>
          BySex({
            m: json |> field("m", string),
            f: json |> field("f", string),
          }),
      ])
    );

  module Variant = {
    type variantOptions = {
      skillSpecialization: option(Options.variantSkillSpecializationOption),
      languageScript: option(Options.variantLanguageAndScriptOption),
      combatTechnique: option(Options.variantCombatTechniqueOption),
      cantrip: option(Options.cantripOption),
      curse: option(Options.curseOption),
      terrainKnowledge: option(Options.terrainKnowledgeOption),
      skill: option(Options.skillOption),
      guildMageUnfamiliarSpell: bool,
    };

    type t = {
      id: int,
      name,
      cost: int,
      prerequisites: Prerequisite.Profession.all,
      options: variantOptions,
      specialAbilities: list(Prerequisite.Activatable.t),
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

    module Translations = {
      type t = {
        name,
        precedingText: option(string),
        fullText: option(string),
        concludingText: option(string),
        errata: list(Erratum.t),
      };

      let decode = json =>
        JsonStrict.{
          name: json |> field("name", decodeName),
          precedingText: json |> optionalField("precedingText", string),
          fullText: json |> optionalField("fullText", string),
          concludingText: json |> optionalField("concludingText", string),
          errata: json |> field("errata", Erratum.decodeList),
        };
    };

    module TranslationMap = TranslationMap.Make(Translations);

    type multilingual = {
      id: int,
      apValue: int,
      sexDependency: option(Prerequisite.sex),
      raceDependency: option(Prerequisite.race),
      cultureDependency: option(Prerequisite.culture),
      activatablePrerequisites: option(list(Prerequisite.activatable)),
      increasablePrerequisites: option(list(Prerequisite.increasable)),
      skillSpecializationSelectOptions:
        option(Options.variantSkillSpecializationOption),
      languageScriptSelectOptions:
        option(Options.variantLanguageAndScriptOption),
      combatTechniqueSelectOptions:
        option(Options.variantCombatTechniqueOption),
      cantripSelectOptions: option(Options.cantripOption),
      curseSelectOptions: option(Options.curseOption),
      terrainKnowledgeSelectOptions: option(Options.terrainKnowledgeOption),
      skillSelectOptions: option(Options.skillOption),
      specialAbilities: option(list(Prerequisite.activatable)),
      combatTechniques: option(list((int, int))),
      skills: option(list((int, int))),
      spells: option(list((int, OneOrMany.t(int)))),
      liturgicalChants: option(list((int, OneOrMany.t(int)))),
      blessings: option(list(int)),
      translations: TranslationMap.t,
    };

    let decodeMultilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        commonCultures:
          json |> field("commonCultures", list(int)) |> Ley_IntSet.fromList,
        commonAdvantages:
          json
          |> optionalField("commonAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        commonDisadvantages:
          json
          |> optionalField("commonDisadvantages", list(int))
          |> Ley_Option.fromOption([]),
        uncommonAdvantages:
          json
          |> optionalField("uncommonAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        uncommonDisadvantages:
          json
          |> optionalField("uncommonDisadvantages", list(int))
          |> Ley_Option.fromOption([]),
        hairColors: json |> field("hairColors", list(int)),
        eyeColors: json |> field("eyeColors", list(int)),
        sizeBase: json |> field("sizeBase", int),
        sizeRandom: json |> field("sizeRandom", list(Dice.Decode.t)),
        translations: json |> field("translations", TranslationMap.decode),
      };

    let decodeMultilingualPair = json =>
      json |> decodeMultilingual |> (variant => (variant.id, variant));

    let resolveTranslations = (langs, x) =>
      Ley_Option.Functor.(
        x.translations
        |> TranslationMap.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            commonCultures: x.commonCultures,
            commonAdvantages: x.commonAdvantages,
            commonAdvantagesText: translation.commonAdvantages,
            commonDisadvantages: x.commonDisadvantages,
            commonDisadvantagesText: translation.commonDisadvantages,
            uncommonAdvantages: x.uncommonAdvantages,
            uncommonAdvantagesText: translation.uncommonAdvantages,
            uncommonDisadvantages: x.uncommonDisadvantages,
            uncommonDisadvantagesText: translation.uncommonDisadvantages,
            hairColors: x.hairColors,
            eyeColors: x.eyeColors,
            sizeBase: x.sizeBase,
            sizeRandom: x.sizeRandom,
          }
        )
      );
  };

  type options = {
    skillSpecialization: option(Options.skillSpecializationOption),
    languageScript: option(Options.languageAndScriptOption),
    combatTechnique: option(Options.combatTechniqueOption),
    cantrip: option(Options.cantripOption),
    curse: option(Options.curseOption),
    terrainKnowledge: option(Options.terrainKnowledgeOption),
    skill: option(Options.skillOption),
    guildMageUnfamiliarSpell: bool,
  };

  type t = {
    id: int,
    name: string,
    apValue: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: Ley_IntMap.t(int),
    attributeAdjustmentsSelectionValue: int,
    attributeAdjustmentsSelectionList: Ley_IntSet.t,
    attributeAdjustmentsText: string,
    automaticAdvantages: list(int),
    automaticAdvantagesText: option(string),
    stronglyRecommendedAdvantages: list(int),
    stronglyRecommendedAdvantagesText: option(string),
    stronglyRecommendedDisadvantages: list(int),
    stronglyRecommendedDisadvantagesText: option(string),
    commonAdvantages: list(int),
    commonAdvantagesText: option(string),
    commonDisadvantages: list(int),
    commonDisadvantagesText: option(string),
    uncommonAdvantages: list(int),
    uncommonAdvantagesText: option(string),
    uncommonDisadvantages: list(int),
    uncommonDisadvantagesText: option(string),
    weightBase: int,
    weightRandom: list(Dice.t),
    variantOptions,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      attributeAdjustments: string,
      automaticAdvantages: option(string),
      stronglyRecommendedAdvantages: option(string),
      stronglyRecommendedDisadvantages: option(string),
      commonAdvantages: option(string),
      commonDisadvantages: option(string),
      uncommonAdvantages: option(string),
      uncommonDisadvantages: option(string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        attributeAdjustments: json |> field("attributeAdjustments", string),
        automaticAdvantages:
          json |> optionalField("automaticAdvantages", string),
        stronglyRecommendedAdvantages:
          json |> optionalField("stronglyRecommendedAdvantages", string),
        stronglyRecommendedDisadvantages:
          json |> optionalField("stronglyRecommendedDisadvantages", string),
        commonAdvantages: json |> optionalField("commonAdvantages", string),
        commonDisadvantages:
          json |> optionalField("commonDisadvantages", string),
        uncommonAdvantages:
          json |> optionalField("uncommonAdvantages", string),
        uncommonDisadvantages:
          json |> optionalField("uncommonDisadvantages", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type variantOptionsMultilingual =
    | WithVariants({variants: Ley_IntMap.t(Variant.multilingual)})
    | WithoutVariants({
        commonCultures: Ley_IntSet.t,
        hairColors: list(int),
        eyeColors: list(int),
        sizeBase: int,
        sizeRandom: list(Dice.t),
      });

  type multilingual = {
    id: int,
    apValue: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: Ley_IntMap.t(int),
    attributeAdjustmentsSelectionValue: int,
    attributeAdjustmentsSelectionList: Ley_IntSet.t,
    automaticAdvantages: list(int),
    stronglyRecommendedAdvantages: list(int),
    stronglyRecommendedDisadvantages: list(int),
    commonAdvantages: list(int),
    commonDisadvantages: list(int),
    uncommonAdvantages: list(int),
    uncommonDisadvantages: list(int),
    weightBase: int,
    weightRandom: list(Dice.t),
    variantOptions: variantOptionsMultilingual,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeVariantOptions =
    JsonStrict.(
      field("type", string)
      |> andThen(
           fun
           | "WithVariants" => (
               (json) => (
                 WithVariants({
                   variants:
                     json
                     |> field(
                          "variants",
                          list(Variant.decodeMultilingualPair),
                        )
                     |> Ley_IntMap.fromList,
                 }): variantOptionsMultilingual
               )
             )
           | "WithoutVariants" => (
               json =>
                 WithoutVariants({
                   commonCultures:
                     json
                     |> field("commonCultures", list(int))
                     |> Ley_IntSet.fromList,
                   hairColors: json |> field("hairColors", list(int)),
                   eyeColors: json |> field("eyeColors", list(int)),
                   sizeBase: json |> field("sizeBase", int),
                   sizeRandom:
                     json |> field("sizeRandom", list(Dice.Decode.t)),
                 })
             )
           | _ => failwith("unknown node type"),
         )
    );

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      apValue: json |> field("apValue", int),
      lp: json |> field("lp", int),
      spi: json |> field("spi", int),
      tou: json |> field("tou", int),
      mov: json |> field("mov", int),
      attributeAdjustments:
        json
        |> optionalField("attributeAdjustments", list(pair(int, int)))
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      attributeAdjustmentsSelectionValue:
        json |> field("attributeAdjustmentsSelectionValue", int),
      attributeAdjustmentsSelectionList:
        json
        |> field("attributeAdjustmentsSelectionList", list(int))
        |> Ley_IntSet.fromList,
      automaticAdvantages:
        json
        |> optionalField("automaticAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      stronglyRecommendedAdvantages:
        json
        |> optionalField("stronglyRecommendedAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      stronglyRecommendedDisadvantages:
        json
        |> optionalField("stronglyRecommendedDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      commonAdvantages:
        json
        |> optionalField("commonAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      commonDisadvantages:
        json
        |> optionalField("commonDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      uncommonAdvantages:
        json
        |> optionalField("uncommonAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      uncommonDisadvantages:
        json
        |> optionalField("uncommonDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      weightBase: json |> field("weightBase", int),
      weightRandom: json |> field("weightRandom", list(Dice.Decode.t)),
      variantOptions: json |> field("typeSpecific", decodeVariantOptions),
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Functor.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          apValue: x.apValue,
          lp: x.lp,
          spi: x.spi,
          tou: x.tou,
          mov: x.mov,
          attributeAdjustments: x.attributeAdjustments,
          attributeAdjustmentsSelectionValue:
            x.attributeAdjustmentsSelectionValue,
          attributeAdjustmentsSelectionList:
            x.attributeAdjustmentsSelectionList,
          attributeAdjustmentsText: translation.attributeAdjustments,
          automaticAdvantages: x.automaticAdvantages,
          automaticAdvantagesText: translation.automaticAdvantages,
          stronglyRecommendedAdvantages: x.stronglyRecommendedAdvantages,
          stronglyRecommendedAdvantagesText:
            translation.stronglyRecommendedAdvantages,
          stronglyRecommendedDisadvantages: x.stronglyRecommendedDisadvantages,
          stronglyRecommendedDisadvantagesText:
            translation.stronglyRecommendedDisadvantages,
          commonAdvantages: x.commonAdvantages,
          commonAdvantagesText: translation.commonAdvantages,
          commonDisadvantages: x.commonDisadvantages,
          commonDisadvantagesText: translation.commonDisadvantages,
          uncommonAdvantages: x.uncommonAdvantages,
          uncommonAdvantagesText: translation.uncommonDisadvantages,
          uncommonDisadvantages: x.uncommonDisadvantages,
          uncommonDisadvantagesText: translation.uncommonDisadvantages,
          weightBase: x.weightBase,
          weightRandom: x.weightRandom,
          variantOptions:
            switch (x.variantOptions) {
            | WithVariants(options) =>
              WithVariants({
                variants:
                  Ley_IntMap.mapMaybe(
                    Variant.resolveTranslations(langs),
                    options.variants,
                  ),
              })
            | WithoutVariants({
                commonCultures,
                hairColors,
                eyeColors,
                sizeBase,
                sizeRandom,
              }) =>
              WithoutVariants({
                commonCultures,
                hairColors,
                eyeColors,
                sizeBase,
                sizeRandom,
              })
            },
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
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
