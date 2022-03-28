import { AxiosInstance } from 'axios';
import { Task, TaskType } from '../schema/Task';

export const getTask = (client: AxiosInstance) => async (id: string): Promise<TaskType> => {
  const response = await client.get(`/task/${id}`);

  return Task.parse(response.data);
};
