import { initClickupClient } from '../../utils/clickup';
import { initGithubClient } from '../../utils/github';
import { clickupTaskRelease } from './index';

jest.mock('../../utils/clickup');
jest.mock('../../utils/github');

const CHANGELOG_SOURCE = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Mod: A task (#56razej)`;

describe('action: clickupTaskRelease', () => {
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
    mockedClickupClient.getTask.mockClear();
    mockedClickupClient.updateTask.mockClear();
    mockedClickupClient.updateCustomField.mockClear();
    mockedGithubClient.getChangelogFile.mockClear();
    mockedGithubClient.getPackageJson.mockClear();
  });

  it('should update the correct tasks', async () => {
    mockedGithubClient.getChangelogFile.mockResolvedValueOnce(CHANGELOG_SOURCE);
    mockedGithubClient.getPackageJson.mockResolvedValueOnce({ version: '0.1.0' });

    const task1 = { id: 'iafazrr', custom_fields: [{ id: 'uuid', name: 'Production server version' }] };
    const task2 = { id: '56razej', custom_fields: [{ id: 'uuid', name: 'Production server version' }] };

    mockedClickupClient.getTask
      .mockResolvedValueOnce(Promise.resolve(task1))
      .mockResolvedValueOnce(Promise.resolve(task2));

    mockedClickupClient.updateTask
      .mockResolvedValueOnce(Promise.resolve())
      .mockResolvedValueOnce(Promise.resolve());

    mockedClickupClient.updateCustomField
      .mockResolvedValueOnce(Promise.resolve())
      .mockResolvedValueOnce(Promise.resolve());

    await clickupTaskRelease({
      repo,
      clickupToken: 'Bruh',
      githubToken: 'Moment',
      gitSourceRef: 'ref#1',
      warn: () => {},
    });

    expect(mockedGithubClient.getChangelogFile).toHaveBeenCalledTimes(1);
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
    expect(mockedClickupClient.getTask).toHaveBeenCalledWith('iafazrr');
    expect(mockedClickupClient.getTask).toHaveBeenCalledWith('56razej');

    expect(mockedClickupClient.updateTask).toHaveBeenCalledTimes(2);
    expect(mockedClickupClient.updateTask).toHaveBeenCalledWith('iafazrr', { status: 'accepted' });
    expect(mockedClickupClient.updateTask).toHaveBeenCalledWith('56razej', { status: 'accepted' });

    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledTimes(2);
    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledWith('iafazrr', 'uuid', '0.1.0');
    expect(mockedClickupClient.updateCustomField).toHaveBeenCalledWith('56razej', 'uuid', '0.1.0');
  });

  it('should throw error if it cannot get the current version', async () => {
    mockedGithubClient.getChangelogFile.mockResolvedValueOnce(CHANGELOG_SOURCE);
    mockedGithubClient.getPackageJson.mockResolvedValueOnce({ version: undefined });

    await expect(async () => {
      await clickupTaskRelease({
        repo,
        clickupToken: 'Bruh',
        githubToken: 'Moment',
        gitSourceRef: 'ref#1',
        warn: () => {},
      });
    }).rejects.toThrow(new Error('Could not get version in package.json.'));
  });
});
