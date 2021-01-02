open Jest
open Expect

let () =
  describe "Modifier" (fun () ->
      describe "Decode" (fun () ->
          describe "t" (fun () ->
              test "decodes an existing check modifier string into the variant"
                (fun () ->
                  expect @@ Check.Modifier.Decode.t [%raw {| "SPI" |}]
                  |> toEqual Check.Modifier.Spirit);

              test "throws if the string is not a check modifier" (fun () ->
                  ( expect @@ fun () ->
                    Check.Modifier.Decode.t [%raw {| "TOU/2" |}] )
                  |> toThrow))))
