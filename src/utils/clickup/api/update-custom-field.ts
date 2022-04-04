import { AxiosInstance } from 'axios';

export type UpdateCustomFieldValue = string | number;

export const updateCustomField = (client: AxiosInstance) => async (
  taskId: string,
  customFieldId: string,
  value: UpdateCustomFieldValue,
): Promise<void> => {
  await client.post(`/task/${taskId}/field/${customFieldId}`, { value });
};
