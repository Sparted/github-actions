import { getInput } from '@actions/core';
import { clickupTaskVersioning } from '../actions/clickup-task-versioning';

const run = async () => {
  const clickupToken = getInput('clickup-token') || process.env.ACTION_CLICKUP_TOKEN;
  const githubToken = getInput('github-token') || process.env.ACTION_GITHUB_TOKEN;
  const repo = getInput('repo') || process.env.ACTION_REPO;
  const gitBaseReference = process.env.GITHUB_BASE_REF;
  const gitHeadReference = process.env.GITHUB_HEAD_REF;

  if (!clickupToken || !githubToken || !repo) {
    throw new Error('Cannot get clickup-token, github-token or repo from inputs.');
  }

  if (!gitBaseReference || !gitHeadReference) {
    throw new Error('GITHUB_BASE_REF or GITHUB_HEAD_REF not present in env.');
  }

  await clickupTaskVersioning({
    repo,
    githubToken,
    clickupToken,
    gitSourceRef: gitHeadReference,
    gitTargetRef: gitBaseReference,
  });
};

run();
