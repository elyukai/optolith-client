open Jest
open Expect

let () =
  describe "Decode" (fun () ->
      describe "t" (fun () ->
          test "decodes an existing check modifier string into the variant"
            (fun () ->
              expect @@ CheckModifier.Decode.t [%raw {| "SPI" |}]
              |> toEqual CheckModifier.Spirit);

          test "throws if the string is not a check modifier" (fun () ->
              (expect @@ fun () -> CheckModifier.Decode.t [%raw {| "TOU/2" |}])
              |> toThrow)))
