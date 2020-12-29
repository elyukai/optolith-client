type characterListSortOrder = Name | DateModified

type characterListVisibilityFilter = All | Own | Shared

type raceListSortOrder = Name | ApValue

type cultureListSortOrder = Name | ApValue

type cultureListVisibilityFilter = All | Common

type professionListSortOrder = Name | ApValue

type professionListVisibilityFilter = All | Common

type professionListGroupVisibilityFilter = All | Mundane | Magical | Blessed

type skillListSortOrder = Name | Group | IC

type specialAbilityListSortOrder = Name | Group

type combatTechniqueListSortOrder = Name | Group | IC

type spellListSortOrder = Name | Group | Property | IC

type liturgicalChantListSortOrder = Name | Group | IC

type equipmentListSortOrder = Name | Group | Where | Weight

type theme = Dark | Light

type t = {
  characterListSortOrder : characterListSortOrder;
  characterListVisibilityFilter : characterListVisibilityFilter;
  raceListSortOrder : raceListSortOrder;
  cultureListSortOrder : cultureListSortOrder;
  cultureListVisibilityFilter : cultureListVisibilityFilter;
  professionListSortOrder : professionListSortOrder;
  professionListVisibilityFilter : professionListVisibilityFilter;
  professionListGroupVisibilityFilter : professionListGroupVisibilityFilter;
  advantageDisadvantageListCultureRatingVisibility : bool;
  skillListSortOrder : skillListSortOrder;
  skillListCultureRatingVisibility : bool;
  combatTechniqueListSortOrder : combatTechniqueListSortOrder;
  specialAbilityListSortOrder : specialAbilityListSortOrder;
  spellListSortOrder : spellListSortOrder;
  spellListUnfamiliarVisibility : bool;
  liturgicalChantListSortOrder : liturgicalChantListSortOrder;
  equipmentListSortOrder : equipmentListSortOrder;
  equipmentListGroupVisibilityFilter : int;
  sheetShowCheckAttributeValues : bool;
  sheetUseParchment : bool;
  sheetZoomFactor : int;
  enableActiveEntryHints : bool;
  locales : string list;
  theme : theme;
  enableEditingHeroAfterCreationPhase : bool;
  meleeItemTemplatesCombatTechniqueFilter : string option;
  rangedItemTemplatesCombatTechniqueFilter : string option;
  enableAnimations : bool;
}

let initial =
  {
    characterListSortOrder = DateModified;
    characterListVisibilityFilter = All;
    raceListSortOrder = Name;
    cultureListSortOrder = Name;
    cultureListVisibilityFilter = Common;
    professionListSortOrder = Name;
    professionListVisibilityFilter = Common;
    professionListGroupVisibilityFilter = All;
    advantageDisadvantageListCultureRatingVisibility = false;
    skillListSortOrder = Group;
    skillListCultureRatingVisibility = false;
    combatTechniqueListSortOrder = Name;
    specialAbilityListSortOrder = Name;
    spellListSortOrder = Name;
    spellListUnfamiliarVisibility = false;
    liturgicalChantListSortOrder = Name;
    equipmentListSortOrder = Name;
    equipmentListGroupVisibilityFilter = 1;
    sheetShowCheckAttributeValues = false;
    sheetUseParchment = false;
    sheetZoomFactor = 1;
    enableActiveEntryHints = false;
    locales = [];
    theme = Dark;
    enableEditingHeroAfterCreationPhase = false;
    meleeItemTemplatesCombatTechniqueFilter = None;
    rangedItemTemplatesCombatTechniqueFilter = None;
    enableAnimations = false;
  }

module Decode = struct
  let raiseUnknownOption ~optionName ~invalidValue =
    raise
      (Json.Decode.DecodeError
         ("Unknown value for option \"" ^ optionName ^ "\": " ^ invalidValue))

  module Old = struct
    let characterListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : characterListSortOrder)
             | "datemodified" | "dateModified" -> DateModified
             | str ->
                 raiseUnknownOption ~optionName:"characterListSortOrder"
                   ~invalidValue:str))

    let characterListVisibilityFilter =
      Json.Decode.(
        string
        |> map (function
             | "all" -> (All : characterListVisibilityFilter)
             | "own" -> Own
             | "shared" -> Shared
             | str ->
                 raiseUnknownOption ~optionName:"characterListVisibilityFilter"
                   ~invalidValue:str))

    let raceListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : raceListSortOrder)
             | "cost" -> ApValue
             | str ->
                 raiseUnknownOption ~optionName:"raceListSortOrder"
                   ~invalidValue:str))

    let cultureListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : cultureListSortOrder)
             | "cost" -> ApValue
             | str ->
                 raiseUnknownOption ~optionName:"cultureListSortOrder"
                   ~invalidValue:str))

    let cultureListVisibilityFilter =
      Json.Decode.(
        string
        |> map (function
             | "all" -> (All : cultureListVisibilityFilter)
             | "common" -> Common
             | str ->
                 raiseUnknownOption ~optionName:"cultureListVisibilityFilter"
                   ~invalidValue:str))

    let professionListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : professionListSortOrder)
             | "cost" -> ApValue
             | str ->
                 raiseUnknownOption ~optionName:"professionListSortOrder"
                   ~invalidValue:str))

    let professionListVisibilityFilter =
      Json.Decode.(
        string
        |> map (function
             | "all" -> (All : professionListVisibilityFilter)
             | "common" -> Common
             | str ->
                 raiseUnknownOption ~optionName:"professionListVisibilityFilter"
                   ~invalidValue:str))

    let professionListGroupVisibilityFilter =
      Json.Decode.(
        int
        |> map (function
             | 0 -> (All : professionListGroupVisibilityFilter)
             | 1 -> Mundane
             | 2 -> Magical
             | 3 -> Blessed
             | num ->
                 raiseUnknownOption
                   ~optionName:"professionListGroupVisibilityFilter"
                   ~invalidValue:(Js.Int.toString num)))

    let skillListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : skillListSortOrder)
             | "group" -> Group
             | "ic" -> IC
             | str ->
                 raiseUnknownOption ~optionName:"skillListSortOrder"
                   ~invalidValue:str))

    let combatTechniqueListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : combatTechniqueListSortOrder)
             | "group" -> Group
             | "ic" -> IC
             | str ->
                 raiseUnknownOption ~optionName:"combatTechniqueListSortOrder"
                   ~invalidValue:str))

    let specialAbilityListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : specialAbilityListSortOrder)
             | "group" | "groupname" -> Group
             | str ->
                 raiseUnknownOption ~optionName:"specialAbilityListSortOrder"
                   ~invalidValue:str))

    let spellListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : spellListSortOrder)
             | "group" -> Group
             | "property" -> Property
             | "ic" -> IC
             | str ->
                 raiseUnknownOption ~optionName:"spellListSortOrder"
                   ~invalidValue:str))

    let liturgicalChantListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : liturgicalChantListSortOrder)
             | "group" -> Group
             | "ic" -> IC
             | str ->
                 raiseUnknownOption ~optionName:"liturgicalChantListSortOrder"
                   ~invalidValue:str))

    let equipmentListSortOrder =
      Json.Decode.(
        string
        |> map (function
             | "name" -> (Name : equipmentListSortOrder)
             | "groupname" -> Group
             | "where" -> Where
             | "weight" -> Weight
             | str ->
                 raiseUnknownOption ~optionName:"equipmentListSortOrder"
                   ~invalidValue:str))

    let theme =
      Json.Decode.(
        string
        |> map (function
             | "dark" -> (Dark : theme)
             | "light" -> Light
             | str -> raiseUnknownOption ~optionName:"theme" ~invalidValue:str))

    let t json =
      Json_Decode_Strict.
        {
          characterListSortOrder =
            json |> field "herolistSortOrder" characterListSortOrder;
          characterListVisibilityFilter =
            json
            |> field "herolistVisibilityFilter" characterListVisibilityFilter;
          raceListSortOrder = json |> field "racesSortOrder" raceListSortOrder;
          cultureListSortOrder =
            json |> field "culturesSortOrder" cultureListSortOrder;
          cultureListVisibilityFilter =
            json |> field "culturesVisibilityFilter" cultureListVisibilityFilter;
          professionListSortOrder =
            json |> field "professionsSortOrder" professionListSortOrder;
          professionListVisibilityFilter =
            json
            |> field "professionsVisibilityFilter"
                 professionListVisibilityFilter;
          professionListGroupVisibilityFilter =
            json
            |> field "professionsGroupVisibilityFilter"
                 professionListGroupVisibilityFilter;
          advantageDisadvantageListCultureRatingVisibility =
            json |> field "advantagesDisadvantagesCultureRatingVisibility" bool;
          skillListSortOrder =
            json |> field "talentsSortOrder" skillListSortOrder;
          skillListCultureRatingVisibility =
            json |> field "talentsCultureRatingVisibility" bool;
          combatTechniqueListSortOrder =
            json
            |> field "combatTechniquesSortOrder" combatTechniqueListSortOrder;
          specialAbilityListSortOrder =
            json
            |> field "specialAbilitiesSortOrder" specialAbilityListSortOrder;
          spellListSortOrder =
            json |> field "spellsSortOrder" spellListSortOrder;
          spellListUnfamiliarVisibility =
            json |> field "spellsUnfamiliarVisibility" bool;
          liturgicalChantListSortOrder =
            json |> field "liturgiesSortOrder" liturgicalChantListSortOrder;
          equipmentListSortOrder =
            json |> field "equipmentSortOrder" equipmentListSortOrder;
          equipmentListGroupVisibilityFilter =
            json |> field "equipmentGroupVisibilityFilter" int;
          sheetShowCheckAttributeValues =
            json
            |> optionalField "sheetCheckAttributeValueVisibility" bool
            |> Ley_Option.fromOption false;
          sheetUseParchment =
            json
            |> optionalField "sheetUseParchment" bool
            |> Ley_Option.fromOption false;
          sheetZoomFactor = json |> field "sheetZoomFactor" int;
          enableActiveEntryHints = json |> field "enableActiveItemHints" bool;
          locales =
            [
              json |> optionalField "locale" string;
              json |> optionalField "fallbackLocale" string;
            ]
            |> Ley_Option.catOptions;
          theme =
            json |> optionalField "theme" theme |> Ley_Option.fromOption Dark;
          enableEditingHeroAfterCreationPhase =
            json
            |> optionalField "enableEditingHeroAfterCreationPhase" bool
            |> Ley_Option.fromOption false;
          meleeItemTemplatesCombatTechniqueFilter =
            json
            |> optionalField "meleeItemTemplatesCombatTechniqueFilter" string;
          rangedItemTemplatesCombatTechniqueFilter =
            json
            |> optionalField "rangedItemTemplatesCombatTechniqueFilter" string;
          enableAnimations =
            json
            |> optionalField "enableAnimations" bool
            |> Ley_Option.fromOption false;
        }
  end

  let characterListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : characterListSortOrder)
           | "dateModified" -> DateModified
           | str ->
               raiseUnknownOption ~optionName:"characterListSortOrder"
                 ~invalidValue:str))

  let characterListVisibilityFilter =
    Json.Decode.(
      string
      |> map (function
           | "all" -> (All : characterListVisibilityFilter)
           | "own" -> Own
           | "shared" -> Shared
           | str ->
               raiseUnknownOption ~optionName:"characterListVisibilityFilter"
                 ~invalidValue:str))

  let raceListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : raceListSortOrder)
           | "apValue" -> ApValue
           | str ->
               raiseUnknownOption ~optionName:"raceListSortOrder"
                 ~invalidValue:str))

  let cultureListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : cultureListSortOrder)
           | "apValue" -> ApValue
           | str ->
               raiseUnknownOption ~optionName:"cultureListSortOrder"
                 ~invalidValue:str))

  let cultureListVisibilityFilter =
    Json.Decode.(
      string
      |> map (function
           | "all" -> (All : cultureListVisibilityFilter)
           | "common" -> Common
           | str ->
               raiseUnknownOption ~optionName:"cultureListVisibilityFilter"
                 ~invalidValue:str))

  let professionListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : professionListSortOrder)
           | "apValue" -> ApValue
           | str ->
               raiseUnknownOption ~optionName:"professionListSortOrder"
                 ~invalidValue:str))

  let professionListVisibilityFilter =
    Json.Decode.(
      string
      |> map (function
           | "all" -> (All : professionListVisibilityFilter)
           | "common" -> Common
           | str ->
               raiseUnknownOption ~optionName:"professionListVisibilityFilter"
                 ~invalidValue:str))

  let professionListGroupVisibilityFilter =
    Json.Decode.(
      string
      |> map (function
           | "all" -> (All : professionListGroupVisibilityFilter)
           | "mundane" -> Mundane
           | "magical" -> Magical
           | "blessed" -> Blessed
           | str ->
               raiseUnknownOption
                 ~optionName:"professionListGroupVisibilityFilter"
                 ~invalidValue:str))

  let skillListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : skillListSortOrder)
           | "group" -> Group
           | "ic" -> IC
           | str ->
               raiseUnknownOption ~optionName:"skillListSortOrder"
                 ~invalidValue:str))

  let combatTechniqueListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : combatTechniqueListSortOrder)
           | "group" -> Group
           | "ic" -> IC
           | str ->
               raiseUnknownOption ~optionName:"combatTechniqueListSortOrder"
                 ~invalidValue:str))

  let specialAbilityListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : specialAbilityListSortOrder)
           | "group" -> Group
           | str ->
               raiseUnknownOption ~optionName:"specialAbilityListSortOrder"
                 ~invalidValue:str))

  let spellListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : spellListSortOrder)
           | "group" -> Group
           | "property" -> Property
           | "ic" -> IC
           | str ->
               raiseUnknownOption ~optionName:"spellListSortOrder"
                 ~invalidValue:str))

  let liturgicalChantListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : liturgicalChantListSortOrder)
           | "group" -> Group
           | "ic" -> IC
           | str ->
               raiseUnknownOption ~optionName:"liturgicalChantListSortOrder"
                 ~invalidValue:str))

  let equipmentListSortOrder =
    Json.Decode.(
      string
      |> map (function
           | "name" -> (Name : equipmentListSortOrder)
           | "group" -> Group
           | "where" -> Where
           | "weight" -> Weight
           | str ->
               raiseUnknownOption ~optionName:"equipmentListSortOrder"
                 ~invalidValue:str))

  let theme =
    Json.Decode.(
      string
      |> map (function
           | "dark" -> (Dark : theme)
           | "light" -> Light
           | str -> raiseUnknownOption ~optionName:"theme" ~invalidValue:str))

  let t json =
    Json_Decode_Strict.
      {
        characterListSortOrder =
          json |> field "characterListSortOrder" characterListSortOrder;
        characterListVisibilityFilter =
          json
          |> field "characterListVisibilityFilter" characterListVisibilityFilter;
        raceListSortOrder = json |> field "raceListSortOrder" raceListSortOrder;
        cultureListSortOrder =
          json |> field "cultureListSortOrder" cultureListSortOrder;
        cultureListVisibilityFilter =
          json
          |> field "cultureListVisibilityFilter" cultureListVisibilityFilter;
        professionListSortOrder =
          json |> field "professionListSortOrder" professionListSortOrder;
        professionListVisibilityFilter =
          json
          |> field "professionListVisibilityFilter"
               professionListVisibilityFilter;
        professionListGroupVisibilityFilter =
          json
          |> field "professionListGroupVisibilityFilter"
               professionListGroupVisibilityFilter;
        advantageDisadvantageListCultureRatingVisibility =
          json |> field "advantageDisadvantageListCultureRatingVisibility" bool;
        skillListSortOrder =
          json |> field "skillListSortOrder" skillListSortOrder;
        skillListCultureRatingVisibility =
          json |> field "skillListCultureRatingVisibility" bool;
        combatTechniqueListSortOrder =
          json
          |> field "combatTechniqueListSortOrder" combatTechniqueListSortOrder;
        specialAbilityListSortOrder =
          json
          |> field "specialAbilityListSortOrder" specialAbilityListSortOrder;
        spellListSortOrder =
          json |> field "spellListSortOrder" spellListSortOrder;
        spellListUnfamiliarVisibility =
          json |> field "spellListUnfamiliarVisibility" bool;
        liturgicalChantListSortOrder =
          json
          |> field "liturgicalChantListSortOrder" liturgicalChantListSortOrder;
        equipmentListSortOrder =
          json |> field "equipmentListSortOrder" equipmentListSortOrder;
        equipmentListGroupVisibilityFilter =
          json |> field "equipmentListGroupVisibilityFilter" int;
        sheetShowCheckAttributeValues =
          json
          |> optionalField "sheetShowCheckAttributeValues" bool
          |> Ley_Option.fromOption false;
        sheetUseParchment =
          json
          |> optionalField "sheetUseParchment" bool
          |> Ley_Option.fromOption false;
        sheetZoomFactor = json |> field "sheetZoomFactor" int;
        enableActiveEntryHints = json |> field "enableActiveEntryHints" bool;
        locales =
          json
          |> optionalField "locales" (list string)
          |> Ley_Option.fromOption [];
        theme =
          json |> optionalField "theme" theme |> Ley_Option.fromOption Dark;
        enableEditingHeroAfterCreationPhase =
          json
          |> optionalField "enableEditingHeroAfterCreationPhase" bool
          |> Ley_Option.fromOption false;
        meleeItemTemplatesCombatTechniqueFilter =
          json |> optionalField "meleeItemTemplatesCombatTechniqueFilter" string;
        rangedItemTemplatesCombatTechniqueFilter =
          json
          |> optionalField "rangedItemTemplatesCombatTechniqueFilter" string;
        enableAnimations =
          json
          |> optionalField "enableAnimations" bool
          |> Ley_Option.fromOption false;
      }
end
