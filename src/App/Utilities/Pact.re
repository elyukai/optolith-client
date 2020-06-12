let%private isDomainValid = (pact: Hero.Pact.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain > 0
  | Custom(domain) => String.length(domain) > 0
  };

let%private isNameValid = (pact: Hero.Pact.t) =>
  pact.category === 2 || String.length(pact.name) > 0;

let%private isArchdemonicDomain = (pact: Hero.Pact.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain < 13
  | Custom(_) => false
  };

let%private isFreeDemonDomain = (pact: Hero.Pact.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain >= 13
  | Custom(_) => false
  };

let%private isTypeValid = (pact: Hero.Pact.t) =>
  pact.category === 1
  || pact.category === 2
  && (
    isArchdemonicDomain(pact)
    && pact.type_ === 1
    || isFreeDemonDomain(pact)
    && pact.type_ === 2
  );

let isPactFromStateValid = (pact: Hero.Pact.t) =>
  isDomainValid(pact) && isNameValid(pact) && isTypeValid(pact);
