import { getTaskIdsFromChangelogDiff } from '../../utils/changelog/parse';
import { initClickupClient } from '../../utils/clickup';
import { initGithubClient } from '../../utils/github';

export type ClickupTaskVersioningParams = {
  githubToken: string;
  clickupToken: string;
  repo: string;
  gitTargetRef: string,
  gitSourceRef: string,
};

const customFieldPerContext: Record<string, string> = {
  Server: 'Staging server version',
  'mobile-app': 'Staging App version',
};

export const clickupTaskVersioning = async ({
  repo,
  githubToken,
  clickupToken,
  gitTargetRef,
  gitSourceRef,
}: ClickupTaskVersioningParams) => {
  const clickupClient = initClickupClient({ token: clickupToken });
  const githubClient = initGithubClient({ token: githubToken });

  const [repoOwner, repoName] = repo.split('/');
  const customFieldName = customFieldPerContext[repoName];

  const oldChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitTargetRef });
  const newChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitSourceRef });
  const { version } = await githubClient.getPackageJson({ owner: repoOwner, repoName, branchRef: gitSourceRef });

  const taskIds = await getTaskIdsFromChangelogDiff(oldChangelog, newChangelog);

  if (!taskIds.length) {
    throw new Error('No task id found. Changelog was likely not updated');
  }

  const fetchTaskPromises = taskIds.map((taskId) => clickupClient.getTask(taskId));
  const tasks = await Promise.all(fetchTaskPromises);

  const updatePromises = tasks.map((task) => {
    const customField = task.custom_fields.find(({ name }) => name === customFieldName);
    const updateTask = clickupClient.updateTask(task.id, { status: 'pending acceptance' });

    if (!customField?.id) {
      // eslint-disable-next-line no-console -- warning in script
      console.warn(`Custom field: ${customFieldName} not found on task with id: ${task.id}`);
    }

    return customField?.id
      ? [updateTask, clickupClient.updateCustomField(task.id, customField.id, version)]
      : [updateTask];
  }).flat(1);

  await Promise.all(updatePromises);
};
