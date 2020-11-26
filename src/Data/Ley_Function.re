module Functor = {
  let (<$>) = (f, g, x) => x |> g |> f;

  let (<&>) = (g, f) => f <$> g;
};

let id = x => x;

let const = (x, _) => x;

let flip = (f, x, y) => f(y, x);

let on = (b, u, x, y) => b(u(x), u(y));
