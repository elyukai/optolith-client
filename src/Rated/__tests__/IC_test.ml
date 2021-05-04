open Jest
open Expect
open IC

let () =
  describe "ap_for_range" (fun () ->
      test "returns positive int on increase" (fun () ->
          expect (ap_for_range A ~from_value:4 ~to_value:6) |> toBe 2);

      test "returns negative int on decrease" (fun () ->
          expect (ap_for_range A ~from_value:4 ~to_value:2) |> toBe (-2));

      test "returns positive int on multi increase above threshold" (fun () ->
          expect (ap_for_range C ~from_value:14 ~to_value:16) |> toBe 27);

      test "returns negative int on multi decrease above threshold" (fun () ->
          expect (ap_for_range C ~from_value:14 ~to_value:12) |> toBe (-15));

      test "returns positive int on multi increase around threshold for E"
        (fun () ->
          expect (ap_for_range E ~from_value:13 ~to_value:15) |> toBe 45);

      test "returns negative int on multi decrease for E" (fun () ->
          expect (ap_for_range E ~from_value:13 ~to_value:11) |> toBe (-30));

      test "returns positive int on multi increase above threshold for E"
        (fun () ->
          expect (ap_for_range E ~from_value:14 ~to_value:16) |> toBe 75));

  describe "ap_for_increase" (fun () ->
      test "returns flat cost" (fun () ->
          expect (ap_for_increase A 4) |> toBe 1);

      test "returns multiplied cost" (fun () ->
          expect (ap_for_increase C 14) |> toBe 12);

      test "returns flat cost for E" (fun () ->
          expect (ap_for_increase E 13) |> toBe 15);

      test "returns multiplied cost for E" (fun () ->
          expect (ap_for_increase E 14) |> toBe 30));

  describe "ap_for_decrease" (fun () ->
      test "returns flat cost" (fun () ->
          expect (ap_for_decrease A 4) |> toBe (-1));

      test "returns multiplied cost" (fun () ->
          expect (ap_for_decrease C 14) |> toBe (-9));

      test "returns flat cost for E" (fun () ->
          expect (ap_for_decrease E 14) |> toBe (-15));

      test "returns multiplied cost for E" (fun () ->
          expect (ap_for_decrease E 15) |> toBe (-30)));

  describe "ap_for_activatation" (fun () ->
      test "returns activation cost for A" (fun () ->
          expect (ap_for_activatation A) |> toBe 1);

      test "returns activation cost for C" (fun () ->
          expect (ap_for_activatation C) |> toBe 3);

      test "returns activation cost for E" (fun () ->
          expect (ap_for_activatation E) |> toBe 15));

  describe "show" (fun () ->
      test "returns name of A" (fun () -> expect (show A) |> toBe "A");

      test "returns name of E" (fun () -> expect (show E) |> toBe "E"))
