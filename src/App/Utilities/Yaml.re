open IO.Functor;

module Decode = Yaml_Decode;
module Integrity = Yaml_Integrity;
module Raw = Yaml_Raw;
module Zip = Yaml_Zip;

let parseStaticData = locale => {
  Js.Console.timeStart("parseStaticData");

  locale
  |> Yaml_Raw.getStaticData
  <&> (
    yamlData => {
      let res = Yaml_Decode.decode(locale, yamlData);

      Js.Console.log("Parsing static data done!");

      Js.Console.timeEnd("parseStaticData");

      res;
    }
  )
  |> Exception.handleE;
};
