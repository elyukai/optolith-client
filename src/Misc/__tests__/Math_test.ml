open Jest
open Expect

let () =
  describe "gsum" (fun () ->
      test "returns the sum of all values between 1 and 100" (fun () ->
          expect @@ Math.gsum 1 100 |> toBe 5050);

      test "returns the sum of all values between 1 and 99" (fun () ->
          expect @@ Math.gsum 1 99 |> toBe 4950))
