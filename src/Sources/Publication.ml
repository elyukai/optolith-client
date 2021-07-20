type t = {
  id : Id.Publication.t;
  name : string;
  abbr : string;
  is_core : bool;
  is_adult_content : bool;
}

module Decode = struct
  open Decoders_bs.Decode

  type translation = {
    name : string;
    nameAbbr : string;
    isMissingImplementation : bool option;
  }

  let translation =
    field "name" string
    >>= fun name ->
    field "nameAbbr" string
    >>= fun nameAbbr ->
    field_opt "isMissingImplementation" bool
    >>= fun isMissingImplementation ->
    succeed { name; nameAbbr; isMissingImplementation }
    >|= Option.ensure (fun { isMissingImplementation; _ } ->
            Option.dis isMissingImplementation)

  type multilingual = {
    id : Id.Publication.t;
    isCore : bool;
    isAdultContent : bool;
    isMissingImplementation : bool option;
    translations : translation TranslationMap.t;
  }

  let multilingual =
    field "id" Id.Publication.Decode.t
    >>= fun id ->
    field "isCore" bool
    >>= fun isCore ->
    field "isAdultContent" bool
    >>= fun isAdultContent ->
    field_opt "isMissingImplementation" bool
    >>= fun isMissingImplementation ->
    field "translations" (TranslationMap.Decode.t_opt translation)
    >>= fun translations ->
    succeed
      { id; isCore; isAdultContent; isMissingImplementation; translations }

  let make_assoc locale_order =
    let open Option.Infix in
    multilingual
    >|= fun multilingual ->
    multilingual.translations
    |> TranslationMap.preferred locale_order
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
