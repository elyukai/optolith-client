module Static = struct
  type t = {
    id : Id.FocusRule.t;
    name : string;
    description : string;
    subject : int;
    level : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = {
      name : string;
      description : string;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "description" string
      >>= fun description ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata -> succeed { name; description; errata }

    type multilingual = {
      id : Id.FocusRule.t;
      subject : int;
      level : int;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.FocusRule.Decode.t
      >>= fun id ->
      field "level" int
      >>= fun level ->
      field "subject" int
      >>= fun subject ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations -> succeed { id; level; subject; src; translations }

    let make_assoc locale_order =
      let open Option.Infix in
      multilingual locale_order
      >|= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          level = multilingual.level;
          subject = multilingual.subject;
          description = translation.description;
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end
