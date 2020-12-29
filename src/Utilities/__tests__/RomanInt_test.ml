open Jest
open Expect

let () =
  describe "intToRoman" (fun () ->
      describe "t" (fun () ->
          test "converts a defined int into a roman int" (fun () ->
              expect @@ RomanInt.intToRoman 3 |> toBe "III");

          test "converts an int not covered into a string of that number"
            (fun () -> expect @@ RomanInt.intToRoman 100 |> toBe "100")))
