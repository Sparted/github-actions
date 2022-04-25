import { getInput, warning } from '@actions/core';
import { clickupTaskVersioning } from '../actions/clickup-task-versioning';

const run = async () => {
  const clickupToken = getInput('CLICKUP_API_TOKEN', { required: true });
  const githubToken = getInput('GITHUB_TOKEN', { required: true });
  const repo = getInput('REPO', { required: true });
  const branchName = getInput('BRANCH', { required: true });
  const newClickupTaskStatus = getInput('CLICKUP_TASK_STATUS', { required: true });
  const clickupVersionFieldName = getInput('CLICKUP_VERSION_FIELD_NAME', { required: false });
  const gitRef = process.env.GITHUB_REF;

  if (!clickupToken || !githubToken || !repo || !branchName || !gitRef || !newClickupTaskStatus) {
    throw new Error('Cannot get all inputs: CLICKUP_API_TOKEN, GITHUB_TOKEN, REPO, BRANCH, CLICKUP_TASK_STATUS, GITHUB_REF');
  }

  return clickupTaskVersioning({
    repo,
    gitRef,
    branchName,
    githubToken,
    clickupToken,
    warn: warning,
    clickupVersionFieldName,
    newTaskStatus: newClickupTaskStatus,
  });
};

run();
