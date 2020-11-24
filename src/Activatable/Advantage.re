module Static = {
  type apValue =
    | Flat(int)
    | PerLevel(list(int));

  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    levels: option(int),
    max: option(int),
    rules: string,
    selectOptions: SelectOption.map,
    input: option(string),
    range: option(string),
    prerequisites: Prerequisite.Collection.AdvantageDisadvantage.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    gr: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        nameInWiki: option(string),
        rules: string,
        input: option(string),
        range: option(string),
        prerequisites: option(string),
        prerequisitesStart: option(string),
        prerequisitesEnd: option(string),
        apValue: option(string),
        apValueAppend: option(string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          nameInWiki: json |> optionalField("nameInWiki", string),
          rules: json |> field("rules", string),
          input: json |> optionalField("input", string),
          range: json |> optionalField("range", string),
          prerequisites: json |> optionalField("prerequisites", string),
          prerequisitesStart:
            json |> optionalField("prerequisitesStart", string),
          prerequisitesEnd: json |> optionalField("prerequisitesEnd", string),
          apValue: json |> optionalField("apValue", string),
          apValueAppend: json |> optionalField("apValueAppend", string),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      noMaxAPInfluence: option(bool),
      isExclusiveToArcaneSpellworks: option(bool),
      levels: option(int),
      max: option(int),
      selectOptionCategories: option(list(SelectOption.Decode.Category.t)),
      selectOptions: SelectOption.Map.t(SelectOption.Decode.multilingual),
      prerequisites: Prerequisite.Collection.AdvantageDisadvantage.Decode.multilingual,
      apValue: option(apValue),
      gr: int,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let apValue =
      Json.Decode.(
        oneOf([
          json => json |> int |> (x => Flat(x)),
          json => json |> list(int) |> (x => PerLevel(x)),
        ])
      );

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        noMaxAPInfluence: json |> optionalField("noMaxAPInfluence", bool),
        isExclusiveToArcaneSpellworks:
          json |> optionalField("isExclusiveToArcaneSpellworks", bool),
        levels: json |> optionalField("levels", int),
        max: json |> optionalField("max", int),
        selectOptionCategories:
          json
          |> optionalField(
               "selectOptionCategories",
               list(SelectOption.Decode.Category.t),
             ),
        selectOptions:
          json
          |> optionalField(
               "selectOptions",
               list(SelectOption.Decode.multilingualAssoc),
             )
          |> Ley_Option.option(
               SelectOption.Map.empty,
               SelectOption.Map.fromList,
             ),
        prerequisites:
          json
          |> field(
               "prerequisites",
               Prerequisite.Collection.AdvantageDisadvantage.Decode.multilingual,
             ),
        apValue: json |> optionalField("apValue", apValue),
        gr: json |> field("gr", int),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
          langs,
          x,
        ) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            let src =
              PublicationRef.Decode.resolveTranslationsList(langs, x.src);
            let errata = translation.errata;

            {
              id: x.id,
              name: translation.name,
              nameInWiki: translation.nameInWiki,
              noMaxAPInfluence:
                x.noMaxAPInfluence |> Ley_Option.fromOption(false),
              isExclusiveToArcaneSpellworks:
                x.isExclusiveToArcaneSpellworks
                |> Ley_Option.fromOption(false),
              levels: x.levels,
              max: x.max,
              rules: translation.rules,
              selectOptions:
                x.selectOptionCategories
                |> SelectOption.Decode.ResolveCategories.resolveCategories(
                     ~blessings,
                     ~cantrips,
                     ~combatTechniques,
                     ~liturgicalChants,
                     ~skills,
                     ~spells,
                     ~tradeSecrets,
                     ~languages,
                     ~scripts,
                     ~animalShapes,
                     ~spellEnhancements,
                     ~liturgicalChantEnhancements,
                     ~src,
                     ~errata=errata |> Ley_Option.fromOption([]),
                   )
                |> SelectOption.Decode.ResolveCategories.mergeSelectOptions(
                     SelectOption.Map.mapMaybe(
                       SelectOption.Decode.resolveTranslations(langs),
                       x.selectOptions,
                     ),
                   ),
              input: translation.input,
              range: translation.range,
              prerequisites:
                Prerequisite.Collection.AdvantageDisadvantage.Decode.resolveTranslations(
                  langs,
                  x.prerequisites,
                ),
              prerequisitesText: translation.prerequisites,
              prerequisitesTextStart: translation.prerequisitesStart,
              prerequisitesTextEnd: translation.prerequisitesEnd,
              apValue: x.apValue,
              apValueText: translation.apValue,
              apValueTextAppend: translation.apValueAppend,
              gr: x.gr,
              src,
              errata: errata |> Ley_Option.fromOption([]),
            };
          }
        )
      );

    let t =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
          langs,
          json,
        ) =>
      json
      |> multilingual
      |> resolveTranslations(
           ~blessings,
           ~cantrips,
           ~combatTechniques,
           ~liturgicalChants,
           ~skills,
           ~spells,
           ~tradeSecrets,
           ~languages,
           ~scripts,
           ~animalShapes,
           ~spellEnhancements,
           ~liturgicalChantEnhancements,
           langs,
         );

    let toAssoc = (x: t) => (x.id, x);

    let assoc =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
        ) =>
      Decoder.decodeAssoc(
        t(
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
        ),
        toAssoc,
      );
  };
};
