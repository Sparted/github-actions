import axios from 'axios';
import {
  getTask,
  updateTask,
  updateCustomField,
} from './api/task';

type InitParams = {
  token: string
};

const CLICKUP_API = 'https://api.clickup.com/api/v2';

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
    updateTask: updateTask(axiosClient),
    updateCustomField: updateCustomField(axiosClient),
  };
};
