type fold('a, 'b) = ('a, 'b) => 'b;

type transducer('a, 'b, 'c) = fold('b, 'c) => fold('a, 'c);

let idT = (f, x) => f(x);

let (<$~) = (f, fold, x, acc) => fold(f(x), acc);

let (<&~) = (g, f) => f <$~ g;

let (~<<) = (pred, fold, x, acc) => pred(x) ? fold(x, acc) : acc;

let (>>~) = (fold, pred) => (~<<)(pred, fold);

let mapOptionT = (f, fold, x, acc) =>
  switch (f(x)) {
  | Some(y) => fold(y, acc)
  | None => acc
  };

let transduceList = (t, xs) => Ley_List.foldr(t(Ley_List.cons), [], xs);
