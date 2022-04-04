import parseChangelog from 'changelog-parser';

const CLICKUP_ID_REGEX = /([#(][a-z0-9]{7})/gm;

/** Return ids matching the CLICKUP_ID_REGEX found in the second string not present in the first */
export const getTaskIdsFromDiff = (baseString: string, stringToDiff: string) => {
  const baseIds = baseString.match(CLICKUP_ID_REGEX);
  const toDiffIds = stringToDiff.match(CLICKUP_ID_REGEX);

  // Shit complexity but the dataset should never be high enough to matter ¯\_(ツ)_/¯
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

  const changelogOneLines = changeLogOne.versions[0].parsed._;
  const changelogTwoLines = changeLogTwo.versions[0].parsed._;

  const diffIds = getTaskIdsFromDiff(
    changelogOneLines.join(''),
    changelogTwoLines.join(''),
  );

  // Remove the #
  return diffIds.map((id) => id.slice(1));
};
