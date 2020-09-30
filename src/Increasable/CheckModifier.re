type t =
  | Spirit
  | HalfOfSpirit
  | Toughness
  | GreaterOfBoth;

let decode = json =>
  Json.Decode.(
    json
    |> string
    |> (
      scope =>
        switch (scope) {
        | "SPI" => json |> int |> (_ => Spirit)
        | "SPI/2" => json |> int |> (_ => HalfOfSpirit)
        | "TOU" => json |> int |> (_ => Toughness)
        | "SPI/TOU" => json |> int |> (_ => GreaterOfBoth)
        | _ => raise(DecodeError("Unknown check modifier: " ++ scope))
        }
    )
  );
