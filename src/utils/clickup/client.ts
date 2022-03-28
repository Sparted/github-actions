import axios from 'axios';
import { getTask } from './api/task';

const CLICKUP_API = 'https://api.clickup.com/api/v2';

type InitParams = {
  token: string
};

const createClickupHeaders = (token: string) => ({
  Authorization: token,
});

export const initClickupClient = ({ token }: InitParams) => {
  const headers = createClickupHeaders(token);

  const axiosClient = axios.create({
    baseURL: CLICKUP_API,
    headers,
  });

  return {
    getTask: getTask(axiosClient),
  };
};
