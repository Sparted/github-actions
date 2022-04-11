import parseChangelog from 'changelog-parser';

const CLICKUP_ID_REGEX = /(#[a-z0-9]{6,7})/gm;

/** Return the clickup ids found in the changelog and removes their # */
export const findAllTaskIds = (changelog: string) => changelog.match(CLICKUP_ID_REGEX)?.map((id) => id.slice(1)) || [];

export const getAllTaskIdsOfLastestVersion = async (rawChangelogOne: string): Promise<string[]> => {
  const changelog = await parseChangelog({ text: rawChangelogOne });

  if (!changelog.versions[0]?.parsed?._) {
    throw new Error(`Could not parse most recent version of changelog.
    Did you forget to add ## before the version number ?`);
  }

  const lines = changelog.versions[0].parsed._.join('');

  return findAllTaskIds(lines);
};

/** Return ids matching the CLICKUP_ID_REGEX found in the second string not present in the first */
export const getTaskIdsFromDiff = (baseChangelog: string, diffChangelog: string) => {
  const baseIds = findAllTaskIds(baseChangelog);
  const toDiffIds = findAllTaskIds(diffChangelog);

  const diff = toDiffIds?.filter((id) => !baseIds?.includes(id));

  return diff || [];
};

export const getTaskIdsFromChangelogDiff = async (rawChangelogOne: string, rawChangelogTwo: string): Promise<string[]> => {
  const changeLogOne = await parseChangelog({ text: rawChangelogOne });
  const changeLogTwo = await parseChangelog({ text: rawChangelogTwo });

  if (!changeLogOne.versions[0]?.parsed?._ || !changeLogTwo.versions[0]?.parsed?._) {
    throw new Error(`Could not parse most recent version of changelog.
    Did you forget to add ## before the version number ?`);
  }

  const changelogOneLines = changeLogOne.versions[0].parsed._.join('');
  const changelogTwoLines = changeLogTwo.versions[0].parsed._.join('');

  const diffIds = getTaskIdsFromDiff(changelogOneLines, changelogTwoLines);

  return diffIds;
};
