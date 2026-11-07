/**
 * Chuyển đổi mọi dạng URL YouTube sang dạng embed chuẩn.
 * Hỗ trợ: watch, youtu.be, shorts, live, embed, v/
 *
 * Tối ưu cho Sanity (data lớn, URL thay đổi ít):
 * - LRU cache theo (url + options) → re-render không parse lại
 * - Fast path khi options mặc định → tránh new URL() overhead
 * - Single-pass regex → 1 lần match thay vì 5 lần .includes()
 * - Cache cả negative result ('') → URL lỗi không re-parse
 */

// ---------------------------------------------------------------------------
// CACHE — LRU Map, key ngắn (url|bits|start), max 500 entries
// ---------------------------------------------------------------------------
const MAX_CACHE_SIZE = 500;
const embedCache = new Map();

/**
 * bits: 1=autoplay, 2=mute, 4=loop, 8=no-controls.
 * start floor về int vì output dùng Math.floor.
 */
const makeCacheKey = (url, options) => {
  const o = options || {};
  const bits =
    (o.autoplay ? 1 : 0) |
    (o.mute ? 2 : 0) |
    (o.loop ? 4 : 0) |
    (o.controls === false ? 8 : 0);
  const start = Number.isFinite(o.start) && o.start > 0 ? Math.floor(o.start) : 0;
  return url + '|' + bits + '|' + start;
};

// 1 regex cho tất cả format. Group 1 = 11-char ID (đúng chuẩn YouTube).
// Boundary (?=[?&#/]|$) tránh match ID dài hơn 11 ký tự.
const YT_ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?=[?&#/]|$)/;

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------
export const getVideoEmbedUrl = (url, options) => {
  if (!url || typeof url !== 'string') return '';

  const key = makeCacheKey(url, options);
  const cached = embedCache.get(key);
  if (cached !== undefined) {
    // LRU refresh — move to end (giữ entry "hot")
    embedCache.delete(key);
    embedCache.set(key, cached);
    return cached;
  }

  const result = computeEmbedUrl(url, options || {});

  embedCache.set(key, result);
  if (embedCache.size > MAX_CACHE_SIZE) {
    // Evict entry cũ nhất (first in Map)
    embedCache.delete(embedCache.keys().next().value);
  }

  return result;
};

// ---------------------------------------------------------------------------
// INTERNAL
// ---------------------------------------------------------------------------
const computeEmbedUrl = (url, options) => {
  const { autoplay, mute, loop, controls = true, start } = options;

  // 1. Chặn URL không thể embed
  if (url.includes('/results?') || url.includes('search_query=')) {
    console.warn(
      '⚠️ getVideoEmbedUrl: Không thể nhúng trang tìm kiếm YouTube. ' +
        'Cần URL video trực tiếp. URL nhận được:',
      url,
    );
    return '';
  }

  // 2. Đã là embed URL → giữ nguyên path + params (không mất ?si=...)
  if (url.includes('youtube.com/embed/')) {
    return appendEmbedParams(url, { autoplay, mute, loop, controls, start });
  }

  // 3. Single-pass regex cho mọi format khác
  const match = url.match(YT_ID_RE);
  if (!match) {
    console.warn('⚠️ getVideoEmbedUrl: Không tìm thấy Video ID hợp lệ trong URL:', url);
    return '';
  }

  const videoId = match[1];

  // 4. FAST PATH — options mặc định → build string, skip URL API
  const hasStart = Number.isFinite(start) && start > 0;
  if (!autoplay && !mute && !loop && controls && !hasStart) {
    return 'https://www.youtube.com/embed/' + videoId + '?rel=0&playsinline=1';
  }

  // 5. Custom params → dùng URL API để build
  return appendEmbedParams('https://www.youtube.com/embed/' + videoId, {
    autoplay,
    mute,
    loop,
    controls,
    start,
  });
};

/**
 * Build URL với custom params. Chỉ gọi khi cần (fast path skip được).
 */
const appendEmbedParams = (baseUrl, { autoplay, mute, loop, controls, start }) => {
  let embedUrl;
  try {
    embedUrl = new URL(baseUrl);
  } catch {
    return '';
  }

  const params = embedUrl.searchParams;

  if (autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1');
  }
  if (mute) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    const id = embedUrl.pathname.split('/').filter(Boolean).pop();
    if (id) params.set('playlist', id);
  }
  if (!controls) params.set('controls', '0');
  if (Number.isFinite(start) && start > 0) {
    params.set('start', String(Math.floor(start)));
  }

  params.set('rel', '0');
  params.set('playsinline', '1');

  return embedUrl.toString();
};