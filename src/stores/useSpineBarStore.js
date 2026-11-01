import { createProgramStore } from './createProgramStore';
import { spineBarProgram } from '../data/programs/spineBar';
import { sanityClient, freshClient } from '../lib/sanity.client';
import { SPINE_PROGRAM_QUERY } from '../lib/queries/programs';
import { adaptExercise } from '../lib/adapters/exercise';
import { cachedFetch } from '../lib/sanityCache';

const transformItem = (item) => ({
  ...adaptExercise(item),
  groupId: item.groupId,
  level: item.level,
  bar: item.bar,
  spineFocus: item.spineFocus,
  deskIssues: item.deskIssues,
  safety: item.safety,
  regression: item.regression,
  progression: item.progression,
});

export const useSpineBarStore = createProgramStore({
  name: 'spine-bar-storage',
  program: spineBarProgram,
  version: 2,
  initFromSanity: ({ set, get, initialProgram }) => async (options = {}) => {
    const { force = false } = options;
    const current = get();

    if (current._isFetching) return;
    if (!force && current._fetchedFromSanity) return;

    set({ loading: true, error: null, _isFetching: true });

    try {
      const client = force ? freshClient : sanityClient;
      const doc = await cachedFetch(client, SPINE_PROGRAM_QUERY, undefined, { force });

      if (!doc) throw new Error('spine-bar program not found on Sanity');

      const newProgram = {
        id: 'spine-bar',
        title: doc.title,
        subtitle: doc.subtitle,
        accent: doc.accent,
        groupBy: doc.groupBy,
        groups: doc.groups ?? [],
        items: (doc.items ?? []).map(transformItem),
      };

      set({
        program: newProgram,
        selectedId:
          current.selectedId && newProgram.items.some((i) => i.id === current.selectedId)
            ? current.selectedId
            : newProgram.items[0]?.id ?? null,
        loading: false,
        error: null,
        _isFetching: false,
        _fetchedFromSanity: true,
      });
    } catch (err) {
      console.error('[useSpineBarStore] fetch failed:', err);
      set({ error: err, loading: false, _isFetching: false });
    }
  },
});