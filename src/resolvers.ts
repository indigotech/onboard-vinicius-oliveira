const users = [
  {
    id: 1,
    name: 'Vinicius',
    email: 'vinicius.bersano@gmail.com',
    password: 'password123',
  },
  {
    id: 2,
    name: 'Shinji',
    email: 'shinji.ikari@gmail.com',
    password: 'asuka321',
  },
];

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
    users: () => users,
    getUserByName: (_, args) => {
      return users.find((user) => user.name === args.name);
    },
  },
  Mutation: {
    createUser(_, { data }) {
      const newUser = {
        id: Math.floor(Math.random() * 10),
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
      };

      users.push(newUser);
      return newUser;
    },
  },
};
