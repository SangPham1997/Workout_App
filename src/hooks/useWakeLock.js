import { useEffect } from 'react';

/*
  useWakeLock — giữ màn hình luôn sáng khi đang tập (isRunning = true).
  Dùng Wake Lock API; tự nhả lock khi dừng timer hoặc unmount.
  Fallback an toàn: nếu trình duyệt không hỗ trợ thì bỏ qua, không lỗi.
*/
export function useWakeLock(isActive) {
  useEffect(() => {
    if (!isActive) return undefined;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return undefined;

    let sentinel = null;
    let cancelled = false;

    const request = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // thiết bị từ chối (pin yếu, tab ẩn...) — bỏ qua, không làm hỏng UI
        sentinel = null;
      }
    };

    request();

    // Một số trình duyệt tự nhả lock khi tab hidden -> xin lại khi quay lại
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !cancelled && !sentinel) {
        request();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      try {
        sentinel?.release();
      } catch {
        /* đã nhả rồi */
      }
    };
  }, [isActive]);
}

export default useWakeLock;
