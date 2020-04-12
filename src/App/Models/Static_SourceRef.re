[@genType "SourceRef"]
type t = {
  id: string,
  page: (int, int),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  let t = json => {
    id: json |> field("id", string),
    page: {
      let first = json |> field("firstPage", int);
      let mlast = json |> optionalField("lastPage", int);

      Maybe.maybe((first, first), last => (first, last), mlast);
    },
  };

  let list = Json.Decode.list(t);
};
