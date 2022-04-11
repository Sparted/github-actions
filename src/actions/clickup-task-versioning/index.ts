import { getTaskIdsFromChangelogDiff } from '../../utils/changelog/parse';
import { initClickupClient } from '../../utils/clickup';
import { initGithubClient } from '../../utils/github';

export type ClickupTaskVersioningParams = {
  repo: string;
  githubToken: string;
  clickupToken: string;
  gitTargetRef: string,
  gitSourceRef: string,
  warn: (args: any) => void,
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
  warn,
}: ClickupTaskVersioningParams) => {
  const clickupClient = initClickupClient({ token: clickupToken });
  const githubClient = initGithubClient({ token: githubToken });

  const [repoOwner, repoName] = repo.split('/');
  const customFieldName = customFieldPerContext[repoName];

  const targetChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitTargetRef });
  const sourceChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitSourceRef });
  const { version } = await githubClient.getPackageJson({ owner: repoOwner, repoName, branchRef: gitSourceRef });

  const taskIds = await getTaskIdsFromChangelogDiff(targetChangelog, sourceChangelog);

  if (!targetChangelog || !sourceChangelog) {
    throw new Error('Could not get changelog.');
  }

  if (!version) {
    throw new Error('Could not get version in package.json.');
  }

  if (!taskIds.length) {
    throw new Error('No task id found. Changelog was likely not updated.');
  }

  const fetchTaskPromises = taskIds.map((taskId) => clickupClient.getTask(taskId));
  const tasks = await Promise.all(fetchTaskPromises);

  const updatePromises = tasks.map((task) => {
    const customField = task.custom_fields.find(({ name }) => name === customFieldName);

    if (!customField?.id) {
      // Can be ignored when running in a repo without versioning fields (eg: github-actions, notification-center)
      warn(`Custom field: ${customFieldName} not found on task with id: ${task.id}.`);
    }

    const updateTask = clickupClient.updateTask(task.id, { status: 'pending acceptance' });

    return customField?.id
      ? [updateTask, clickupClient.updateCustomField(task.id, customField.id, version)]
      : [updateTask];
  }).flat(1);

  await Promise.all(updatePromises);
};
