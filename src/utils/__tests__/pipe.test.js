const pipe = require('../pipe').pipe;


test('returns correctly piped value', () => {
  expect(pipe(
    str => str + ' Petersen',
    str => str.toUpperCase(),
    str => str + ' 26 y'
  )(
    'Hans'
  )).toBe('HANS PETERSEN 26 y');
});
