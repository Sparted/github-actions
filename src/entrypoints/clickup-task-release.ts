import { getInput, warning } from '@actions/core';
import { clickupTaskRelease } from '../actions/clickup-task-release';

const run = async () => {
  const clickupToken = getInput('clickup-token') || process.env.ACTION_CLICKUP_TOKEN;
  const githubToken = getInput('github-token') || process.env.ACTION_GITHUB_TOKEN;
  const repo = getInput('repo') || process.env.ACTION_REPO;
  const gitHeadReference = process.env.GITHUB_HEAD_REF;

  if (!clickupToken || !githubToken || !repo) {
    throw new Error('Cannot get clickup-token, github-token or repo from inputs.');
  }

  if (!gitHeadReference) {
    throw new Error('GITHUB_HEAD_REF is not present in env.');
  }

  await clickupTaskRelease({
    repo,
    githubToken,
    clickupToken,
    warn: warning,
    gitSourceRef: gitHeadReference,
  });
};

run();
