const { Identity } = require('../identity');

test('Identity.return', () => {
  expect(Identity.return(3).value).toEqual(3);
});

test('fmap', () => {
  expect(Identity.return(3).fmap(x => x * 2))
    .toEqual(Identity.return(6));
});

test('bind', () => {
  expect(Identity.return(3).bind(x => Identity.return(x * 2)))
    .toEqual(Identity.return(6));
});

test('then', () => {
  expect(Identity.return(3).then(Identity.return(2)))
    .toEqual(Identity.return(2));
});

test('ap', () => {
  expect(Identity.return(3).ap(Identity.return(x => x * 2)))
    .toEqual(Identity.return(6));
});
