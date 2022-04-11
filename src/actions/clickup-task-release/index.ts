import { getAllTaskIdsOfLastestVersion } from '../../utils/changelog/parse';
import { initClickupClient } from '../../utils/clickup';
import { initGithubClient } from '../../utils/github';

export type ClickupTaskReleaseParams = {
  repo: string;
  githubToken: string;
  clickupToken: string;
  gitSourceRef: string,
};

const customFieldPerContext: Record<string, string> = {
  Server: 'Production server version',
  'mobile-app': 'Production App version',
};

export const clickupTaskRelease = async ({
  repo,
  githubToken,
  clickupToken,
  gitSourceRef,
}: ClickupTaskReleaseParams) => {
  const clickupClient = initClickupClient({ token: clickupToken });
  const githubClient = initGithubClient({ token: githubToken });

  const [repoOwner, repoName] = repo.split('/');
  const customFieldName = customFieldPerContext[repoName];

  if (!customFieldName) {
    throw new Error(`Action was run in an unsuported repo. Currently supported repos: ${Object.keys(customFieldPerContext).join(', ')}.
    Add repo name to 'customFieldPerContext' to enable support`);
  }

  const sourceChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitSourceRef });
  const { version } = await githubClient.getPackageJson({ owner: repoOwner, repoName, branchRef: gitSourceRef });

  const taskIds = await getAllTaskIdsOfLastestVersion(sourceChangelog);

  if (!sourceChangelog) {
    throw new Error('Could not get changelog.');
  }

  if (!version) {
    throw new Error('Could not get version in package.json.');
  }

  const fetchTaskPromises = taskIds.map((taskId) => clickupClient.getTask(taskId));
  const tasks = await Promise.all(fetchTaskPromises);

  const updatePromises = tasks.map((task) => {
    const customField = task.custom_fields.find(({ name }) => name === customFieldName);

    if (!customField?.id) {
      // eslint-disable-next-line no-console -- warning in script
      console.warn(`Custom field: ${customFieldName} not found on task with id: ${task.id}.`);
    }

    const updateTask = clickupClient.updateTask(task.id, { status: 'accepted' });

    return customField?.id
      ? [updateTask, clickupClient.updateCustomField(task.id, customField.id, version)]
      : [updateTask];
  }).flat(1);

  await Promise.all(updatePromises);
};
