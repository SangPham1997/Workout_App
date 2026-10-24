/**
 * Helpers for "YYYY-MM-DD" date keys.
 *
 * Mọi ngày trong app (check-in, streak, heatmap, tuần bắt đầu thứ 2) đều dùng
 * ngày **theo giờ địa phương**. Trước đây code dùng `toISOString().slice(0, 10)`
 * — đó là ngày UTC, nên ở Việt Nam (UTC+7) check-in lúc 00:00–06:59 bị ghi sang
 * ngày hôm trước và làm sai streak/heatmap.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Chuyển Date → key "YYYY-MM-DD" theo giờ địa phương. */
export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Key của hôm nay theo giờ địa phương. */
export function todayKey() {
  return toDateKey(new Date());
}

/** Key "YYYY-MM-DD" → Date tại 00:00 giờ địa phương. */
export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Cộng/trừ ngày trên key (xử lý đúng qua tháng, năm, DST). */
export function addDaysKey(key, days) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** Số ngày giữa 2 key (b - a). Dùng Math.round để bỏ qua chênh lệch DST. */
export function daysBetweenKeys(a, b) {
  return Math.round((parseDateKey(b) - parseDateKey(a)) / MS_PER_DAY);
}

/** Key của thứ Hai đầu tuần chứa `date` (tuần bắt đầu thứ 2). */
export function getWeekStartKey(date = new Date()) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
  return toDateKey(monday);
}

/** Key "YYYY-MM" từ một date key. */
export function getMonthKey(key) {
  return key.slice(0, 7);
}
