const UserAPI = require('../user');

const mockStore = {
  users: {
    findOrCreate: jest.fn()
  },
};
module.exports.mockStore = mockStore;

const ds = new UserAPI({ store: mockStore });
ds.initialize({ context: { user: { id: 1, email: 'a@a.a' } } });

describe('[UserAPI.findOrCreateUser]', () => {
  it('returns null for invalid emails', async () => {
    const res = await ds.findOrCreateUser({ email: 'boo!' });
    expect(res).toEqual(null);
  });

  it('looks up/creates user in store', async () => {
    mockStore.users.findOrCreate.mockReturnValueOnce([{ id: 1 }]);

    // check the result of the fn
    const res = await ds.findOrCreateUser({ email: 'a@a.a' });
    expect(res).toEqual({ id: 1 });

    // make sure store is called properly
    expect(mockStore.users.findOrCreate).toBeCalledWith({
      where: { email: 'a@a.a' },
    });
  });

  it('returns null if no user found/created', async () => {
    // store lookup is not mocked to return anything, so this
    // simulates a failed lookup

    const res = await ds.findOrCreateUser({ email: 'a@a.a' });
    expect(res).toEqual(null);
  });
});