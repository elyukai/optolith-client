type order = list(string);

let fromList = xs => xs;

let toList = xs => xs;

let getPreferred = List.hd;

module Supported = {
  type t = {
    id: string,
    name: string,
    region: string,
  };

  module Decode = {
    type multilingual = {
      id: string,
      name: string,
      region: string,
      isMissingImplementation: option(bool),
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", string),
        name: json |> field("name", string),
        region: json |> field("region", string),
        isMissingImplementation:
          json |> optionalField("isMissingImplementation", bool),
      };

    let toAssoc = x =>
      Ley_Option.dis(x.isMissingImplementation)
        ? None : Some((x.id, {id: x.id, name: x.name, region: x.region}));

    let assoc = json => json |> multilingual |> toAssoc;

    let map = json =>
      Json.Decode.(
        json |> list(assoc) |> Ley_Option.catOptions |> Ley_StrMap.fromList
      );
  };

  let systemLocaleToId = (supportedLocales, systemLocale) =>
    systemLocale
    |> Js.String.split("-")
    |> (arr => arr[0])
    |> (
      systemLocaleStart =>
        Ley_StrMap.find(
          locale => Js.String.startsWith(systemLocaleStart, locale.id),
          supportedLocales,
        )
        |> Ley_Option.option("en-US", locale => locale.id)
    );
};

let filterBySupported = (def, supportedLocales, order) =>
  order
  |> Ley_List.filter(Ley_Function.flip(Ley_StrMap.member, supportedLocales))
  |> (
    fun
    | [] => [def]
    | order => order
  );
