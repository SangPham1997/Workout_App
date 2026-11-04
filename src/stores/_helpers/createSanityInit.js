// Helper dùng chung cho logic fetch Sanity của các store dạng "danh sách item".
// Gói lại: guard _isFetching/_fetchedFromSanity, set cờ loading/refreshing,
// gọi cachedFetch, adapt + dedup theo id, fallback selectedId, xử lý lỗi.
//
// Lợi ích:
//  - Loại bỏ ~80 dòng lặp lại ở useExerciseStore / useKarateStore / useSpineBarStore.
//  - Đảm bảo cờ luôn được reset (kể cả khi throw).
//  - Tự rebuild Set<id> module-level mỗi lần fetch thành công.
//
// Cách dùng (trong create((set, get) => ({ ... }))):
//   initFromSanity: createSanityListInit({ get, set, ... }),
//

export function createSanityListInit({
  name,
  query,
  adapt,
  getId = (item) => item.id,
  getClient,          // (force) => client
  cachedFetch,
  stateKey,           // tên field chứa danh sách: 'exercises' | 'sessions'
  getIdSet,           // () => Set<id> module-level
  buildSelectedId = (adapted, currentSelectedId) =>
    adapted.some((it) => getId(it) === currentSelectedId)
      ? currentSelectedId
      : getId(adapted[0]) ?? null,
  dedup = true,
  get,
  set,
}) {
  return async function initFromSanity(options = {}) {
    const { force = false } = options;
    const current = get();

    if (current._isFetching) return;
    if (!force && current._fetchedFromSanity) return;

    const isInitialLoad = !current._fetchedFromSanity;
    set({
      loading: isInitialLoad,
      _isRefreshing: !isInitialLoad,
      error: null,
      _isFetching: true,
    });

    try {
      const client = getClient(force);
      const docs = await cachedFetch(client, query, undefined, { force });

      let adapted = (docs ?? []).map(adapt);
      if (dedup) {
        const seen = new Set();
        adapted = adapted.filter((item) => {
          const id = getId(item);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      }

      const ids = getIdSet();
      ids.clear();
      for (const item of adapted) ids.add(getId(item));

      set({
        [stateKey]: adapted,
        selectedId: buildSelectedId(adapted, current.selectedId),
        loading: false,
        _isRefreshing: false,
        error: null,
        _isFetching: false,
        _fetchedFromSanity: true,
      });
    } catch (err) {
      console.error([${name}] fetch failed:, err);
      set({
        error: err,
        loading: false,
        _isRefreshing: false,
        _isFetching: false,
      });
    }
  };
}

// Rebuild Set<id> module-level từ danh sách item.
export function rebuildIdSet(idSet, items, getId = (item) => item.id) {
  idSet.clear();
  for (const item of items) idSet.add(getId(item));
}
