const { getICMultiplier, getIncreaseAP, getDecreaseAP, getAPRange, getICName } = require ('../improvementCostUtils.ts');

test('getICMultiplier', () => {
  expect (getICMultiplier (1)) .toEqual (1);
  expect (getICMultiplier (3)) .toEqual (3);
  expect (getICMultiplier (5)) .toEqual (15);
});

test('getIncreaseAP', () => {
  expect (getIncreaseAP (1) (4)) .toEqual (1);
  expect (getIncreaseAP (3) (14)) .toEqual (12);
  expect (getIncreaseAP (5) (13)) .toEqual (15);
  expect (getIncreaseAP (5) (14)) .toEqual (30);
});

test('getDecreaseAP', () => {
  expect (getDecreaseAP (1) (4)) .toEqual (-1);
  expect (getDecreaseAP (3) (14)) .toEqual (-9);
  expect (getDecreaseAP (5) (13)) .toEqual (-15);
  expect (getDecreaseAP (5) (14)) .toEqual (-15);
});

test('getAPRange', () => {
  expect (getAPRange (1) (4) (6)) .toEqual (2);
  expect (getAPRange (1) (4) (2)) .toEqual (-2);
  expect (getAPRange (3) (14) (16)) .toEqual (27);
  expect (getAPRange (3) (14) (12)) .toEqual (-15);
  expect (getAPRange (5) (13) (15)) .toEqual (45);
  expect (getAPRange (5) (13) (11)) .toEqual (-30);
  expect (getAPRange (5) (14) (16)) .toEqual (75);
});

test('getICName', () => {
  expect (getICName (1)) .toEqual ('A');
  expect (getICName (5)) .toEqual ('E');
});
