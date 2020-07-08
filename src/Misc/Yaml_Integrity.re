module Entity = {
  let uniquePairs = xs =>
    List.fold_right(
      ((k, v), mp) =>
        Ley_IntMap.member(k, mp)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(k) ++ "is set twice",
              ),
            )
          : Ley_IntMap.insert(k, v, mp),
      xs,
      Ley_IntMap.empty,
    );

  let uniqueList = xs =>
    List.fold_right(
      (x, s) =>
        Ley_IntSet.member(x, s)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(x) ++ "is set twice",
              ),
            )
          : Ley_IntSet.insert(x, s),
      xs,
      Ley_IntSet.empty,
    );
};
