module IM = Ley_IntMap
module O = Ley_Option
module Shared = Activatable_Shared

module Static = struct
  type specialRule =
    | Labeled of { label : string; text : string }
    | Plain of string

  type t = {
    id : int;
    name : string;
    nameForArcaneSpellworks : string option;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    specialRules : specialRule list;
    selectOptions : SelectOption.map;
    input : string option;
    primary : int option;
    useHalfPrimaryForArcaneEnergy : bool;
    canLearnCantrips : bool;
    canLearnSpells : bool;
    canLearnRituals : bool;
    allowMultipleTraditions : bool;
    alternativeDisAdvApMax : int option;
    isMagicalDilettante : bool;
    areDisAdvRequiredApplyToMagActionsOrApps : bool;
    useArcaneSpellworksFromTradition : int option;
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
        nameForArcaneSpellworks : string option;
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
            nameForArcaneSpellworks =
              json |> optionalField "nameForArcaneSpellworks" string;
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

    type multilingual = {
      id : int;
      levels : int option;
      max : int option;
      selectOptions : SelectOption.Decode.multilingual option;
      primary : int option;
      useHalfPrimaryForArcaneEnergy : bool option;
      canLearnCantrips : bool;
      canLearnSpells : bool;
      canLearnRituals : bool;
      allowMultipleTraditions : bool;
      alternativeDisAdvApMax : int option;
      isMagicalDilettante : bool;
      areDisAdvRequiredApplyToMagActionsOrApps : bool;
      useArcaneSpellworksFromTradition : int option;
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
          primary = json |> optionalField "primary" int;
          useHalfPrimaryForArcaneEnergy =
            json |> optionalField "useHalfPrimaryForAE" bool;
          canLearnCantrips = json |> field "canLearnCantrips" bool;
          canLearnSpells = json |> field "canLearnSpells" bool;
          canLearnRituals = json |> field "canLearnRituals" bool;
          allowMultipleTraditions = json |> field "allowMultipleTraditions" bool;
          alternativeDisAdvApMax =
            json |> optionalField "alternativeDisAdvAPMax" int;
          areDisAdvRequiredApplyToMagActionsOrApps =
            json |> field "areDisAdvRequiredApplyToMagActionsOrApps" bool;
          isMagicalDilettante = json |> field "isMagicalDilettante" bool;
          useArcaneSpellworksFromTradition =
            json |> optionalField "useArcaneSpellworksFromTradition" int;
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
            nameForArcaneSpellworks = translation.nameForArcaneSpellworks;
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
            useHalfPrimaryForArcaneEnergy =
              multilingual.useHalfPrimaryForArcaneEnergy
              |> Ley_Option.fromOption false;
            canLearnCantrips = multilingual.canLearnCantrips;
            canLearnSpells = multilingual.canLearnSpells;
            canLearnRituals = multilingual.canLearnRituals;
            allowMultipleTraditions = multilingual.allowMultipleTraditions;
            alternativeDisAdvApMax = multilingual.alternativeDisAdvApMax;
            areDisAdvRequiredApplyToMagActionsOrApps =
              multilingual.areDisAdvRequiredApplyToMagActionsOrApps;
            isMagicalDilettante = multilingual.isMagicalDilettante;
            useArcaneSpellworksFromTradition =
              multilingual.useArcaneSpellworksFromTradition;
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

let primary_attribute mp =
  O.Infix.(
    IM.find Dynamic.is_active mp >>= fun trad ->
    trad.static >>= fun trad -> trad.primary)
