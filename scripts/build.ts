/* eslint-disable import/no-extraneous-dependencies -- Useless in scripts */
// @ts-ignore -- no types exists for ncc
import ncc from '@vercel/ncc';
import syncFs, { promises as fs } from 'fs';
import path from 'path';

const ACTIONS_DIRECTORY = path.resolve(__dirname, '..', '..', 'src', 'entrypoints');
const BUILD_DIST = path.resolve(__dirname, '..', 'dist');

const BASE_NCC_CONFIG = {
  minify: true,
  sourceMap: false,
};

const writeBuiltActionFile = async (name: string, code: string): Promise<void> => {
  const targetPath = `${BUILD_DIST}/${name}.js`;

  return fs.writeFile(targetPath, code);
};

const buildActions = async () => {
  syncFs.mkdirSync(BUILD_DIST);
  const actionsFiles = syncFs.readdirSync(ACTIONS_DIRECTORY);

  // Remove .ts extension
  const actionsNames = actionsFiles.map((actionfile) => path.basename(actionfile, '.ts'));
  const filepaths = actionsFiles.map((actionFile) => path.join(ACTIONS_DIRECTORY, actionFile));

  const resolvedBuilds = await Promise.all(
    filepaths.map((filepath) => ncc(filepath, BASE_NCC_CONFIG)),
  );

  const writePromises = resolvedBuilds.map(({ code }, i) => {
    const actionName = actionsNames[i];

    return writeBuiltActionFile(actionName, code);
  });

  await Promise.all(writePromises);
};

buildActions();
