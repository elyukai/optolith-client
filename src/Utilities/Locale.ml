module Order = struct
  type t = string list

  let from_list def xs = match xs with [] -> [ def ] | prefs -> prefs

  let to_list xs = xs

  let preferred = List.hd
end

(* module Supported = struct
  type t = { id : string; name : string; region : string }

  module Decode = struct
    type multilingual = {
      id : string;
      name : string;
      region : string;
      isMissingImplementation : bool option;
    }
    [@@decco]

    let makeAssoc multilingual =
      match multilingual.isMissingImplementation with
      | None | Some false ->
          Some
            ( multilingual.id,
              {
                id = multilingual.id;
                name = multilingual.name;
                region = multilingual.region;
              } )
      | Some true -> None

    let assoc json = json |> multilingual_decode |. Belt.Result.map makeAssoc

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
  | order -> order *)
