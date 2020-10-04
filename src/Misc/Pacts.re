let%private isDomainValid = (pact: Pact.Dynamic.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain > 0
  | Custom(domain) => String.length(domain) > 0
  };

let%private isNameValid = (pact: Pact.Dynamic.t) =>
  pact.category === 2 || String.length(pact.name) > 0;

let%private isArchdemonicDomain = (pact: Pact.Dynamic.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain < 13
  | Custom(_) => false
  };

let%private isFreeDemonDomain = (pact: Pact.Dynamic.t) =>
  switch (pact.domain) {
  | Predefined(domain) => domain >= 13
  | Custom(_) => false
  };

let%private isTypeValid = (pact: Pact.Dynamic.t) =>
  pact.category === 1
  || pact.category === 2
  && (
    isArchdemonicDomain(pact)
    && pact.type_ === 1
    || isFreeDemonDomain(pact)
    && pact.type_ === 2
  );

let isPactFromStateValid = (pact: Pact.Dynamic.t) =>
  isDomainValid(pact) && isNameValid(pact) && isTypeValid(pact);
