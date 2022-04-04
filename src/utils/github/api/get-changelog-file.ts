import { Octokit } from '../types';
import { getContent, GetContentParams } from './get-content';

export type GetChangelogFileParam = Omit<GetContentParams, 'path'>;

export const getChangelogFile = (githubClient: Octokit) => async (params: GetChangelogFileParam): Promise<string> => {
  const { content, encoding } = await getContent(githubClient)({
    ...params,
    path: 'CHANGELOG.md',
  });

  const changeLogText = Buffer.from(content, encoding).toString('utf-8');

  return changeLogText;
};
