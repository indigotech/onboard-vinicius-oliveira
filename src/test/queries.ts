import axios from 'axios';

import { LoginInput, UserInput } from '../interfaces';
import { CREATE_USER_MUTATION, FIND_USER_BY_ID_QUERY, LOGIN_MUTATION, TEST_URL } from './test-constants.utils';
import { generateToken } from '../utils';

export const axiosCreateUser = async (userInput: UserInput, token?) => {
  return await axios.post(
    TEST_URL,
    { query: CREATE_USER_MUTATION, variables: { data: userInput } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};

export const axiosLoginUser = async (loginInput: LoginInput) => {
  return await axios.post(TEST_URL, {
    query: LOGIN_MUTATION,
    variables: { data: loginInput },
  });
};

export const axiosGetUserById = async (userInputId: number, token?) => {
  return await axios.post(
    TEST_URL,
    { query: FIND_USER_BY_ID_QUERY, variables: { userId: userInputId } },
    {
      headers: { Authorization: token || generateToken(1, false) },
    },
  );
};
