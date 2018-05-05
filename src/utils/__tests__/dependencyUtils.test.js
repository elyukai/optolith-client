const CreateEntryUtils = require('../createEntryUtils');
const DependencyUtils = require('../dependencyUtils');

test('adds dependencies', () => {
  const actual = DependencyUtils.addDependencies(
    {},
    [
      {
        id: 'SA_4',
        active: false,
        sid: 1,
        tier: 1
      }
    ],
    'SA_8'
  );

  const actualConverted = {
    specialAbilities: [...actual.specialAbilities]
  };

  const expected = {
    specialAbilities: [['SA_4', CreateEntryUtils.createActivatableDependent(
      'SA_4',
      {
        dependencies: [
          {
            sid: 1,
            tier: 1
          }
        ]
      }
    )]]
  };

  expect(actualConverted).toEqual(expected);
});

test('removes dependencies', () => {
  const actual = DependencyUtils.removeDependencies(
    {
      specialAbilities: new Map([['SA_4', CreateEntryUtils.createActivatableDependent(
        'SA_4',
        {
          dependencies: [
            {
              sid: 1,
              tier: 1
            }
          ]
        }
      )]])
    },
    [
      {
        id: 'SA_4',
        active: false,
        sid: 1,
        tier: 1
      }
    ],
    'SA_8'
  );

  const actualConverted = {
    specialAbilities: [...actual.specialAbilities]
  };

  const expected = {
    specialAbilities: []
  };

  expect(actualConverted).toEqual(expected);
});
