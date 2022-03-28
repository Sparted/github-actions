// import { getInput } from '@actions/core';
import { clickupTaskVersioning } from '../actions/clickup-task-versioning';

const run = async () => {
  // const clickupToken = getInput('clickup-token');
  // const githubToken = getInput('github-token');

  await clickupTaskVersioning();
};

run();
