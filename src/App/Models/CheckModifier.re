type t =
  | SPI
  | DOUBLE_SPI
  | TOU
  | MAX_SPI_TOU;

module Decode = {
  open Json.Decode;

  let t = json =>
    json
    |> string
    |> (
      scope =>
        switch (scope) {
        | "SPI" => json |> int |> (_ => SPI)
        | "SPI/2" => json |> int |> (_ => DOUBLE_SPI)
        | "TOU" => json |> int |> (_ => TOU)
        | "SPI/TOU" => json |> int |> (_ => MAX_SPI_TOU)
        | _ => raise(DecodeError("Unknown check modifier: " ++ scope))
        }
    );
};
