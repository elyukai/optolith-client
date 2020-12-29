open Jest
open Expect

let () =
  describe "Decode" (fun () ->
      describe "t" (fun () ->
          test "successfully decodes a single value" (fun () ->
              expect @@ OneOrMany.Decode.t Json.Decode.int [%raw {| 3 |}]
              |> toBe (OneOrMany.One 3));

          test "successfully decodes a list of values" (fun () ->
              expect
              @@ OneOrMany.Decode.t Json.Decode.int [%raw {| [1, 2, 3] |}]
              |> toBe (OneOrMany.Many [ 1; 2; 3 ]));

          test "throws if the decoder is unsuccessful on a single value"
            (fun () ->
              ( expect @@ fun () ->
                OneOrMany.Decode.t Json.Decode.int [%raw {| "not a number" |}]
              )
              |> toThrow);

          test "throws if the decoder is unsuccessful on a list of values"
            (fun () ->
              ( expect @@ fun () ->
                OneOrMany.Decode.t Json.Decode.int
                  [%raw {| [1, 2, "not a number"] |}] )
              |> toThrow)))
