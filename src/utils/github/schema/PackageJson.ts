import { z } from 'zod';

export const PackageJson = z.object({
  version: z.string(),
});

export type PackageJsonType = z.infer<typeof PackageJson>;
