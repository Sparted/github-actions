import { initClickupClient } from '../../utils/clickup';
import { initGithubClient } from '../../utils/github';
import { clickupTaskVersioning } from './index';

jest.mock('../../utils/clickup');
jest.mock('../../utils/github');

const CHANGELOG_TARGET_1 = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Mod: A task (#56razej)`;

const CHANGELOG_SOURCE_1 = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Mod: A task (#56razej)
- Add: a new task (#azert2)
- Fix: a bugfix (#poop123)`;

const IDENTICAL_CHANGELOG = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Mod: A task (#56razej)`;

describe('action: clickupTaskVersioning', () => {
  const mockedClickupClient = {
    getTask: jest.fn(),
    updateTask: jest.fn(),
    updateCustomField: jest.fn(),
  };

  const mockedGithubClient = {
    getChangelogFile: jest.fn(),
    getPackageJson: jest.fn(),
  };

  const mockedInitClickupClient = jest.mocked(initClickupClient);
  const mockedInitGithubClient = jest.mocked(initGithubClient);

  mockedInitClickupClient.mockImplementation(() => mockedClickupClient);
  mockedInitGithubClient.mockImplementation(() => mockedGithubClient);

  const repo = 'Sparted/Server';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the correct tasks', async () => {
    mockedGithubClient.getChangelogFile
      .mockResolvedValueOnce(CHANGELOG_TARGET_1)
      .mockResolvedValueOnce(CHANGELOG_SOURCE_1);
    mockedGithubClient.getPackageJson.mockResolvedValueOnce({ version: '0.1.0' });

    const task1 = { id: 'azert2', custom_fields: [{ id: 'uuid', name: 'Staging server version' }] };
    const task2 = { id: 'poop123', custom_fields: [{ id: 'uuid', name: 'Staging server version' }] };

    mockedClickupClient.getTask
      .mockResolvedValueOnce(Promise.resolve(task1))
      .mockResolvedValueOnce(Promise.resolve(task2));

    mockedClickupClient.updateTask
      .mockResolvedValueOnce(Promise.resolve())
      .mockResolvedValueOnce(Promise.resolve());

    mockedClickupClient.updateCustomField
      .mockResolvedValueOnce(Promise.resolve())
      .mockResolvedValueOnce(Promise.resolve());

    await clickupTaskVersioning({
      repo,
      clickupToken: 'Bruh',
      githubToken: 'Moment',
      gitSourceRef: 'ref#1',
      gitTargetRef: 'ref#2',
      warn: () => {},
    });

    expect(mockedGithubClient.getChangelogFile).toHaveBeenCalledTimes(2);
    expect(mockedGithubClient.getChangelogFile).toHaveBeenCalledWith({
      owner: 'Sparted',
      repoName: 'Server',
      branchRef: 'ref#2',
    });
    expect(mockedGithubClient.getChangelogFile).toHaveBeenCalledWith({
      owner: 'Sparted',
      repoName: 'Server',
      branchRef: 'ref#1',
    });
    expect(mockedGithubClient.getPackageJson).toHaveBeenCalledWith({
      owner: 'Sparted',
      repoName: 'Server',
      branchRef: 'ref#1',
    });

    expect(mockedClickupClient.getTask).toHaveBeenCalledTimes(2);
    expect(mockedClickupClient.getTask).toHaveBeenCalledWith('azert2');
    expect(mockedClickupClient.getTask).toHaveBeenCalledWith('poop123');

    expect(mockedClickupClient.updateTask).toHaveBeenCalledTimes(2);
    expect(mockedClickupClient.updateTask).toHaveBeenCalledWith('azert2', { status: 'pending acceptance' });
    expect(mockedClickupClient.updateTask).toHaveBeenCalledWith('poop123', { status: 'pending acceptance' });

    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledTimes(2);
    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledWith('azert2', 'uuid', '0.1.0');
    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledWith('poop123', 'uuid', '0.1.0');
  });

  it('should throw error if it cannot get the current version', async () => {
    mockedGithubClient.getChangelogFile
      .mockResolvedValueOnce(CHANGELOG_TARGET_1)
      .mockResolvedValueOnce(CHANGELOG_SOURCE_1);
    mockedGithubClient.getPackageJson.mockResolvedValueOnce({ version: undefined });

    await expect(async () => {
      await clickupTaskVersioning({
        repo,
        clickupToken: 'Bruh',
        githubToken: 'Moment',
        gitSourceRef: 'ref#1',
        gitTargetRef: 'ref#2',
        warn: () => {},
      });
    }).rejects.toThrow(new Error('Could not get version in package.json.'));
  });

  it('should throw error if there is no new tasks in changelog', async () => {
    mockedGithubClient.getChangelogFile
      .mockResolvedValueOnce(IDENTICAL_CHANGELOG)
      .mockResolvedValueOnce(IDENTICAL_CHANGELOG);
    mockedGithubClient.getPackageJson.mockResolvedValueOnce({ version: '0.1.0' });

    await expect(async () => {
      await clickupTaskVersioning({
        repo,
        clickupToken: 'Bruh',
        githubToken: 'Moment',
        gitSourceRef: 'ref#1',
        gitTargetRef: 'ref#2',
        warn: () => {},
      });
    }).rejects.toThrow(new Error('No task id found. Changelog was likely not updated.'));
  });
});
