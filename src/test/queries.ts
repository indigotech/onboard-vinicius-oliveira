import axios from 'axios';
import { AddressInput, LoginInput, UserInput } from '../interfaces';
import { generateToken } from '../utils';
import {
  CREATE_ADDRESS_MUTATION,
  CREATE_USER_MUTATION,
  FIND_USERS_QUERY,
  FIND_USER_BY_ID_QUERY,
  LOGIN_MUTATION,
  TEST_URL,
} from './test-constants.utils';

export const createUser = async (userInput: UserInput, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: CREATE_USER_MUTATION, variables: { input: userInput } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};

export const addAddress = async (addressInput: AddressInput, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: CREATE_ADDRESS_MUTATION, variables: { input: addressInput } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};

export const loginUser = async (loginInput: LoginInput) => {
  return await axios.post(TEST_URL, {
    query: LOGIN_MUTATION,
    variables: { input: loginInput },
  });
};

export const getUserById = async (userInputId: number, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: FIND_USER_BY_ID_QUERY, variables: { userId: userInputId } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};

export const getUsers = async (page: number, usersByPage?: number, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: FIND_USERS_QUERY, variables: { page: page, usersByPage: usersByPage } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};
