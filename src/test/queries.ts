import axios from 'axios';

import { LoginInput, UserInput } from '../interfaces';
import { CREATE_USER_MUTATION, LOGIN_MUTATION, TEST_URL } from './test-constants.utils';
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
