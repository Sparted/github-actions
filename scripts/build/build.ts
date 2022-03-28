/* eslint-disable import/no-extraneous-dependencies -- Useless in scripts */
import fs from 'fs';
// @ts-ignore -- no types exists
import ncc from '@vercel/ncc';

const ACTIONS_DIRECTORY = `${__dirname}/../../src/entrypoints`;
const BUILD_DIST = `${__dirname}/../../dist`;

const BASE_NCC_CONFIG = {
  minify: true,
  sourceMap: false,
};

const writeBuiltActionFile = (name: string, code: string): Promise<void> => new Promise((resolve, reject) => {
  const targetPath = `${BUILD_DIST}/${name}.js`;

  fs.writeFile(targetPath, code, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve();
  });
});

const buildActions = async () => {
  fs.mkdirSync(BUILD_DIST);
  const actionsFiles = fs.readdirSync(ACTIONS_DIRECTORY);

  // Remove .ts extension
  const actionsNames = actionsFiles.map((actionfile) => actionfile.slice(0, -3));
  const actionsPath = actionsFiles.map((actionFile) => `${ACTIONS_DIRECTORY}/${actionFile}`);

  const resolvedBuilds = await Promise.all(
    actionsPath.map((path) => ncc(path, BASE_NCC_CONFIG)),
  );

  const writePromises = resolvedBuilds.map(({ code }, i) => {
    const actionName = actionsNames[i];

    return writeBuiltActionFile(actionName, code);
  });

  await Promise.all(writePromises);
};

buildActions();
