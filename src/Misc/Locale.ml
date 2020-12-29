module Order = struct
  type t = string list

  let fromList xs = xs

  let toList xs = xs

  let getPreferred = List.hd
end

module Supported = struct
  type t = { id : string; name : string; region : string }

  module Decode = struct
    type multilingual = {
      id : string;
      name : string;
      region : string;
      isMissingImplementation : bool option;
    }

    let multilingual json =
      Json_Decode_Strict.
        {
          id = json |> field "id" string;
          name = json |> field "name" string;
          region = json |> field "region" string;
          isMissingImplementation =
            json |> optionalField "isMissingImplementation" bool;
        }

    let make multilingual =
      if Ley_Option.dis multilingual.isMissingImplementation then None
      else
        Some
          ( multilingual.id,
            {
              id = multilingual.id;
              name = multilingual.name;
              region = multilingual.region;
            } )

    let assoc json = json |> multilingual |> make

    let map json =
      Json.Decode.(
        json |> list assoc |> Ley_Option.catOptions |> Ley_StrMap.fromList)
  end

  let systemLocaleToId supportedLocales systemLocale =
    (systemLocale |> Js.String.split "-" |> fun arr -> arr.(0))
    |> fun systemLocaleStart ->
    Ley_StrMap.find
      (fun { id; _ } -> Js.String.startsWith systemLocaleStart id)
      supportedLocales
    |> Ley_Option.option "en-US" (fun locale -> locale.id)
end

let filterBySupported def supportedLocales order =
  order
  |> Ley_List.filter (Ley_Function.flip Ley_StrMap.member supportedLocales)
  |> function
  | [] -> [ def ]
  | order -> order
