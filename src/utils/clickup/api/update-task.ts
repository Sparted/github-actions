import { AxiosInstance } from 'axios';
import { Task, TaskType } from '../schema/Task';

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
