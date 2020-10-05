open IO.Infix;

let parseStaticData = (~onProgress, langs) => {
  Js.Console.timeStart("parseStaticData");

  let preferredLocale = Locale.getPreferred(langs);

  Yaml_Parse.parseUI(preferredLocale)
  <&> Yaml_Decode.decodeUI(preferredLocale)
  >>= (
    ui =>
      Yaml_Parse.parseFiles(~onProgress)
      <&> (
        Yaml_Decode.decodeFiles(langs, ui)
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
