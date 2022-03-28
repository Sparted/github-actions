// import { getInput } from '@actions/core';
import { clickupTaskRelease } from '../actions/clickup-task-release';

const run = async () => {
  // const clickupToken = getInput('clickup-token');
  // const githubToken = getInput('github-token');

  await clickupTaskRelease();
};

run();
