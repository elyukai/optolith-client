open IO.Functor;

module Decode = Yaml_Decode;
module Integrity = Yaml_Integrity;
module Raw = Yaml_Raw;
module Zip = Yaml_Zip;

let parseStaticData = locale => {
  Js.Console.timeStart("parseStaticData");

  locale
  |> Raw.getStaticData
  <&> (
    yamlData => {
      let res = Decode.decode(yamlData);

      Js.Console.log("Parsing static data done!");

      Js.Console.timeEnd("parseStaticData");

      res;
    }
  );
};
