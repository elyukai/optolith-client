open IO.Infix;

module Decode = Yaml_Decode;
module Raw = Yaml_Raw;

let parseStaticData = (~onProgress, langs) => {
  Js.Console.timeStart("parseStaticData");

  let preferredLocale = langs |> List.hd;

  Raw.parseUI(preferredLocale)
  <&> Decode.decodeUI(preferredLocale)
  >>= (
    ui =>
      Raw.parseFiles(~onProgress)
      <&> (
        Decode.decodeFiles(langs, ui)
        |> (
          static => {
            Js.Console.log("Parsing static data done!");

            Js.Console.timeEnd("parseStaticData");

            static;
          }
        )
      )
  )
  |> Exception.handleE;
};
