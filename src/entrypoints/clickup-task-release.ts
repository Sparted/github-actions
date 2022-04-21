import { getInput, warning } from '@actions/core';
import { clickupTaskRelease } from '../actions/clickup-task-release';

const run = async () => {
  const clickupToken = getInput('CLICKUP_TOKEN', { required: true });
  const githubToken = getInput('GITHUB_TOKEN', { required: true });
  const repo = getInput('REPO', { required: true });
  const gitRef = process.env.GITHUB_REF;

  if (!gitRef) {
    throw new Error('GITHUB_REF is not present in env.');
  }

  await clickupTaskRelease({
    repo,
    gitRef,
    githubToken,
    clickupToken,
    warn: warning,
  });
};

run();
