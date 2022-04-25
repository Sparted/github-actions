import { z } from 'zod';
import { Commit } from './Commit';

export const CommitList = z.array(Commit);

export type CommitListType = z.infer<typeof CommitList>;
