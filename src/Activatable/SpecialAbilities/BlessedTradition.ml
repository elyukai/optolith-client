module Shared = Activatable_Shared

module Static = struct
  type specialRule =
    | Labeled of { label : string; text : string }
    | Plain of string

  type favoredCombatTechniques =
    | All
    | AllMelee
    | AllUsedInHunting
    | Specific of Id.CombatTechnique.t list

  type favoredSkillsSelection = { amount : int; options : int list }

  type t = {
    id : int;
    name : string;
    nameShort : string option;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    specialRules : specialRule list;
    selectOptions : SelectOption.map;
    input : string option;
    primary : int;
    aspects : (int * int) option;
    restrictedBlessings : int list;
    favoredCombatTechniques : favoredCombatTechniques option;
    favoredSkills : int list;
    favoredSkillsSelection : favoredSkillsSelection option;
    isShamanistic : bool;
    prerequisites : Prerequisite.Collection.AdvantageDisadvantage.t;
    prerequisitesText : string option;
    prerequisitesTextStart : string option;
    prerequisitesTextEnd : string option;
    apValue : Shared.ApValue.t option;
    apValueText : string option;
    apValueTextAppend : string option;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Shared.Decode.Make (struct
    module F = Ley_Function

    type nonrec t = t

    module Translation = struct
      let specialRule =
        Json_Decode_Strict.(
          field "text" string
          |> andThen (fun text ->
                 optionalField "label" string
                 |> map (function
                      | Some label -> Labeled { label; text }
                      | None -> Plain text)))

      type t = {
        name : string;
        nameShort : string option;
        nameInWiki : string option;
        specialRules : specialRule list;
        input : string option;
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
            nameShort = json |> optionalField "nameShort" string;
            nameInWiki =
              json |> optionalField "nameInWiki" Shared.NameInLibrary.Decode.t;
            specialRules = json |> field "specialRules" (list specialRule);
            input = json |> optionalField "input" Shared.Input.Decode.t;
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

    let favoredCombatTechniques =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "All" -> F.const All
             | "AllMelee" -> F.const AllMelee
             | "AllUsedInHunting" -> F.const AllUsedInHunting
             | "List" ->
                 field "value" (list Id.CombatTechnique.Decode.t)
                 |> map (fun xs -> Specific xs)
             | str ->
                 raise
                   (DecodeError
                      ("Unknown favored combat techniques type: " ^ str))))

    let favoredSkillsSelection json =
      Json.Decode.
        {
          amount = json |> field "amount" int;
          options = json |> field "options" (list int);
        }

    type multilingual = {
      id : int;
      levels : int option;
      max : int option;
      selectOptions : SelectOption.Decode.multilingual option;
      primary : int;
      aspects : (int * int) option;
      restrictedBlessings : int list option;
      favoredCombatTechniques : favoredCombatTechniques option;
      favoredSkills : int list;
      favoredSkillsSelection : favoredSkillsSelection option;
      isShamanistic : bool option;
      prerequisites :
        Prerequisite.Collection.AdvantageDisadvantage.Decode.multilingual;
      apValue : Shared.ApValue.t option;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          levels = json |> optionalField "levels" int;
          max = json |> optionalField "max" int;
          selectOptions =
            json
            |> optionalField "selectOptions" SelectOption.Decode.multilingual;
          primary = json |> field "primary" int;
          aspects = json |> optionalField "aspects" (tuple2 int int);
          restrictedBlessings =
            json |> optionalField "restrictedBlessings" (list int);
          favoredCombatTechniques =
            json
            |> optionalField "favoredCombatTechniques" favoredCombatTechniques;
          favoredSkills = json |> field "favoredSkills" (list int);
          favoredSkillsSelection =
            json
            |> optionalField "favoredSkillsSelection" favoredSkillsSelection;
          isShamanistic = json |> optionalField "isShamanistic" bool;
          prerequisites =
            json
            |> field "prerequisites"
                 Prerequisite.Collection.AdvantageDisadvantage.Decode
                 .multilingual;
          apValue = json |> optionalField "apValue" Shared.ApValue.Decode.t;
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
            nameShort = translation.nameShort;
            nameInWiki = translation.nameInWiki;
            levels = multilingual.levels;
            max = multilingual.max;
            specialRules = translation.specialRules;
            selectOptions =
              multilingual.selectOptions
              |> Ley_Option.option SelectOption.Map.empty
                   (resolveSelectOptions ~src ~errata langs);
            input = translation.input;
            primary = multilingual.primary;
            aspects = multilingual.aspects;
            restrictedBlessings =
              multilingual.restrictedBlessings |> Ley_Option.fromOption [];
            favoredCombatTechniques = multilingual.favoredCombatTechniques;
            favoredSkills = multilingual.favoredSkills;
            favoredSkillsSelection = multilingual.favoredSkillsSelection;
            isShamanistic =
              multilingual.isShamanistic |> Ley_Option.fromOption false;
            prerequisites =
              Prerequisite.Collection.AdvantageDisadvantage.Decode
              .resolveTranslations langs multilingual.prerequisites;
            prerequisitesText = translation.prerequisites;
            prerequisitesTextStart = translation.prerequisitesStart;
            prerequisitesTextEnd = translation.prerequisitesEnd;
            apValue = multilingual.apValue;
            apValueText = translation.apValue;
            apValueTextAppend = translation.apValueAppend;
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
