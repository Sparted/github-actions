import { getInput, warning } from '@actions/core';
import { clickupTaskRelease } from '../actions/clickup-task-release';

const run = async () => {
  const clickupToken = getInput('clickup-token') || process.env.ACTION_CLICKUP_TOKEN;
  const githubToken = getInput('github-token') || process.env.ACTION_GITHUB_TOKEN;
  const repo = getInput('repo') || process.env.ACTION_REPO;
  const gitRef = process.env.GITHUB_REF;

  if (!clickupToken || !githubToken || !repo) {
    throw new Error('Cannot get clickup-token, github-token or repo from inputs.');
  }

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
