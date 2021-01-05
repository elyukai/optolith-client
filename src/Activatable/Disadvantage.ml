module Shared = Activatable_Shared

module Static = struct
  type t = {
    id : int;
    name : string;
    nameInWiki : string option;
    noMaxAPInfluence : bool;
    isExclusiveToArcaneSpellworks : bool;
    levels : int option;
    max : int option;
    rules : string;
    selectOptions : SelectOption.map;
    input : string option;
    range : string option;
    prerequisites : Prerequisite.Collection.AdvantageDisadvantage.t;
    prerequisitesText : string option;
    prerequisitesTextStart : string option;
    prerequisitesTextEnd : string option;
    apValue : Shared.ApValue.t option;
    apValueText : string option;
    apValueTextAppend : string option;
    gr : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Shared.Decode.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        nameInWiki : string option;
        rules : string;
        input : string option;
        range : string option;
        prerequisites : string option;
        prerequisitesStart : string option;
        prerequisitesEnd : string option;
        apValue : string option;
        apValueAppend : string option;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" Shared.Name.Decode.t;
            nameInWiki =
              json |> optionalField "nameInWiki" Shared.NameInLibrary.Decode.t;
            rules = json |> field "rules" Shared.Rules.Decode.t;
            input = json |> optionalField "input" Shared.Input.Decode.t;
            range = json |> optionalField "range" string;
            prerequisites =
              json
              |> optionalField "prerequisites"
                   Shared.PrerequisitesReplacement.Decode.t;
            prerequisitesStart =
              json
              |> optionalField "prerequisitesStart"
                   Shared.PrerequisitesStart.Decode.t;
            prerequisitesEnd =
              json
              |> optionalField "prerequisitesEnd"
                   Shared.PrerequisitesEnd.Decode.t;
            apValue =
              json |> optionalField "apValue" Shared.ApValueReplacement.Decode.t;
            apValueAppend =
              json
              |> optionalField "apValueAppend" Shared.ApValueAppend.Decode.t;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      noMaxAPInfluence : bool option;
      isExclusiveToArcaneSpellworks : bool option;
      levels : int option;
      max : int option;
      selectOptions : SelectOption.Decode.multilingual option;
      prerequisites :
        Prerequisite.Collection.AdvantageDisadvantage.Decode.multilingual;
      apValue : Shared.ApValue.t option;
      gr : int;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          noMaxAPInfluence = json |> optionalField "noMaxAPInfluence" bool;
          isExclusiveToArcaneSpellworks =
            json |> optionalField "isExclusiveToArcaneSpellworks" bool;
          levels = json |> optionalField "levels" int;
          max = json |> optionalField "max" int;
          selectOptions =
            json
            |> optionalField "selectOptions" SelectOption.Decode.multilingual;
          prerequisites =
            json
            |> field "prerequisites"
                 Prerequisite.Collection.AdvantageDisadvantage.Decode
                 .multilingual;
          apValue = json |> optionalField "apValue" Shared.ApValue.Decode.t;
          gr = json |> field "gr" int;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make ~resolveSelectOptions langs (multilingual : multilingual)
        (translation : Translation.t) =
      let src =
        PublicationRef.Decode.resolveTranslationsList langs multilingual.src
      in
      let errata = translation.errata |> Ley_Option.fromOption [] in
      Some
        ( multilingual.id,
          {
            id = multilingual.id;
            name = translation.name;
            nameInWiki = translation.nameInWiki;
            noMaxAPInfluence =
              multilingual.noMaxAPInfluence |> Ley_Option.fromOption false;
            isExclusiveToArcaneSpellworks =
              multilingual.isExclusiveToArcaneSpellworks
              |> Ley_Option.fromOption false;
            levels = multilingual.levels;
            max = multilingual.max;
            rules = translation.rules;
            selectOptions =
              multilingual.selectOptions
              |> Ley_Option.option SelectOption.Map.empty
                   (resolveSelectOptions ~src ~errata langs);
            input = translation.input;
            range = translation.range;
            prerequisites =
              Prerequisite.Collection.AdvantageDisadvantage.Decode
              .resolveTranslations langs multilingual.prerequisites;
            prerequisitesText = translation.prerequisites;
            prerequisitesTextStart = translation.prerequisitesStart;
            prerequisitesTextEnd = translation.prerequisitesEnd;
            apValue = multilingual.apValue;
            apValueText = translation.apValue;
            apValueTextAppend = translation.apValueAppend;
            gr = multilingual.gr;
            src;
            errata;
          } )

    module Accessors = struct
      let translations x = x.translations
    end
  end)
end

module Dynamic = Activatable_Dynamic.Make (struct
  type static = Static.t
end)
