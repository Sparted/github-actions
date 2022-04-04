import { AxiosInstance } from 'axios';
import { Task, TaskType } from '../schema/Task';

export const getTask = (client: AxiosInstance) => async (taskId: string): Promise<TaskType> => {
  const response = await client.get(`/task/${taskId}`);

  return Task.parse(response.data);
};

export type UpdateTaskData = Partial<{
  status: 'pending acceptance' | 'accepted' | 'in progress' | 'open'
}>;

export const updateTask = (client: AxiosInstance) => async (
  taskId: string,
  data: UpdateTaskData,
): Promise<TaskType> => {
  const response = await client.put(`/task/${taskId}`, data);

  return Task.parse(response.data);
};

export type UpdateCustomFieldValue = string | number;

export const updateCustomField = (client: AxiosInstance) => async (
  taskId: string,
  customFieldId: string,
  value: UpdateCustomFieldValue,
): Promise<void> => {
  await client.post(`/task/${taskId}/field/${customFieldId}`, { value });
};
