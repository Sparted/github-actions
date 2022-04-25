import { z } from 'zod';

export const Commit = z.object({
  sha: z.string(),
  commit: z.object({
    author: z.object({
      name: z.string(),
      date: z.string(),
    }),
  }),
});

export type CommitType = z.infer<typeof Commit>;
