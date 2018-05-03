const ImprovementCostUtils = require('../improvementCostUtils');

test('returns B for 2', () => {
  expect(ImprovementCostUtils.getICName(2)).toBe('B');
});

test('returns 3 AP for increasing C skill from 5 to 6', () => {
  expect(ImprovementCostUtils.getIncreaseAP(3, 5)).toBe(3);
});

test('returns 18 AP for increasing C skill from 16 to 17', () => {
  expect(ImprovementCostUtils.getIncreaseAP(3, 16)).toBe(18);
});

test('returns 15 AP for increasing attribute from 8 to 9', () => {
  expect(ImprovementCostUtils.getIncreaseAP(5, 8)).toBe(15);
});

test('returns 45 AP for increasing attribute from 15 to 16', () => {
  expect(ImprovementCostUtils.getIncreaseAP(5, 15)).toBe(45);
});

test('returns 30 AP for increasing C skill from 11 to 15', () => {
  expect(ImprovementCostUtils.getAPRange(3, 11, 15)).toBe(30);
});

test('returns 3 AP for decreasing C skill from 5 to 4', () => {
  expect(ImprovementCostUtils.getDecreaseAP(3, 5)).toBe(-3);
});

test('returns 15 AP for decreasing C skill from 16 to 15', () => {
  expect(ImprovementCostUtils.getDecreaseAP(3, 16)).toBe(-15);
});

test('returns 15 AP for decreasing attribute from 9 to 8', () => {
  expect(ImprovementCostUtils.getDecreaseAP(5, 9)).toBe(-15);
});

test('returns 45 AP for decreasing attribute from 16 to 15', () => {
  expect(ImprovementCostUtils.getDecreaseAP(5, 16)).toBe(-45);
});

test('returns 48 AP for decreasing C skill from 16 to 10', () => {
  expect(ImprovementCostUtils.getAPRange(3, 16, 10)).toBe(-48);
});
