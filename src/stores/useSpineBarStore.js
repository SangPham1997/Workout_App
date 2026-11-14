import { createProgramStore } from './createProgramStore'
import { sanityClient, freshClient } from '../lib/sanity.client'
import { SPINE_PROGRAM_QUERY } from '../lib/queries/programs'
import { adaptExercise } from '../lib/adapters/exercise'
import { cachedFetch } from '../lib/sanityCache'

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
})

export const useSpineBarStore = createProgramStore({
  name: 'spine-bar-storage',
  // Empty program — data luôn fetch từ Sanity
  program: { id: 'spine-bar', title: 'Xà & Cột sống', subtitle: '', accent: '', groupBy: '', groups: [], items: [] },
  version: 3,
  initFromSanity: ({ set, get }) => async (options = {}) => {
    const { force = false } = options
    const current = get()
    // FIX: removed _isFetching check — createProgramStore wrapper đã check + set true
    // → check ở đây sẽ LUÔN true → early return → fetch không chạy
    // FIX: removed _fetchedFromSanity check — wrapper đã check với !force
    set({
      loading: !current._fetchedFromSanity,
      _isRefreshing: current._fetchedFromSanity,
      error: null,
      _isFetching: true,
    })

    try {
      const client = force ? freshClient : sanityClient
      const doc = await cachedFetch(client, SPINE_PROGRAM_QUERY, undefined, { force })

      if (!doc) throw new Error('spine-bar program not found on Sanity')

      const newProgram = {
        id: 'spine-bar',
        title: doc.title,
        subtitle: doc.subtitle,
        accent: doc.accent,
        groupBy: doc.groupBy,
        groups: doc.groups ?? [],
        items: (doc.items ?? []).map(transformItem),
      }

      const hasSelected = newProgram.items.some((i) => i.id === current.selectedId)

        set({
        program: newProgram,
        selectedId: hasSelected ? current.selectedId : newProgram.items[0]?.id ?? null,
        loading: false,
        _isRefreshing: false,
        error: null,
        _isFetching: false,
        _fetchedFromSanity: true,
      })
    } catch (err) {
      console.error('[useSpineBarStore] fetch failed:', err)
      set({
        error: err,
        loading: false,
        _isRefreshing: false,
        _isFetching: false,
      })
      throw err
    }
  },
})