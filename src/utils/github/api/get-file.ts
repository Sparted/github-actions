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
}: GetFileParams): Promise<RepositoryFileType | undefined> => {
  try {
    const response = await githubClient.rest.repos.getContent({
      owner,
      repo: repoName,
      path,
      ref: branchRef,
    });

    return RepositoryFile.parse(response.data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return undefined;
  }
};
