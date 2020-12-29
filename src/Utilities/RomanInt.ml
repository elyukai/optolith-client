let romanNumbers =
  [
    "I";
    "II";
    "III";
    "IV";
    "V";
    "VI";
    "VII";
    "VIII";
    "IX";
    "X";
    "XI";
    "XII";
    "XIII";
  ]

let intToRoman x =
  Ley_List.Safe.atMay romanNumbers (x - 1)
  |> Ley_Option.fromOption (Ley_Int.show x)
