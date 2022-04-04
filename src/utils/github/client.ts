import { getOctokit } from '@actions/github';
import { getChangelogFile } from './api/get-changelog-file';
import { getPackageJson } from './api/get-package-json';

export type InitGithubClientParams = {
  token: string,
};

export const initGithubClient = ({ token }: InitGithubClientParams) => {
  const octokit = getOctokit(token);

  return {
    getChangelogFile: getChangelogFile(octokit),
    getPackageJson: getPackageJson(octokit),
  };
};
