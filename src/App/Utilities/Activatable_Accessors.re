open Static;

let isActive = (x: Hero.Activatable.t) => Ley.List.Extra.notNull(x.active);

let isActiveM = Ley.Option.option(false, isActive);

let name = x =>
  switch (x) {
  | Advantage(y) => y.name
  | Disadvantage(y) => y.name
  | SpecialAbility(y) => y.name
  };

let selectOptions = x =>
  switch (x) {
  | Advantage(y) => y.selectOptions
  | Disadvantage(y) => y.selectOptions
  | SpecialAbility(y) => y.selectOptions
  };

let input = x =>
  switch (x) {
  | Advantage(y) => y.input
  | Disadvantage(y) => y.input
  | SpecialAbility(y) => y.input
  };

let apValue = x =>
  switch (x) {
  | Advantage(y) => y.apValue
  | Disadvantage(y) => y.apValue
  | SpecialAbility(y) => y.apValue
  };
