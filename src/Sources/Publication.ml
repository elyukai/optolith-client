type t = {
  id : Id.Publication.t;
  name : string;
  abbr : string;
  is_core : bool;
  is_adult_content : bool;
}

module Decode = struct
  open Json.Decode
  open JsonStrict

  type translation = {
    name : string;
    nameAbbr : string;
    isMissingImplementation : bool option;
  }

  let translation json =
    {
      name = json |> field "name" string;
      nameAbbr = json |> field "nameAbbr" string;
      isMissingImplementation =
        json |> optionalField "isMissingImplementation" bool;
    }
    |> Option.ensure (fun { isMissingImplementation; _ } ->
           Option.dis isMissingImplementation)

  type multilingual = {
    id : Id.Publication.t;
    isCore : bool;
    isAdultContent : bool;
    isMissingImplementation : bool option;
    translations : translation TranslationMap.t;
  }

  let multilingual json =
    {
      id = json |> field "id" Id.Publication.Decode.t;
      isCore = json |> field "isCore" bool;
      isAdultContent = json |> field "isAdultContent" bool;
      isMissingImplementation =
        json |> optionalField "isMissingImplementation" bool;
      translations =
        json |> field "translations" (TranslationMap.Decode.t_opt translation);
    }

  let make_assoc locale_order json =
    let open Option.Infix in
    json |> multilingual |> fun multilingual ->
    multilingual.translations |> TranslationMap.preferred locale_order
    <&> fun translation ->
    ( multilingual.id,
      {
        id = multilingual.id;
        is_core = multilingual.isCore;
        is_adult_content = multilingual.isAdultContent;
        name = translation.name;
        abbr = translation.nameAbbr;
      } )
end
