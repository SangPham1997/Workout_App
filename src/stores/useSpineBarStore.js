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
  // eslint-disable-next-line no-unused-vars
  initFromSanity: ({ set, get, initialProgram: _initialProgram}) => async (options = {}) => {
    const { force = false } = options;
    const current = get();

    if (current._isFetching) return;
    if (!force && current._fetchedFromSanity) return;

    set({
      loading: !current._fetchedFromSanity,
      _isRefreshing: current._fetchedFromSanity,
      error: null,
      _isFetching: true,
    });

    try {
      const client = force ? freshClient : sanityClient;
      const doc = await cachedFetch(client, SPINE_PROGRAM_QUERY, undefined, {
        force,
      });

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

      const hasSelected = newProgram.items.some(
        (i) => i.id === current.selectedId
      );

      set({
        program: newProgram,
        selectedId: hasSelected
          ? current.selectedId
          : newProgram.items[0]?.id ?? null,
        loading: false,
        _isRefreshing: false,
        error: null,
        _isFetching: false,
        _fetchedFromSanity: true,
      });
    } catch (err) {
      console.error('[useSpineBarStore] fetch failed:', err);
      set({
        error: err,
        loading: false,
        _isRefreshing: false,
        _isFetching: false,
      });
      throw err; // để base store cũng thấy lỗi và reset cờ
    }
  },
});