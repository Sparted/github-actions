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

  const oldChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitTargetRef });
  const newChangelog = await githubClient.getChangelogFile({ owner: repoOwner, repoName, branchRef: gitSourceRef });

  const tasksIds = getTaskIdsFromChangelogDiff(oldChangelog, newChangelog);

  console.log(tasksIds);
};
