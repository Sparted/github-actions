import { z } from 'zod';

export const RepositoryFile = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  type: z.string(),
  content: z.string(),
  encoding: z.enum(['base64']),
});

export type RepositoryFileType = z.infer<typeof RepositoryFile>;
