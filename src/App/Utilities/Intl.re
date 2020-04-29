module List = {
  open Static;
  open Maybe;

  type formatType =
    | Conjunction
    | Disjunction;

  let%private getSeparator = (type_, staticData) =>
    switch (type_) {
    | Conjunction => staticData.messages.general_and
    | Disjunction => staticData.messages.general_or
    };

  let%private joinLastWithSeparator = (type_, staticData, lastStr, initStr) =>
    initStr ++ " " ++ getSeparator(type_, staticData) ++ " " ++ lastStr;

  let format = (type_, staticData, xs) =>
    switch (xs) {
    | [] => ""
    | [x] => x
    | xs =>
      xs
      |> ListH.Extra.unsnoc
      |> maybe("", ((init, last)) =>
           init
           |> ListH.intercalate(", ")
           |> joinLastWithSeparator(type_, staticData, last)
         )
    };
};
