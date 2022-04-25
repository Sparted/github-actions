import { getTaskIdsFromChangelogDiff } from '../../utils/changelog/parse';
import { initClickupClient } from '../../utils/clickup';
import type { TaskStatus } from '../../utils/clickup/api';
import { initGithubClient } from '../../utils/github';

export type ClickupTaskVersioningParams = {
  repo: string;
  gitRef: string;
  githubToken: string;
  clickupToken: string;
  newTaskStatus: string;
  branchName: string;
  warn: (args: any) => void;

  clickupVersionFieldName?: string;
};

export const clickupTaskVersioning = async ({
  warn,
  repo,
  gitRef,
  branchName,
  githubToken,
  clickupToken,
  newTaskStatus,
  clickupVersionFieldName,
}: ClickupTaskVersioningParams) => {
  const clickupClient = initClickupClient({ token: clickupToken });
  const githubClient = initGithubClient({ token: githubToken });

  const [repoOwner, repoName] = repo.split('/');

  const commits = await githubClient.getCommitHistory({ owner: repoOwner, repoName, branchName });

  const lastCommitRef = commits[1].sha;

  const currentChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitRef });
  const lastChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: lastCommitRef });

  const { version } = await githubClient.getPackageJson({ owner: repoOwner, repoName, branchRef: gitRef });

  if (!lastChangelog || !currentChangelog) {
    throw new Error('Could not get changelog.');
  }

  const taskIds = await getTaskIdsFromChangelogDiff(lastChangelog, currentChangelog);

  if (!version) {
    throw new Error('Could not get version in package.json.');
  }

  if (!taskIds.length) {
    throw new Error('No task id found. Changelog was likely not updated.');
  }

  const fetchTaskPromises = taskIds.map((taskId) => clickupClient.getTask(taskId));
  const tasks = await Promise.all(fetchTaskPromises);

  const updatePromises = tasks.map((task) => {
    const customField = clickupVersionFieldName
      ? task.custom_fields.find(({ name }) => name === clickupVersionFieldName)
      : undefined;

    if (clickupVersionFieldName && !customField?.id) {
      warn(`Custom field: ${clickupVersionFieldName} not found on task with id: ${task.id}.`);
    }

    const updateTask = clickupClient.updateTask(task.id, { status: newTaskStatus as TaskStatus });

    return customField?.id
      ? [updateTask, clickupClient.updateCustomField(task.id, customField.id, version)]
      : [updateTask];
  }).flat(1);

  await Promise.all(updatePromises);
};
