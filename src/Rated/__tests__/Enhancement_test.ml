open Jest
open Expect
open Enhancement

let x1 =
  {
    id = 1;
    name = "";
    level = 1;
    effect = "";
    prerequisites = [];
    src = [];
    errata = [];
  }

let x2 = { x1 with level = 2 }

let x3 = { x1 with level = 3 }

let () =
  describe "ap_value" (fun () ->
      test "returns the AP value for level 1 with IC A" (fun () ->
          expect (ap_value A x1) |> toBe 1);

      test "returns the AP value for level 2 with IC A" (fun () ->
          expect (ap_value A x2) |> toBe 2);

      test "returns the AP value for level 3 with IC A" (fun () ->
          expect (ap_value A x3) |> toBe 3);

      test "returns the AP value for level 1 with IC D" (fun () ->
          expect (ap_value D x1) |> toBe 4);

      test "returns the AP value for level 2 with IC C" (fun () ->
          expect (ap_value C x2) |> toBe 6);

      test "returns the AP value for level 3 with IC B" (fun () ->
          expect (ap_value B x3) |> toBe 6))
