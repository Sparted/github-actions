import { AxiosInstance } from 'axios';
import { Task, TaskType } from '../schema/Task';

export const getTask = (client: AxiosInstance) => async (taskId: string): Promise<TaskType> => {
  const response = await client.get(`/task/${taskId}`);

  return Task.parse(response.data);
};
