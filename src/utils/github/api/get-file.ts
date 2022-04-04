import { RepositoryFile, RepositoryFileType } from '../schema/RepositoryFile';
import { Octokit } from '../types';

export type GetFileParams = {
  owner: string,
  repoName: string,
  branchRef: string,
  path: string,
};

export const getFile = (githubClient: Octokit) => async ({
  branchRef,
  owner,
  repoName,
  path,
}: GetFileParams): Promise<RepositoryFileType> => {
  const response = await githubClient.rest.repos.getContent({
    owner,
    repo: repoName,
    path,
    ref: branchRef,
  });

  return RepositoryFile.parse(response.data);
};
