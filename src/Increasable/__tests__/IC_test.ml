open Jest
open Expect
open IC

let () =
  describe "getApForRange" (fun () ->
      test "returns positive int on increase" (fun () ->
          expect (getApForRange A ~fromValue:4 ~toValue:6) |> toBe 2);

      test "returns negative int on decrease" (fun () ->
          expect (getApForRange A ~fromValue:4 ~toValue:2) |> toBe (-2));

      test "returns positive int on multi increase above threshold" (fun () ->
          expect (getApForRange C ~fromValue:14 ~toValue:16) |> toBe 27);

      test "returns negative int on multi decrease above threshold" (fun () ->
          expect (getApForRange C ~fromValue:14 ~toValue:12) |> toBe (-15));

      test "returns positive int on multi increase around threshold for E"
        (fun () ->
          expect (getApForRange E ~fromValue:13 ~toValue:15) |> toBe 45);

      test "returns negative int on multi decrease for E" (fun () ->
          expect (getApForRange E ~fromValue:13 ~toValue:11) |> toBe (-30));

      test "returns positive int on multi increase above threshold for E"
        (fun () ->
          expect (getApForRange E ~fromValue:14 ~toValue:16) |> toBe 75));

  describe "getApForIncrease" (fun () ->
      test "returns flat cost" (fun () ->
          expect (getApForIncrease A 4) |> toBe 1);

      test "returns multiplied cost" (fun () ->
          expect (getApForIncrease C 14) |> toBe 12);

      test "returns flat cost for E" (fun () ->
          expect (getApForIncrease E 13) |> toBe 15);

      test "returns multiplied cost for E" (fun () ->
          expect (getApForIncrease E 14) |> toBe 30));

  describe "getApForDecrease" (fun () ->
      test "returns flat cost" (fun () ->
          expect (getApForDecrease A 4) |> toBe (-1));

      test "returns multiplied cost" (fun () ->
          expect (getApForDecrease C 14) |> toBe (-9));

      test "returns flat cost for E" (fun () ->
          expect (getApForDecrease E 14) |> toBe (-15));

      test "returns multiplied cost for E" (fun () ->
          expect (getApForDecrease E 15) |> toBe (-30)));

  describe "getApForActivatation" (fun () ->
      test "returns activation cost for A" (fun () ->
          expect (getApForActivatation A) |> toBe 1);

      test "returns activation cost for C" (fun () ->
          expect (getApForActivatation C) |> toBe 3);

      test "returns activation cost for E" (fun () ->
          expect (getApForActivatation E) |> toBe 15));

  describe "show" (fun () ->
      test "returns name of A" (fun () -> expect (show A) |> toBe "A");

      test "returns name of E" (fun () -> expect (show E) |> toBe "E"))
