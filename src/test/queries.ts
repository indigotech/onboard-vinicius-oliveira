import axios from 'axios';

import { LoginInput, UserInput } from '../interfaces';
import {
  CREATE_USER_MUTATION,
  FIND_USERS_QUERY,
  FIND_USER_BY_ID_QUERY,
  LOGIN_MUTATION,
  TEST_URL,
} from './test-constants.utils';
import { generateToken } from '../utils';

export const createUser = async (userInput: UserInput, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: CREATE_USER_MUTATION, variables: { data: userInput } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};

export const loginUser = async (loginInput: LoginInput) => {
  return await axios.post(TEST_URL, {
    query: LOGIN_MUTATION,
    variables: { data: loginInput },
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

export const getUsers = async (limit?: number, token?: string) => {
export const axiosGetUsers = async (page: number, usersByPage?: number, token?: string) => {
  return await axios.post(
    TEST_URL,
    { query: FIND_USERS_QUERY, variables: { page: page, usersByPage: usersByPage } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};
