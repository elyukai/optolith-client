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
      Json_Decode_Strict.(
        either(
          json => json |> const(false) |> (_ => Remove),
          json => json |> decoder |> (x => Override(x)),
          json,
        )
      );

    type skillSpecializationOption =
      | Single(OneOrMany.t(int))
      | Group(OneOrMany.t(int));

    let decodeSkillSpecializationOption =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Single" => (
                 json =>
                   json
                   |> field("value", Prerequisite.oneOrManyInt)
                   |> (x => Single(x))
               )
             | "Group" => (
                 json =>
                   json
                   |> field("value", Prerequisite.oneOrManyInt)
                   |> (x => Group(x))
               )
             | str =>
               raise(
                 DecodeError("Unknown skill specialization type: " ++ str),
               ),
           )
      );

    type variantSkillSpecializationOption =
      variantOverride(skillSpecializationOption);

    let decodeVariantSkillSpecializationOption =
      decodeVariantOverride(decodeSkillSpecializationOption);

    type languageAndScriptOption = int;

    let decodeLanguageAndScriptOption = Json_Decode_Strict.int;

    type variantLanguageAndScriptOption =
      variantOverride(languageAndScriptOption);

    let decodeVariantLanguageAndScriptOption =
      decodeVariantOverride(decodeLanguageAndScriptOption);

    type combatTechniqueSecondOption = {
      amount: int,
      value: int,
    };

    let decodeCombatTechniqueSecondOption = json =>
      Json_Decode_Strict.{
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
      Json_Decode_Strict.{
        amount: json |> field("amount", int),
        value: json |> field("value", int),
        second:
          json |> optionalField("second", decodeCombatTechniqueSecondOption),
        sid: json |> field("sid", list(int)),
      };

    type combatTechniqueOverrideOption = {
      amount: int,
      value: int,
      second: option(variantOverride(combatTechniqueSecondOption)),
      sid: list(int),
    };

    let decodeCombatTechniqueOverrideOption = json =>
      Json_Decode_Strict.(
        (
          {
            amount: json |> field("amount", int),
            value: json |> field("value", int),
            second:
              json
              |> optionalField(
                   "second",
                   decodeVariantOverride(decodeCombatTechniqueSecondOption),
                 ),
            sid: json |> field("sid", list(int)),
          }: combatTechniqueOverrideOption
        )
      );

    type variantCombatTechniqueOption =
      variantOverride(combatTechniqueOverrideOption);

    let decodeVariantCombatTechniqueOption =
      decodeVariantOverride(decodeCombatTechniqueOverrideOption);

    type cantripOption = {
      amount: int,
      sid: list(int),
    };

    let decodeCantripOption = json =>
      Json_Decode_Strict.{
        amount: json |> field("amount", int),
        sid: json |> field("sid", list(int)),
      };

    type curseOption = int;

    let decodeCurseOption = Json_Decode_Strict.int;

    type terrainKnowledgeOption = list(int);

    let decodeTerrainKnowledgeOption = Json_Decode_Strict.(list(int));

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
      Json_Decode_Strict.{
        gr: json |> optionalField("gr", int),
        value: json |> field("value", int),
      };

    type activatableSkillOption = {
      id: list(int),
      value: int,
    };

    let decodeActivatableSkillOption = json =>
      Json_Decode_Strict.{
        id: json |> field("id", list(int)),
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
      spells: option(list(activatableSkillOption)),
      liturgicalChants: option(list(activatableSkillOption)),
      guildMageUnfamiliarSpell: bool,
    };

    let defaultVariant: variant = {
      skillSpecialization: None,
      languageScript: None,
      combatTechnique: None,
      cantrip: None,
      curse: None,
      terrainKnowledge: None,
      skill: None,
      spells: None,
      liturgicalChants: None,
      guildMageUnfamiliarSpell: false,
    };

    let decodeVariant = json =>
      Json_Decode_Strict.{
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
        spells:
          json |> optionalField("spells", list(decodeActivatableSkillOption)),
        liturgicalChants:
          json
          |> optionalField(
               "liturgicalChants",
               list(decodeActivatableSkillOption),
             ),
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
      spells: option(list(activatableSkillOption)),
      liturgicalChants: option(list(activatableSkillOption)),
      guildMageUnfamiliarSpell: bool,
    };

    let default: t = {
      skillSpecialization: None,
      languageScript: None,
      combatTechnique: None,
      cantrip: None,
      curse: None,
      terrainKnowledge: None,
      skill: None,
      spells: None,
      liturgicalChants: None,
      guildMageUnfamiliarSpell: false,
    };

    let decode = json =>
      Json_Decode_Strict.(
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
            spells:
              json
              |> optionalField("spells", list(decodeActivatableSkillOption)),
            liturgicalChants:
              json
              |> optionalField(
                   "liturgicalChants",
                   list(decodeActivatableSkillOption),
                 ),
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
                 == SpecialAbility(
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

  let name =
    Json_Decode_Strict.(
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
      spells: Ley_IntMap.t(int),
      liturgicalChants: Ley_IntMap.t(int),
      blessings: list(int),
      precedingText: option(string),
      fullText: option(string),
      concludingText: option(string),
    };

    module Decode = {
      module Translation = {
        type t = {
          name,
          precedingText: option(string),
          fullText: option(string),
          concludingText: option(string),
        };

        let t = json =>
          Json_Decode_Strict.{
            name: json |> field("name", name),
            precedingText: json |> optionalField("precedingText", string),
            fullText: json |> optionalField("fullText", string),
            concludingText: json |> optionalField("concludingText", string),
          };
      };

      module TranslationMap = TranslationMap.Make(Translation);

      type multilingual = {
        id: int,
        apValue: int,
        prerequisites:
          option(Prerequisite.Collection.Profession.Decode.multilingual),
        options: option(Options.variant),
        specialAbilities: list(Prerequisite.Activatable.t),
        combatTechniques: Ley_IntMap.t(int),
        skills: Ley_IntMap.t(int),
        spells: Ley_IntMap.t(int),
        liturgicalChants: Ley_IntMap.t(int),
        blessings: list(int),
        translations: TranslationMap.t,
      };

      let multilingual = json =>
        Json_Decode_Strict.{
          id: json |> field("id", int),
          apValue: json |> field("apValue", int),
          prerequisites:
            json
            |> optionalField(
                 "prerequisites",
                 Prerequisite.Collection.Profession.Decode.multilingual,
               ),
          options: json |> optionalField("options", Options.decodeVariant),
          specialAbilities:
            json
            |> optionalField(
                 "specialAbilities",
                 list(Prerequisite.Activatable.Decode.t),
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
                   (json |> field("id", int), json |> field("value", int))
                 ),
               )
            |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
          liturgicalChants:
            json
            |> optionalField(
                 "liturgicalChants",
                 list(json =>
                   (json |> field("id", int), json |> field("value", int))
                 ),
               )
            |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
          blessings:
            json
            |> optionalField("blessings", list(int))
            |> Ley_Option.fromOption([]),
          translations:
            json |> field("translations", TranslationMap.Decode.t),
        };

      let multilingualAssoc = json =>
        json |> multilingual |> (variant => (variant.id, variant));

      let resolveTranslations = (langs, x) =>
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.Decode.getFromLanguageOrder(langs)
          <&> (
            translation => {
              let prerequisites =
                x.prerequisites
                |> Ley_Option.option(
                     [],
                     Prerequisite.Collection.Profession.Decode.resolveTranslations(
                       langs,
                     ),
                   );

              {
                id: x.id,
                name: translation.name,
                apValue: x.apValue,
                prerequisites,
                options: {
                  ...
                    x.options |> Ley_Option.fromOption(Options.defaultVariant),
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
              };
            }
          )
        );
    };
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
    spells: Ley_IntMap.t(int),
    liturgicalChants: Ley_IntMap.t(int),
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
    curriculum: option(int),
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
    module Translation = {
      type t = {
        name,
        subname: option(name),
        prerequisitesStart: option(string),
        suggestedAdvantages: option(string),
        suggestedDisadvantages: option(string),
        unsuitableAdvantages: option(string),
        unsuitableDisadvantages: option(string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        Json_Decode_Strict.{
          name: json |> field("name", name),
          subname: json |> optionalField("subname", name),
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
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      apValue: int,
      prerequisites:
        option(Prerequisite.Collection.Profession.Decode.multilingual),
      options: option(Options.t),
      specialAbilities: list(Prerequisite.Activatable.t),
      combatTechniques: Ley_IntMap.t(int),
      skills: Ley_IntMap.t(int),
      spells: Ley_IntMap.t(int),
      liturgicalChants: Ley_IntMap.t(int),
      blessings: list(int),
      suggestedAdvantages: list(int),
      suggestedDisadvantages: list(int),
      unsuitableAdvantages: list(int),
      unsuitableDisadvantages: list(int),
      variants: Ley_IntMap.t(Variant.Decode.multilingual),
      isVariantRequired: bool,
      curriculum: option(int),
      gr: int,
      sgr: int,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json_Decode_Strict.{
        id: json |> field("id", int),
        apValue: json |> field("apValue", int),
        prerequisites:
          json
          |> optionalField(
               "prerequisites",
               Prerequisite.Collection.Profession.Decode.multilingual,
             ),
        options: json |> optionalField("options", Options.decode),
        specialAbilities:
          json
          |> optionalField(
               "specialAbilities",
               list(Prerequisite.Activatable.Decode.t),
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
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        liturgicalChants:
          json
          |> optionalField(
               "liturgicalChants",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
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
          |> optionalField(
               "variants",
               list(Variant.Decode.multilingualAssoc),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        isVariantRequired:
          json
          |> optionalField("isVariantRequired", bool)
          |> Ley_Option.fromOption(false),
        curriculum: json |> optionalField("curriculum", int),
        gr: json |> field("gr", int),
        sgr: json |> field("sgr", int),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            let prerequisites =
              x.prerequisites
              |> Ley_Option.option(
                   [],
                   Prerequisite.Collection.Profession.Decode.resolveTranslations(
                     langs,
                   ),
                 );

            {
              id: x.id,
              name: translation.name,
              subname: translation.subname,
              apValue: x.apValue,
              prerequisites,
              prerequisitesStart: translation.prerequisitesStart,
              options: {
                ...x.options |> Ley_Option.fromOption(Options.default),
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
                |> Ley_IntMap.mapMaybe(
                     Variant.Decode.resolveTranslations(langs),
                   ),
              isVariantRequired: x.isVariantRequired,
              curriculum: x.curriculum,
              gr: x.gr,
              sgr: x.sgr,
              src:
                PublicationRef.Decode.resolveTranslationsList(langs, x.src),
              errata: translation.errata |> Ley_Option.fromOption([]),
            };
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
