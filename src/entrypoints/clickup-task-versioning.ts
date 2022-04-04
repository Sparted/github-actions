import { getInput } from '@actions/core';
import { clickupTaskVersioning } from '../actions/clickup-task-versioning';

const run = async () => {
  const clickupToken = getInput('clickup-token') || process.env.ACTION_CLICKUP_TOKEN;
  const githubToken = getInput('github-token') || process.env.ACTION_GITHUB_TOKEN;

  if (!clickupToken || !githubToken) {
    throw new Error('Cannot get clickup-token or github-token from inputs.');
  }

  await clickupTaskVersioning({
    clickupToken,
    githubToken,
  });
};

run();
