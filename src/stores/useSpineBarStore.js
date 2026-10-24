import { createProgramStore } from './createProgramStore';
import { spineBarProgram } from '../data/programs/spineBar';

export const useSpineBarStore = createProgramStore({
  name: 'spine-bar-storage',
  program: spineBarProgram,
  version: 1,
});
