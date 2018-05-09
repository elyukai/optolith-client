const CreateEntryUtils = require('../createEntryUtils');
const DependencyUtils = require('../dependencyUtils');

test('adds dependencies', () => {
  const actual = DependencyUtils.addDependencies(
    {
      specialAbilities: new Map()
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

test('adds optional dependencies', () => {
  const actual = DependencyUtils.addDependencies(
    {
      specialAbilities: new Map()
    },
    [
      {
        id: ['SA_4', 'SA_1234', 'SA_12345'],
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
    specialAbilities: [
      ['SA_4', CreateEntryUtils.createActivatableDependent(
        'SA_4',
        {
          dependencies: [
            {
              sid: 1,
              tier: 1,
              origin: 'SA_8'
            }
          ]
        }
      )],
      ['SA_1234', CreateEntryUtils.createActivatableDependent(
        'SA_1234',
        {
          dependencies: [
            {
              sid: 1,
              tier: 1,
              origin: 'SA_8'
            }
          ]
        }
      )],
      ['SA_12345', CreateEntryUtils.createActivatableDependent(
        'SA_12345',
        {
          dependencies: [
            {
              sid: 1,
              tier: 1,
              origin: 'SA_8'
            }
          ]
        }
      )],
    ],
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

test('removes optional dependencies', () => {
  const actual = DependencyUtils.removeDependencies(
    {
      specialAbilities: new Map([
        ['SA_4', CreateEntryUtils.createActivatableDependent(
          'SA_4',
          {
            dependencies: [
              {
                sid: 1,
                tier: 1,
                origin: 'SA_8'
              }
            ]
          }
        )],
        ['SA_1234', CreateEntryUtils.createActivatableDependent(
          'SA_1234',
          {
            dependencies: [
              {
                sid: 1,
                tier: 1,
                origin: 'SA_8'
              }
            ]
          }
        )],
        ['SA_12345', CreateEntryUtils.createActivatableDependent(
          'SA_12345',
          {
            dependencies: [
              {
                sid: 1,
                tier: 1,
                origin: 'SA_8'
              }
            ]
          }
        )],
      ])
    },
    [
      {
        id: ['SA_4', 'SA_1234', 'SA_12345'],
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
