import { getOctokit } from '@actions/github';
import { getChangelogFile } from './api/get-changelog-file';

export type InitGithubClientParams = {
  token: string,
};
export const initGithubClient = ({ token }: InitGithubClientParams) => {
  const octokit = getOctokit(token);

  return {
    getChangelogFile: getChangelogFile(octokit),
  };
};
