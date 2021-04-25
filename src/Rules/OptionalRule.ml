module Static = struct
  type t = {
    id : int;
    name : string;
    description : string;
    isPrerequisite : bool;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type translation = {
      name : string;
      description : string;
      errata : Erratum.t list option;
    }

    let translation json =
      {
        name = json |> field "name" string;
        description = json |> field "description" string;
        errata = json |> optionalField "errata" Erratum.Decode.list;
      }

    type multilingual = {
      id : int;
      isPrerequisite : bool;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" int;
        isPrerequisite = json |> field "isPrerequisite" bool;
        src = json |> field "src" (PublicationRef.Decode.make_list locale_order);
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual locale_order |> fun multilingual ->
      multilingual.translations |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          description = translation.description;
          isPrerequisite = multilingual.isPrerequisite;
          src = multilingual.src;
          errata = translation.errata |> Option.fromOption [];
        } )
  end
end
