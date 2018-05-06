const UnusedEntryUtils = require('../unusedEntryUtils');

test('used activatable dependent skill is still used (active)', () => {
  expect(UnusedEntryUtils.isActivatableDependentSkillUnused({
    id: 'SPELL_1',
    active: true,
    value: 0,
    dependencies: [],
  })).toBe(false);
});

test('used activatable dependent skill is still used (value)', () => {
  expect(UnusedEntryUtils.isActivatableDependentSkillUnused({
    id: 'SPELL_1',
    active: true,
    value: 5,
    dependencies: [],
  })).toBe(false);
});

test('used activatable dependent skill is still used (dependency)', () => {
  expect(UnusedEntryUtils.isActivatableDependentSkillUnused({
    id: 'SPELL_1',
    active: false,
    value: 0,
    dependencies: [false],
  })).toBe(false);
});

test('used activatable dependent skill is still used (active and dependency)', () => {
  expect(UnusedEntryUtils.isActivatableDependentSkillUnused({
    id: 'SPELL_1',
    active: true,
    value: 0,
    dependencies: [true],
  })).toBe(false);
});

test('unused activatable dependent skill is unused', () => {
  expect(UnusedEntryUtils.isActivatableDependentSkillUnused({
    id: 'SPELL_1',
    active: false,
    value: 0,
    dependencies: [],
  })).toBe(true);
});

test('used activatable dependent is still used (active)', () => {
  expect(UnusedEntryUtils.isActivatableDependentUnused({
    id: 'SPELL_1',
    active: [{}],
    dependencies: [],
  })).toBe(false);
});

test('used activatable dependent is still used (dependency)', () => {
  expect(UnusedEntryUtils.isActivatableDependentUnused({
    id: 'SPELL_1',
    active: [],
    dependencies: [{}],
  })).toBe(false);
});

test('used activatable dependent is still used (active and dependency)', () => {
  expect(UnusedEntryUtils.isActivatableDependentUnused({
    id: 'SPELL_1',
    active: [{}],
    dependencies: [{}],
  })).toBe(false);
});

test('unused activatable dependent is unused', () => {
  expect(UnusedEntryUtils.isActivatableDependentUnused({
    id: 'SPELL_1',
    active: [],
    dependencies: [],
  })).toBe(true);
});
