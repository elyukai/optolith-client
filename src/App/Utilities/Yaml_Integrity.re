module Entity = {
  let uniquePairs = xs =>
    List.fold_right(
      ((k, v), mp) =>
        Ley.IntMap.member(k, mp)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(k) ++ "is set twice",
              ),
            )
          : Ley.IntMap.insert(k, v, mp),
      xs,
      Ley.IntMap.empty,
    );

  let uniqueList = xs =>
    List.fold_right(
      (x, s) =>
        Ley.IntSet.member(x, s)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(x) ++ "is set twice",
              ),
            )
          : Ley.IntSet.insert(x, s),
      xs,
      Ley.IntSet.empty,
    );
};
