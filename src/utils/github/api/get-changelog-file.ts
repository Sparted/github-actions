import { Octokit } from '../types';
import { getFile, GetFileParams } from './get-file';

export type GetChangelogFileParam = Omit<GetFileParams, 'path'>;

export const getChangelogFile = (githubClient: Octokit) => async (params: GetChangelogFileParam): Promise<string | undefined> => {
  const file = await getFile(githubClient)({
    ...params,
    path: 'CHANGELOG.md',
  });

  if (!file) {
    return undefined;
  }

  const { content, encoding } = file;

  const changeLogText = Buffer.from(content, encoding).toString('utf-8');

  return changeLogText;
};
