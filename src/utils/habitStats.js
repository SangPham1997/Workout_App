import { daysBetweenKeys, todayKey } from './dateKey.js';

/**
 * Chuỗi ngày liên tiếp hiện tại.
 * Chỉ tính khi lần check-in gần nhất là hôm nay hoặc hôm qua.
 */
export function calculateStreak(dates = [], today = todayKey()) {
  if (!dates.length) return 0;

  // Dedupe + sort tăng dần để so sánh từ cuối lên.
  const sorted = [...new Set(dates)].sort();
  const last = sorted[sorted.length - 1];
  const gap = daysBetweenKeys(last, today);

  // Check-in gần nhất không phải hôm nay/hôm qua → chuỗi đã đứt.
  // gap < 0 nghĩa là dữ liệu ở tương lai (lệch đồng hồ/import) → cũng bỏ qua.
  if (gap > 1 || gap < 0) return 0;

  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (daysBetweenKeys(sorted[i - 1], sorted[i]) === 1) streak++;
    else break;
  }
  return streak;
}

/** Chuỗi dài nhất trong toàn bộ lịch sử check-in. */
export function calculateLongestStreak(dates = []) {
  if (!dates.length) return 0;

  const sorted = [...new Set(dates)].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (daysBetweenKeys(sorted[i - 1], sorted[i]) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
