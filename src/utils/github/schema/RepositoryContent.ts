import { z } from 'zod';

export const RepositoryContent = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  type: z.string(),
  content: z.string(),
  encoding: z.enum(['base64']),
});

export type RepositoryContentType = z.infer<typeof RepositoryContent>;
