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

    type variant = {
      skillSpecialization: option(variantSkillSpecializationOption),
      languageScript: option(variantLanguageAndScriptOption),
      combatTechnique: option(variantCombatTechniqueOption),
      cantrip: option(cantripOption),
      curse: option(curseOption),
      terrainKnowledge: option(terrainKnowledgeOption),
      skill: option(skillOption),
      guildMageUnfamiliarSpell: bool,
    };

    let decodeVariant = json =>
      JsonStrict.{
        skillSpecialization:
          json
          |> optionalField(
               "skillSpecialization",
               decodeVariantSkillSpecializationOption,
             ),
        languageScript:
          json
          |> optionalField(
               "languageScript",
               decodeVariantLanguageAndScriptOption,
             ),
        combatTechnique:
          json
          |> optionalField(
               "combatTechnique",
               decodeVariantCombatTechniqueOption,
             ),
        cantrip: json |> optionalField("cantrip", decodeCantripOption),
        curse: json |> optionalField("curse", decodeCurseOption),
        terrainKnowledge:
          json
          |> optionalField("terrainKnowledge", decodeTerrainKnowledgeOption),
        skill: json |> optionalField("skill", decodeSkillOption),
        guildMageUnfamiliarSpell:
          json
          |> optionalField("guildMageUnfamiliarSpell", bool)
          |> Ley_Option.fromOption(false),
      };

    type t = {
      skillSpecialization: option(skillSpecializationOption),
      languageScript: option(languageAndScriptOption),
      combatTechnique: option(combatTechniqueOption),
      cantrip: option(cantripOption),
      curse: option(curseOption),
      terrainKnowledge: option(terrainKnowledgeOption),
      skill: option(skillOption),
      guildMageUnfamiliarSpell: bool,
    };

    let decode = json =>
      JsonStrict.(
        (
          {
            skillSpecialization:
              json
              |> optionalField(
                   "skillSpecialization",
                   decodeSkillSpecializationOption,
                 ),
            languageScript:
              json
              |> optionalField(
                   "languageScript",
                   decodeLanguageAndScriptOption,
                 ),
            combatTechnique:
              json
              |> optionalField("combatTechnique", decodeCombatTechniqueOption),
            cantrip: json |> optionalField("cantrip", decodeCantripOption),
            curse: json |> optionalField("curse", decodeCurseOption),
            terrainKnowledge:
              json
              |> optionalField(
                   "terrainKnowledge",
                   decodeTerrainKnowledgeOption,
                 ),
            skill: json |> optionalField("skill", decodeSkillOption),
            guildMageUnfamiliarSpell: false,
          }: t
        )
      );

    let getGuildMageUnfamiliarSpell = prerequisites =>
      prerequisites
      |> Ley_List.any((x: Prerequisite.Profession.t) =>
           [@warning "-4"]
           (
             switch (x) {
             | {value: Activatable({id, active: true, _}), _} =>
               [@warning "-44"]
               Id.Activatable.(
                 id
                 == (
                      SpecialAbility,
                      Id.SpecialAbility.toInt(TraditionGuildMages),
                    )
               )
             | _ => false
             }
           )
         );
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
    type t = {
      id: int,
      name,
      apValue: int,
      prerequisites: Prerequisite.Collection.Profession.t,
      options: Options.variant,
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
      prerequisites: Prerequisite.Collection.Profession.multilingual,
      options: Options.variant,
      specialAbilities: list(Prerequisite.Activatable.t),
      combatTechniques: Ley_IntMap.t(int),
      skills: Ley_IntMap.t(int),
      spells: Ley_IntMap.t(OneOrMany.t(int)),
      liturgicalChants: Ley_IntMap.t(OneOrMany.t(int)),
      blessings: list(int),
      translations: TranslationMap.t,
    };

    let decodeMultilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        apValue: json |> field("apValue", int),
        prerequisites:
          json
          |> field(
               "prerequisites",
               Prerequisite.Collection.Profession.decodeMultilingual,
             ),
        options: json |> field("options", Options.decodeVariant),
        specialAbilities:
          json
          |> optionalField(
               "specialAbilities",
               list(Prerequisite.Activatable.decode),
             )
          |> Ley_Option.fromOption([]),
        combatTechniques:
          json
          |> optionalField(
               "combatTechniques",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        skills:
          json
          |> optionalField(
               "skills",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        spells:
          json
          |> optionalField(
               "spells",
               list(json =>
                 (
                   json |> field("id", int),
                   json |> field("value", Prerequisite.oneOrManyInt),
                 )
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        liturgicalChants:
          json
          |> optionalField(
               "liturgicalChants",
               list(json =>
                 (
                   json |> field("id", int),
                   json |> field("value", Prerequisite.oneOrManyInt),
                 )
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        blessings:
          json
          |> optionalField("blessings", list(int))
          |> Ley_Option.fromOption([]),
        translations: json |> field("translations", TranslationMap.decode),
      };

    let decodeMultilingualPair = json =>
      json |> decodeMultilingual |> (variant => (variant.id, variant));

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.getFromLanguageOrder(langs)
        <&> (
          translation => {
            let prerequisites =
              Prerequisite.Collection.Profession.resolveTranslations(
                langs,
                x.prerequisites,
              );

            {
              id: x.id,
              name: translation.name,
              apValue: x.apValue,
              prerequisites,
              options: {
                ...x.options,
                guildMageUnfamiliarSpell:
                  Options.getGuildMageUnfamiliarSpell(prerequisites),
              },
              specialAbilities: x.specialAbilities,
              combatTechniques: x.combatTechniques,
              skills: x.skills,
              spells: x.spells,
              liturgicalChants: x.liturgicalChants,
              blessings: x.blessings,
              precedingText: translation.precedingText,
              fullText: translation.fullText,
              concludingText: translation.concludingText,
              errata: translation.errata,
            };
          }
        )
      );
  };

  type t = {
    id: int,
    name,
    subname: option(name),
    apValue: int,
    prerequisites: Prerequisite.Collection.Profession.t,
    prerequisitesStart: option(string),
    options: Options.t,
    specialAbilities: list(Prerequisite.Activatable.t),
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
    variants: Ley_IntMap.t(Variant.t),
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

  module Translations = {
    type t = {
      name,
      subname: option(name),
      activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
      prerequisitesStart: option(string),
      suggestedAdvantages: option(string),
      suggestedDisadvantages: option(string),
      unsuitableAdvantages: option(string),
      unsuitableDisadvantages: option(string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", decodeName),
        subname: json |> optionalField("subname", decodeName),
        activatablePrerequisites:
          json
          |> optionalField(
               "activatablePrerequisites",
               list(Prerequisite.Activatable.decode),
             ),
        prerequisitesStart:
          json |> optionalField("prerequisitesStart", string),
        suggestedAdvantages:
          json |> optionalField("suggestedAdvantages", string),
        suggestedDisadvantages:
          json |> optionalField("suggestedDisadvantages", string),
        unsuitableAdvantages:
          json |> optionalField("unsuitableAdvantages", string),
        unsuitableDisadvantages:
          json |> optionalField("unsuitableDisadvantages", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    apValue: int,
    prerequisites: Prerequisite.Collection.Profession.multilingual,
    options: Options.t,
    specialAbilities: list(Prerequisite.Activatable.t),
    combatTechniques: Ley_IntMap.t(int),
    skills: Ley_IntMap.t(int),
    spells: Ley_IntMap.t(OneOrMany.t(int)),
    liturgicalChants: Ley_IntMap.t(OneOrMany.t(int)),
    blessings: list(int),
    suggestedAdvantages: list(int),
    suggestedDisadvantages: list(int),
    unsuitableAdvantages: list(int),
    unsuitableDisadvantages: list(int),
    variants: Ley_IntMap.t(Variant.multilingual),
    isVariantRequired: bool,
    gr: int,
    sgr: int,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      apValue: json |> field("apValue", int),
      prerequisites:
        json
        |> field(
             "prerequisites",
             Prerequisite.Collection.Profession.decodeMultilingual,
           ),
      options: json |> field("options", Options.decode),
      specialAbilities:
        json
        |> optionalField(
             "specialAbilities",
             list(Prerequisite.Activatable.decode),
           )
        |> Ley_Option.fromOption([]),
      combatTechniques:
        json
        |> optionalField(
             "combatTechniques",
             list(json =>
               (json |> field("id", int), json |> field("value", int))
             ),
           )
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      skills:
        json
        |> optionalField(
             "skills",
             list(json =>
               (json |> field("id", int), json |> field("value", int))
             ),
           )
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      spells:
        json
        |> optionalField(
             "spells",
             list(json =>
               (
                 json |> field("id", int),
                 json |> field("value", Prerequisite.oneOrManyInt),
               )
             ),
           )
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      liturgicalChants:
        json
        |> optionalField(
             "liturgicalChants",
             list(json =>
               (
                 json |> field("id", int),
                 json |> field("value", Prerequisite.oneOrManyInt),
               )
             ),
           )
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      blessings:
        json
        |> optionalField("blessings", list(int))
        |> Ley_Option.fromOption([]),
      suggestedAdvantages:
        json
        |> optionalField("suggestedAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      suggestedDisadvantages:
        json
        |> optionalField("suggestedDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      unsuitableAdvantages:
        json
        |> optionalField("unsuitableAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      unsuitableDisadvantages:
        json
        |> optionalField("unsuitableDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      variants:
        json
        |> optionalField("variants", list(Variant.decodeMultilingualPair))
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      isVariantRequired: json |> field("isVariantRequired", bool),
      gr: json |> field("gr", int),
      sgr: json |> field("sgr", int),
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          let prerequisites =
            Prerequisite.Collection.Profession.resolveTranslations(
              langs,
              x.prerequisites,
            );

          {
            id: x.id,
            name: translation.name,
            subname: translation.subname,
            apValue: x.apValue,
            prerequisites,
            prerequisitesStart: translation.prerequisitesStart,
            options: {
              ...x.options,
              guildMageUnfamiliarSpell:
                Options.getGuildMageUnfamiliarSpell(prerequisites),
            },
            specialAbilities: x.specialAbilities,
            combatTechniques: x.combatTechniques,
            skills: x.skills,
            spells: x.spells,
            liturgicalChants: x.liturgicalChants,
            blessings: x.blessings,
            suggestedAdvantages: x.suggestedAdvantages,
            suggestedAdvantagesText: translation.suggestedAdvantages,
            suggestedDisadvantages: x.suggestedDisadvantages,
            suggestedDisadvantagesText: translation.suggestedDisadvantages,
            unsuitableAdvantages: x.unsuitableAdvantages,
            unsuitableAdvantagesText: translation.unsuitableAdvantages,
            unsuitableDisadvantages: x.unsuitableDisadvantages,
            unsuitableDisadvantagesText: translation.unsuitableDisadvantages,
            variants:
              x.variants
              |> Ley_IntMap.mapMaybe(Variant.resolveTranslations(langs)),
            isVariantRequired: x.isVariantRequired,
            gr: x.gr,
            sgr: x.sgr,
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          };
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
