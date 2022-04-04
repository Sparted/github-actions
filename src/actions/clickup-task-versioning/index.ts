import { initClickupClient } from '../../utils/clickup/client';

export type ClickupTaskVersioningParams = {
  githubToken: string;
  clickupToken: string;
};

export const clickupTaskVersioning = async ({
  githubToken,
  clickupToken,
}: ClickupTaskVersioningParams) => {
  const clickupClient = initClickupClient({ token: clickupToken });

  const task = await clickupClient.getTask('25txhjw');

  const customFieldId = task.custom_fields.find((field) => field.name === 'Production server version')?.id;

  const [
    updatedTask,
  ] = await Promise.all([
    clickupClient.updateTask(task.id, { status: 'in progress' }),
    clickupClient.updateCustomField(task.id, customFieldId!, '1.1.1.1.1'),
  ]);

  console.log(updatedTask);
};
