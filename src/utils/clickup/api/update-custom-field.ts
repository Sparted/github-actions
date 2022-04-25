import { AxiosInstance } from 'axios';

export type UpdateCustomFieldValue = string | number;

export const updateCustomField = (client: AxiosInstance) => (
  taskId: string,
  customFieldId: string,
  value: UpdateCustomFieldValue,
): Promise<void> => client.post(`/task/${taskId}/field/${customFieldId}`, { value });
