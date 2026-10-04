/**
 * Chuyển đổi mọi dạng URL YouTube sang dạng embed chuẩn.
 * Hỗ trợ:
 *   - https://www.youtube.com/watch?v=ID
 *   - https://youtu.be/ID
 *   - https://m.youtube.com/watch?v=ID      (mobile)
 *   - https://music.youtube.com/watch?v=ID  (music)
 *   - https://www.youtube.com/shorts/ID     (Shorts)
 *   - https://www.youtube.com/live/ID       (Live)
 *   - https://www.youtube.com/embed/ID      (đã embed sẵn → giữ nguyên)
 *   - https://www.youtube.com/v/ID
 *   - URL có timestamp (&t=30s), playlist (&list=...), v.v.
 *
 * @param {string} url - URL YouTube gốc
 * @param {object} options - Tuỳ chọn
 * @param {boolean} options.autoplay - Tự động phát (mặc định false)
 * @param {boolean} options.mute - Tắt tiếng (mặc định false)
 * @param {boolean} options.loop - Lặp lại (mặc định false)
 * @param {boolean} options.controls - Hiện controls (mặc định true)
 * @returns {string} URL embed hoặc chuỗi rỗng nếu không hợp lệ
 */
export const getVideoEmbedUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return '';

  const {
    autoplay = false,
    mute = false,
    loop = false,
    controls = true,
  } = options;

  // Nếu đã là URL embed → giữ nguyên, chỉ thêm params
  if (url.includes('youtube.com/embed/')) {
    return appendEmbedParams(url, { autoplay, mute, loop, controls });
  }

  let videoId = null;

  // --- Trường hợp 1: youtu.be/ID ---
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
  }
  // --- Trường hợp 2: youtube.com/watch?v=ID ---
  else if (url.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(url);
      videoId = parsed.searchParams.get('v');
    } catch {
      // Fallback cho URL không parse được
      videoId = url.split('v=')[1]?.split(/[&#]/)[0];
    }
  }
  // --- Trường hợp 3: youtube.com/shorts/ID ---
  else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('shorts/')[1]?.split(/[?&#]/)[0];
  }
  // --- Trường hợp 4: youtube.com/live/ID ---
  else if (url.includes('youtube.com/live/')) {
    videoId = url.split('live/')[1]?.split(/[?&#]/)[0];
  }
  // --- Trường hợp 5: youtube.com/v/ID (embed cũ) ---
  else if (url.includes('youtube.com/v/')) {
    videoId = url.split('v/')[1]?.split(/[?&#]/)[0];
  }

  // Không trích xuất được ID → trả về rỗng
  if (!videoId) return '';

  // Làm sạch ID (chỉ giữ chữ, số, gạch ngang, gạch dưới)
  videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Validate độ dài ID YouTube (chuẩn là 11 ký tự)
  if (videoId.length !== 11) return '';

  const base = `https://www.youtube.com/embed/${videoId}`;
  return appendEmbedParams(base, { autoplay, mute, loop, controls });
};

/**
 * Thêm các tham số vào URL embed (autoplay, mute, loop, controls).
 */
const appendEmbedParams = (baseUrl, { autoplay, mute, loop, controls }) => {
  const params = new URLSearchParams();

  if (autoplay) {
    params.set('autoplay', '1');
    // Autoplay bắt buộc phải mute trên hầu hết trình duyệt
    params.set('mute', '1');
  }
  if (mute && !params.has('mute')) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    // Loop yêu cầu phải có playlist = cùng ID
    const idMatch = baseUrl.match(/embed\/([^?]+)/);
    if (idMatch) params.set('playlist', idMatch[1]);
  }
  if (!controls) params.set('controls', '0');

  // Các params bổ sung để tăng trải nghiệm
  params.set('rel', '0');        // Không hiện video liên quan từ kênh khác
  params.set('modestbranding', '1'); // Giảm branding YouTube

  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
};