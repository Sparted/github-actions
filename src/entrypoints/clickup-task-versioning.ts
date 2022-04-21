import { getInput, warning } from '@actions/core';
import { clickupTaskVersioning } from '../actions/clickup-task-versioning';

const run = async () => {
  const clickupToken = getInput('CLICKUP_TOKEN', { required: true });
  const githubToken = getInput('GITHUB_TOKEN', { required: true });
  const repo = getInput('REPO', { required: true });
  const gitBaseReference = process.env.GITHUB_BASE_REF;
  const gitHeadReference = process.env.GITHUB_HEAD_REF;

  if (!gitBaseReference || !gitHeadReference) {
    throw new Error('GITHUB_BASE_REF or GITHUB_HEAD_REF not present in env.');
  }

  await clickupTaskVersioning({
    repo,
    githubToken,
    clickupToken,
    warn: warning,
    gitSourceRef: gitHeadReference,
    gitTargetRef: gitBaseReference,
  });
};

run();
