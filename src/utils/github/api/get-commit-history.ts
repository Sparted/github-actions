import { CommitList, CommitListType } from '../schema/CommitList';
import { Octokit } from '../types';

export type GetCommitHistoryParam = {
  owner: string,
  repoName: string,
  branchName: string,
};

export const getCommitHistory = (githubClient: Octokit) => async ({
  owner,
  repoName,
  branchName,
}: GetCommitHistoryParam): Promise<CommitListType> => {
  const response = await githubClient.request('GET /repos/{owner}/{repo}/commits', {
    owner,
    repo: repoName,
    ref: branchName,
  });

  return CommitList.parse(response.data);
};
