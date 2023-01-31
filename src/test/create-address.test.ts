import { expect } from 'chai';
import { DEFAULT_ADDRESS_INPUT, DEFAULT_USER_INPUT } from './test-constants.utils';
import { addAddress, createUser } from './queries';
import { addressRepository, userRepository } from '../utils';

describe('Create Address Mutation', () => {
  afterEach(async () => {
    await addressRepository.delete({});
    await userRepository.delete({});
  });

  it('Should create a new Adress', async () => {
    await createUser(DEFAULT_USER_INPUT);
    const response = await addAddress(DEFAULT_ADDRESS_INPUT);

    const responseOutput = response.data.data.createAddress;

    const [addressFromDb] = await addressRepository.find();

    expect(DEFAULT_ADDRESS_INPUT.cep).to.be.eq(addressFromDb.cep);
    expect(DEFAULT_ADDRESS_INPUT.street).to.be.eq(addressFromDb.street);
    expect(DEFAULT_ADDRESS_INPUT.streetNum).to.be.eq(addressFromDb.streetNum);
    expect(DEFAULT_ADDRESS_INPUT.complement).to.be.eq(addressFromDb.complement);
    expect(DEFAULT_ADDRESS_INPUT.neighborhood).to.be.eq(addressFromDb.neighborhood);
    expect(DEFAULT_ADDRESS_INPUT.city).to.be.eq(addressFromDb.city);
    expect(DEFAULT_ADDRESS_INPUT.state).to.be.eq(addressFromDb.state);
    expect(responseOutput).to.be.deep.eq(addressFromDb);
  });

  it('Should return an Error when trying to create an Address without being Logged In', async () => {
    await createUser(DEFAULT_USER_INPUT);

    const response = await addAddress(DEFAULT_ADDRESS_INPUT, 'bad_token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });

  it('Should return an Error when trying to create duplicate Addresses for the same User', async () => {
    await createUser(DEFAULT_USER_INPUT);

    await addAddress(DEFAULT_ADDRESS_INPUT);
    const response = await addAddress(DEFAULT_ADDRESS_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'This User is Alredy Registered in this Address',
      code: 400,
    });
  });

  it('Should return an Error if User is not found in the Database', async () => {
    await createUser(DEFAULT_USER_INPUT);

    const { ...BAD_ADDRESS_INPUT } = DEFAULT_ADDRESS_INPUT;

    BAD_ADDRESS_INPUT.userEmail = 'bademail@test.com';

    const response = await addAddress(BAD_ADDRESS_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'User not present in the database', code: 404 });
  });
});
