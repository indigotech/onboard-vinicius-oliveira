const users = [
  {
    id: 1,
    name: 'Vinicius',
    password: 'password123',
  },
  {
    id: 2,
    name: 'Shinji',
    password: 'asuka321',
  },
];

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
    users: () => [
      {
        id: 1,
        name: 'Vinicius',
        password: 'password123',
      },
      {
        id: 2,
        name: 'Shinji',
        password: 'asuka321',
      },
    ],
  },
};
