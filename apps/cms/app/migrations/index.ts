import * as migration_20250906_102651_versioning from './20250906_102651_versioning';

export const migrations = [
  {
    up: migration_20250906_102651_versioning.up,
    down: migration_20250906_102651_versioning.down,
    name: '20250906_102651_versioning'
  },
];
