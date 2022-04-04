import { RepositoryContent, RepositoryContentType } from '../schema/RepositoryContent';
import { Octokit } from '../types';

export type GetContentParams = {
  owner: string,
  repoName: string,
  branchRef: string,
  path: string,
};

export const getContent = (githubClient: Octokit) => async ({
  branchRef,
  owner,
  repoName,
  path,
}: GetContentParams): Promise<RepositoryContentType> => {
  const response = await githubClient.rest.repos.getContent({
    owner,
    repo: repoName,
    path,
    ref: branchRef,
  });

  return RepositoryContent.parse(response.data);
};
