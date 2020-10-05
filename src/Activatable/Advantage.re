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
    actions: option(string),
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

  module Translations = {
    type t = {
      name: string,
      nameInWiki: option(string),
      rules: string,
      input: option(string),
      range: option(string),
      actions: option(string),
      prerequisites: option(string),
      prerequisitesStart: option(string),
      prerequisitesEnd: option(string),
      apValue: option(string),
      apValueAppend: option(string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        nameInWiki: json |> optionalField("nameInWiki", string),
        rules: json |> field("rules", string),
        input: json |> optionalField("input", string),
        range: json |> optionalField("range", string),
        actions: json |> optionalField("actions", string),
        prerequisites: json |> optionalField("prerequisites", string),
        prerequisitesStart:
          json |> optionalField("prerequisitesStart", string),
        prerequisitesEnd: json |> optionalField("prerequisitesEnd", string),
        apValue: json |> optionalField("apValue", string),
        apValueAppend: json |> optionalField("apValueAppend", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    noMaxAPInfluence: option(bool),
    isExclusiveToArcaneSpellworks: option(bool),
    levels: option(int),
    max: option(int),
    selectOptionCategories: option(list(SelectOption.Category.WithGroups.t)),
    selectOptions: SelectOption.Map.t(SelectOption.multilingual),
    prerequisites: Prerequisite.Collection.AdvantageDisadvantage.multilingual,
    apValue: option(apValue),
    gr: int,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeApValue =
    Json.Decode.(
      oneOf([
        json => json |> int |> (x => Flat(x)),
        json => json |> list(int) |> (x => PerLevel(x)),
      ])
    );

  let decodeMultilingual = json =>
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
             list(SelectOption.Category.WithGroups.decode),
           ),
      selectOptions:
        json
        |> optionalField(
             "selectOptions",
             list(SelectOption.decodeMultilingualPair),
           )
        |> Ley_Option.option(
             SelectOption.Map.empty,
             SelectOption.Map.fromList,
           ),
      prerequisites:
        json
        |> field(
             "prerequisites",
             Prerequisite.Collection.AdvantageDisadvantage.decodeMultilingual,
           ),
      apValue: json |> optionalField("apValue", decodeApValue),
      gr: json |> field("gr", int),
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations =
      (
        langs,
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        x,
      ) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => (
          x.id,
          {
            id: x.id,
            name: translation.name,
            nameInWiki: translation.nameInWiki,
            noMaxAPInfluence:
              x.noMaxAPInfluence |> Ley_Option.fromOption(false),
            isExclusiveToArcaneSpellworks:
              x.isExclusiveToArcaneSpellworks |> Ley_Option.fromOption(false),
            levels: x.levels,
            max: x.max,
            rules: translation.rules,
            selectOptions:
              x.selectOptionCategories
              |> SelectOption.ResolveCategories.resolveCategories(
                   blessings,
                   cantrips,
                   combatTechniques,
                   liturgicalChants,
                   skills,
                   spells,
                 )
              |> SelectOption.ResolveCategories.mergeSelectOptions(
                   SelectOption.Map.mapMaybe(
                     SelectOption.resolveTranslations(langs),
                     x.selectOptions,
                   ),
                 ),
            input: translation.input,
            range: translation.range,
            actions: translation.actions,
            prerequisites:
              Prerequisite.Collection.AdvantageDisadvantage.resolveTranslations(
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
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode =
      (
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        langs,
        json,
      ) =>
    json
    |> decodeMultilingual
    |> resolveTranslations(
         langs,
         blessings,
         cantrips,
         combatTechniques,
         liturgicalChants,
         skills,
         spells,
       );
};
