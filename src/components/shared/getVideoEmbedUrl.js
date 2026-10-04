/**
 * Chuyển đổi mọi dạng URL YouTube sang dạng embed chuẩn.
 * Hỗ trợ: watch, youtu.be, shorts, live, embed, v/
 * 
 * @param {string} url - URL YouTube gốc
 * @param {object} options - Tuỳ chọn
 * @returns {string} URL embed hoặc chuỗi rỗng nếu không hợp lệ
 */
export const getVideoEmbedUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return '';

  // 1. Chặn sớm các URL không thể embed (như trang tìm kiếm) để tránh lỗi iframe
  if (url.includes('/results?') || url.includes('search_query=')) {
    console.warn('⚠️ getVideoEmbedUrl: Không thể nhúng trang tìm kiếm YouTube. Vui lòng cung cấp URL video trực tiếp (ví dụ: youtube.com/watch?v=ID). URL nhận được:', url);
    return ''; 
  }

  const {
    autoplay = false,
    mute = false,
    loop = false,
    controls = true,
  } = options;

  // 2. Nếu đã là URL embed → giữ nguyên, chỉ thêm params
  if (url.includes('youtube.com/embed/')) {
    return appendEmbedParams(url, { autoplay, mute, loop, controls });
  }

  let videoId = null;

  // 3. Trích xuất Video ID từ các định dạng khác nhau
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    } 
    else if (url.includes('youtube.com/watch')) {
      const parsed = new URL(url);
      videoId = parsed.searchParams.get('v');
    } 
    else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split(/[?&#]/)[0];
    } 
    else if (url.includes('youtube.com/live/')) {
      videoId = url.split('live/')[1]?.split(/[?&#]/)[0];
    } 
    else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1]?.split(/[?&#]/)[0];
    }
  } catch (error) {
    console.error('Lỗi khi parse URL YouTube:', error, url);
    return '';
  }

  // 4. Validate Video ID
  if (!videoId) {
    console.warn('⚠️ getVideoEmbedUrl: Không tìm thấy Video ID hợp lệ trong URL:', url);
    return '';
  }

  // Làm sạch ID (chỉ giữ chữ, số, gạch ngang, gạch dưới)
  videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');

  // YouTube Video ID chuẩn luôn là 11 ký tự
  if (videoId.length !== 11) {
    console.warn('⚠️ getVideoEmbedUrl: Video ID không đúng độ dài chuẩn (11 ký tự). ID nhận được:', videoId);
    return '';
  }

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
    params.set('mute', '1'); // Autoplay bắt buộc phải mute trên trình duyệt hiện đại
  }
  if (mute && !params.has('mute')) {
    params.set('mute', '1');
  }
  if (loop) {
    params.set('loop', '1');
    // Loop yêu cầu phải có playlist = cùng ID video
    const idMatch = baseUrl.match(/embed\/([^?]+)/);
    if (idMatch) {
      params.set('playlist', idMatch[1]);
    }
  }
  if (!controls) {
    params.set('controls', '0');
  }

  // Các params bổ sung để tăng trải nghiệm người dùng (UX)
  params.set('rel', '0');             // Không hiện video đề xuất từ kênh khác khi kết thúc
  params.set('modestbranding', '1');  // Giảm thiểu logo/branding của YouTube

  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
};