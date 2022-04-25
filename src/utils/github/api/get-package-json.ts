import { PackageJson } from '../schema/PackageJson';
import { Octokit } from '../types';
import { getFile, GetFileParams } from './get-file';

export type GetVersionFileParam = Omit<GetFileParams, 'path'>;

export const getPackageJson = (githubClient: Octokit) => async (params: GetVersionFileParam) => {
  const file = await getFile(githubClient)({
    ...params,
    path: 'package.json',
  });

  if (!file) {
    return undefined;
  }

  const { content, encoding } = file;

  const packageJson = JSON.parse(Buffer.from(content, encoding).toString('utf-8'));

  return PackageJson.parse(packageJson);
};
