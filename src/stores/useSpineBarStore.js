import { createProgramStore } from './createProgramStore';
import { spineBarProgram } from '../data/programs/spineBar';
import { sanityClient } from '../lib/sanity.client';
import { SPINE_PROGRAM_QUERY } from '../lib/queries/programs';
import { adaptExercise } from '../lib/adapters/exercise'
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
  version: 1,
  initFromSanity: ({ set, get, initialProgram }) => async () => {
    const current = get();

    // Idempotent: chỉ skip nếu đã load TỪ SANITY (program khác static initial)
    const loadedFromSanity = current.program !== initialProgram;
    if (!current.loading && loadedFromSanity) return;

    set({ loading: true, error: null });

    try {
      const doc = await cachedFetch(sanityClient, SPINE_PROGRAM_QUERY);
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
      });
    } catch (err) {
      console.error('[useSpineBarStore] fetch failed:', err);
      set({ error: err, loading: false });
    }
  },
});