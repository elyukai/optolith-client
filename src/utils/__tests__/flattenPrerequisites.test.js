const { flattenPrerequisites } = require('../flattenPrerequisites');

test('does not flatten plain array', () => {
  expect(flattenPrerequisites(['RCP'])).toEqual(['RCP']);
});

test('flattens Map on activation/deactivation', () => {
  const prerequisites = new Map([[1, ['RCP']], [2, { id: 'SA_12345', active: true }]]);
  expect(flattenPrerequisites(prerequisites, 1)).toEqual(['RCP']);
});

test('flattens Map on activation/deactivation with higher level', () => {
  const prerequisites = new Map([[1, ['RCP']], [2, { id: 'SA_12345', active: true }]]);
  expect(flattenPrerequisites(prerequisites, 2))
    .toEqual(['RCP', { id: 'SA_12345', active: true }]);
});

test('flattens Map on level change', () => {
  const prerequisites = new Map([
    [1, ['RCP']],
    [2, { id: 'SA_12345', active: true }],
    [3, { id: 'SA_123', sid: 2 }],
    [4, { id: 'SA_1', tier: 3 }],
  ]);

  expect(flattenPrerequisites(prerequisites, 2, 4))
    .toEqual([{ id: 'SA_123', sid: 2 }, { id: 'SA_1', tier: 3 }]);
});
