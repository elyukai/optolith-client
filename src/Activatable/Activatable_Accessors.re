open Static;

let isActive = (x: Hero.Activatable.t) => Ley_List.Extra.notNull(x.active);

let isActiveM = Ley_Option.option(false, isActive);

let id = x =>
  switch (x) {
  | Advantage(y) => (EntryType.Activatable.Advantage, y.id)
  | Disadvantage(y) => (Disadvantage, y.id)
  | SpecialAbility(y) => (SpecialAbility, y.id)
  };

let id' = x =>
  switch (x) {
  | Advantage(y) => y.id
  | Disadvantage(y) => y.id
  | SpecialAbility(y) => y.id
  };

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

let apValue' = x =>
  switch (apValue(x)) {
  | Some(Flat(y)) => Some(OneOrMany.One(y))
  | Some(PerLevel(ys)) => Some(Many(ys))
  | None => None
  };

let max = x =>
  switch (x) {
  | Advantage(y) => y.max
  | Disadvantage(y) => y.max
  | SpecialAbility(y) => y.max
  };
