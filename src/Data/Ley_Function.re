module Functor = {
  let (<$>) = (f, g, x) => x |> g |> f;

  let (<&>) = (g, f) => f <$> g;
};

let id = x => x;

let const = (x, _) => x;

let (<-) = (f, g, x) => f(g(x));

let flip = (f, x, y) => f(y, x);

let ($) = (f, x) => f(x);

let (&) = (x, f) => f(x);

let on = (b, u, x, y) => b(u(x), u(y));
