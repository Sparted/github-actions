import { getTaskIdsFromChangelogDiff } from './parse';

const RAW_SERVER_CHANGELOG_ONE = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Add: Some feature with multiple tasks (#12varjk #27vapor)
- Fix: Some zendesk bug (#ZEN1234)
- Mod: A task (#56razej)

## 0.0.1
- Fix: fix bug (#21paega)
`;

const RAW_SERVER_CHANGELOG_TWO = `
## 0.1.0
- Add: Some feature (#iafazrr)
- Add: Some feature with multiple tasks (#12varjk #27vapor)
- Fix: Some zendesk bug (#ZEN1234)
- Mod: A task with no # (#56razej)
- Add: Some new feature not present in changelog one (#ikdf132)
- Add: Some other new feature not present in changelog one (#mlf12e2 #ZEN1234)

## 0.0.1
- Fix: fix bug (#21paega)
`;

const RAW_APP_CHANGELOG_ONE = `
# Changelog
Blablabla description of project..
Blabla

## [0.1.0]
### Fixed
- Some zendesk bug (#ZEN1234)
- Some bug (#21paega)

### Added
- Some feature (#iafazrr)
- Some feature with multiple tasks (#12varjk #27vapor)

### Changed
- A task (#56razej)
`;

const RAW_APP_CHANGELOG_TWO = `
# Changelog
Blablabla description of project..
Blabla

## [0.1.0]
### Fixed
- Some zendesk bug (#ZEN1234)
- Some bug (#21paega)

### Added
- Some feature (#iafazrr)
- Some feature with multiple tasks (#12varjk #27vapor)
- Some new feature not present in changelog one (#ikdf132)
- Some other new feature not present in changelog one (#mlf12e2 #ZEN1234)

### Changed
- A task (#56razej)
`;

describe('changelog parse', () => {
  it('should throw if changelog is malformed in first or second param', async () => {
    const malformedChangelog = `
    1.1.1
    -----
    - Add: my feature (#azerty1)
    - Fix: my bug (#azerty2)`;

    const errorMsg = `Could not parse most recent version of changelog.
    Did you forget to add ## before the version number ?`;

    await expect(async () => getTaskIdsFromChangelogDiff(malformedChangelog, RAW_SERVER_CHANGELOG_ONE))
      .rejects
      .toThrow(new Error(errorMsg));

    await expect(async () => getTaskIdsFromChangelogDiff(RAW_SERVER_CHANGELOG_ONE, malformedChangelog))
      .rejects
      .toThrow(new Error(errorMsg));
  });

  describe('get tasks ids from server changelog diff', () => {
    it('should return correct tasks ids', async () => {
      const taskIds = await getTaskIdsFromChangelogDiff(RAW_SERVER_CHANGELOG_ONE, RAW_SERVER_CHANGELOG_TWO);

      expect(taskIds).toStrictEqual(['#ikdf132', '#mlf12e2']);
    });

    it('should return nothing when same server changelog', async () => {
      const taskIds = await getTaskIdsFromChangelogDiff(RAW_SERVER_CHANGELOG_ONE, RAW_SERVER_CHANGELOG_ONE);

      expect(taskIds).toStrictEqual([]);
    });
  });

  describe('get tasks ids from app changelog diff', () => {
    it('should return correct tasks ids', async () => {
      const taskIds = await getTaskIdsFromChangelogDiff(RAW_APP_CHANGELOG_ONE, RAW_APP_CHANGELOG_TWO);

      expect(taskIds).toStrictEqual(['#ikdf132', '#mlf12e2']);
    });

    it('should return nothing when same app changelog', async () => {
      const taskIds = await getTaskIdsFromChangelogDiff(RAW_APP_CHANGELOG_ONE, RAW_APP_CHANGELOG_ONE);

      expect(taskIds).toStrictEqual([]);
    });
  });
});
