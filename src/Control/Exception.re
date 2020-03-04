open Either;
open IO.Monad;

let catch = Js.Promise.catch;

let try_ = x => x >>= (x => pure(Right(x))) |> catch(x => pure(Left(x)));
